import { AppRegistry } from 'react-native';
import App from './App';
import ActiveMQService from './src/headless/ActiveMQ';

AppRegistry.registerComponent('CFSoftware', () => App);
AppRegistry.registerHeadlessTask('ActiveMQ', () => ActiveMQService);
