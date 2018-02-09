import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { BackHandler, ToastAndroid, StatusBar } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { MenuContext } from 'react-native-popup-menu';
import { initialStorage } from '../utils/storage';
import ACTIONS from '../models/actions';
import AppNavigator from './AppNavigator';
import theme from '../theme';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleBackAndroid = this._handleBackAndroid.bind(this);
        this.handleNotificationClick = this._handleNotificationClick.bind(this);
        this.handleChatNotificationClick = this._handleChatNotificationClick.bind(this);
        this.handleWONotificationClick = this._handleWONotificationClick.bind(this);
        this.handleAutoLogin = this._handleAutoLogin.bind(this);
    }

    componentWillMount() {
        // 1.通知栏操作：非活动状态
        PushNotification.popInitialNotification((notification) => {
            this.handleNotificationClick(notification);
        });
        // 2.storage初始化
        initialStorage();
        // 3.全局设置状态栏样式
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor(theme.statusBarColor, true);
    }

    componentDidMount() {
        // 通知栏操作：活动状态
        PushNotification.configure({
            onNotification: this.handleNotificationClick,
            popInitialNotification: true,
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
        this.handleAutoLogin();  // 自动登录并连接ActiveMQ
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid);
        clearTimeout(this.redirectChatting);
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

    _handleChatNotificationClick(data) {
        const { dispatch } = this.props;
        const type = data.type.toString();
        switch (type) {
            case '0':
                // 通知
                break;
            case '1':
            case '2':
                // 聊天：私聊，群聊
                this.redirectChatting = setTimeout(() => (
                    dispatch({
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Chatting',
                        params: {
                            userId: data.topicId,
                            personName: data.topicName,
                            type: data.type,
                        },
                    })
                ), 1500);
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

    _handleBackAndroid() {
        const { nav, dispatch } = this.props;
        // 路由停留在首页时，正常退出
        if (nav.index === 0) return false;
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
