import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatChatListItem from '../../components/FlatChatListItem';
import theme from '../../theme';
import ACTIONS from '../../models/actions';

const ChatListItem = ({ item, dispatch }) => {
    function handleDelete(userId) {
        // ...删除本条数据
        dispatch({
            type: ACTIONS.CHAT_LIST.DELETE,
            payload: {
                userId,
            },
        });
    }

    function handlePress({ personName, userId }) {
        // 按压跳转私聊界面
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'Chatting',
            params: {
                personName,
                userId,
            },
        });
        // 根据userId更新徽章
        dispatch({
            type: ACTIONS.CHAT_LIST.UPDATE,
            payload: {
                userId,
            },
        });
    }

    function handleClearBadge(userId) {
        // 清除聊天栏徽章
        dispatch({
            type: ACTIONS.CHAT_LIST.UPDATE,
            payload: {
                userId,
            },
        });
    }

    return (
        <FlatChatListItem
            item={item}
            itemMap={{
                title: 'personName',
                subtitle: 'latestContext',
                badge: 'unread',
                date: 'latestDate',
                avatar: 'avatar',
            }}
            onPress={data => handlePress(data)}
            onDelete={userId => handleDelete(userId)}
            onClearBadge={userId => handleClearBadge(userId)}
            pressColor={theme.rippleColor}
        />
    );
};

ChatListItem.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
};

export default connect()(ChatListItem);
