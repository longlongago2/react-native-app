import uuid from 'uuid/v4';

/**
 * ************ SQLite: type(类别信息) ********** *
 */
export function* createTypeTable() {
    if (!global.sqLiteHelper) return;
    const { err } = yield global.sqLiteHelper.createTable({
        tableName: 'type',
        tableFields: [
            {
                columnName: 'uuid',
                dataType: 'VARCHAR PRIMARY KEY',
            }, {
                columnName: 'kind',        // 类型的分类
                dataType: 'VARCHAR',
            },
            {
                columnName: 'typeId',      // 类型编号
                dataType: 'VARCHAR',
            }, {
                columnName: 'typeName',    // 类型名称（英文）
                dataType: 'VARCHAR',
            }, {
                columnName: 'displayName',  // 显示名称（汉字）
                dataType: 'VARCHAR',
            },
        ],
    });
    if (err) throw new Error('创建type表失败：用于记录消息类别信息');
}

export function* initialTypeTableData() {
    if (!global.sqLiteHelper) return;
    const { err } = yield global.sqLiteHelper.insertItems('type', [
        {
            uuid: uuid(),
            kind: 'chatList',
            typeId: '0',
            typeName: 'NOTIFICATION',
            displayName: '通知',
        }, {
            uuid: uuid(),
            kind: 'chatList',
            typeId: '1',
            typeName: 'PTP',
            displayName: '私聊',
        }, {
            uuid: uuid(),
            kind: 'chatList',
            typeId: '2',
            typeName: 'PTG',
            displayName: '群聊',
        }, {
            uuid: uuid(),
            kind: 'message',
            typeId: '0',
            typeName: 'text',
            displayName: '文字消息',
        }, {
            uuid: uuid(),
            kind: 'message',
            typeId: '1',
            typeName: 'image',
            displayName: '图片消息',
        }, {
            uuid: uuid(),
            kind: 'message',
            typeId: '2',
            typeName: 'voice',
            displayName: '语音消息',
        }, {
            uuid: uuid(),
            kind: 'message',
            typeId: '3',
            typeName: 'location',
            displayName: '地理位置',
        },
    ]);
    if (err) throw new Error('初始化type数据失败：用于记录消息类别信息');
}

export function* clearTypeTableData() {
    if (!global.sqLiteHelper) return;
    const { err } = yield global.sqLiteHelper.deleteItem('type');
    if (err) throw new Error('清空type数据失败：用于记录消息类别信息');
}
