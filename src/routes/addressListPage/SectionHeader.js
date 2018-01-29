/** created by zhangqi on 2018-1-23 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ToastAndroid, Button } from 'react-native';
import HeaderPopupMenu from '../../components/HeaderPopupMenu';
import theme from '../../theme';

const SectionHeader = ({ item, dispatch, navigation }) => {
    const { setParams } = navigation;
    function handleInsertFriend() {
        setParams({
            modalVisible: true,
            type: 'insertFriend',
            friendGroupsId: item.friendgroupsid,
            friendGroupsName: item.friendgroupsname,
        });
    }
    function handleInsertFriendGroup() {
        setParams({
            modalVisible: true,
            type: 'insertGroup',
            friendGroupsId: item.friendgroupsid,
            friendGroupsName: item.friendgroupsname,
        });
    }
    function handleCancelClick() {
        ToastAndroid.show('取消', 3000);
    }
    const menuOptions = [
        {
            key: 'camera',
            handler: () => handleInsertFriend(),
            text: '添加好友',
        },
        {
            key: 'album',
            handler: () => handleInsertFriendGroup(),
            text: '新建分组',
        },
        {
            key: 'cancel',
            handler: () => handleCancelClick(),
            text: '取消',
        },
    ];
    return (
        <View style={{
            backgroundColor: theme.background,
            flex: 1,
            flexDirection: 'row',
            padding: 5,
        }}
        >
            <HeaderPopupMenu
                menuOptions={menuOptions}
                display="popup"
                customMenuTriggerStyle={{
                    flex: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text>{item.friendgroupsname}</Text>
            </HeaderPopupMenu>
        </View>
    );
};
SectionHeader.propTypes = {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default SectionHeader;
