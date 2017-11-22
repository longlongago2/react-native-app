import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    latestVersion: '',
    loading: false,
};

export default function (state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case ACTIONS.LATESTAPP_DOWNLOAD.LOADING:
            return {
                ...state,
                ...payload,
            };
        case ACTIONS.APPVERSION.SUCCESS:
            return {
                ...state,
                ...payload,
            };
        case ACTIONS.APPVERSION.FAILURE:
            return {
                ...state,
            };
        case ACTIONS.LATESTAPP_DOWNLOAD.SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.LATESTAPP_DOWNLOAD.FAILURE:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
