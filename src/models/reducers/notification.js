import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    pageNumber: 0,
    notificationList: [],
    loaded: false,
    loading: false,
    pageLoading: false,
    unread: 0,
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.NOTIFICATION.LOADING:
            return { ...state, ...payload };
        case ACTIONS.UNREAD_NOTIFICATION.SUCCESS:
            return { ...state, unread: payload.unread };
        case ACTIONS.NOTIFICATION.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
                pageLoading: false,
            };
        case ACTIONS.NOTIFICATION.FAILURE:
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
