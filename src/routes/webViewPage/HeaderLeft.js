import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme';

const HeaderLeft = ({ dispatch }) => {
    function handleClose() {
        dispatch({ type: 'Navigation/BACK' });
    }

    return (
        <HeaderTool onPress={handleClose}>
            <Icon
                name="md-close"
                size={22}
                color={theme.header.foregroundColor}
            />
        </HeaderTool>
    );
};

HeaderLeft.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect()(HeaderLeft);
