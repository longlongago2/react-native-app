/** created by zhangqi on 2017-9-15 */
import { call, put, select } from 'redux-saga/effects';
import ACTIONS from '../actions';

import {
    queryProductDetailByProductid,
} from '../../services/productDetail';

/**
 *
 * @param payload
 */
export function* queryProDetailByProductid({ payload }) {
    yield put({
        type: ACTIONS.PRODUCT_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, token } = yield select(state => state.user);
    const { productid } = payload;
    const params = { token, productid };
    const { data, err } = yield call(queryProductDetailByProductid, params);
}
