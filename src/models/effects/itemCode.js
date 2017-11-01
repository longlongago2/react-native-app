import { put, call, select } from 'redux-saga/effects';
import ACTIONS from '../actions';
import {
    queryWOTypeCodeItem,
    queryWOKindCodeItem,
    queryProductsCodeItemByUserId,
} from '../../services/itemCode';

/**
 * action: ACTIONS.WO_TYPE.REQUEST 触发
 */
export function* queryWOTypeCodeItemList() {
    const { token, online } = yield select(state => state.user);
    if (online) {
        const { data, err } = yield call(queryWOTypeCodeItem, { token });
        if (data && data.data.status === '22400') {
            yield put({
                type: ACTIONS.WO_TYPE.SUCCESS,
                payload: {
                    woTypeItems: data.data.info,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WO_TYPE.FAILURE,
                payload: {
                    message,
                },
            });
        }
    }
}

/**
 * action: ACTIONS.WO_KIND.REQUEST 触发
 */
export function* queryWOKindCodeItemList() {
    const { token, online } = yield select(state => state.user);
    if (online) {
        const { data, err } = yield call(queryWOKindCodeItem, { token });
        if (data && data.data.status === '22400') {
            yield put({
                type: ACTIONS.WO_KIND.SUCCESS,
                payload: {
                    woKindItems: data.data.info,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WO_KIND.FAILURE,
                payload: {
                    message,
                },
            });
        }
    }
}

export function* queryWOProductCodeItemList() {
    const { token, userInfo, online } = yield select(state => state.user);
    if (online) {
        const { data, err } = yield call(queryProductsCodeItemByUserId,
            { token, userid: userInfo.userid });
        if (data && data.data.status === '20900') {
            yield put({
                type: ACTIONS.WO_PRODUCT.SUCCESS,
                payload: {
                    woProductItems: data.data.info,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WO_PRODUCT.FAILURE,
                payload: { message },
            });
        }
    }
}
