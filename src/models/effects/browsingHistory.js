import { put, select } from 'redux-saga/effects';
import SQLiteHelper from 'react-native-sqlite-helper';
import moment from 'moment';
import ACTIONS from '../actions';

/**
 * 打开数据库
 */
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

/**
 * 关闭数据库
 */
export function* closeDataBase() {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    yield global.sqLiteHelper.close();
}

/**
 * 删除数据库
 */
export function* deleteDataBase() {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    yield global.sqLiteHelper.delete();
    global.sqLiteHelper = null;
    global.db = null;
}

/**
 * 创建表 fork
 */
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
                columnName: 'ordercode',
                dataType: 'varchar',
            }, {
                columnName: 'title',
                dataType: 'varchar',
            }, {
                columnName: 'time',
                dataType: 'datetime',
            }, {
                columnName: 'workOrderType',
                dataType: 'varchar',
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

/**
 * 新增浏览记录(ACTIONS.BROWSING_HISTORY.INSERT 触发)
 * @param payload
 */
export function* insertHistory({ payload }) {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    // 检查db里是否有相同的工单数据(根据ordercode进行查询)
    const { res: _res, err: _err } = yield global.db.executeSql(`select * from record where ordercode='${payload.items[0].ordercode}'`)
        .then((data) => {
            const count = data[0].rows.length;
            return { res: count };
        });
    if (_res > 0) { // 若数据库中已经存在此条数据, 则修改工单的浏览时间
        yield put({
            type: ACTIONS.BROWSING_HISTORY.UPDATE,
            payload: {
                item: {
                    time: moment().format('YYYY-MM-DD HH:mm:ss'),
                },
                condition: {
                    ordercode: payload.items[0].ordercode,
                },
            },
        });
    } else { // 没有此条数据, 创建一条新记录
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
    if (_err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'executeSql 查询失败！',
            },
        });
    }
}

/**
 * 查询当天浏览记录(ACTIONS.BROWSING_HISTORY.REQUEST 触发)
 * @param payload
 */
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
    const { res, err } = yield global.db.executeSql(`select * from record where time > '${date} 00:00:01' and time < '${date} 23:59:59' and userid='${userid}' order by time desc`)
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

/**
 * 修改历浏览记录(ACTIONS.BROWSING_HISTORY.UPDATE 触发)
 * @param payload
 */
export function* updateHistory({ payload }) {
    if (!global.sqLiteHelper) {
        yield openDataBase();
    }
    const { historyList } = yield select(state => state.browsingHistory);
    const { res, err } = yield global.sqLiteHelper.updateItem('record', payload.item, payload.condition)
        .then(() => {
            let newHistoryList = historyList.concat();
            newHistoryList = newHistoryList.map((item) => {
                if (item.ordercode === payload.condition.ordercode) {
                    return {
                        ...item,
                        time: payload.item.time,
                    };
                }
                return item;
            });
            return { res: newHistoryList };
        });
    if (err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'updateItem failed: 修改数据失败！',
            },
        });
    } else {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.SUCCESS,
            payload: {
                historyList: res,
            },
        });
    }
}
