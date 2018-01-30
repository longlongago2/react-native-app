import { DeviceEventEmitter, ToastAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default async () => {
    // 此处监听用于消息通知
    DeviceEventEmitter.addListener('MqttMsg', (e) => {
        try {
            const message = JSON.parse(e.message);
            // 通知栏推送
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
        } catch (err) {
            ToastAndroid.show(err.message, 3000);
        }
    });
};
