import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

export default class TwinkleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnimated: new Animated.Value(0), // 透明度初始值设为0
        };
        this.startAnimation = this._startAnimation.bind(this);
    }

    componentDidMount() {
        this.startAnimation();
    }

    _startAnimation() {
        const { fadeAnimated } = this.state;
        const { iterations } = this.props;
        const num = iterations || 2;
        let initialArr = [
            Animated.timing(
                fadeAnimated,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                },
            ),
        ];
        const nextArr = [
            Animated.timing(
                fadeAnimated,
                {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                },
            ),
            Animated.timing(
                fadeAnimated,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                },
            ),
        ];
        let i = 0;
        while (i < num - 1) {
            i++;
            initialArr = initialArr.concat(nextArr);
        }
        Animated.sequence(initialArr).start();
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

TwinkleView.propTypes = {
    children: PropTypes.object,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    iterations: PropTypes.number,    // 迭代次数: 默认是2次
};
