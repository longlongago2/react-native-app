import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme';

const HeaderRight = ({ navigation }) => {
    function handleFilterPress() {
        const { setParams } = navigation;
        setParams({ modalVisible: true });
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <HeaderTool onPress={() => handleFilterPress()}>
                <Icon
                    size={20}
                    name="filter"
                    color={theme.header.foregroundColor}
                />
            </HeaderTool>
        </View>
    );
};

HeaderRight.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default HeaderRight;
