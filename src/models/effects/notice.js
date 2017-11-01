import { call, put, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import queryValidNoticeByExpirationTime from '../../services/notice';
import ACTIONS from '../actions';

/**
 *
 * @param payload
 */
export function* queryValidNotice({ payload }) {
    const { online, token, pageNumber, noticeList } = yield select(state => ({
        ...state.user,
        ...state.notice,
    }));
    if (online) {
        const params = {
            pageNumber,
            accessToken: token,
            ...payload,
        };
        if (params.pageNumber <= 0) {
            yield put({
                type: ACTIONS.NOTICE.LOADING,
                payload: { loading: true },
            });
        } else {
            yield put({
                type: ACTIONS.NOTICE.LOADING,
                payload: { pageLoading: true },
            });
        }
        const { err, data } = yield call(queryValidNoticeByExpirationTime, params);
        if (data && data.data.status === '22500') {
            const paginationData = data.data.info;
            let newLoaded;
            let newPageNumber;
            let newNoticeList;
            if (paginationData.length === 0) {
                // 页码全部加载完毕
                newLoaded = true;
                newPageNumber = pageNumber;
                newNoticeList = noticeList;
            } else {
                newLoaded = false;
                newPageNumber = parseInt(pageNumber, 0) + 1;
                newNoticeList = noticeList.concat(paginationData);
            }
            yield put({
                type: ACTIONS.NOTICE.SUCCESS,
                payload: {
                    loaded: newLoaded,
                    pageNumber: newPageNumber,
                    noticeList: newNoticeList,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.NOTICE.FAILURE,
                payload: { message },
            });
        }
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 * ACTIONS.NOTICE.INITIAL 触发
 * @param payload
 */
export function* initialNotice({ payload }) {
    const { online } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.NOTICE.SUCCESS,
            payload: {
                loaded: false,
                pageNumber: 0,
                noticeList: [],
                ...payload,
            },
        });
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}
