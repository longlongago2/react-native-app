import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastAndroid } from 'react-native';
import FlatChatListItem from '../../components/FlatChatListItem';
import theme from '../../theme';
import ACTIONS from '../../models/actions';

const ChatListItem = ({ item, dispatch }) => {
    function handleDelete({ topicId }) {
        // 删除本条数据
        dispatch({
            type: ACTIONS.CHAT_LIST.DELETE,
            payload: {
                condition: {
                    topicId,
                },
            },
        });
    }

    function handleAllDelete() {
        // 删除所有数据
        dispatch({
            type: ACTIONS.CHAT_LIST.DELETE,
            payload: {},
        });
    }

    function handleClearBadge({ topicId }) {
        // 清除徽章
        dispatch({
            type: ACTIONS.CHAT_LIST.UPDATE,
            payload: {
                item: {
                    unread: 0,
                },
                condition: {
                    topicId,
                },
            },
        });
    }

    function handleAllClearBadge() {
        // 清除所有徽章
        dispatch({
            type: ACTIONS.CHAT_LIST.UPDATE,
            payload: {
                item: {
                    unread: 0,
                },
            },
        });
    }

    function handlePress({ topicName, topicId, type }) {
        switch (type) {
            case '0':
                // 通知
                break;
            case '1':
                // 私聊
                dispatch({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'Chatting',
                    params: {
                        userId: topicId,
                        personName: topicName,
                        type,
                    },
                });
                break;
            case '2':
                // 群聊
                break;
            default:
                ToastAndroid.show('没有处理的类型！', 3000);
                break;
        }
    }

    return (
        <FlatChatListItem
            item={item}
            itemMap={{
                title: 'topicName',
                subtitle: 'newestMsg',
                badge: 'unread',
                date: 'createdAt',
                avatar: 'avatar',
            }}
            onPress={handlePress}
            onDelete={handleDelete}
            onAllDelete={handleAllDelete}
            onClearBadge={handleClearBadge}
            onAllClearBadge={handleAllClearBadge}
            pressColor={theme.rippleColor}
        />
    );
};

ChatListItem.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
};

export default connect()(ChatListItem);
