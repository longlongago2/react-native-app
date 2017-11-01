import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/EvilIcons';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme/index';


const HeaderRight = ({ dispatch }) => {
    function handlePress(routeName) {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName,
            params: null,
        });
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <HeaderTool
                route="Search"
                onPress={handlePress}
            >
                <Icon
                    name="search"
                    color={theme.header.foregroundColor}
                    size={30}
                />
            </HeaderTool>
        </View>
    );
};
HeaderRight.propTypes = {
    dispatch: PropTypes.func,
};

export default connect()(HeaderRight);
