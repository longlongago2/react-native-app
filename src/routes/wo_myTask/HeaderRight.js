import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Feather';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme';

const HeaderRight = ({ navigation }) => {
    function handlePress() {
        const { setParams } = navigation;
        setParams({ modalVisible: true });
    }

    return (
        <HeaderTool onPress={() => handlePress()}>
            <Icon
                size={20}
                name="filter"
                color={theme.header.foregroundColor}
            />
        </HeaderTool>
    );
};

HeaderRight.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default HeaderRight;
