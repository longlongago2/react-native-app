import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    unreadSum: 0,    // 未读消息总数
    chatList: [],    // 用户所有聊天数据
    sysList: [],     // 系统消息
    addressList: [], // 通讯录消息
    loading: false,  // 加载状态
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.CHAT_LIST.LOADING:
            const { loading } = payload;
            return { ...state, loading };
        case ACTIONS.CHAT_LIST.SUCCESS:
            const { chatList, unreadSum } = payload;
            return {
                ...state,
                unreadSum,
                chatList,
                loading: false,
            };
        case ACTIONS.CHAT_LIST.FAILURE:
            const { message } = payload;
            ToastAndroid.show(`请求聊天列表失败：${message}`, 3000);
            return { ...state, loading: false };
        case ACTIONS.CHAT_LIST.INITIAL:
            return initialState;
        case ACTIONS.SYS_LIST.SUCCESS:
            const { sysList } = payload;
            return { ...state, sysList };
        default:
            return state;
    }
}
