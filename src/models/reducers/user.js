/**
 * saga 调用 user reducer 并传输数据
 * @param state   ：默认状态state 或 上一个状态state
 * @param action  :saga的运输载体，即effect里的put({数据载体})
 * @return {*}
 */

import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    online: false,
    userInfo: {},
    token: '',
    loading: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.UPLOAD_AVATAR.LOADING:
        case ACTIONS.USER_PASSWORD.LOADING:
        case ACTIONS.USER_LOGIN.LOADING:
        case ACTIONS.USER_LOGOUT.LOADING:
            const { loading } = payload;
            return { ...state, loading };
        case ACTIONS.USER_LOGIN.SUCCESS:
            const { userInfo, token, runBackground } = payload;
            // 非自动登录：手动登录
            if (!runBackground) {
                ToastAndroid.show('登录成功！', 3000);
            }
            return {
                ...state,
                online: true,
                userInfo,
                token,
                loading: false,
            };
        case ACTIONS.USER_LOGIN.FAILURE:
            ToastAndroid.show(`登录失败：${payload.message}`, 3000);
            return { ...state, loading: false };
        case ACTIONS.USER_LOGOUT.SUCCESS:
            return initialState;
        case ACTIONS.USER_LOGOUT.FAILURE:
            ToastAndroid.show(`退出失败：${payload.message}`, 3000);
            return { ...state, loading: false };
        case ACTIONS.USER_INFO.SUCCESS:
            ToastAndroid.show('信息修改成功！', 3000);
            const { newUserInfo } = payload;
            return {
                ...state,
                userInfo: newUserInfo,
                loading: false,
            };
        case ACTIONS.USER_INFO.FAILURE:
            ToastAndroid.show(`信息修改失败！：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.UPLOAD_AVATAR.FAILURE:
            ToastAndroid.show(`上传失败！：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.USER_PASSWORD.SUCCESS:
            ToastAndroid.show('修改密码成功！请重新登录', 3000);
            return {
                ...state,
                loading: false,
            };
        case ACTIONS.USER_PASSWORD.FAILURE:
            ToastAndroid.show(`修改密码失败！：${payload.message}`, 3000);
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
