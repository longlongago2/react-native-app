import { put, call, select } from 'redux-saga/effects';
import { GiftedChat } from 'react-native-gifted-chat';
import moment from 'moment';
import uuid from 'uuid/v4';
import { insertMessage } from './messages';
import { sendMSG } from '../../services/activeMQ';
import ACTIONS from '../../models/actions';

/**
 * ACTIONS.ACTIVE_MQ.REQUEST 发送消息
 * @param {*} payload
 */
export function* sendMessages({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return;
    const { send, messages } = payload;
    if (!Array.isArray(messages)) return;
    const { data: prevData } = yield select(state => state.activeMQ);
    const prevMessages = prevData.messages;
    const newMessages = messages.map(item => ({ ...item, loading: true, received: false }));
    // 无条件记录消息
    yield put({
        type: ACTIONS.ACTIVE_MQ.SUCCESS,
        payload: {
            data: {
                messages: GiftedChat.append(prevMessages, newMessages),
            },
        },
    });
    // 更改已记录消息状态
    const { userid, avatar } = userInfo;
    for (let i = 0; i < messages.length; i++) {
        let portrayal = '0';          // 消息体类型
        let text = messages[i].text;  // 消息体内容
        if (messages[i].text) {
            portrayal = '0'; // 文本
            text = messages[i].text;
        } else if (messages[i].image) {
            portrayal = '1'; // 图片
            text = messages[i].image;
        } else if (messages[i].voice) {
            portrayal = '2'; // 语音
            text = messages[i].voice;
        } else if (messages[i].tip) {
            portrayal = '3';  // 提示
            text = messages[i].tip;
        }
        const params = {
            senderId: userid.toString(),
            avatar,
            ...send,
            text,
            portrayal,
        };
        const { data, err } = yield call(sendMSG, params);
        let currentMessage;
        if (err) {
            // 发送失败
            yield put({
                type: ACTIONS.ACTIVE_MQ.FAILURE,
                payload: {
                    message: err.message,
                },
            });
            currentMessage = { ...messages[i], loading: false, received: false };
        } else {
            currentMessage = { ...messages[i], loading: false, received: data.success };
        }
        // 记录message到数据库
        // ...
        // 更新发送状态
        yield put({
            type: ACTIONS.ACTIVE_MQ.UPDATE,
            payload: {
                _id: messages[i]._id,
                upgrade: currentMessage,
            },
        });
        // 记录chatList到数据库
        yield put({
            type: ACTIONS.CHAT_LIST.INSERT,
            payload: {
                item: {
                    topicId: send.receiverId,
                    topicName: send.receiver,
                    type: send.type,
                    newestMsg: text,
                    createdAt: (data && data.msg.createdAt) || moment().format('YYYY-MM-DD HH:mm:ss'),
                },
            },
        });
    }
}

/**
 * ACTIONS.ACTIVE_MQ.INSERT 接收消息
 * @param payload
 */
export function* receiveMessages({ payload }) {
    const { online } = yield select(state => state.user);
    if (!online) return;
    const { topicId, data } = yield select(state => state.activeMQ);
    // 记录到message表 todo: 有错误
    // yield insertMessage({
    //     payload: {
    //         messages: [{
    //             uuid: uuid(),
    //             topicId: payload.topicId,
    //             userid: payload.userid,
    //             createdAt: payload.createdAt,
    //             typeId: payload.typeId,
    //             content: payload.content,
    //         }],
    //         user: payload.user,
    //     },
    // });
    // 即时更新聊天数据
    if (payload.topicId.toString() === topicId.toString()) {
        const prevMessages = data.messages;
        const newMessages = [{
            text: payload.content,
            user: payload.user,
            createdAt: payload.createdAt,
            _id: uuid(),
        }];
        yield put({
            type: ACTIONS.ACTIVE_MQ.SUCCESS,
            payload: {
                data: {
                    messages: GiftedChat.append(prevMessages, newMessages),
                },
            },
        });
    }
}

/**
 * ACTIONS.ACTIVE_MQ.UPDATE
 * @param payload
 */
export function* updateMessage({ payload }) {
    const { online } = yield select(state => state.user);
    if (!online) return;
    const { _id, upgrade } = payload;
    const { data } = yield select(state => state.activeMQ);
    const prevMessages = data.messages.concat();
    const nextMessages = prevMessages.map((item) => {
        if (item._id === _id) return upgrade;
        return item;
    });
    yield put({
        type: ACTIONS.ACTIVE_MQ.SUCCESS,
        payload: {
            data: {
                messages: nextMessages,
            },
        },
    });
}

/**
 * ACTIONS.ACTIVE_MQ.INITIAL
 * @param payload
 */
export function* initialMessages({ payload }) {
    const { online } = yield select(state => state.user);
    if (!online) return;
    yield put({
        type: ACTIONS.ACTIVE_MQ.SUCCESS,
        payload,
    });
}
