/**
 * 通讯录: 添加朋友
 * created by zhangqi on 2018-1-26
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { View, Text, ScrollView, TextInput } from 'react-native';
import ModalPage from '../../components/ModalPage';
import ACTIONS from '../../models/actions';


export default class ModalInsertFriend extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            friendId: 0,
            friendName: '',
        };
        this.handleSubmit = this._handleSubmit.bind(this);
    }
    _handleSubmit(close) {
        const { dispatch, friendGroupsId } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_DETAIL.INSERT,
            payload: {
                friendcode: uuid(),
                friendid: this.state.friendId,
                friendname: this.state.friendName,
                friendtype: 0,
                friendgroupsid: friendGroupsId,
            },
        });
        close();
    }
    render() {
        const { navigation, friendGroupsName } = this.props;
        return (
            <ModalPage
                navigation={navigation}
                title="添加好友"
                onSubmit={this.handleSubmit}
            >
                <ScrollView style={{ alignSelf: 'flex-start', width: '100%' }}>
                    <Text>{`您正在为${friendGroupsName}添加好友`}</Text>
                    <View
                        style={{
                            flex: 1,
                            width: '100%',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 10,
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'rgba(139,139,139,0.3)',
                            flexDirection: 'row',
                            height: 60,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ flex: 0.2 }}>好友id: </Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="输入内容"
                            placeholderTextColor="#cccccc"
                            style={{ flex: 0.8 }}
                            onChangeText={(text) => {
                                this.setState({ friendId: text });
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            width: '100%',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 10,
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'rgba(139,139,139,0.3)',
                            flexDirection: 'row',
                            height: 60,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ flex: 0.2 }}>好友名: </Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="输入内容"
                            placeholderTextColor="#cccccc"
                            style={{ flex: 0.8 }}
                            onChangeText={(text) => {
                                this.setState({ friendName: text });
                            }}
                        />
                    </View>
                </ScrollView>
            </ModalPage>
        );
    }
}

ModalInsertFriend.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    friendGroupsName: PropTypes.string.isRequired,
    friendGroupsId: PropTypes.number.isRequired,
};

