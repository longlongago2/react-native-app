import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    loading: false,
    feedbackImageList: [],
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.FEEDBACK_IMAGE.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.FEEDBACK_IMAGE.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.FEEDBACK_IMAGE.FAILURE:
            ToastAndroid.show(`操作失败：${payload.message}`, 3000);
            return { ...state, loading: false };
        default:
            return state;
    }
}
