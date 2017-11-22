import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    latestVersion: '',
    loading: false,
    downloading: false,
};

export default function (state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case ACTIONS.APPVERSION.LOADING:
            return {
                ...state,
                loading: true,
            };
        case ACTIONS.APPVERSION.SUCCESS:
            return {
                ...state,
                ...payload,
                loading: false,
            };
        case ACTIONS.APPVERSION.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.LATESTAPP_DOWNLOAD.LOADING:
            return {
                ...state,
                downloading: true,
            };
        case ACTIONS.LATESTAPP_DOWNLOAD.SUCCESS:
            return {
                ...state,
                downloading: false,
            };
        case ACTIONS.LATESTAPP_DOWNLOAD.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return {
                ...state,
                downloading: false,
            };
        default:
            return state;
    }
}
