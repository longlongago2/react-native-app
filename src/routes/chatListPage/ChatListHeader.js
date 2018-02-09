import React from 'react';
import PropTypes from 'prop-types';
import FlatChatListHeader from '../../components/FlatChatListHeader';
import theme from '../../theme';

const ChatListHeader = ({ dispatch }) => {
    function handlePress() {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'AddressList',
        });
    }

    return (
        <FlatChatListHeader
            onPress={handlePress}
            pressColor={theme.rippleColor}
        />
    );
};

ChatListHeader.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default ChatListHeader;
