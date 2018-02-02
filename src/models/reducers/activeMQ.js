import { ToastAndroid } from 'react-native';
import moment from 'moment';
import ACTIONS from '../../models/actions';

const timeStamp = `${moment().add(1, 'day').format('YYYY-MM-DD')} 23:59:59`;
const initialState = {
    topicId: '',                                   // 当前聊天主题
    data: {                                        // 数据
        timeStamp,                                 // 时间戳（查询截止日期）
        messages: [],                              // 累加的所有数据
        loaded: false,                             // 所有数据加载完毕
    },
    loading: false,                                // 正在发送
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.ACTIVE_MQ.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.ACTIVE_MQ.SUCCESS:
            if (payload.data) {
                return {
                    ...state,
                    ...payload,
                    data: {
                        ...state.data,
                        ...payload.data,
                    },
                    loading: false,
                };
            }
            return { ...state, ...payload, loading: false };
        case ACTIONS.ACTIVE_MQ.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        default:
            return state;
    }
}
