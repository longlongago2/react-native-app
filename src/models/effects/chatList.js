/**
 * ************ SQLite: chatList(聊天列表) ********** *
 */

import { put, select, call } from 'redux-saga/effects';
import uuid from 'uuid/v4';
import SQLiteHelper from 'react-native-sqlite-helper';
import ACTIONS from '../actions';
import { queryUserInfo } from '../../services/user';
import api from '../../utils/api';

/**
 * 创建chatList表(fork触发)
 */
export function* createChatListTable() {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.createTable({
        tableName: 'chatList',
        tableFields: [
            {
                columnName: 'uuid',
                dataType: 'VARCHAR PRIMARY KEY',
            }, {
                columnName: 'avatar',    // 头像
                dataType: 'VARCHAR',
            }, {
                columnName: 'topicId',   // 聊天编号
                dataType: 'VARCHAR',
            }, {
                columnName: 'topicName', // 聊天名称
                dataType: 'VARCHAR',
            }, {
                columnName: 'type',      // 聊天类型（群聊，私聊，通知，天气等）
                dataType: 'VARCHAR',
            }, {
                columnName: 'newestMsg', // 最新消息
                dataType: 'VARCHAR',
            }, {
                columnName: 'createdAt',  // 创建时间
                dataType: 'DATETIME DEFAULT ( datetime( \'now\', \'localtime\' ) )',
            }, {
                columnName: 'unread',    // 未读消息数
                dataType: 'INT DEFAULT ( 0 )',
            },
        ],
    });
    if (err) throw new Error('创建chatList表失败：用于记录聊天信息');
}

/**
 * ACTIONS.CHAT_LIST.REQUEST 触发
 */
export function* queryChatList() {
    const { online, userInfo } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.CHAT_LIST.LOADING,
            payload: {
                loading: true,
            },
        });
        const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
        const { res: chatList, err } = yield sqLiteHelper.selectItems('chatList', '*');
        if (err) {
            yield put({
                type: ACTIONS.CHAT_LIST.FAILURE,
                payload: {
                    message: err.message,
                },
            });
            return;
        }
        let unreadSum = 0;
        if (Array.isArray(chatList) && chatList.length > 0) {
            chatList.forEach((item) => {
                unreadSum += item.unread;
            });
        }
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList,
                unreadSum,
            },
        });
    } else {
        yield put({ type: ACTIONS.CHAT_LIST.INITIAL });
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

/**
 * ACTIONS.CHAT_LIST.INSERT 触发
 * @param payload
 */
export function* insertChatList({ payload }) {
    const { userInfo, online, token } = yield select(state => state.user);
    if (!online) return;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    // 检测是否存在并归类
    try {
        const { res, err: selectErr } = yield sqLiteHelper.selectItems('chatList', '*', { topicId: payload.item.topicId });
        if (selectErr) throw new Error('查询失败！');
        if (Array.isArray(res) && res.length > 0) {
            // 存在，修改信息
            const { err: updateErr } = yield sqLiteHelper.updateItem(
                'chatList',
                {
                    unread: res[0].unread + 1,
                    ...payload.item,
                },
                {
                    topicId: res[0].topicId,
                },
            );
            if (updateErr) throw new Error('更新失败！');
        } else {
            // 不存在，添加信息
            const params = {
                userid: payload.item.topicId,
                accessToken: token,
            };
            let avatar;
            const { data } = yield call(queryUserInfo, params);  // 查询用户头像
            if (data && data.data.status === '21300') {
                avatar = `${api.database}/${data.data.info.avatar}`;
            } else {
                throw new Error('请求用户信息接口失败');
            }
            const { err: insertErr } = yield sqLiteHelper.insertItems('chatList', [{
                uuid: uuid(),
                unread: 1,
                avatar,
                ...payload.item,
            }]);
            if (insertErr) throw new Error('添加失败！');
        }
        // 重新查询
        const { res: newChatList, err: reSelectErr } = yield sqLiteHelper.selectItems('chatList', '*');
        if (reSelectErr) throw new Error('重新失败！');
        let unreadSum = 0;
        if (Array.isArray(newChatList) && newChatList.length > 0) {
            newChatList.forEach((item) => {
                unreadSum += item.unread;
            });
        }
        yield put({
            type: ACTIONS.CHAT_LIST.SUCCESS,
            payload: {
                chatList: newChatList,
                unreadSum,
            },
        });
    } catch (err) {
        yield put({
            type: ACTIONS.CHAT_LIST.FAILURE,
            payload: {
                message: err.message,
            },
        });
    }
}

/**
 * ACTIONS.CHAT_LIST.UPDATE 触发：主要针对更新 unread
 * @param payload
 */
export function* updateChatList({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return false;
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.updateItem('chatList', payload.item, payload.condition);
    if (err) {
        yield put({
            type: ACTIONS.CHAT_LIST.FAILURE,
            payload: { message: err.message },
        });
        return false;
    }
    const { res: chatList, _err } = yield sqLiteHelper.selectItems('chatList', '*');
    if (_err) {
        yield put({
            type: ACTIONS.CHAT_LIST.FAILURE,
            payload: {
                message: _err.message,
            },
        });
        return false;
    }
    let unreadSum = 0;
    if (Array.isArray(chatList) && chatList.length > 0) {
        chatList.forEach((item) => {
            unreadSum += item.unread;
        });
    }
    yield put({
        type: ACTIONS.CHAT_LIST.SUCCESS,
        payload: {
            chatList,
            unreadSum,
        },
    });
    return true;
}

/**
 * ACTIONS.CHAT_LIST.DELETE 触发
 * @param payload
 */
export function* deleteChatList({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return false;
    yield put({
        type: ACTIONS.CHAT_LIST.LOADING,
        payload: {
            loading: true,
        },
    });
    const sqLiteHelper = new SQLiteHelper(`${userInfo.username}.db`, '1.0', 'IMStorage', 200000);
    const { err } = yield sqLiteHelper.deleteItem('chatList', payload.condition);
    if (err) {
        yield put({
            type: ACTIONS.CHAT_LIST.FAILURE,
            payload: { message: err.message },
        });
        return false;
    }
    const { res: chatList, _err } = yield sqLiteHelper.selectItems('chatList', '*');
    if (_err) {
        yield put({
            type: ACTIONS.CHAT_LIST.FAILURE,
            payload: {
                message: _err.message,
            },
        });
        return false;
    }
    let unreadSum = 0;
    if (Array.isArray(chatList) && chatList.length > 0) {
        chatList.forEach((item) => {
            unreadSum += item.unread;
        });
    }
    yield put({
        type: ACTIONS.CHAT_LIST.SUCCESS,
        payload: {
            chatList,
            unreadSum,
        },
    });
    return false;
}
