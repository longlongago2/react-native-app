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
            }, {
                columnName: 'received', // 已接收
                dataType: 'BOOLEAN DEFAULT ( 1 )',
            }, {
                columnName: 'system', // 是否是系统消息
                dataType: 'BOOLEAN DEFAULT ( 0 )',
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
    yield sqLiteHelper.insertItems('message', payload.messages);
    // 2.修改关联表：chatListUser表
    const { res } = yield queryChatListUsers({
        payload: {
            condition: {
                userid: payload.user._id,
            },
        },
    });
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
    if (!online) return false;
    const { data } = yield select(state => state.activeMQ);
    const { topicId } = payload;
    const pageSize = 15;
    let pageNumber;
    if (typeof payload.pageNumber === 'number') {
        pageNumber = payload.pageNumber >= 0 ? payload.pageNumber : 0;
    } else {
        pageNumber = data.pageNumber;
    }
    const offset = pageSize * pageNumber;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { res: sqlite } = yield sqLiteHelper.open();
    return yield sqlite.executeSql(`select message.uuid, message.createdAt, message.userid, message.received, message.system, name, avatar, content, typeName from message 
    inner join chatListUser on message.userid = chatListUser.userid 
    inner join type on message.typeId = type.typeId 
    where type.kind = 'message' and message.topicId = '${topicId}'
    order by message.createdAt desc 
    limit ${pageSize} offset ${offset};`)
        .then((res) => {
            const queryResult = [];
            const len = res[0].rows.length;
            for (let i = 0; i < len; i++) {
                queryResult.push(res[0].rows.item(i));
            }
            return { res: queryResult };
        })
        .catch(err => ({ err }));
}

export function* deleteMessages({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return false;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    return yield sqLiteHelper.deleteItem('message', payload.condition);
}
