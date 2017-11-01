import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    workorder: {               // 工单界面展示页：组内工单
        pageNumber: 0,         // 当前加载页码
        pageLoading: false,    // 分页加载
        workorderList: [],     // 数据列表
        loading: false,        // 正在加载
        loaded: false,         // 所有数据加载完成
    },
    woGroup: {                 // 首页模块：组内工单
        pageNumber: 0,         // 当前加载页码
        pageLoading: false,    // 分页加载
        workorderList: [],     // 数据列表
        loading: false,        // 正在加载
        loaded: false,         // 所有数据加载完成
    },
    woMyTask: {                // 首页模块：我的任务
        pageNumber: 0,         // 当前加载页码
        pageLoading: false,    // 分页加载
        workorderList: [],     // 数据列表
        loading: false,        // 正在加载
        loaded: false,         // 所有数据加载完成
    },
    woRecycleBin: {            // 首页模块：回收站
        pageNumber: 0,         // 当前加载页码
        pageLoading: false,    // 分页加载
        workorderList: [],     // 数据列表
        loading: false,        // 正在加载
        loaded: false,         // 所有数据加载完成
    },
    woiCreated: {              // 首页模块：我的工单
        pageNumber: 0,         // 当前加载页码
        pageLoading: false,    // 分页加载
        workorderList: [],     // 数据列表
        loading: false,        // 正在加载
        loaded: false,         // 所有数据加载完成
    },
    woDrafts: {                // 首页模块：草稿箱
        pageNumber: 0,         // 当前加载页码
        pageLoading: false,    // 分页加载
        workorderList: [],     // 数据列表
        loading: false,        // 正在加载
        loaded: false,         // 所有数据加载完成
    },
    loading: false,   // insert loading
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    const stateName = payload && payload.stateName;
    const stateValue = payload && payload.stateValue;
    switch (type) {
        case ACTIONS.WORKORDER.LOADING:
            const newPartLoading = {};
            if (stateName && stateValue) {
                newPartLoading[stateName] = {
                    ...state[stateName],
                    loading: stateValue.loading || state[stateName].loading,
                    pageLoading: stateValue.pageLoading || state[stateName].pageLoading,
                };
            }
            return {
                ...state,
                ...newPartLoading,
                loading: payload.loading || state.loading,
            };
        case ACTIONS.WORKORDER.SUCCESS:
            const newPartSuccess = {};
            if (stateName && stateValue) {
                newPartSuccess[stateName] = {
                    ...state[stateName],
                    ...stateValue,
                    loading: false,
                    pageLoading: false,
                };
            }
            return {
                ...state,
                ...newPartSuccess,
                loading: false,
            };
        case ACTIONS.WORKORDER.FAILURE:
            ToastAndroid.show(`操作失败：${payload.message}`, 3000);
            const newPartFailure = {};
            if (stateName) {
                newPartFailure[stateName] = {
                    ...state[stateName],
                    loading: false,
                    pageLoading: false,
                };
            }
            return {
                ...state,
                ...newPartFailure,
                loading: false,
            };
        default:
            return state;
    }
}
