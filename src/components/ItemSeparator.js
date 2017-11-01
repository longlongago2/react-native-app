import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const DIYItemSeparator = ({ backgroundColor, border, lineColor, marginHorizontal }) => (
    <View style={{ backgroundColor }}>
        <View
            style={{
                height: border,
                backgroundColor: lineColor,
                marginHorizontal,
                borderWidth: 0,
            }}
        />
    </View>
);
DIYItemSeparator.propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    border: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    marginHorizontal: PropTypes.number.isRequired,
};

export default DIYItemSeparator;
