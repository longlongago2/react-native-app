import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatUserListItem from '../../components/FlatUserListItem';
import ACTIONS from '../../models/actions';

const UserListItem = ({ dispatch, item }) => {
    function handlePress() {
        dispatch({
            type: ACTIONS.LOGIN_GATHER.REQUEST,
            payload: {
                username: item.username,
                password: item.password,
                showUserList: false,
            },
        });
    }

    function handleDelete() {
        dispatch({
            type: ACTIONS.USER_LIST.DELETE,
            payload: {
                key: 'userList',
                id: item.username,
            },
        });
    }

    return (
        <FlatUserListItem
            item={item}
            onPress={() => handlePress()}
            onDelete={() => handleDelete()}
        />
    );
};
UserListItem.propTypes = {
    dispatch: PropTypes.func,
    item: PropTypes.object.isRequired,
};
export default connect()(UserListItem);
