import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderTool from '../../components/HeaderTool';
import ACTIONS from '../../models/actions/index';
import theme from '../../theme';


const UpdateProfileOptionsHeaderRight = ({ navigation, dispatch }) => {
    function handlePress() {
        const { state } = navigation;
        dispatch({
            type: ACTIONS.USER_INFO.UPDATE,
            payload: {
                key: state.params.item.key,
                value: state.params.item.text,
            },
        });
    }

    return (
        <HeaderTool onPress={handlePress}>
            <Text style={{ color: theme.header.foregroundColor }}>
                保存
            </Text>
        </HeaderTool>
    );
};

UpdateProfileOptionsHeaderRight.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default connect()(UpdateProfileOptionsHeaderRight);
