/**
 * ************ SQLite: message(当前显示消息) ********** *
 */

import { select } from 'redux-saga/effects';
import SQLiteHelper from 'react-native-sqlite-helper';
import { updateChatListUsers, queryChatListUsers, insertChatListUsers } from './chatListUser';

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
                columnName: 'userid',    // 用户编号（外键：chatListUser表）
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

export function* insertMessage({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    // 1.插入主表：message表
    const { err: errMessage } = yield sqLiteHelper.insertItems('message', payload.messages);
    if (errMessage) throw new Error('插入message表失败');
    // 2.修改关联表：chatListUser表
    const { res, err: errChatListUser } = yield queryChatListUsers({
        payload: {
            condition: {
                userid: payload.user._id,
            },
        },
    });
    if (errChatListUser) throw new Error('查chatListUser表失败');
    if (Array.isArray(res) && res.length > 0) {
        // 已存在：修改
        yield updateChatListUsers({
            payload: {
                item: {
                    name: payload.user.name,
                    avatar: payload.user.avatar,
                },
                condition: {
                    userid: payload.user._id,
                },
            },
        });
    } else {
        // 不存在：新增
        yield insertChatListUsers({
            payload: {
                item: [{
                    userid: payload.user._id,
                    name: payload.user.name,
                    avatar: payload.user.avatar,
                }],
            },
        });
    }
}

export function* queryMessages({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
}

export function* deleteMessages({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
}
