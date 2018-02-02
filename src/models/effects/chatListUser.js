import SQLiteHelper from 'react-native-sqlite-helper';
import { select } from 'redux-saga/effects';

export function* createChatListUserTable() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.createTable({
        tableName: 'chatListUser',
        tableFields: [
            {
                columnName: 'userid',
                dataType: 'VARCHAR PRIMARY KEY',
            }, {
                columnName: 'name',
                dataType: 'VARCHAR',
            }, {
                columnName: 'avatar',
                dataType: 'VARCHAR',
            },
        ],
    });
    if (err) throw new Error('创建chatListUser表失败：用于记录聊天用户信息');
}

export function* queryChatListUsers({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return false;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    return sqLiteHelper.selectItems('chatListUser', '*', payload.condition);
}

export function* updateChatListUsers({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.updateItem('chatListUser', payload.item, payload.condition);
    if (err) throw new Error('更新chatListUser表失败：用于记录聊天用户信息');
}

export function* insertChatListUsers({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.insertItems('chatListUser', payload.item);
    if (err) throw new Error('插入chatListUser表失败：用于记录聊天用户信息');
}
