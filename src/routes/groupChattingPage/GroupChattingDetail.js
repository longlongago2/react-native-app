/**
 * 聊天信息
 * created by zhangqi on 2018-2-2
 * */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

class GroupChattingDetail extends Component {
    render() {
        const { navigation } = this.props;
        const { state } = navigation;
        const item = state.params.item;
        return (
            <View>
                <Text>群主：{item.personname}</Text>
                <Text>群公告：{item.notice}</Text>
                <Text>群简介：{item.intro}</Text>
            </View>
        );
    }
}

GroupChattingDetail.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default GroupChattingDetail;
