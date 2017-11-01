import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatChatListHeader from '../../components/FlatChatListHeader';
import theme from '../../theme';

const ChatListHeader = ({ dispatch, sysList }) => {
    function handlePress() {
        alert('广播');
    }

    return (
        <FlatChatListHeader
            onPress={() => handlePress()}
            sysList={sysList}
            pressColor={theme.rippleColor}
        />
    );
};

ChatListHeader.propTypes = {
    dispatch: PropTypes.func.isRequired,
    sysList: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    sysList: state.instantMessaging.sysList,
});
export default connect(mapStateToProps)(ChatListHeader);
