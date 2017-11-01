/** created by zhangqi on 2017-9-22 */
import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    loading: false,        // 正在加载
    userGroupList: [],     // 用户组列表
    usersList: [],         // 用户组下所有用户
    assignedUsersList: [], // 可以指派的用户
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.USERGROUP.LOADING:
        case ACTIONS.USERGROUP_DETAIL.LOADING:
            const { loading } = payload;
            return { ...state, loading };
        case ACTIONS.USERGROUP.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.USERGROUP.FAILURE:
            ToastAndroid.show(`查询用户列表失败：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.USERGROUP_DETAIL.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.USERGROUP_DETAIL.FAILURE:
            ToastAndroid.show(`查询用户详情失败：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.USERGROUP_ASSIGNED.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.USERGROUP_ASSIGNED.FAILURE:
            ToastAndroid.show(`查询可指派人员失败：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.USERGROUP_TRACKERS.SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.USERGROUP_TRACKERS.FAILURE:
            ToastAndroid.show('添加跟踪者失败', 3000);
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
