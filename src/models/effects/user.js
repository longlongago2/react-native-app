import { call, put, select } from 'redux-saga/effects';
import moment from 'moment';
import ACTIONS from '../actions';
import {
    openChatWS,
    closeChatWS,
    openMessageWS,
    closeMessageWS,
} from '../../utils/webSocket';
import {
    fetchLogin,
    fetchLogout,
    updateUserOptions,
    updateUserPwd,
} from '../../services/user';
import { fileUpload } from '../../services/fileOperation';

/**
 * action: ACTIONS.USER_LOGIN.REQUEST 触发
 * @param payload
 */
export function* login({ payload }) {
    yield put({
        type: ACTIONS.USER_LOGIN.LOADING,
        payload: { loading: true },
    });
    const { username, password, dispatch, runBackground } = payload;
    const { data, err } = yield call(fetchLogin, { username, password });
    if (data && data.data.status === '20000') {
        // 非后台自动登录：手动登录
        if (!runBackground) {
            // currentUser：存储自动登陆用户（自动登录）
            global.storage.save({
                key: 'currentUser',
                data: {
                    username,
                    password,
                },
                expires: 1000 * 3600 * 24 * 15,
            });
            // userList：存储所有登录成功过的 user 信息
            global.storage.save({
                key: 'userList',
                id: username,
                data: {
                    key: data.data.info.userid,
                    avatar: data.data.info.avatar ? data.data.info.avatar : '', // 头像
                    username,  // 用户名
                    password,  // 密码
                },
                expires: null,
            });
        }
        yield put({
            type: ACTIONS.USER_LOGIN.SUCCESS,
            payload: {
                userInfo: data.data.info,
                token: data.data.accesstoken,
                runBackground,
            },
        });
        // 查询聊天未读徽章
        yield put({ type: ACTIONS.CHAT_LIST.REQUEST });
        // 查询消息未读徽章
        yield put({ type: ACTIONS.UNREAD_NOTIFICATION.REQUEST });
        // 初始化公告
        yield put({
            type: ACTIONS.NOTICE.INITIAL,
        });
        // 查询公告
        yield put({
            type: ACTIONS.NOTICE.REQUEST,
            payload: {
                pageNumber: -1,
                expirationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
        });
        // 建立webSocket连接
        const { userid } = data.data.info;
        // 1.建立聊天会话
        openChatWS(userid, dispatch);
        // 2.建立消息会话
        openMessageWS(userid, dispatch);
    } else {
        const message = (err && err.message) || (data && data.data.info);
        yield put({
            type: ACTIONS.USER_LOGIN.FAILURE,
            payload: {
                message,
            },
        });
    }
}

/**
 * action: ACTION.USER_LOGOUT.REQUEST 触发
 * @param payload
 */
export function* logout({ payload }) {
    yield put({
        type: ACTIONS.USER_LOGOUT.LOADING,
        payload: { loading: true },
    });
    const { data, err } = yield call(fetchLogout, payload);
    if (data && data.data.status === '20097') {
        yield put({
            type: ACTIONS.USER_LOGOUT.SUCCESS,
        });
        // 删除 currentUser
        global.storage.remove({ key: 'currentUser' });
        // 清空登录框中内容
        yield put({
            type: ACTIONS.LOGIN_GATHER.REQUEST,
            payload: {
                username: '',
                password: '',
            },
        });
        // 关闭 webSocket 连接
        // 1.关闭聊天会话
        closeChatWS();
        // 2.关闭消息会话
        closeMessageWS();
    } else {
        const message = (err && err.message) || (data && data.data.info);
        yield put({
            type: ACTIONS.USER_LOGOUT.FAILURE,
            payload: {
                message,
            },
        });
    }
}

/**
 * action: ACTIONS.USER_INFO.UPDATE 触发
 * @param payload
 */
export function* updateUserInfo({ payload }) {
    yield put({
        type: ACTIONS.USER_INFO.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo, token } = yield select(state => state.user);
    const { key, value } = payload;
    if (online) {
        const newUserInfo = Object.assign({}, userInfo);
        const params = {
            userid: newUserInfo.userid,
            accessToken: token,
        };
        params[key] = value;
        const { data, err } = yield call(updateUserOptions, params);
        if (data && data.data.status === '21200') {
            newUserInfo[key] = value;
            yield put({
                type: ACTIONS.USER_INFO.SUCCESS,
                payload: {
                    newUserInfo,
                },
            });
            yield put({
                type: 'Navigation/BACK',
                key: null,
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.USER_INFO.FAILURE,
                payload: {
                    message,
                },
            });
        }
    }
}

/**
 * action: ACTION.UPLOAD_AVATAR.INSERT 触发
 * @param payload
 */
export function* uploadUserAvatar({ payload }) {
    yield put({
        type: ACTIONS.UPLOAD_AVATAR.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo, token } = yield select(state => state.user);
    const { url } = payload;
    if (online) {
        const formData = new FormData();
        const file = {
            uri: url,
            type: 'multipart/form-data',
            name: 'avatar.jpg',
        };
        formData.append('file', file);
        const { data, err } = yield call(fileUpload, formData);
        if (data && data.data.status === '20000') { // 上传头像至服务器成功
            const newUserInfo = Object.assign({}, userInfo);
            const avatarUrl = (data.data.info.url).replace('download?fileUrl=', '');
            const params = {
                userid: newUserInfo.userid,
                accessToken: token,
                avatar: avatarUrl,
            };
            const { data: _data, err: _err } = yield call(updateUserOptions, params); // 修改数据库信息
            if (_data && _data.data.status === '21200') {
                newUserInfo.avatar = avatarUrl;
                yield put({
                    type: ACTIONS.USER_INFO.SUCCESS,
                    payload: {
                        newUserInfo,
                    },
                });
            } else {
                const message = (_err && _err.message) || (_data && _data.data.info);
                yield put({
                    type: ACTIONS.USER_INFO.FAILURE,
                    payload: {
                        message,
                    },
                });
            }
        } else {
            // 上传头像失败
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.UPLOAD_AVATAR.FAILURE,
                payload: {
                    message,
                },
            });
        }
    }
}

/**
 * action: ACTIONS.USER_PASSWORD.UPDATE 触发
 * @param payload
 */
export function* updateUserPassword({ payload }) {
    yield put({
        type: ACTIONS.USER_PASSWORD.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo, token } = yield select(state => state.user);
    const { oldpwd, newpwd } = payload;
    if (online) {
        const params = {
            userid: userInfo.userid,
            oldPassword: oldpwd,
            newPassword: newpwd,
            accessToken: token,
        };
        const { data, err } = yield call(updateUserPwd, params);
        if (data && data.data.status === '21200') {
            yield put({
                type: ACTIONS.USER_PASSWORD.SUCCESS,
                payload: {
                    userInfo,
                },
            });
            // 清除过时的登录者信息
            global.storage.remove({
                key: 'userList',
                id: userInfo.username,
            });
            // 登出系统
            yield put({
                type: ACTIONS.USER_LOGOUT.REQUEST,
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.USER_PASSWORD.FAILURE,
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

