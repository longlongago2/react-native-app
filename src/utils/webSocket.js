import PushNotification from 'react-native-push-notification';
import api from '../utils/api';
import ACTIONS from '../models/actions';

export async function openChatWS(userId, dispatch) {
    // 如果已建立连接，就跳出
    if (global.CHATWS && global.CHATWS.readyState === 1) {
        return false;
    }
    // 未建立连接，继续建立连接
    const url = `${api.webSocket}/chat?userId=${userId}`;
    const chatWS = new WebSocket(url);
    chatWS.onopen = function onOpen(e) {
        console.log('webSocket：chat会话建立！');
    };
    chatWS.onmessage = function onMessage(e) {
        const msg = JSON.parse(e.data);
        if (msg.type === 1) {
            // 私聊
            dispatch({
                type: ACTIONS.CHAT_LIST.INSERT,
                payload: {
                    data: e.data,
                },
            });
        }
        if (msg.type === 0) {
            // 广播
            dispatch({
                type: ACTIONS.SYS_LIST.INSERT,
                payload: {
                    data: e.data,
                },
            });
        }
    };
    chatWS.onclose = function onClose() {
        console.log('webSocket：chat会话关闭！');
    };
    // 储存在全局(webSocket对象)
    global.CHATWS = chatWS;
    return true;
}

export async function closeChatWS() {
    if (global.CHATWS && global.CHATWS.readyState === 1) {
        global.CHATWS.close();
    }
}

export async function openMessageWS(userId, dispatch) {
    // 如果已建立连接，跳出
    if (global.MESSAGEWS && global.MESSAGEWS.readyState === 1) {
        return false;
    }
    // 如果未建立连接，继续建立连接
    const url = `${api.webSocket}/message?userId=${userId}`;
    const messageWS = new WebSocket(url);
    messageWS.onopen = function onOpen() {
        console.log('webSocket：message会话建立！');
    };
    messageWS.onmessage = function onMessage(e) {
        const message = JSON.parse(e.data);
        // 1.通知栏推送
        PushNotification.localNotification({
            title: '您有一条通知，点击查看',
            message: message.context,
            playSound: true,              // 声音
            soundName: 'default',         // 声音类型
            vibrate: true,                // 震动
            vibration: 300,               // 震动时长 毫秒
            ongoing: false,               // 是否常驻通知栏
            largeIcon: 'ic_logo',         // 大图标：通知栏，图标存储地址 android/app/src/main/res
            smallIcon: 'ic_notification', // 小图标：状态栏
            autoCancel: true,             // 弹出通知栏自动消失
            tag: e.data,                  // (optional) add tag to message 利用这个字段跳转页面
            group: 'workorder',           // (optional) add group to message 利用这个字段跳转页面
        });
        // 2.查询最新的未读消息数字
        dispatch({ type: ACTIONS.UNREAD_NOTIFICATION.REQUEST });
    };
    messageWS.onclose = function onClose() {
        console.log('webSocket:message会话关闭');
    };
    // 储存在全局(webSocket对象)
    global.MESSAGEWS = messageWS;
    return true;
}

export async function closeMessageWS() {
    if (global.MESSAGEWS && global.MESSAGEWS.readyState === 1) {
        global.MESSAGEWS.close();
    }
}
