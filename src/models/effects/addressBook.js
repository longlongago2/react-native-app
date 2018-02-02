import { call, put, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';
import {
    queryAllFriendGroup,
    queryAllFriendMsg,
    insertFriendGroupByPOJO,
    insertFriendByPOJO,
    insertChatUserGroupByPOJO,
    insertChatUserGroupToUserByPOJO,
    queryChatUserGroupByUserId,
    queryChatGroupToUserByChatUserGroupId,
} from '../../services/addressBook';

/**
 * ACTIONS.FRIEND_GROUP.REQUEST 触发
 * 根据 userId 查询所有好友分组信息
 */
export function* queryAllFriendGroupInfo() {
    yield put({
        type: ACTIONS.FRIEND_GROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userId: userid,
    };
    const { data, err } = yield call(queryAllFriendGroup, params);
    if (online) {
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.FRIEND_GROUP.SUCCESS,
                payload: {
                    friendGroupList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_GROUP.FAILURE,
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
 * ACTIONS.FRIEND_DETAIL.REQUEST 触发
 * 根据 userId 查询好友详情信息
 */
export function* queryAllFriendMsgInfo() {
    yield put({
        type: ACTIONS.FRIEND_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userId: userid,
    };
    const { data, err } = yield call(queryAllFriendMsg, params);
    if (online) {
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.FRIEND_DETAIL.SUCCESS,
                payload: {
                    friendDetailList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_DETAIL.FAILURE,
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
 * ACTIONS.FRIEND_GROUP.INSERT 触发
 * 添加好友分组
 * @param payload
 */
export function* insertFriendGroup({ payload }) {
    yield put({
        type: ACTIONS.FRIEND_GROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userid,
        ...payload,
    };
    const { err, data } = yield call(insertFriendGroupByPOJO, params);
    if (online) {
        if (data && data.data.status === '22000') {
            ToastAndroid.show('添加好友分组成功', 3000);
            yield put({
                type: ACTIONS.FRIEND_DETAIL.REQUEST, // 重新查询
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_GROUP.FAILURE,
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
 * ACTIONS.FRIEND_DETAIL.INSERT 触发
 * 根据 friend 对象新增好友
 * @param payload
 */
export function* insertFriend({ payload }) {
    yield put({
        type: ACTIONS.FRIEND_DETAIL.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userid,
        ...payload,
    };
    const { err, data } = yield call(insertFriendByPOJO, params);
    if (online) {
        if (data && data.data.status === '22000') {
            ToastAndroid.show('添加好友成功', 3000);
            yield put({
                type: ACTIONS.FRIEND_DETAIL.REQUEST, // 重新查询
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.FRIEND_GROUP.FAILURE,
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
 * ACTIONS.CHATGROUP.INSERT 触发
 * 根据 chatUsergGroup 对象新增群聊
 * @param payload
 */
export function* insertChatGroup({ payload }) {
    yield put({
        type: ACTIONS.CHATGROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userid,
        ...payload,
    };
    const { err, data } = yield call(insertChatUserGroupByPOJO, params);
    if (online) {
        if (data && data.data.status === '22000') {
            ToastAndroid.show('添加群聊成功', 3000);
            yield put({
                type: ACTIONS.CHATGROUP.REQUEST, // 重新查询
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.CHATGROUP.FAILURE,
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
 * ACTIONS.CHATGROUP_MEMBERS.INSERT 触发
 * 根据 chatUserGroupToUser 对象新增群群聊成员
 * @param payload
 */
export function* insertChatGroupMembers({ payload }) {
    yield put({
        type: ACTIONS.CHATGROUP_MEMBERS.REQUEST,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userid,
        ...payload,
    };
    const { err, data } = yield call(insertChatUserGroupToUserByPOJO, params);
    if (online) {
        if (data && data.data.status === '22000') {
            ToastAndroid.show('添加群成员成功', 3000);
            yield put({
                type: ACTIONS.CHATGROUP_MEMBERS.REQUEST, // 重新查询
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.CHATGROUP_MEMBERS.FAILURE,
                payload: {
                    message,
                },
            });
        }
    }
}

/**
 * ACTIONS.CHATGROUP.REQUEST 触发
 * 查询所有群聊信息(根据userId)
 */
export function* queryAllChatGroup() {
    yield put({
        type: ACTIONS.CHATGROUP.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online, userInfo } = yield select(state => state.user);
    const { userid } = userInfo;
    const params = {
        userId: userid,
    };
    const { data, err } = yield call(queryChatUserGroupByUserId, params);
    if (online) {
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.CHATGROUP.SUCCESS,
                payload: {
                    chatGroupList: data.data.info,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.CHATGROUP.FAILURE,
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
 * ACTIONS.CHATGROUP_MEMBERS.REQUEST 触发
 * 查询所有群成员信息(根据chatUserGroupId)
 * @param payload
 */
export function* queryAllChatGroupMembers({ payload }) {
    yield put({
        type: ACTIONS.CHATGROUP_MEMBERS.LOADING,
        payload: {
            loading: true,
        },
    });
    const { online } = yield select(state => state.user);
    const params = {
        ...payload,
    };
    const { data, err } = yield call(queryChatGroupToUserByChatUserGroupId, params);
    if (online) {
        if (data && data.data.status === '22000') {
            yield put({
                type: ACTIONS.CHATGROUP_MEMBERS.SUCCESS,
                payload: {
                    chatGroupMembers: data.data.info,
                },
            });
        } else {
            const message = (err && err.message);
            yield put({
                type: ACTIONS.CHATGROUP_MEMBERS.FAILURE,
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
