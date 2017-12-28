import { DeviceEventEmitter } from 'react-native';
import ActiveMQ from 'react-native-activemq';
import { getStorageByKey } from '../utils/storage';

export default async (taskData) => {
    // const { data } = await getStorageByKey('currentUser');
    // if (data) {
    //     ActiveMQ.connectAndReserve('CFSP/PTP', data.username);  // activeMQ 连接
    // }
    // DeviceEventEmitter.addListener('MqttMsg', (e) => {
    //     console.log(e.message);
    // });
};
