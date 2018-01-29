/**
 * 通讯录操作模态框
 * created by zhangqi on 2018-1-25
 * */
import React from 'react';
import ProTypes from 'prop-types';
import ModalInsertFriend from './ModalInsertFriend';
import ModalInsertGroup from './ModalInsertGroup';
import ModalChatUserGoup from './ModalChatUserGroup';
import ModalNewFriend from './ModalNewFriend';

const ModalAddressOperation = ({ navigation, dispatch }) => {
    const { state } = navigation;
    if (state.params && state.params.type) {
        const item = state.params.type;
        switch (item) {
            case 'insertFriend': // 添加好友
                const friendGroupsId = state.params.friendGroupsId;
                const friendGroupsName = state.params.friendGroupsName;
                return (
                    <ModalInsertFriend
                        navigation={navigation}
                        dispatch={dispatch}
                        friendGroupsId={friendGroupsId}
                        friendGroupsName={friendGroupsName}
                    />
                );
            case 'insertGroup': // 添加分组
                return (
                    <ModalInsertGroup
                        navigation={navigation}
                        dispatch={dispatch}
                    />
                );
            case 'newFriend': // 新的朋友
                return (
                    <ModalNewFriend
                        navigation={navigation}
                        dispatch={dispatch}
                    />
                );
            case 'chatUserGroup': // 群聊
                return (
                    <ModalChatUserGoup
                        navigation={navigation}
                        dispatch={dispatch}
                    />
                );
            default:
                return null;
        }
    }
    return null;
};

ModalAddressOperation.propTypes = {
    navigation: ProTypes.object.isRequired,
    dispatch: ProTypes.func.isRequired,
};

export default ModalAddressOperation;
