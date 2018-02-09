export function* createChatListUserTable() {
    if (!global.sqLiteHelper) return;
    const { err } = yield global.sqLiteHelper.createTable({
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
    if (!global.sqLiteHelper) return false;
    return yield global.sqLiteHelper.selectItems('chatListUser', '*', payload.condition);
}

export function* updateChatListUsers({ payload }) {
    if (!global.sqLiteHelper) return;
    const { err } = yield global.sqLiteHelper.updateItem('chatListUser', payload.item, payload.condition);
    if (err) throw new Error('更新chatListUser表失败：用于记录聊天用户信息');
}

export function* insertChatListUsers({ payload }) {
    if (!global.sqLiteHelper) return;
    const { err } = yield global.sqLiteHelper.insertItems('chatListUser', payload.item);
    if (err) throw new Error('插入chatListUser表失败：用于记录聊天用户信息');
}
