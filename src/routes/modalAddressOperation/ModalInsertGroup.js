/**
 * 通讯录: 添加分组
 * created by zhangqi on 2018-1-29
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, TextInput } from 'react-native';
import ModalPage from '../../components/ModalPage';
import ACTIONS from '../../models/actions';

export default class ModalInsertGroup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            friendsGroupName: '',
        };
        this.handleSubmit = this._handleSubmit.bind(this);
    }
    _handleSubmit(close) {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_GROUP.INSERT,
            payload: {
                friendgroupsname: this.state.friendsGroupName,
            },
        });
        close();
    }
    render() {
        const { navigation } = this.props;
        return (
            <ModalPage
                navigation={navigation}
                title="新建分组"
                onSubmit={this.handleSubmit}
            >
                <ScrollView style={{ alignSelf: 'flex-start', width: '100%' }}>
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
                        <Text style={{ flex: 0.2 }}>分组名：</Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="输入内容"
                            placeholderTextColor="#cccccc"
                            style={{ flex: 0.8 }}
                            onChangeText={(text) => {
                                this.setState({ friendsGroupName: text });
                            }}
                        />
                    </View>
                </ScrollView>
            </ModalPage>
        );
    }
}

ModalInsertGroup.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

