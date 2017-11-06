/**
 * created by zhangqi on 2017-9-12
 * */
import React from 'react';
import { View, Text, ToastAndroid, Alert } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../../theme';
import ACTIONS from '../../models/actions';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';

const dataList = [
    {
        data: [
            { key: 'review', name: '评审', redirect: { type: 'modal', params: { name: 'review' } } },
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        data2: [
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        key: 'woGroup',
    },
    {
        data: [
            { key: 'update', name: '更新', redirect: { type: 'modal', params: { name: 'update' } } },
            { key: 'reAssign', name: '转交', redirect: { type: 'modal', params: { name: 'reAssign' } } },
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        data2: [
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        key: 'woMyTask',
    },
    {
        data: [
            {
                key: 'edit',
                name: '重新编辑',
                redirect: {
                    type: 'route',
                    params: {
                        name: 'CreateWO',
                        stateName: 'woiCreated',
                    },
                },
            },
            { key: 'recall', name: '撤回', redirect: { type: 'currentPage', params: { name: 'recall' } } },
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        data2: [
            { key: 'close', name: '关闭', redirect: { type: 'modal', params: { name: 'close' } } },
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        data3: [
            { key: 'delete', name: '删除', redirect: { type: 'currentPage', params: { name: 'delete' } } },
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        key: 'woiCreated',
    },
    {
        data: [
            { key: 'noTracking', name: '取消跟踪', redirect: { type: 'currentPage', params: { name: 'noTracking' } } },
            { key: 'reply', name: '留言', redirect: { type: 'modal', params: { name: 'reply' } } },
        ],
        key: 'woTracking',
    },
    {
        data: [
            {
                key: 'edit',
                name: '重新编辑',
                redirect: {
                    type: 'route',
                    params: {
                        name: 'CreateWO',
                        stateName: 'woDrafts',
                    },
                },
            },
            { key: 'reSubmit', name: '重新提交', redirect: { type: 'currentPage', params: { name: 'reSubmit' } } },
            { key: 'clean', name: '删除', redirect: { type: 'currentPage', params: { name: 'clean' } } },
        ],
        key: 'woDrafts',
    },
    {
        data: [
            { key: 'restore', name: '还原', redirect: { type: 'currentPage', params: { name: 'restore' } } },
            { key: 'clean', name: '删除', redirect: { type: 'currentPage', params: { name: 'clean' } } },
        ],
        key: 'woRecycleBin',
    },
];

const WODetailBottom = ({ workOrderDetail, navigation, userid, dispatch }) => {
    const { wsstatus, wstateclient } = workOrderDetail;
    const { state } = navigation;
    const workOrderType = state.params.workOrderType;            // 工单模块（我的工单，组内工单，我的跟踪...）
    const productPrincipal = state.params.obj.productprincipal;  // 工单负责人

    function handleDataList() {
        switch (workOrderType) {
            case 'woGroup':        // 组内工单
                let groupList = [];
                if (wsstatus === 0 && (userid.toString() === productPrincipal)) { // 未评审&&当前用户为产品负责人
                    groupList = dataList[0].data;
                } else {
                    groupList = dataList[0].data2;
                }
                return groupList;
            case 'woiCreated':    // 我的工单
                let iCreatedList = [];
                if (wstateclient === 1) { // 未处理
                    iCreatedList = dataList[2].data;
                }
                if (wstateclient === 2 || wstateclient === 3) { // 处理中&&处理完
                    iCreatedList = dataList[2].data2;
                }
                if (wstateclient === 4) { // 已关闭
                    iCreatedList = dataList[2].data3;
                }
                return iCreatedList;
            case 'woMyTask':      // 我的任务
                let myTaskList = [];
                if (wstateclient === 4) { // 客户状态已关闭
                    myTaskList = dataList[1].data2;
                } else {
                    myTaskList = dataList[1].data;
                }
                return myTaskList;
            case 'woTracking':    // 我的跟踪
                return dataList[3].data;
            case 'woDrafts':      // 草稿箱
                return dataList[4].data;
            case 'woRecycleBin':  // 回收站
                return dataList[5].data;
            default:
                return [];
        }
    }

    function handleOptions(item) {
        const { setParams } = navigation;
        switch (item.redirect.type) {
            case 'route':
                if (item.redirect.params.name === 'CreateWO') {
                    // 重新编辑
                    dispatch({
                        type: 'Navigation/NAVIGATE',
                        routeName: item.redirect.params.name,
                        params: {
                            dataFilling: true,                          // 修改工单
                            stateName: item.redirect.params.stateName,  // 数据来源模块，方便重新编辑时更新本地数据
                            orderCode: workOrderDetail.ordercode,
                        },
                    });
                } else {
                    dispatch({
                        type: 'Navigation/NAVIGATE',
                        routeName: item.redirect.params.name,
                    });
                }
                break;
            case 'modal':
                setParams({
                    modalVisible: true,
                    type: item.redirect.params.name,
                });
                break;
            case 'currentPage':
                switch (item.redirect.params.name) {
                    case 'recall':
                        // 撤回
                        dispatch({
                            type: ACTIONS.WORKORDER.UPDATE,
                            payload: {
                                stateName: 'woiCreated',
                                stateValue: {
                                    todo: 'recall',
                                    params: {
                                        orderCode: workOrderDetail.ordercode,
                                    },
                                },
                            },
                        });
                        // 返回上一页
                        dispatch({ type: 'Navigation/BACK' });
                        break;
                    case 'clean':
                        // 真删
                        Alert.alert(
                            '询问',
                            '工单将彻底删除且无法恢复，是否继续？',
                            [
                                {
                                    text: '取消',
                                    style: 'cancel',
                                },
                                {
                                    text: '是',
                                    onPress: () => {
                                        // 删除工单
                                        dispatch({
                                            type: ACTIONS.WORKORDER.DELETE,
                                            payload: {
                                                stateName: 'woRecycleBin',
                                                stateValue: {
                                                    orderCodes: workOrderDetail.ordercode,
                                                },
                                            },
                                        });
                                        // 返回上一页
                                        dispatch({ type: 'Navigation/BACK' });
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                        break;
                    case 'delete':
                        // 删除到回收站
                        Alert.alert(
                            '询问',
                            '工单将移除到回收站，是否继续？',
                            [
                                {
                                    text: '取消',
                                    style: 'cancel',
                                },
                                {
                                    text: '是',
                                    onPress: () => {
                                        dispatch({
                                            type: ACTIONS.WORKORDER.UPDATE,
                                            payload: {
                                                stateName: 'woiCreated',
                                                stateValue: {
                                                    todo: 'delete',
                                                    params: {
                                                        orderCodes: workOrderDetail.ordercode,
                                                    },
                                                },
                                            },
                                        });
                                        // 返回上一页
                                        dispatch({ type: 'Navigation/BACK' });
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                        break;
                    case 'reSubmit':
                        // 重新提交
                        dispatch({
                            type: ACTIONS.WORKORDER.UPDATE,
                            payload: {
                                stateName: 'woDrafts',
                                stateValue: {
                                    todo: 'reSubmit',
                                    params: {
                                        orderCode: workOrderDetail.ordercode,
                                    },
                                },
                            },
                        });
                        // 返回上一页
                        dispatch({ type: 'Navigation/BACK' });
                        break;
                    case 'restore':
                        // 还原
                        Alert.alert(
                            '询问',
                            '工单将还原到我的工单，是否继续？',
                            [
                                {
                                    text: '取消',
                                    style: 'cancel',
                                },
                                {
                                    text: '是',
                                    onPress: () => {
                                        dispatch({
                                            type: ACTIONS.WORKORDER.UPDATE,
                                            payload: {
                                                stateName: 'woRecycleBin',
                                                stateValue: {
                                                    todo: 'restore',
                                                    params: {
                                                        orderCodes: workOrderDetail.ordercode,
                                                    },
                                                },
                                            },
                                        });
                                        // 返回上一页
                                        dispatch({ type: 'Navigation/BACK' });
                                    },
                                },
                            ]);
                        break;
                    case 'noTracking':
                        // 取消跟踪
                        Alert.alert(
                            '询问',
                            '取消跟踪后，会从跟踪列表中移除，是否继续？',
                            [
                                {
                                    text: '取消',
                                    style: 'cancel',
                                },
                                {
                                    text: '是',
                                    onPress: () => {
                                        dispatch({
                                            type: ACTIONS.TRACKINGWORKORDER.DELETE,
                                            payload: {
                                                orderCodes: workOrderDetail.ordercode,
                                            },
                                        });
                                        // 返回上一页
                                        dispatch({ type: 'Navigation/BACK' });
                                    },
                                },
                            ]);
                        break;
                    default:
                        ToastAndroid.show('WODetailBottom.js:name类型未处理', 3000);
                }
                break;
            default:
                ToastAndroid.show('WODetailBottom.js:type类型未处理', 3000);
        }
    }

    if (handleDataList().length <= 0) return null;
    return (
        <View
            style={{
                height: 45,
                borderTopWidth: 0.5,
                flexDirection: 'row',
                borderTopColor: 'rgba(139,139,139,0.4)',
                backgroundColor: '#ffffff',
            }}
        >
            {
                handleDataList().map((item, i) => (
                    <RAFTouchableNativeFeedback
                        key={item.key}
                        backgroundColor={theme.rippleColor}
                        onPress={() => handleOptions(item)}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRightWidth: 0.85,
                                borderRightColor: 'rgba(139,139,139,0.3)',
                            }}
                        >
                            <Text style={{ color: theme.theme }}>{item.name}</Text>
                        </View>
                    </RAFTouchableNativeFeedback>
                ))
            }
        </View>
    );
};

WODetailBottom.propTypes = {
    userid: PropTypes.number.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default WODetailBottom;
