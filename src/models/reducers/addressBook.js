import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    friendGroupList: [], // 好友分组列表
    friendDetailList: [], // 好友详情信息
    chatGroupList: [],   // 群聊列表
    chatGroupMembers: [], // 群成员列表
    loading: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.FRIEND_GROUP.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.FRIEND_GROUP.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.FRIEND_GROUP.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        case ACTIONS.FRIEND_DETAIL.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.FRIEND_DETAIL.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.FRIEND_DETAIL.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        case ACTIONS.CHATGROUP.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.CHATGROUP.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.CHATGROUP.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        case ACTIONS.CHATGROUP_MEMBERS.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.CHATGROUP_MEMBERS.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.CHATGROUP_MEMBERS.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        default:
            return state;
    }
}
