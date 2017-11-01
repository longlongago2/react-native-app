import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import HeaderTitle from '../components/HeaderTitle';
import Home from './homePage';
import AddressList from './addressListPage';
import ChatList from './chatListPage';
import WorkOrder from './workOrderPage';
import WorkorderHeaderRight from './homePage/HeaderRight';
import User from './userPage';
import Login from './loginPage';
import CreateWO from './createWOPage';
import Setting from './settingPage/index';
import Profile from './profilePage';
import Notification from './notificationPage';
import NotificationTitle from './notificationPage/HeaderTitle';
import Chatting from './chattingPage';
import CreateWOHeaderRight from './createWOPage/HeaderRight';
import TabBarBadge from './chatListPage/TabBarBadge';
import AvatarPreview from './avatarPreviewPage';
import AvatarPreviewHeaderRight from './avatarPreviewPage/HeaderRight';
import ImagePreview from './imagesPreviewPage';
import UpdateProfileOptions from './profilePage/updateProfileOptions';
import UpdateProfileOptionsHeaderRight from './profilePage/HeaderRight';
import UpdatePassword from './settingPage/updatePassword';
import UpdatePasswordHeaderRight from './settingPage/HeadRight';
import WOGroup from './wo_group';
import WOGroupHeaderRight from './wo_group/HeaderRight';
import WOMyTask from './wo_myTask';
import WOMyTaskHeaderRight from './wo_myTask/HeaderRight';
import WOICreated from './wo_iCreated';
import WOICreatedHeaderRight from './wo_iCreated/HeaderRight';
import WOTracking from './wo_tracking';
import WODrafts from './wo_drafts';
import WODraftsHeaderRight from './wo_drafts/HeaderRight';
import WORecycleBin from './wo_recycleBin';
import WORecycleBinHeaderRight from './wo_recycleBin/HeaderRight';
import WorkOrderDetail from './workOrderDetail';
import WebView from './webViewPage';
import WebViewHeaderRight from './webViewPage/HeaderRight';
import WebViewHeaderLeft from './webViewPage/HeaderLeft';
import Instruction from './instructionPage';

const InstantMessaging = TabNavigator({
    ChatList: {
        screen: ChatList,
        path: 'chatList',
        navigationOptions() {
            return {
                tabBarLabel: '消息',
            };
        },
    },
    AddressList: {
        screen: AddressList,
        path: 'addressList',
        navigationOptions() {
            return {
                tabBarLabel: '通讯录',
            };
        },
    },
}, {
    initialRouteName: 'ChatList',
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
        showLabel: true,
        showIcon: false,
        scrollEnabled: false,
        activeTintColor: theme.tabBar.activeTintColor,
        inactiveTintColor: theme.tabBar.inactiveTintColor,
        pressColor: theme.tabBar.rippleColor,
        indicatorStyle: {
            height: 4,
            width: 50,
            left: '25%',
            marginLeft: -25,
            borderRadius: 2,
            backgroundColor: theme.tabBar.indicatorColor,
            bottom: 2,
        },
        labelStyle: {
            fontSize: 15,
        },
        style: {
            backgroundColor: theme.tabBar.backgroundColor,
        },
    },
});

export const BottomNavigator = TabNavigator({
    Home: {
        screen: Home,
        path: 'home',
        navigationOptions() {
            return {
                header: null,
                tabBarLabel: '首页',
                tabBarIcon({ tintColor }) {
                    return (
                        <Icon name="grid" size={25} color={tintColor} />
                    );
                },
            };
        },
    },
    WorkOrder: {
        screen: WorkOrder,
        path: 'workOrder',
        navigationOptions({ navigation }) {
            return {
                tabBarLabel: '工单',
                tabBarIcon({ tintColor }) {
                    return (
                        <Icon name="pocket" size={25} color={tintColor} />
                    );
                },
                headerTitle: (
                    <HeaderTitle
                        title="工单"
                        navigation={navigation}
                        onPress={() => WorkOrder.scrollToTop()}
                    />
                ),
                headerRight: <WorkorderHeaderRight />,
            };
        },
    },
    InstantMessaging: {
        screen: InstantMessaging,
        path: 'instantMessaging',
        navigationOptions() {
            return {
                header: null,
                tabBarLabel: '聊天',
                tabBarIcon({ focused, tintColor }) {
                    if (focused) {
                        return (
                            <TabBarBadge
                                icon={
                                    <IonicIcon
                                        name="md-chatbubbles"
                                        size={25}
                                        color={tintColor}
                                    />
                                }
                                display="number"
                            />
                        );
                    }
                    return (
                        <TabBarBadge
                            icon={
                                <Icon
                                    name="message-square"
                                    size={25}
                                    color={tintColor}
                                />}
                            display="number"
                        />);
                },
            };
        },
    },
    User: {
        screen: User,
        path: 'user',
        navigationOptions() {
            return {
                tabBarLabel: '我的',
                tabBarIcon({ tintColor }) {
                    return (
                        <Icon name="user" size={25} color={tintColor} />
                    );
                },
            };
        },
    },
}, {
    initialRouteName: 'Home',     // 默认标签页
    tabBarPosition: 'bottom',     // 导航栏位置
    swipeEnabled: false,          // 是否允许在标签之间进行滑动
    animationEnabled: false,      // 是否允许显示动画
    lazy: true,                   // 懒加载，不提前制作
    backBehavior: 'initialRoute', // tab栏是否支持返回到首页
    tabBarOptions: {
        showLabel: true,
        showIcon: true,
        scrollEnabled: false,     // 允许tab栏过长左右滚动
        activeTintColor: theme.bottomTabs.activeTintColor,
        inactiveTintColor: theme.bottomTabs.inactiveTintColor,
        pressColor: theme.bottomTabs.rippleColor,
        indicatorStyle: {
            height: 0,
        },
        labelStyle: {
            fontSize: 9,
            margin: 0,
        },
        iconStyle: {
            width: 60,
            height: 30,
        },
        style: {
            backgroundColor: theme.bottomTabs.backgroundColor,
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(191, 191, 191, 0.2)',
        },
    },
});

const AppNavigator = StackNavigator({
    Login: {
        screen: Login,
        path: 'login',
        navigationOptions() {
            return {
                header: null,
            };
        },
    },
    CreateWO: {
        screen: CreateWO,
        path: 'createWO',
        navigationOptions({ navigation }) {
            const { state } = navigation;
            return {
                title: (state.params && state.params.dataFilling) ? '修改工单' : '创建工单',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <CreateWOHeaderRight navigation={navigation} />,
            };
        },
    },
    Profile: {
        screen: Profile,
        path: 'profile',
        navigationOptions() {
            return {
                title: '用户信息',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    Chatting: {
        screen: Chatting,
        path: 'chatting',
        navigationOptions({ navigation }) {
            return {
                title: `${navigation.state.params.personName}`,
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    Entry: {
        screen: BottomNavigator,
        path: 'entry',
        navigationOptions({ navigation, screenProps, navigationOptions }) {
            return {
                title: `${navigationOptions.tabBarLabel}`,
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    Setting: {
        screen: Setting,
        path: 'setting',
        navigationOptions() {
            return {
                title: '设置',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    Notification: {
        screen: Notification,
        path: 'notification',
        navigationOptions({ navigation }) {
            return {
                headerTitle: (
                    <NotificationTitle
                        title="我的消息"
                        navigation={navigation}
                        onPress={() => Notification.scrollToTop()}
                    />
                ),
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    AvatarPreview: {
        screen: AvatarPreview,
        path: 'avatarPreview',
        navigationOptions({ navigation }) {
            const { state } = navigation;
            return {
                title: state.params.item.title,
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <AvatarPreviewHeaderRight />,
            };
        },
    },
    ImagesPreview: {
        screen: ImagePreview,
        path: 'imagesPreview',
        navigationOptions({ navigation }) {
            const { state } = navigation;
            return {
                title: state.params.title || '图片预览',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    UpdateProfileOptions: {
        screen: UpdateProfileOptions,
        path: 'updateProfileOptions',
        navigationOptions({ navigation }) {
            const { state } = navigation;
            return {
                title: state.params.item.title,
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <UpdateProfileOptionsHeaderRight
                    navigation={navigation}
                />,
            };
        },
    },
    UpdatePassword: {
        screen: UpdatePassword,
        path: 'UpdatePassword',
        navigationOptions({ navigation }) {
            return {
                title: '修改密码',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <UpdatePasswordHeaderRight
                    navigation={navigation}
                />,
            };
        },
    },
    WOGroup: {
        screen: WOGroup,
        path: 'woGroup',
        navigationOptions({ navigation }) {
            return {
                headerTitle: (
                    <HeaderTitle
                        title="组内工单"
                        navigation={navigation}
                        onPress={() => WOGroup.scrollToTop()}
                    />
                ),
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <WOGroupHeaderRight navigation={navigation} />,
            };
        },
    },
    WOMyTask: {
        screen: WOMyTask,
        path: 'WOMyTask',
        navigationOptions({ navigation }) {
            return {
                headerTitle: (
                    <HeaderTitle
                        title="我的任务"
                        navigation={navigation}
                        onPress={() => WOMyTask.scrollToTop()}
                    />
                ),
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <WOMyTaskHeaderRight navigation={navigation} />,
            };
        },
    },
    WOICreated: {
        screen: WOICreated,
        path: 'WOICreated',
        navigationOptions({ navigation }) {
            return {
                headerTitle: (
                    <HeaderTitle
                        title="我的工单"
                        navigation={navigation}
                        onPress={() => WOICreated.scrollToTop()}
                    />
                ),
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <WOICreatedHeaderRight navigation={navigation} />,
            };
        },
    },
    WOTracking: {
        screen: WOTracking,
        path: 'WOTracking',
        navigationOptions() {
            return {
                title: '我的跟踪',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    WODrafts: {
        screen: WODrafts,
        path: 'WODrafts',
        navigationOptions({ navigation }) {
            return {
                headerTitle: (
                    <HeaderTitle
                        title="草稿箱"
                        navigation={navigation}
                        onPress={() => WODrafts.scrollToTop()}
                    />
                ),
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <WODraftsHeaderRight navigation={navigation} />,
            };
        },
    },
    WORecycleBin: {
        screen: WORecycleBin,
        path: 'WORecycleBin',
        navigationOptions({ navigation }) {
            return {
                headerTitle: (
                    <HeaderTitle
                        title="回收站"
                        navigation={navigation}
                        onPress={() => WORecycleBin.scrollToTop()}
                    />
                ),
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <WORecycleBinHeaderRight
                    navigation={navigation}
                />,
            };
        },
    },
    WorkOrderDetail: {
        screen: WorkOrderDetail,
        path: 'WorkOrderDetail',
        navigationOptions({ navigation }) {
            const { state } = navigation;
            return {
                title: state.params.obj.title,
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
    WebView: {
        screen: WebView,
        path: 'webView',
        navigationOptions({ navigation }) {
            const { state } = navigation;
            return {
                title: state.params.title,
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
                headerRight: <WebViewHeaderRight navigation={navigation} />,
                headerLeft: <WebViewHeaderLeft />,
                headerTitleStyle: {
                    width: 200,
                    marginLeft: 5,
                },
            };
        },
    },
    Instruction: {
        screen: Instruction,
        path: 'instruction',
        navigationOptions({ navigation }) {
            return {
                title: '关于平台',
                headerTintColor: theme.header.foregroundColor,
                headerStyle: {
                    backgroundColor: theme.header.backgroundColor,
                },
            };
        },
    },
}, {
    initialRouteName: 'Entry',
});

export default AppNavigator;
