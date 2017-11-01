import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    loading: false,
    pageLoading: false,
    loaded: false,
    pageNumber: 0,
    noticeList: [],
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.NOTICE.LOADING:
            const { loading } = payload;
            return {
                ...state,
                loading,
            };
        case ACTIONS.NOTICE.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
                pageLoading: false,
            };
        case ACTIONS.NOTICE.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return {
                ...state,
                loading: false,
                pageLoading: false,
            };
        default:
            return state;
    }
}
