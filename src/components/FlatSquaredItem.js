import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import RAFTouchableNativeFeedback from '../components/RAFTouchableNativeFeedback';
import theme from '../theme';

class FlatSquaredItem extends PureComponent {
    componentWillUnmount() {
        cancelAnimationFrame(this.timerPress);
    }

    render() {
        const { item, onPress, width } = this.props;
        return (
            <RAFTouchableNativeFeedback
                backgroundColor={theme.rippleColor}
                onPress={() => {
                    this.timerPress = requestAnimationFrame(() => onPress(item));
                }}
            >
                <View
                    style={{
                        flex: -1,
                        width,
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onLayout={this.onLayoutDidChange}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: item.color || theme.theme,
                            flex: -1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {item.icon}
                    </View>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            lineHeight: 22,
                        }}
                    >
                        {item.name}
                    </Text>
                </View>
            </RAFTouchableNativeFeedback>
        );
    }
}

FlatSquaredItem.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        color: PropTypes.string,
        redirect: PropTypes.object.isRequired,
    }).isRequired,
    onPress: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
};

export default FlatSquaredItem;

