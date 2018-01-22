import { put, select } from 'redux-saga/effects';
import SQLiteHelper from 'react-native-sqlite-helper';
import uuid from 'uuid/v4';
import ACTIONS from '../actions';

/**
 * ************ SQLite: type(类别信息) ********** *
 */
export function* createTypeTable() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.createTable({
        tableName: 'type',
        tableFields: [
            {
                columnName: 'type_uuid',
                dataType: 'VARCHAR PRIMARY KEY',
            }, {
                columnName: 'groupName',
                dataType: 'VARCHAR',
            },
            {
                columnName: 'typeId',
                dataType: 'VARCHAR',
            }, {
                columnName: 'typeName',
                dataType: 'VARCHAR',
            }, {
                columnName: 'displayName',
                dataType: 'VARCHAR',
            },
        ],
    });
    if (err) throw new Error('创建type表失败：用于记录消息类别信息');
}

export function* initialTypeTableData() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.insertItems('type', [
        {
            type_uuid: uuid(),
            groupName: 'chatList',
            typeId: '0',
            typeName: 'PTP',
            displayName: '私聊',
        }, {
            type_uuid: uuid(),
            groupName: 'chatList',
            typeId: '1',
            typeName: 'PTG',
            displayName: '群组',
        }, {
            type_uuid: uuid(),
            groupName: 'chatList',
            typeId: '2',
            typeName: 'WEATHER',
            displayName: '天气',
        }, {
            type_uuid: uuid(),
            groupName: 'message',
            typeId: '1',
            typeName: 'text',
            displayName: '文字消息',
        }, {
            type_uuid: uuid(),
            groupName: 'message',
            typeId: '2',
            typeName: 'image',
            displayName: '图片消息',
        },
        {
            type_uuid: uuid(),
            groupName: 'message',
            typeId: '3',
            typeName: 'location',
            displayName: '地理消息',
        },
    ]);
    if (err) throw new Error('初始化type数据失败：用于记录消息类别信息');
}

export function* clearTypeTableData() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.deleteItem('type');
    if (err) throw new Error('清空type数据失败：用于记录消息类别信息');
}

/**
 * ************ SQLite: message(当前显示消息) ********** *
 */

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
                columnName: 'createAt',  // 创建时间
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
    if (err) {
        yield put({
            type: ACTIONS.MESSAGES.FAILURE,
            payload: {
                message: err.message,
            },
        });
    }
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

/**
 * ************ SQLite: chatList(聊天列表) ********** *
 */

/**
 * 创建chatList表(fork触发)
 */
export function* createChatListTable() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.createTable({
        tableName: 'chatList',
        tableFields: [
            {
                columnName: 'uuid',
                dataType: 'VARCHAR PRIMARY KEY',
            }, {
                columnName: 'avatar',    // 头像
                dataType: 'VARCHAR',
            }, {
                columnName: 'topicId',   // 标题编号
                dataType: 'VARCHAR',
            }, {
                columnName: 'topicName', // 标题名称
                dataType: 'VARCHAR',
            }, {
                columnName: 'topicType', // 标题类型
                dataType: 'VARCHAR',
            }, {
                columnName: 'newestMsg', // 最新消息
                dataType: 'VARCHAR',
            }, {
                columnName: 'createAt',  // 创建时间
                dataType: 'DATETIME',
            }, {
                columnName: 'unread',    // 未读消息数
                dataType: 'INT',
            },
        ],
    });
    if (err) throw new Error('创建chatList表失败：用于记录聊天信息');
}

/**
 * ACTIONS.CHAT_LIST.REQUEST 触发
 */
export function* queryChatList() {
    const { online, userInfo } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.CHAT_LIST.LOADING,
            payload: {
                loading: true,
            },
        });
        const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
        const { res: chatList, err } = yield sqLiteHelper.selectItems('chatList', '*');
        if (err) {
            yield put({
                type: ACTIONS.CHAT_LIST.FAILURE,
                payload: {
                    message: err.message,
                },
            });
            return;
        }
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList,
            },
        });
    } else {
        yield put({ type: ACTIONS.CHAT_LIST.INITIAL });
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

/**
 * ACTIONS.CHAT_LIST.INSERT 触发
 * @param payload
 */
export function* insertChatList({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    yield put({
        type: ACTIONS.CHAT_LIST.LOADING,
        payload: {
            loading: true,
        },
    });
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    // 检测是否存在并归类
    try {
        const { res, err: selectErr } = yield sqLiteHelper.selectItems('chatList', '*', { topicId: payload.item.topicId });
        if (selectErr) throw new Error('查询失败！');
        if (Array.isArray(res) && res.length > 0) {
            // 存在，修改信息
            const { err: updateErr } = yield sqLiteHelper.updateItem(
                'chatList',
                {
                    unread: res[0].unread + 1,
                    topicName: payload.item.topicName,
                    newestMsg: payload.item.newestMsg,
                    createAt: payload.item.createAt,
                    avatar: payload.item.avatar,
                },
                {
                    topicId: res[0].topicId,
                },
            );
            if (updateErr) throw new Error('更新失败！');
        } else {
            // 不存在，添加信息
            const { err: insertErr } = yield sqLiteHelper.insertItems('chatList', [payload.item]);
            if (insertErr) throw new Error('添加失败！');
        }
        // 重新查询
        const { res: newChatList, err: reSelectErr } = yield sqLiteHelper.selectItems('chatList', '*');
        if (reSelectErr) throw new Error('重新失败！');
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList: newChatList,
            },
        });
    } catch (err) {
        yield put({
            type: ACTIONS.CHAT_LIST.FAILURE,
            payload: {
                message: err.message,
            },
        });
    }
}

/**
 * ACTIONS.CHAT_LIST.UPDATE 触发：主要针对更新 unread
 * @param payload
 */
export function* updateChatList({ payload }) {
    // const { userId } = payload;
    // // 获取当前用户的 storageKey
    // const { storageKey, error } = yield getChatListStorageKey();
    // // 获取当前 state
    // const { chatList, unreadSum } = yield select(state => state.instantMessaging);
    // // 清零所有未读数
    // if (!error && userId && userId.toString() === 'all') {
    //     const newChatList = [];
    //     chatList.forEach((item) => {
    //         // 1.更新本地存储：storage
    //         global.storage.save({
    //             key: storageKey,
    //             id: item.userId,
    //             data: { ...item, unread: 0 },
    //             expires: null,
    //         });
    //         // 2.更新界面徽章：state
    //         newChatList.push({ ...item, unread: 0 });
    //     });
    //     yield put({
    //         type: ACTIONS.CHAT_LIST.SUCCESS,
    //         payload: {
    //             chatList: newChatList,
    //             unreadSum: 0,
    //         },
    //     });
    // }
    // // 清零某条未读数
    // if (!error && userId && userId.toString() !== 'all') {
    //     const newChatList = [];
    //     let newUnreadSum = unreadSum;
    //     chatList.forEach((item) => {
    //         if (item.userId === userId) {
    //             // 1.更新本地存储：storage
    //             global.storage.save({
    //                 key: storageKey,
    //                 id: item.userId,
    //                 data: { ...item, unread: 0 },
    //                 expires: null,
    //             });
    //             // 2.更新界面徽章：state
    //             newChatList.push({ ...item, unread: 0 });
    //             newUnreadSum -= item.unread;
    //         } else {
    //             newChatList.push(item);
    //         }
    //     });
    //     yield put({
    //         type: ACTIONS.CHAT_LIST.SUCCESS,
    //         payload: {
    //             chatList: newChatList,
    //             unreadSum: newUnreadSum,
    //         },
    //     });
    // }
}

/**
 * ACTIONS.CHAT_LIST.DELETE 触发
 * @param payload
 */
export function* deleteChatList({ payload }) {
    // // 根据 chatList 中的 userId 删除
    // const { userId } = payload;
    // // 获取当前用户的 storageKey
    // const { storageKey, error } = yield getChatListStorageKey();
    // // 获取本地state
    // const { chatList } = yield select(state => state.instantMessaging);
    // // 删除某条
    // if (!error && userId && userId.toString() !== 'all') {
    //     chatList.forEach((item) => {
    //         if (item.userId === userId) {
    //             // 删除本地存储storage
    //             global.storage.remove({
    //                 key: storageKey,
    //                 id: userId,
    //             });
    //         }
    //     });
    //     yield queryChatList(); // 重新请求数据
    // }
    // // 删除全部
    // if (!error && userId && userId.toString() === 'all') {
    //     // 1.删除本地存储storage
    //     yield global.storage.clearMapForKey(storageKey);
    //     // 2.清空state数据
    //     yield put({
    //         type: ACTIONS.CHAT_LIST.SUCCESS,
    //         payload: {
    //             chatList: [],
    //             unreadSum: 0,
    //         },
    //     });
    // }
}
