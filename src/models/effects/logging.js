import { put, call } from 'redux-saga/effects';
import { getAllDataForKey } from '../../utils/storage';
import ACTIONS from '../actions';

/**
 * action: ACTIONS.USER_LIST.REQUEST 触发
 * @param payload
 */
export function* receiveUserList({ payload }) {
    const { key } = payload;
    // 获取某个key下的所有数据
    const { data, err } = yield getAllDataForKey(key);
    if (err) {
        yield put({
            type: ACTIONS.USER_LIST.FAILURE,
            payload: {
                message: err.message,
            },
        });
    } else {
        yield put({
            type: ACTIONS.USER_LIST.SUCCESS,
            payload: {
                userList: data,
            },
        });
    }
}

/**
 * action: ACTIONS.USER_LIST.DELETE 触发
 * @param payload
 */
export function* deleteUserListByKeyAndId({ payload }) {
    const { key, id } = payload;
    yield global.storage.remove({ key, id });          // 删除
    const { data, err } = yield getAllDataForKey(key); // 重新请求本地userList值
    if (err) {
        yield put({
            type: ACTIONS.USER_LIST.FAILURE,
            payload: {
                message: err.message,
            },
        });
    } else {
        yield put({
            type: ACTIONS.USER_LIST.SUCCESS,
            payload: {
                userList: data,
            },
        });
    }
}

/**
 * action: ACTIONS.LOGIN_GATHER.REQUEST 触发
 * @param payload
 */
export function* loginInfoGather({ payload }) {
    if (payload) {
        yield put({
            type: ACTIONS.LOGIN_GATHER.SUCCESS,
            payload,
        });
    } else {
        yield put({
            type: ACTIONS.LOGIN_GATHER.FAILURE,
            payload: {
                message: 'logging需要payload数据！',
            },
        });
    }
}
