import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    chatList: [],                                  // 聊天用户列表
    unreadSum: 0,                                  // 未读消息总数
    loading: false,                                // 加载状态
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.CHAT_LIST.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.CHAT_LIST.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.CHAT_LIST.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        default:
            return state;
    }
}
