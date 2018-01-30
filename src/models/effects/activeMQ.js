import { put, call, select } from 'redux-saga/effects';
import { sendMSG } from '../../services/activeMQ';
import ACTIONS from '../../models/actions';
import api from '../../utils/api';

/**
 * 发送消息
 * @param {*} payload
 */
export function* sendMessage({ payload }) {
    yield put({
        type: ACTIONS.ACTIVE_MQ.LOADING,
        payload: {
            loading: true,
        },
    });
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const { userid, avatar } = userInfo;
    const params = {
        senderId: userid.toString(),
        avatar,
        ...payload,
    };
    alert(JSON.stringify(params));
    const { data, err } = yield call(sendMSG, params);
}
