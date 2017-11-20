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
            ToastAndroid.show('下载或安装失败,请重试', 3000);
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
