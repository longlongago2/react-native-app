import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const Hyperlink = ({ route, style, dispatch, text }) => {
    function handlePress() {
        dispatch({
            type: 'Navigation/NAVIGATE',
            ...route,
        });
    }

    return (
        <Text
            onPress={handlePress}
            style={{
                fontSize: 10,
                color: 'blue',
                lineHeight: 25,
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: 'red',
                ...style,
            }}
        >
            {
                text
            }
        </Text>
    );
};
Hyperlink.propTypes = {
    route: PropTypes.shape({
        routeName: PropTypes.string.isRequired,
        params: PropTypes.object,
    }).isRequired,
    style: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};
export default Hyperlink;
