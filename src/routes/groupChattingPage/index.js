/**
 * 群聊窗口
 * created by zhangqi on 2018-2-2
 * */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

class GroupChattingPage extends Component {

    render() {
        const { dispatch, navigation } = this.props;
        const { state } = navigation;
        const item = state.params.item;
        return (
            <View>
                <Text>群聊数据</Text>
            </View>
        );
    }
}

GroupChattingPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect()(GroupChattingPage);

