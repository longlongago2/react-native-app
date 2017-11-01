/** created by zhangqi on 2017-9-22 */
import { call, put, select } from 'redux-saga/effects';
import ACTIONS from '../actions';
import {
    queryAllUserGroup,
    queryUserGroupDetailByGroupId,
    queryUserGroupAssignedByProductCode,
    insertWorkOrderTrackers,
} from '../../services/userGroup';

/**
 * ACTION.USERGROUP.REQUEST 触发
 */
export function* queryAllUserGroupInfo() {
    yield put({
        type: ACTIONS.USERGROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const params = { token };
    const { data, err } = yield call(queryAllUserGroup, params);
    if (online) {
        // 此处后台只返回data数据，没有状态码
        if (data) {
            yield put({
                type: ACTIONS.USERGROUP.SUCCESS,
                payload: {
                    userGroupList: data,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.USERGROUP.FAILURE,
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
 * ACTIONS.USERGROUP_DETAIL.REQUEST 触发
 * @param payload
 */
export function* queryUGDetailByGroupId({ payload }) {
    yield put({
        type: ACTIONS.USERGROUP_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const { groupId } = payload;
    const params = { token, groupId };
    const { data, err } = yield call(queryUserGroupDetailByGroupId, params);
    if (online) {
        if (data && data.data.status === '21300') {
            yield put({
                type: ACTIONS.USERGROUP_DETAIL.SUCCESS,
                payload: {
                    usersList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.USERGROUP_DETAIL.FAILURE,
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
 * ACTIONS.USERGROUP_ASSIGNED.REQUEST 触发
 * @param payload
 */
export function* queryPersonNameByProductCode({ payload }) {
    yield put({
        type: ACTIONS.USERGROUP_ASSIGNED.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const { productId } = payload;
    const params = { token, productId };
    const { data, err } = yield call(queryUserGroupAssignedByProductCode, params);
    if (online) {
        if (data && data.data.status === '20900') {
            yield put({
                type: ACTIONS.USERGROUP_ASSIGNED.SUCCESS,
                payload: {
                    assignedUsersList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.USERGROUP_ASSIGNED.FAILURE,
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
 * ACTIONS.USERGROUP_TRACKERS.INSERT 触发
 * @param payload
 */
export function* insertWOTrackers({ payload }) {
    yield put({
        type: ACTIONS.USERGROUP_TRACKERS.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const { woDetail, orderCode } = payload;
    const params = { orderCode, woDetail, token };
    const { data, err } = yield call(insertWorkOrderTrackers, params);
    if (online) {
        if (data && data.data.status === '20100') {
            yield put({
                type: ACTIONS.USERGROUP_TRACKERS.SUCCESS,
            });
        } else {
            // const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.USERGROUP_TRACKERS.FAILURE,
                // payload: {
                //     message,
                // },
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

