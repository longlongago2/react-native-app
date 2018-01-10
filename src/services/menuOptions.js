import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import OptionBadge from '../routes/userPage/OptionBadge';
import InstructionBadge from '../routes/instructionPage/InstructionBadge';
import BrowsingHistory from '../routes/browsingHistoryPage';

// 首页 功能模块 选项
export function fetchHomeOptions() {
    return [
        {
            name: '我的工单',
            key: 'home-menu-01',
            icon: <FeatherIcon name="user-check" size={25} color="#fff" />,
            color: '#0BA29B',
            redirect: {
                routeName: 'WOICreated',
                params: {
                    workOrderType: 'woiCreated',
                },
            },
        },
        {
            name: '组内工单',
            key: 'home-menu-02',
            icon: <FeatherIcon name="users" size={25} color="#fff" />,
            color: '#79B23D',
            redirect: {
                routeName: 'WOGroup',
                params: {
                    workOrderType: 'woGroup',
                },
            },
        },
        {
            name: '我的任务',
            key: 'home-menu-03',
            icon: <FeatherIcon name="file-plus" size={25} color="#fff" />,
            color: '#F39801',
            redirect: {
                routeName: 'WOMyTask',
                params: {
                    workOrderType: 'woMyTask',
                },
            },
        },
        {
            name: '我的跟踪',
            key: 'home-menu-04',
            icon: <FeatherIcon name="eye" size={25} color="#fff" />,
            color: '#01A0EA',
            redirect: {
                routeName: 'WOTracking',
                params: {
                    workOrderType: 'woTracking',
                },
            },
        },
        {
            name: '草稿箱',
            key: 'home-menu-05',
            icon: <FeatherIcon name="feather" size={25} color="#fff" />,
            color: '#A9823F',
            redirect: {
                routeName: 'WODrafts',
                params: {
                    workOrderType: 'woDrafts',
                },
            },
        },
        {
            name: '回收站',
            key: 'home-menu-06',
            icon: <FeatherIcon name="trash-2" size={25} color="#fff" />,
            color: '#DD5044',
            redirect: {
                routeName: 'WORecycleBin',
                params: {
                    workOrderType: 'woRecycleBin',
                },
            },
        },
        {
            name: '更多',
            key: 'home-menu-07',
            icon: <FeatherIcon name="more-horizontal" size={25} color="#fff" />,
            color: '#cccccc',
            redirect: {
                routeName: '',
                params: {
                    workOrderType: 'more',
                },
            },
        },
    ];
}

// 我的 页面 功能选项
export function fetchUserOptions() {
    return [
        {
            data: [
                {
                    text: '我的消息',
                    showBadge: true,
                    badge: <OptionBadge />,
                    icon: <Icon name="bell" size={20} color="#1EA362" />,
                    redirect: { routeName: 'Notification' },
                    key: 'notification',
                },
                {
                    text: '最近浏览',
                    showBadge: false,
                    icon: <Icon name="clock-o" size={20} color="#009ACD" />,
                    redirect: { routeName: 'BrowsingHistory' },
                    key: 'history',
                },
            ],
            key: 's1',
        },
        {
            data: [{
                text: '设置',
                showBadge: false,
                icon: <Icon name="cog" size={20} color="#4169E1" />,
                redirect: { routeName: 'Setting' },
                key: 'setting',
            }],
            key: 's2',
        },
        {
            data: [
                {
                    text: '关于平台',
                    showBadge: false,
                    icon: <Icon name="info" size={20} color="#0F8EC9" />,
                    redirect: { routeName: 'Instruction' },
                    key: 'about',
                },
                {
                    text: '意见反馈',
                    showBadge: false,
                    icon: <Icon name="paper-plane" size={20} color="#00868B" />,
                    redirect: false,
                    key: 'feedback',
                },
            ],
            key: 's3',
        },
    ];
}

// 我的 设置 页面 操作选项
export function fetchSettingOptions(loginState) {
    if (!loginState) {
        return [
            {
                data: [
                    {
                        text: '清除本地缓存',
                        showBadge: false,
                        icon: <Icon name="hdd-o" size={20} color="#FFAA25" />,
                        redirect: { routeName: 'clearAllStorage' },
                        key: 'clean',
                    },
                    {
                        text: '请您登录',
                        showBadge: false,
                        icon: <Icon name="user" size={20} color="#01A0EA" />,
                        redirect: { routeName: 'Login' },
                        key: 'login',
                    },
                ],
                key: 's1',
            },
        ];
    }
    return [
        {
            data: [
                {
                    text: '清除本地缓存',
                    showBadge: false,
                    icon: <Icon name="hdd-o" size={20} color="#FFAA25" />,
                    redirect: { routeName: 'clearAllStorage' },
                    key: 'clean',
                },
                {
                    text: '修改密码',
                    showBadge: false,
                    icon: <Icon name="pencil-square-o" size={20} color="#01A0EA" />,
                    redirect: { routeName: 'UpdatePassword' },
                    key: 'psw',
                },
            ],
            key: 's1',
        },
        {
            data: [
                {
                    text: '退出登录',
                    showBadge: false,
                    icon: <Icon name="sign-out" size={20} color="#F21729" />,
                    redirect: { routeName: 'logout' },
                    key: 'logout',
                },
            ],
            key: 's2',
        },
    ];
}

// 关于平台 操作选项
export function fetchInstructionOptions() {
    return [
        {
            data: [
                {
                    text: '功能介绍',
                    showBadge: false,
                    icon: <Icon name="rocket" size={20} color="#4C8BF5" />,
                    redirect: {
                        routeName: 'WebView',
                        params: {
                            title: '跳转中...',
                            source: {
                                uri: 'http://www.baidu.com',
                            },
                        },
                    },
                    key: 'readme',
                },
                {
                    text: '开源协议',
                    showBadge: false,
                    icon: <Icon name="code" size={20} color="#4C8BF5" />,
                    redirect: {
                        routeName: 'WebView',
                        params: {
                            title: '跳转中...',
                            source: {
                                uri: 'http://www.baidu.com',
                            },
                        },
                    },
                    key: 'license',
                },
            ],
            key: 's1',
        },
        {
            data: [
                {
                    text: '检查更新',
                    showBadge: true,
                    badge: <InstructionBadge />,
                    icon: <Icon name="cloud-download" size={20} color="#4C8BF5" />,
                    redirect: false,
                    key: 'upgrade',
                },
            ],
            key: 's2',
        },
    ];
}

// 聊天功能面板选项
export function fetchFunctionOptions() {
    return [
        {
            name: '语音',
            key: 'function-menu-01',
            icon: <FeatherIcon name="mic" size={25} color="#fff" />,
            color: '#0BA29B',
            type: 0,
        },
        {
            name: '视频',
            key: 'function-menu-02',
            icon: <FeatherIcon name="video" size={25} color="#fff" />,
            color: '#233AAE',
            type: 1,
        },
        {
            name: '相册',
            key: 'function-menu-03',
            icon: <FeatherIcon name="image" size={25} color="#fff" />,
            color: '#79B23D',
            type: 2,
        },
        {
            name: '拍摄',
            key: 'function-menu-04',
            icon: <FeatherIcon name="camera" size={25} color="#fff" />,
            color: '#3C3F41',
            type: 3,
        },
        {
            name: '文件',
            key: 'function-menu-05',
            icon: <FeatherIcon name="folder" size={25} color="#fff" />,
            color: '#FFAA25',
            type: 4,
        },
        {
            name: '位置',
            key: 'function-menu-06',
            icon: <FeatherIcon name="map-pin" size={25} color="#fff" />,
            color: '#A9823F',
            type: 5,
        },
        {
            name: '工单',
            key: 'function-menu-07',
            icon: <FeatherIcon name="hash" size={25} color="#fff" />,
            color: '#DD5044',
            type: 6,
        },
        {
            name: '名片',
            key: 'function-menu-08',
            icon: <FeatherIcon name="credit-card" size={25} color="#fff" />,
            color: '#007AF9',
            type: 7,
        },
    ];
}
