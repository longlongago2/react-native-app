import { put } from 'redux-saga/effects';
import SQLiteHelper from 'react-native-sqlite-helper';
import ACTIONS from '../actions';

export function* openDataBase() {
    const sqLite = new SQLiteHelper('browsingHistory', '1.0', 'browsingHistory', 3000);
    const { res, err } = yield sqLite.open();
    if (res) {
        global.sqLiteHelper = sqLite;
        global.db = res;
    }
    if (err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'sqLite打开失败！',
            },
        });
    }
}

export function* closeDataBase() {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    yield global.sqLiteHelper.close();
}

export function* deleteDataBase() {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    yield global.sqLiteHelper.delete();
    global.sqLiteHelper = null;
    global.db = null;
}

export function* createTable() {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    const { err } = yield global.sqLiteHelper.createTable({
        tableName: 'record',
        tableFields: [
            {
                columnName: 'id',
                dataType: 'INTEGER PRIMARY KEY AUTOINCREMENT',
            },
            {
                columnName: 'userid',
                dataType: 'varchar',
            },
            {
                columnName: 'orderCode',
                dataType: 'varchar',
            }, {
                columnName: 'title',
                dataType: 'varchar',
            }, {
                columnName: 'time',
                dataType: 'datetime',
            },
        ],
    });
    if (err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'createTable failed：创建表失败！',
            },
        });
    }
}

export function* insertHistory({ payload }) {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    const { err } = yield global.sqLiteHelper.insertItems('record', payload.items);
    if (err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'insertItems failed：插入数据失败！',
            },
        });
    }
}

export function* queryHistoryList({ payload }) {
    if (!global.db) {
        yield openDataBase();
    }
    yield put({
        type: ACTIONS.BROWSING_HISTORY.LOADING,
        payload: {
            loading: true,
        },
    });
    // 查询当天的浏览记录
    const date = payload.date;      // 查询日期：格式：YYYY-MM-DD
    const userid = payload.userid;  // 用户id
    const { res, err } = yield global.db.executeSql(`select * from record where time > '${date} 00:00:01' and time < '${date} 23:59:59' and userid='${userid}'`)
        .then((data) => {
            const queryResult = [];
            const len = data[0].rows.length;
            for (let i = 0; i < len; i++) {
                queryResult.push(data[0].rows.item(i));
            }
            return { res: queryResult };
        })
        .catch(error => ({ err: error }));
    yield put({
        type: ACTIONS.BROWSING_HISTORY.SUCCESS,
        payload: {
            historyList: res,
        },
    });
    if (err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'executeSql 查询失败！',
            },
        });
    }
}
