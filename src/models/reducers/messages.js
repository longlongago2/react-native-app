import { ToastAndroid } from 'react-native';
import moment from 'moment';
import ACTIONS from '../actions';

const timeStamp = `${moment().add(1, 'day').format('YYYY-MM-DD')} 23:59:59`;
const initialState = {
    messages: {                                    // 当前用户聊天数据
        timeStamp,                                 // 时间戳（查询时间戳之前的数据）
        data: [],                                  // 分页累加的所有数据
        loaded: false,                             // 所有数据加载完毕
    },
    loading: false,                                // 加载状态
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.MESSAGES.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.MESSAGES.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.MESSAGES.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        default:
            return state;
    }
}
