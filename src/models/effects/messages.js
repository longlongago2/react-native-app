/**
 * ************ SQLite: message(当前显示消息) ********** *
 */

import { put, select } from 'redux-saga/effects';
import SQLiteHelper from 'react-native-sqlite-helper';
import ACTIONS from '../actions';

/**
 * 创建message表(fork触发)
 */
export function* createMessagesTable() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.createTable({
        tableName: 'message',
        tableFields: [
            {
                columnName: 'uuid',
                dataType: 'VARCHAR PRIMARY KEY',
            }, {
                columnName: 'topicId',   // 主题归属（外键：chatList表）
                dataType: 'VARCHAR',
            }, {
                columnName: 'userid',    // 用户编号
                dataType: 'VARCHAR',
            }, {
                columnName: 'createdAt',  // 创建时间
                dataType: 'DATETIME',
            }, {
                columnName: 'typeId',    // 消息类型（外键：type表）
                dataType: 'VARCHAR',
            }, {
                columnName: 'content',   // 消息内容
                dataType: 'VARCHAR',
            },
        ],
    });
    if (err) throw new Error('创建message表失败：用于记录聊天信息');
}

/**
 * 新增即时通讯消息(ACTIONS.MESSAGES.INSERT 触发)
 * @param payload
 */
export function* insertMessage({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.insertItems('message', payload.messages);
    if (err) throw new Error('插入message表失败');
}

/**
 * 查询当前即时通讯消息(ACTIONS.MESSAGES.REQUEST 触发)
 * @param payload
 */
export function* queryMessages({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
}

/**
 * 删除即时消息(支持多条)(ACTIONS.MESSAGES.DELETE 触发)
 * @param payload
 */
export function* deleteMessages({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
}
