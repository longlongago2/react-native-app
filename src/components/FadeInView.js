import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

export default class FadeInView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnimated: new Animated.Value(0),  // 透明度初始值设为0
        };
        this.startAnimation = this._startAnimation.bind(this);
    }

    componentDidMount() {
        this.startAnimation(0, 1);
    }

    _startAnimation(start, end) {
        const { duration } = this.props;
        const { fadeAnimated } = this.state;
        fadeAnimated.setValue(start);
        Animated.timing(                    // 随时间变化而执行的动画类型
            fadeAnimated,                   // 动画中的变量值
            {
                toValue: end,               // 透明度最终变为1，即完全不透明
                duration: duration || 800,  // 动画持续时间
                useNativeDriver: true,      // 使用原生动画驱动
            },
        ).start();
    }

    render() {
        const { style, children } = this.props;
        const { fadeAnimated } = this.state;
        return (
            <Animated.View
                style={
                    Array.isArray(style) ?
                        [
                            ...style,
                            { opacity: fadeAnimated },
                        ] :
                        {
                            ...style,
                            opacity: fadeAnimated,
                        }
                }
            >
                {children}
            </Animated.View>
        );
    }
}

FadeInView.propTypes = {
    children: PropTypes.object,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    duration: PropTypes.number,
};
