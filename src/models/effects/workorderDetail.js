/** created by zhanqi on 2017-9-6 */
import { call, put, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import uuid from 'uuid/v4';
import ACTIONS from '../actions';
import {
    queryWorkorderDetailByOrdercode,
    queryWorkorderReplyByOrdercode,
    insertWorkorderReplyByOrdercode,
} from '../../services/workorderDetail';

/**
 * ACTION.WORKORDER_DETAIL.REQUEST 触发
 * @param payload
 */
export function* queryWODetailByOrderCode({ payload }) {
    yield put({
        type: ACTIONS.WORKORDER_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const { orderCode } = payload;
    const params = { token, orderCode };
    const { data, err } = yield call(queryWorkorderDetailByOrdercode, params);
    if (online) {
        if (data && data.data.status === '20100') {
            yield put({
                type: ACTIONS.WORKORDER_DETAIL.SUCCESS,
                payload: {
                    workOrderDetail: data.data.info,
                },
            });
            // 级联更改 feedbackImage.js
            const medias = data.data.info.workordermediass;
            if (medias && Array.isArray(medias) && medias.length > 0) {
                yield put({
                    type: ACTIONS.FEEDBACK_IMAGE.INITIAL,
                    payload: {
                        feedbackImageList: medias.filter(item => item.mediatype.toString() === '0')
                            .map(item => ({
                                key: uuid(),
                                uri: item.mediainfo,
                                disabled: true,  // 填充的数据为安全起见都不可以删除
                            })),
                    },
                });
            }
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WORKORDER_DETAIL.FAILURE,
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
 * ACTION.WORKORDER_DETAIL.UPDATE 触发
 * @param payload
 */
export function* updateWODetailState({ payload }) {
    const { workOrderDetail } = yield select(state => state.workorderDetail);
    yield put({
        type: ACTIONS.WORKORDER_DETAIL.SUCCESS,
        payload: {
            workOrderDetail: {
                ...workOrderDetail,
                ...payload.workOrderDetail,
            },
        },
    });
}

/**
 * ACTION.WORKORDER_REPLY.REQUEST 触发
 * @param payload
 */
export function* queryWOReplyByOrderCode({ payload }) {
    yield put({
        type: ACTIONS.WORKORDER_REPLY.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const { orderCode } = payload;
    const isInside = null;
    const params = { orderCode, isInside, token };
    const { data, err } = yield call(queryWorkorderReplyByOrdercode, params);
    if (online) {
        if (data && data.data.status === '20100') {
            yield put({
                type: ACTIONS.WORKORDER_REPLY.SUCCESS,
                payload: {
                    workOrderReply: data.data.info.reverse(),
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WORKORDER_REPLY.FAILURE,
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
 * ACTION.WORKORDER_REPLY.INSERT 触发
 * @param payload
 */
export function* insertWOReplyByOrderCode({ payload }) {
    yield put({
        type: ACTIONS.WORKORDER_REPLY.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    if (!payload.workordercode) throw new Error('WORKORDER_REPLY.INSERT payload必须存在workordercode');
    const params = {
        accessToken: token,
        ...payload,
    };
    const { err, data } = yield call(insertWorkorderReplyByOrdercode, params);
    if (online) {
        if (data && data.data.status === '20100') {
            if (params.isinside === 0) ToastAndroid.show('留言发表成功！', 3000);
            yield put({
                type: ACTIONS.WORKORDER_REPLY.REQUEST, // 重新查询
                payload: {
                    orderCode: payload.workordercode,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WORKORDER_REPLY.FAILURE,
                payload: {
                    message,
                },
            });
        }
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

