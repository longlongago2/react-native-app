import { DeviceEventEmitter } from 'react-native';

export default async (taskData) => {
    // 此处监听用于消息通知
    DeviceEventEmitter.addListener('MqttMsg', (e) => {
        // notification...
        console.log(`push notification:${e.message}`);
    });
};
