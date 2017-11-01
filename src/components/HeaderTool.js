import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import RAFTouchableNativeFeedback from './RAFTouchableNativeFeedback';
import styleModule from './HeaderToolStyle';
import theme from '../theme';

const styles = StyleSheet.create(styleModule);

export default class HeaderTool extends PureComponent {
    componentWillUnmount() {
        cancelAnimationFrame(this.timer);
    }

    render() {
        const { onPress, children, route } = this.props;
        return (
            <View style={styles.menuLayout}>
                <RAFTouchableNativeFeedback
                    backgroundColor={theme.header.rippleColor}
                    onPress={() => {
                        if (onPress) {
                            this.timer = requestAnimationFrame(() => onPress(route));
                        }
                    }}
                >
                    <View style={styles.menu}>
                        {children}
                    </View>
                </RAFTouchableNativeFeedback>
            </View>
        );
    }
}
HeaderTool.propTypes = {
    onPress: PropTypes.func,
    route: PropTypes.string,
    children: PropTypes.object.isRequired,
};
