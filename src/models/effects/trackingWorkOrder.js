import { call, put, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import {
    queryPaginationWorkOrderListByFollowUserId,
    cleanWorkorderDetailByMainCodesAndFollowUserId,
    updateWorkerOrderDetailLastReadTimeByOrderCodeAndUserId,
} from '../../services/workorder';
import ACTIONS from '../actions';

/**
 * ACTIONS.TRACKINGWORKORDER.REQUEST 触发
 * @param payload
 */
export function* queryWorkOrderListByFollowUserId({ payload }) {
    const { online, token, userInfo } = yield select(state => state.user);
    const { pageNumber, trackingWOList } = yield select(state => state.trackingWorkOrder);
    const userId = userInfo.userid;
    const params = { userId, token, pageNumber, ...payload };
    if (online) {
        if (params.pageNumber <= 0) {
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.LOADING,
                payload: {
                    loading: true,
                },
            });
        } else {
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.LOADING,
                payload: {
                    pageLoading: true,
                },
            });
        }
        const { data, err } = yield call(queryPaginationWorkOrderListByFollowUserId, params);
        if (data && data.data.status === '20100') {
            const paginationData = data.data.info;
            let newPageNumber;
            let newTrackingWOList;
            let newLoaded;
            if (paginationData.length === 0) {
                newPageNumber = pageNumber;
                newTrackingWOList = trackingWOList;
                newLoaded = true;
            } else {
                newPageNumber = parseInt(pageNumber, 0) + 1;
                newTrackingWOList = trackingWOList.concat(paginationData);
                newLoaded = false;
            }
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.SUCCESS,
                payload: {
                    trackingWOList: newTrackingWOList,
                    pageNumber: newPageNumber,
                    loaded: newLoaded,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.FAILURE,
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
 * ACTIONS.TRACKINGWORKORDER.INITIAL 触发
 * @param payload
 */
export function* initWOTracking({ payload }) {
    const { online } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.TRACKINGWORKORDER.SUCCESS,
            payload: {
                loaded: false,
                pageNumber: 0,
                trackingWOList: [],
                ...payload,
            },
        });
    }
}

/**
 * ACTIONS.TRACKINGWORKORDER.DELETE 触发
 * @param payload
 */
export function* cleanWOTrackingByMainCodeAndFollowUserId({ payload }) {
    const { online, token, userInfo } = yield select(state => state.user);
    const followUserId = userInfo.userid;
    const { orderCodes } = payload;
    const params = { orderCodes, followUserId, token };
    if (online) {
        yield put({
            type: ACTIONS.TRACKINGWORKORDER.LOADING,
            payload: {
                loading: true,
            },
        });
        const { data, err } = yield call(cleanWorkorderDetailByMainCodesAndFollowUserId, params);
        if (data && data.data.status === '20100') {
            const { trackingWOList } = yield select(state => state.trackingWorkOrder);
            const orderCodesArr = orderCodes.split(',');
            let newTrackWOList = trackingWOList.concat();
            orderCodesArr.forEach((orderCode) => {
                newTrackWOList = newTrackWOList.filter(item => (
                    item.ordercode !== orderCode
                ));
            });
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.SUCCESS,
                payload: {
                    trackingWOList: newTrackWOList,
                },
            });
            ToastAndroid.show('取消跟踪成功', 3000);
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.FAILURE,
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
 * ACTIONS.TRACKINGWORKORDER.UPDATE 触发
 * @param payload
 */
export function* updateWODetailLastReadTimeByOrderCodeAndUserId({ payload }) {
    yield put({
        type: ACTIONS.TRACKINGWORKORDER.LOADING,
        payload: {
            loading: true,
        },
    });
    const { trackingWOList } = yield select(state => state.trackingWorkOrder);
    const { online, token, userInfo } = yield select(state => state.user);
    const { orderCode } = payload;
    const userId = userInfo.userid;
    const params = {
        orderCode,
        userId,
        token,
    };
    const { data, err } = yield call(updateWorkerOrderDetailLastReadTimeByOrderCodeAndUserId, params);
    if (online) {
        if (data && data.data.status === '20100') {
            let newTrackingWOList = trackingWOList.concat();
            newTrackingWOList = newTrackingWOList.map((item) => {
                if (item.ordercode === params.orderCode) {
                    return ({
                        ...item,
                        notReadNum: 0,
                    });
                }
                return item;
            });
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.SUCCESS,
                payload: {
                    trackingWOList: newTrackingWOList,
                },
            });
            ToastAndroid.show('修改最后读取时间成功', 3000);
        } else {
            const message = (err.message) || (data.data.info);
            yield put({
                type: ACTIONS.TRACKINGWORKORDER.FAILURE,
            });
            ToastAndroid.show(`修改最后读取时间失败: ${message}`, 3000);
        }
    } else {
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

