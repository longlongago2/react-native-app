/** created by zhanqi on 2017-11-02 */
import { put, call, select } from 'redux-saga/effects';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import { queryTheNewestVersion } from '../../services/instruction';
import ACTIONS from '../../models/actions';

export function* queryLatestVersion() {
    const { online } = yield select(state => state.user);
    if (online) {
        const { data } = yield call(queryTheNewestVersion);
        if (data && data.data.status === 'true') {
            yield put({
                type: ACTIONS.APPVERSION.SUCCESS,
                payload: {
                    latestVersion: data.data.info.versioninfo,
                },
            });
        } else {
            yield put({
                type: ACTIONS.APPVERSION.FAILURE,
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