import { put, select } from 'redux-saga/effects';
import SQLiteHelper from 'react-native-sqlite-helper';
import moment from 'moment';
import ACTIONS from '../actions';

/**
 * 创建record表 (fork触发)
 */
export function* createBrowsingHistoryTable() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.createTable({
        tableName: 'record',
        tableFields: [
            {
                columnName: 'id',
                dataType: 'INTEGER PRIMARY KEY AUTOINCREMENT',
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
    if (err) throw new Error('创建record表失败：用于记录浏览历史');
}

/**
 * 新增浏览记录(ACTIONS.BROWSING_HISTORY.INSERT 触发)
 * @param payload
 */
export function* insertHistory({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    // 检查db里是否有相同的工单数据
    const { item } = payload;
    const { res: _res, err: _err } = yield sqLiteHelper.selectItems('record', '*', { ordercode: item.ordercode });
    if (_err) {
        yield put({
            type: ACTIONS.BROWSING_HISTORY.FAILURE,
            payload: {
                message: 'executeSql 查询失败！',
            },
        });
    }
    if (_res.length > 0) {
        // 已存在就更新time为即时时间
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // 1.sqLite
        const { err } = yield sqLiteHelper.updateItem(
            'record',
            { time: currentTime },
            { ordercode: item.ordercode });
        if (err) {
            yield put({
                type: ACTIONS.BROWSING_HISTORY.FAILURE,
                payload: {
                    message: 'table record updateItem failed：更改数据失败！',
                },
            });
        }
        // 2.state
        const { historyList } = yield select(state => state.browsingHistory);
        let newHistoryList = historyList.concat();
        newHistoryList = newHistoryList.map((_item) => {
            if (_item.ordercode === item.ordercode) {
                return {
                    ..._item,
                    time: currentTime,
                };
            }
            return _item;
        });
        yield put({
            type: ACTIONS.BROWSING_HISTORY.SUCCESS,
            payload: {
                historyList: newHistoryList,
            },
        });
    } else {
        // 不存在就创建
        const { err } = yield sqLiteHelper.insertItems('record', [item]);
        if (err) {
            yield put({
                type: ACTIONS.BROWSING_HISTORY.FAILURE,
                payload: {
                    message: 'table record insertItems failed：插入数据失败！',
                },
            });
        }
    }
}

/**
 * 查询当天浏览记录(ACTIONS.BROWSING_HISTORY.REQUEST 触发)
 * @param payload
 */
export function* queryHistoryList({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { res: sqLite, err: _err } = yield sqLiteHelper.open();
    if (_err) return;
    yield put({
        type: ACTIONS.BROWSING_HISTORY.LOADING,
        payload: {
            loading: true,
        },
    });
    // 查询当天的浏览记录
    const date = moment(payload.date).format('YYYY-MM-DD');      // 查询条件：日期（格式：YYYY-MM-DD）
    const { res, err } = yield sqLite.executeSql(`select * from record where time > '${date} 00:00:01' and time < '${date} 23:59:59' order by time desc`)
        .then((data) => {
            const queryResult = [];
            const len = data[0].rows.length;
            for (let i = 0; i < len; i++) {
                queryResult.push(data[0].rows.item(i));
            }
            return { res: queryResult };
        })
        .catch(error => ({ err: error }));
    yield sqLiteHelper.close();
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
