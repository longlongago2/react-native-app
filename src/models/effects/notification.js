import { put, call, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import { queryUnreadNotificationNumByUserId, queryNotificationPaginationByUserId } from '../../services/notification';
import ACTIONS from '../../models/actions';

/**
 * ACTIONS.UNREAD_NOTIFICATION.REQUEST 触发
 */
export function* queryUnreadNotificationNum() {
    const { online, token, userInfo } = yield select(state => state.user);
    if (online) {
        const params = {
            userId: userInfo.userid,
            accessToken: token,
        };
        const { data, err } = yield call(queryUnreadNotificationNumByUserId, params);
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.UNREAD_NOTIFICATION.SUCCESS,
                payload: {
                    unread: data.data.info,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.UNREAD_NOTIFICATION.FAILURE,
                payload: { message },
            });
        }
    } else {
        ToastAndroid.show('尚未登录');
    }
}

/**
 * ACTIONS.NOTIFICATION.REQUEST 触发
 */
export function* queryNotificationListByUserId({ payload }) {
    const { online, userInfo, token } = yield select(state => state.user);
    if (online) {
        const { pageNumber, notificationList } = yield select(state => state.notification);
        const params = {
            userId: userInfo.userid,
            accessToken: token,
            pageNumber,
            ...payload,
        };
        if (params.pageNumber <= 0) {
            yield put({
                type: ACTIONS.NOTIFICATION.LOADING,
                payload: { loading: true },
            });
        } else {
            yield put({
                type: ACTIONS.NOTIFICATION.LOADING,
                payload: { pageLoading: true },
            });
        }
        const { data, err } = yield call(queryNotificationPaginationByUserId, params);
        if (data && data.data.status === '22000') {
            const paginationData = data.data.info;
            let newLoaded;
            let newPageNumber;
            let newNotificationList;
            if (paginationData.length === 0) {
                // 页码全部加载完毕
                newLoaded = true;
                newPageNumber = pageNumber;
                newNotificationList = notificationList;
            } else {
                newLoaded = false;
                newPageNumber = parseInt(pageNumber, 0) + 1;
                newNotificationList = notificationList.concat(paginationData);
            }
            yield put({
                type: ACTIONS.NOTIFICATION.SUCCESS,
                payload: {
                    notificationList: newNotificationList,
                    pageNumber: newPageNumber,
                    loaded: newLoaded,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.NOTIFICATION.FAILURE,
                payload: { message },
            });
        }
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 * ACTIONS.NOTIFICATION.INITIAL 触发
 * @param payload
 */
export function* initialNotification({ payload }) {
    const { online } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.NOTIFICATION.SUCCESS,
            payload: {
                notificationList: [],
                pageNumber: 0,
                loaded: false,
                ...payload,
            },
        });
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 * ACTIONS.NOTIFICATION.UPDATE 触发
 * @param payload
 */
export function* updateNotificationItem({ payload }) {
    const { online, userInfo, token } = yield select(state => state.user);
    if (online) {
        yield put();
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 * ACTIONS.NOTIFICATION.INSERT 触发
 * @param payload
 */
export function* insertNotificationItem({ payload }) {
    const { online, userInfo, token } = yield select(state => state.user);
    if (online) {
        yield put();
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}
