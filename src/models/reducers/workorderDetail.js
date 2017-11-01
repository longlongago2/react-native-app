/** created by zhanqi on 2017-9-6 */
import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    loading: false,        // 正在加载
    workOrderDetail: {},   // 单条工单对象
    workOrderReply: [],    // 工单回复
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.WORKORDER_DETAIL.LOADING:
        case ACTIONS.WORKORDER_REPLY.LOADING:
            const { loading } = payload;
            return { ...state, loading };
        case ACTIONS.WORKORDER_DETAIL.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.WORKORDER_DETAIL.FAILURE:
            ToastAndroid.show(`操作工单详情失败：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.WORKORDER_REPLY.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.WORKORDER_REPLY.FAILURE:
            ToastAndroid.show(`操作工单回复失败：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
