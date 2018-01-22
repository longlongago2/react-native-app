import { ToastAndroid } from 'react-native';
import moment from 'moment';
import ACTIONS from '../actions';

const initialState = {
    chatList: [],                                  // 聊天用户列表
    messages: {                                    // 当前用户聊天数据
        timeStamp: moment().format('YYYY-MM-DD'),  // 时间戳（查询时间戳往后一页数据）
        data: [],                                  // 分页累加的所有数据
        loaded: false,                             // 所有数据加载完毕
    },
    unreadSum: 0,                                  // 未读消息总数
    loading: false,                                // 加载状态
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.CHAT_LIST.LOADING:
        case ACTIONS.MESSAGES.LOADING:
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
        case ACTIONS.MESSAGES.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        case ACTIONS.CHAT_LIST.INITIAL:
            return initialState;
        default:
            return state;
    }
}
