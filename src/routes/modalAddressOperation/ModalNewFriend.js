/**
 * 通讯录: 新的朋友
 * created by zhangqi on 2018-1-29
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import ModalPage from '../../components/ModalPage';

export default class ModalNewFriend extends PureComponent {
    render() {
        const { navigation, dispatch } = this.props;
        return (
            <ModalPage
                navigation={navigation}
                title="新的朋友"
                onSubmit={this.handleSubmit}
            >
                <View>
                    <Text>新的朋友页面</Text>
                </View>
            </ModalPage>
        );
    }
}

ModalNewFriend.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

