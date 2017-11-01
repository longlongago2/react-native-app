import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';

const initialState = {
    username: '',
    password: '',
    userList: [],
    showUserList: false,
};
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.USER_LIST.SUCCESS:
            return {
                ...state,
                userList: payload.userList,
            };
        case ACTIONS.LOGIN_GATHER.SUCCESS:
            return { ...state, ...payload };
        case ACTIONS.USER_LIST.FAILURE:
        case ACTIONS.LOGIN_GATHER.FAILURE:
            ToastAndroid.show(payload.message, 3000);
            return state;
        default:
            return state;
    }
}
