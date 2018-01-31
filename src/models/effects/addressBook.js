import { call, put, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';
import {
    queryAllFriendGroup,
    queryAllFriendMsg,
    insertFriendGroupByPOJO,
    insertFriendByPOJO,
} from '../../services/addressBook';

/**
 * ACTIONS.FRIEND_GROUP.REQUEST 触发
 * 根据 userId 查询所有好友分组信息
 */
export function* queryAllFriendGroupInfo() {
    yield put({
        type: ACTIONS.FRIEND_GROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userId: userid,
    };
    const { data, err } = yield call(queryAllFriendGroup, params);
    if (online) {
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.FRIEND_GROUP.SUCCESS,
                payload: {
                    friendGroupList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_GROUP.FAILURE,
                payload: {
                    message,
                },
            });
        }
    } else {
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

/**
 * ACTIONS.FRIEND_DETAIL.REQUEST 触发
 * 根据 userId 查询好友详情信息
 */
export function* queryAllFriendMsgInfo() {
    yield put({
        type: ACTIONS.FRIEND_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userId: userid,
    };
    const { data, err } = yield call(queryAllFriendMsg, params);
    if (online) {
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.FRIEND_DETAIL.SUCCESS,
                payload: {
                    friendDetailList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_DETAIL.FAILURE,
                payload: {
                    message,
                },
            });
        }
    } else {
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

/**
 * ACTIONS.FRIEND_GROUP.INSERT 触发
 * 添加好友分组
 * @param payload
 */
export function* insertFriendGroup({ payload }) {
    yield put({
        type: ACTIONS.FRIEND_GROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userid,
        ...payload,
    };
    const { err, data } = yield call(insertFriendGroupByPOJO, params);
    if (online) {
        if (data && data.data.status === '22000') {
            ToastAndroid.show('添加好友分组成功', 3000);
            yield put({
                type: ACTIONS.FRIEND_DETAIL.REQUEST, // 重新查询
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_GROUP.FAILURE,
                payload: {
                    message,
                },
            });
        }
    } else {
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

/**
 * ACTIONS.FRIEND_DETAIL.INSERT 触发
 * 根据 friend 对象新增好友
 * @param payload
 */
export function* insertFriend({ payload }) {
    yield put({
        type: ACTIONS.FRIEND_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userid,
        ...payload,
    };
    const { err, data } = yield call(insertFriendByPOJO, params);
    if (online) {
        if (data && data.data.status === '22000') {
            ToastAndroid.show('添加好友成功', 3000);
            yield put({
                type: ACTIONS.FRIEND_DETAIL.REQUEST, // 重新查询
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_GROUP.FAILURE,
                payload: {
                    message,
                },
            });
        }
    } else {
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}
