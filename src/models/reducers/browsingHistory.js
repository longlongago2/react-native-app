import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    historyList: [],
    loading: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.BROWSING_HISTORY.LOADING:
            return { ...state, loading: payload.loading };
        case ACTIONS.BROWSING_HISTORY.SUCCESS:
            return { ...state, ...payload, loading: false };
        case ACTIONS.BROWSING_HISTORY.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return { ...state, loading: false };
        default:
            return state;
    }
}
