/**
 * 通讯录: 群聊
 * created by zhangqi on 2018-1-29
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import ModalPage from '../../components/ModalPage';

export default class ModalChatUserGroup extends PureComponent {
    render() {
        const { navigation, dispatch } = this.props;
        return (
            <ModalPage
                navigation={navigation}
                title="群聊"
                onSubmit={this.handleSubmit}
            >
                <View>
                    <Text>群聊页面</Text>
                </View>
            </ModalPage>
        );
    }
}

ModalChatUserGroup.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

