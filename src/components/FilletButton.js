import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, View, Text, StyleSheet } from 'react-native';
import filletBtnStyle from './FilletButtonStyle';
import theme, { rgba } from '../theme';

const styles = StyleSheet.create(filletBtnStyle);

class FilletButton extends PureComponent {
    constructor(props) {
        super(props);
        this.handleExpensiveAction = this._handleExpensiveAction.bind(this);
    }

    componentWillUnmount() {
        // 清除异步定时器
        const { onPress } = this.props;
        if (onPress) {
            cancelAnimationFrame(this.timer);
        }
    }

    _handleExpensiveAction() {
        const { onPress } = this.props;
        if (onPress) {
            // 异步定时器：在动画后执行
            this.timer = requestAnimationFrame(onPress);
        }
    }

    render() {
        const { title, buttonStyle, textStyle } = this.props;
        // FilletButton 比较特殊，不使用theme的rippleColor，使用自己的Color
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(rgba('rgb(255,255,255)', 0.5), false)}
                onPress={this.handleExpensiveAction}
            >
                <View style={[styles.btn, buttonStyle]}>
                    <Text style={[styles.btnText, textStyle]}>
                        {title}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    }
}


FilletButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    buttonStyle: PropTypes.object,
    textStyle: PropTypes.object,
};

export default FilletButton;
