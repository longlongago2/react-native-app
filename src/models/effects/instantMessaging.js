import { put, select } from 'redux-saga/effects';
import PushNotification from 'react-native-push-notification';
import { AppState } from 'react-native';
import ACTIONS from '../actions';
import { getStorageByKeyAndId, getChatListStorageKey } from '../../utils/storage';

/**
 * ************ SQLite: CHAT_LIST ********** *
 */

/**
 * ACTIONS.CHAT_LIST.REQUEST 触发
 */
export function* queryChatList() {
    yield put({
        type: ACTIONS.CHAT_LIST.LOADING,
        payload: { loading: true },
    });
    const { online } = yield select(state => state.user);
    // 1.获取本地存储名称
    if (online) {
        const { error, storageKey } = yield getChatListStorageKey();
        if (!error) {
            // 2.获取全部聊天列表
            const chatList = yield global.storage.getAllDataForKey(storageKey);
            let unreadSum = 0;
            if (Array.isArray(chatList) && chatList.length > 0) {
                chatList.forEach((item) => {
                    unreadSum += item.unread;
                });
            }
            // 3.更新界面：state
            yield put({
                type: ACTIONS.CHAT_LIST.SUCCESS,
                payload: {
                    chatList,
                    unreadSum,
                },
            });
        } else {
            yield put({
                type: ACTIONS.CHAT_LIST.FAILURE,
                payload: {
                    message: error.message,
                },
            });
        }
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
    // 1.获取本地存储名称
    const { storageKey, error } = yield getChatListStorageKey();
    if (!error) {
        // 2.获取原始态数据
        const newLog = JSON.parse(payload.data);
        const { userId, avatar, date, personName, context } = newLog;
        const { data, err } = yield getStorageByKeyAndId(storageKey, userId);
        // 3.处理新数据
        let nextData;
        if (err) {
            // 首次加载：初始化数据结构（单条）
            nextData = {
                userId,
                personName,
                avatar,
                latestContext: context.replace(/<[^>]+>/g, ' '),
                latestDate: date,
                log: [newLog],
                unread: 1,
            };
        } else {
            // 非首次加载：添加新数据至 log:[]
            nextData = Object.assign({}, data);  // 拷贝原始数据
            nextData.log.push(newLog);
            nextData.latestDate = date;
            nextData.latestContext = context.replace(/<[^>]+>/g, ' ');
            nextData.unread = data.unread + 1;
            nextData.avatar = avatar;
        }
        // 4.更新storage数据
        yield global.storage.save({
            key: storageKey,
            id: userId,
            data: nextData,
            expires: null,
        });
        // 5.更新state数据
        const { unreadSum } = yield select(state => state.instantMessaging);
        const nextUnreadSum = unreadSum + 1;
        const nextChatList = yield global.storage.getAllDataForKey(storageKey);
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList: nextChatList,
                unreadSum: nextUnreadSum,
            },
        });
        // 6.通知栏本地推送
        if (AppState.currentState !== 'active') {
            // 界面为激活状态时，不提示
            PushNotification.localNotification({
                title: `${newLog.personName}，给您发来一条消息！`,
                message: (newLog.context).replace(/<[^>]+>/g, ' '),
                subText: '点击查看聊天',       // 副标题
                playSound: true,              // 声音
                soundName: 'default',         // 声音类型
                vibrate: true,                // 震动
                vibration: 300,               // 震动时长 毫秒
                ongoing: false,               // 是否常驻通知栏
                largeIcon: 'ic_logo',         // 大图标：通知栏，图标存储地址 android/app/src/main/res
                smallIcon: 'ic_notification', // 小图标：状态栏
                autoCancel: true,             // 弹出通知栏自动消失
                tag: payload.data,            // tag利用这个字段跳转页面
                group: 'chat',                // group利用这个字段跳转页面
            });
        }
    }
}

/**
 * ACTIONS.CHAT_LIST.UPDATE 触发：主要针对更新 unread
 * @param payload
 */
export function* updateChatList({ payload }) {
    const { userId } = payload;
    // 获取当前用户的 storageKey
    const { storageKey, error } = yield getChatListStorageKey();
    // 获取当前 state
    const { chatList, unreadSum } = yield select(state => state.instantMessaging);
    // 清零所有未读数
    if (!error && userId && userId.toString() === 'all') {
        const newChatList = [];
        chatList.forEach((item) => {
            // 1.更新本地存储：storage
            global.storage.save({
                key: storageKey,
                id: item.userId,
                data: { ...item, unread: 0 },
                expires: null,
            });
            // 2.更新界面徽章：state
            newChatList.push({ ...item, unread: 0 });
        });
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList: newChatList,
                unreadSum: 0,
            },
        });
    }
    // 清零某条未读数
    if (!error && userId && userId.toString() !== 'all') {
        const newChatList = [];
        let newUnreadSum = unreadSum;
        chatList.forEach((item) => {
            if (item.userId === userId) {
                // 1.更新本地存储：storage
                global.storage.save({
                    key: storageKey,
                    id: item.userId,
                    data: { ...item, unread: 0 },
                    expires: null,
                });
                // 2.更新界面徽章：state
                newChatList.push({ ...item, unread: 0 });
                newUnreadSum -= item.unread;
            } else {
                newChatList.push(item);
            }
        });
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList: newChatList,
                unreadSum: newUnreadSum,
            },
        });
    }
}

/**
 * ACTIONS.CHAT_LIST.DELETE 触发
 * @param payload
 */
export function* deleteChatList({ payload }) {
    // 根据 chatList 中的 userId 删除
    const { userId } = payload;
    // 获取当前用户的 storageKey
    const { storageKey, error } = yield getChatListStorageKey();
    // 获取本地state
    const { chatList } = yield select(state => state.instantMessaging);
    // 删除某条
    if (!error && userId && userId.toString() !== 'all') {
        chatList.forEach((item) => {
            if (item.userId === userId) {
                // 删除本地存储storage
                global.storage.remove({
                    key: storageKey,
                    id: userId,
                });
            }
        });
        yield queryChatList(); // 重新请求数据
    }
    // 删除全部
    if (!error && userId && userId.toString() === 'all') {
        // 1.删除本地存储storage
        yield global.storage.clearMapForKey(storageKey);
        // 2.清空state数据
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList: [],
                unreadSum: 0,
            },
        });
    }
}
