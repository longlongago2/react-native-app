import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

class ThrownIntoAnimation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            positionXAnimated: new Animated.Value(0),
            positionYAnimated: new Animated.Value(0),
        };
    }

    componentDidMount() {
        const { position, duration } = this.props;
        const { positionXAnimated, positionYAnimated } = this.state;
        if (position.left) {
            if (typeof position.left === 'number') {
                positionXAnimated.setValue(position.left);
            }
            if (typeof position.left === 'object' && position.left.initial && position.left.final) {
                positionXAnimated.setValue(position.left.initial);
                Animated.spring(
                    positionXAnimated,
                    {
                        toValue: position.left.final,
                        duration: duration || 800,
                    },
                ).start();
            }
        }
        if (position.right) {
            if (typeof position.right === 'number') {
                positionXAnimated.setValue(position.right);
            }
            if (typeof position.right === 'object' && position.right.initial && position.right.final) {
                positionXAnimated.setValue(position.right.initial);
                Animated.spring(
                    positionXAnimated,
                    {
                        toValue: position.right.final,
                        duration: duration || 800,
                    },
                ).start();
            }
        }
        if (position.top) {
            if (typeof position.top === 'number') {
                positionYAnimated.setValue(position.top);
            }
            if (typeof position.top === 'object' && position.top.initial && position.top.final) {
                positionYAnimated.setValue(position.top.initial);
                Animated.spring(
                    positionYAnimated,
                    {
                        toValue: position.top.final,
                        duration: duration || 800,
                    },
                ).start();
            }
        }
        if (position.bottom) {
            if (typeof position.bottom === 'number') {
                positionYAnimated.setValue(position.bottom);
            }
            if (typeof position.bottom === 'object' && position.bottom.initial && position.bottom.final) {
                positionYAnimated.setValue(position.bottom.initial);
                Animated.spring(
                    positionYAnimated,
                    {
                        toValue: position.bottom.final,
                        duration: duration || 800,
                    },
                ).start();
            }
        }
    }

    render() {
        const { children, style, position } = this.props;
        const { positionXAnimated, positionYAnimated } = this.state;
        return (
            <Animated.View
                style={[
                    style,
                    {
                        position: 'absolute',
                        left: position.left ? positionXAnimated : null,
                        right: position.right && !position.left ? positionXAnimated : null,
                        top: position.top ? positionYAnimated : null,
                        bottom: position.bottom && !position.top ? positionYAnimated : null,
                        transform: [{ scale: 1 }],
                    },
                ]}
            >
                {
                    children && Array.isArray(children) ?
                        children.map(item => item) :
                        children
                }
            </Animated.View>
        );
    }
}

ThrownIntoAnimation.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
    style: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
    ]),
    position: PropTypes.shape({
        left: PropTypes.oneOfType([
            PropTypes.shape({
                initial: PropTypes.number.isRequired,
                final: PropTypes.number.isRequired,
            }),
            PropTypes.number,
        ]),
        right: PropTypes.oneOfType([
            PropTypes.shape({
                initial: PropTypes.number.isRequired,
                final: PropTypes.number.isRequired,
            }),
            PropTypes.number,
        ]),
        top: PropTypes.oneOfType([
            PropTypes.shape({
                initial: PropTypes.number.isRequired,
                final: PropTypes.number.isRequired,
            }),
            PropTypes.number,
        ]),
        bottom: PropTypes.oneOfType([
            PropTypes.shape({
                initial: PropTypes.number.isRequired,
                final: PropTypes.number.isRequired,
            }),
            PropTypes.number,
        ]),
    }),
    duration: PropTypes.number,
};

export default ThrownIntoAnimation;
