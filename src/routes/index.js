import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { AppState, BackHandler, DeviceEventEmitter, ToastAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { MenuContext } from 'react-native-popup-menu';
import moment from 'moment';
import { initialStorage } from '../utils/storage';
import ACTIONS from '../models/actions';
import AppNavigator from './AppNavigator';
import api from '../utils/api';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,    // app状态：active,inactive,background
        };
        this.handleAppStateChange = this._handleAppStateChange.bind(this);
        this.handleBackAndroid = this._handleBackAndroid.bind(this);
        this.handleNotificationClick = this._handleNotificationClick.bind(this);
        this.handleChatNotificationClick = this._handleChatNotificationClick.bind(this);
        this.handleWONotificationClick = this._handleWONotificationClick.bind(this);
        this.handleAutoLogin = this._handleAutoLogin.bind(this);
        this.handleActiveMQ = this._handleActiveMQ.bind(this);
    }

    componentWillMount() {
        // 1.通知推送初始化
        PushNotification.popInitialNotification((notification) => {
            this.handleNotificationClick(notification);
        });
        // 2.storage初始化
        initialStorage();
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
        DeviceEventEmitter.addListener('MqttMsg', this.handleActiveMQ);
        // 1.通知栏配置
        PushNotification.configure({
            onNotification: this.handleNotificationClick,
            popInitialNotification: true,
        });
        // 2.自动登录并连接ActiveMQ
        this.handleAutoLogin();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid);
        DeviceEventEmitter.removeListener('MqttMsg', this.handleActiveMQ);
    }

    _handleAutoLogin() {
        const { dispatch } = this.props;
        global.storage.load({
            key: 'currentUser',
            autoSync: false,
        }).then((data) => {
            const { username, password } = data;
            // 1.自动登录
            dispatch({
                type: ACTIONS.USER_LOGIN.REQUEST,
                payload: {
                    username,
                    password,
                    dispatch,
                    runBackground: true, // 后台自动登录
                },
            });
        }).catch((err) => {
            switch (err.name) {
                case 'NotFoundError':
                    ToastAndroid.show('您还未登录，请先登录！', 3000);
                    break;
                case 'ExpiredError':
                    ToastAndroid.show('您的登录信息已过期，请重新登录！', 3000);
                    break;
                default:
                    ToastAndroid.show('登录信息捕获未知错误，请重新登录！', 3000);
            }
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: 'Login',
            });
        });
    }

    _handleActiveMQ(e) {
        const { dispatch } = this.props;
        const message = JSON.parse(e.message);
        dispatch({
            type: ACTIONS.CHAT_LIST.INSERT,
            payload: {
                item: {
                    topicId: message.topicId.toString(),
                    topicName: message.topicName,
                    type: message.type,
                    newestMsg: message.topicText,
                    createdAt: message.createdAt,
                    avatar: `${api.database}/${message.user.avatar}`,
                },
            },
        });
    }

    _handleChatNotificationClick(data) {
        const { dispatch } = this.props;
        const type = data.type.toString();
        switch (type) {
            case '0':
                // 通知
                break;
            case '1':
                // 私聊
                dispatch({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'Chatting',
                    params: {
                        userId: data.topicId,
                        personName: data.topicName,
                        type: data.type,
                    },
                });
                break;
            case '2':
                // 群聊
                break;
            default:
        }
    }

    _handleWONotificationClick(data) {
        const { dispatch } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WorkOrderDetail',
            params: {
                obj: {
                    ordercode: data.messageRouter,
                    title: data.workorderTitle,
                },
                workOrderType: null,
            },
        });
    }

    _handleNotificationClick(notification) {
        if (notification !== null) {
            const group = notification.group;
            const data = notification.data;
            switch (group) {
                case 'chat':
                    // 聊天消息通知
                    this.handleChatNotificationClick(data);
                    break;
                case 'workorder':
                    // 工单消息通知
                    this.handleWONotificationClick(data);
                    break;
                case 'progress':
                    break;
                default:
                    ToastAndroid.show('未处理的点击事件', 3000);
            }
        }
    }

    _handleAppStateChange(nextAppState) {
        const { appState } = this.state;
        if (appState === 'active' && nextAppState === 'background') {
            if (__DEV__) {
                console.log('才丰软件服务平台：处于后台状态！');
            }
        } else if (appState === 'background' && nextAppState === 'active') {
            if (__DEV__) {
                console.log('才丰软件服务平台：处于活动状态！');
            }
        }
        this.setState({ appState: nextAppState });
    }

    _handleBackAndroid() {
        const { nav, dispatch } = this.props;
        // 路由停留在首页时
        if (nav.index === 0) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                // 最近2秒内按过back键，可以退出应用
                BackHandler.exitApp();
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出服务平台', ToastAndroid.SHORT);
            return true;
        }
        dispatch({ type: 'Navigation/BACK' });  // 返回键调用返回action
        return true;
    }

    render() {
        const { dispatch, nav } = this.props;
        return (
            <MenuContext>
                <AppNavigator
                    navigation={addNavigationHelpers({
                        dispatch,
                        state: nav,
                    })}
                />
            </MenuContext>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func,
    nav: PropTypes.object,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(App);
