import { DeviceEventEmitter } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default async (taskData) => {
    // 此处监听用于消息通知
    DeviceEventEmitter.addListener('MqttMsg', (e) => {
        const message = e.message;

        // 通知栏推送
        PushNotification.localNotification({
            title: '您有一条通知，点击查看',
            message: message.context || message.portrayal,
            playSound: true,              // 声音
            soundName: 'default',         // 声音类型
            vibrate: true,                // 震动
            vibration: 300,               // 震动时长 毫秒
            ongoing: false,               // 是否常驻通知栏
            largeIcon: 'ic_logo',         // 大图标：通知栏，图标存储地址 android/app/src/main/res
            smallIcon: 'ic_notification', // 小图标：状态栏
            autoCancel: true,             // 弹出通知栏自动消失
            data: message,
        });
    });
};
