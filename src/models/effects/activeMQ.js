import { put, call, select } from 'redux-saga/effects';
import { sendMSG } from '../../services/activeMQ';
import ACTIONS from '../../models/actions';

/**
 * 发送消息(ACTIONS.ACTIVE_MQ.REQUEST)
 */
export function* sendMessage() {
    yield put({
        type: ACTIONS.ACTIVE_MQ.LOADING,
        payload: {
            loading: true,
        },
    });
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const { userid, avatar, username } = userInfo;
    const { data, err } = yield call(sendMessage, {});
}
