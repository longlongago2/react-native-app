import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback } from 'react-native';

export default class RAFTouchableNativeFeedback extends PureComponent {
    constructor(props) {
        super(props);
        this.handleExpensivePress = this._handleExpensivePress.bind(this);
        this.handleExpensiveLongPress = this._handleExpensiveLongPress.bind(this);
    }

    componentWillUnmount() {
        // 清除异步定时器
        if (this.timer1) {
            cancelAnimationFrame(this.timer1);
        }
        if (this.timer2) {
            cancelAnimationFrame(this.timer2);
        }
    }

    _handleExpensivePress() {
        const { onPress } = this.props;
        if (onPress) {
            // 异步定时器：在动画后执行
            this.timer1 = requestAnimationFrame(onPress);
        }
    }

    _handleExpensiveLongPress() {
        const { onLongPress } = this.props;
        if (onLongPress) {
            this.timer2 = requestAnimationFrame(onLongPress);
        }
    }

    render() {
        const { children, backgroundColor } = this.props;
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(backgroundColor, false)}
                onPress={this.handleExpensivePress}
                onLongPress={this.handleExpensiveLongPress}
            >
                {children}
            </TouchableNativeFeedback>
        );
    }
}

RAFTouchableNativeFeedback.propTypes = {
    children: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
};

