/** created by zhanqi on 2017-11-02 */
import { put, call, select } from 'redux-saga/effects';
import { queryTheNewestVersion } from '../../services/instruction';
import ACTIONS from '../../models/actions';

export function* queryLatestVersion() {
    const { online } = yield select(state => state.user);
    if (online) {
        yield put({ type: ACTIONS.APPVERSION.LOADING });
        const { data } = yield call(queryTheNewestVersion);
        if (data && data.data.status === 'true') {
            yield put({
                type: ACTIONS.APPVERSION.SUCCESS,
                payload: {
                    latestVersion: data.data.info.versioninfo,
                    latestApkPath: data.data.info.path,
                },
            });
        } else {
            yield put({
                type: ACTIONS.APPVERSION.FAILURE,
                payload: {
                    message: '查询失败',
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
