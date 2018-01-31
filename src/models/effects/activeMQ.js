import { put, call, select } from 'redux-saga/effects';
import { GiftedChat } from 'react-native-gifted-chat';
import { sendMSG } from '../../services/activeMQ';
import ACTIONS from '../../models/actions';

/**
 * 发送消息
 * @param {*} payload
 */
export function* sendMessage({ payload }) {
    const { userInfo, online } = yield select(state => state.user);
    if (!online) return false;
    const { send, messages } = payload;
    if (!Array.isArray(messages)) return false;
    const { data: prevData } = yield select(state => state.activeMQ);
    const prevMessages = prevData.messages;
    // 无条件记录
    yield put({
        type: ACTIONS.ACTIVE_MQ.SUCCESS,
        payload: {
            data: {
                messages: GiftedChat.append(prevMessages, messages),
            },
        },
    });
    // 携带状态记录
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
        if (err) {
            yield put({
                type: ACTIONS.ACTIVE_MQ.FAILURE,
                payload: {
                    message: err.message,
                },
            });
            return false;
        }
        messages[i] = { ...messages[i], received: data.success };
        yield put({
            type: ACTIONS.ACTIVE_MQ.SUCCESS,
            payload: {
                data: {
                    messages: GiftedChat.append(prevMessages, messages),
                },
            },
        });
        // 记录chatList
        yield put({
            type: ACTIONS.CHAT_LIST.INSERT,
            payload: {
                item: {
                    topicId: send.receiverId,
                    topicName: send.receiver,
                    type: send.type,
                    newestMsg: text,
                    createdAt: data.msg.createdAt,
                },
            },
        });
    }
    return true;
}
