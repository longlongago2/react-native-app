/**
 * 群聊窗口 右上角图标
 * created by zhangqi on 2018-2-2
 * */

import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme';

const HeaderRight = ({ dispatch, navigation }) => {
    const { state } = navigation;
    function handlePress() {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'GroupChattingDetail',
            params: {
                item: state.params.item,
            },
        });
    }
    return (
        <HeaderTool onPress={() => handlePress()}>
            <Icon
                size={20}
                name="users"
                color={theme.header.foregroundColor}
            />
        </HeaderTool>
    );
};

HeaderRight.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default connect()(HeaderRight);
