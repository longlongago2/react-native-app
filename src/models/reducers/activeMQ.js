import moment from 'moment';
import ACTIONS from '../../models/actions';

const timeStamp = `${moment().add(1, 'day').format('YYYY-MM-DD')} 23:59:59`;
const initialState = {
    data: {                                        // 当前用户聊天数据
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
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload.data,
                },
                loading: false,
            };
        case ACTIONS.ACTIVE_MQ.FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
}
