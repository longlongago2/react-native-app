import { DeviceEventEmitter, ToastAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import api from '../utils/api';
import ACTIONS from '../models/actions';
import rootSaga from '../models/effects';
import { store } from '../../App';

const handleActiveMQNotification = (e) => {
    if (!global.saga) {
        global.saga = store.runSaga(rootSaga);
    }
    const dispatch = store.dispatch;
    try {
        const message = JSON.parse(e.message);
        // 1.通知栏推送
        PushNotification.localNotification({
            id: message.topicId,
            title: message.topicName,
            message: message.topicText || message.topicType,  // topicType,消息类型的文字形式：[图片] [语音] 等
            playSound: true,              // 声音
            soundName: 'default',         // 声音类型
            vibrate: true,                // 震动
            vibration: 300,               // 震动时长 毫秒
            ongoing: false,               // 是否常驻通知栏
            largeIcon: 'ic_logo',         // 大图标：通知栏，图标存储地址 android/app/src/main/res
            smallIcon: 'ic_notification', // 小图标：状态栏
            autoCancel: true,             // 弹出通知栏自动消失
            group: 'chat',
            data: message,
        });
        // 2.记录聊天列表数据（chatList表）
        const localtime = moment().format('YYYY-MM-DD HH:mm:ss');
        const avatar = message.user.avatar && `${api.database}/${message.user.avatar}`;
        dispatch({
            type: ACTIONS.CHAT_LIST.INSERT,
            payload: {
                item: {
                    topicId: message.topicId.toString(),
                    topicName: message.topicName,
                    type: message.type,
                    newestMsg: message.topicText,
                    avatar,
                    createdAt: localtime, // 使用本地时间
                },
            },
        });
        let contentTypeName;
        switch (message.portrayal) {
            case 0:
                contentTypeName = 'text';
                break;
            case 1:
                contentTypeName = 'image';
                break;
            case 2:
                contentTypeName = 'voice';
                break;
            case 3:
                contentTypeName = 'location';
                break;
            default:
                contentTypeName = 'text';
                break;
        }
        // 3.记录聊天面板数据（message表）
        dispatch({
            type: ACTIONS.ACTIVE_MQ.INSERT,
            payload: {
                topicId: message.topicId.toString(),
                userid: message.senderId,
                typeId: message.portrayal.toString(),
                content: message.text,
                contentTypeName,
                user: {
                    ...message.user,
                    avatar,
                },
                createdAt: localtime,  // 使用本地时间
            },
        });
    } catch (err) {
        ToastAndroid.show(err.message, 3000);
    }
};

export default async () => {
    // 此处监听用于消息通知
    DeviceEventEmitter.addListener('MqttMsg', handleActiveMQNotification);
};
