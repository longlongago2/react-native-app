import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FadeInView from '../components/FadeInView';
import theme from '../theme';

const FloatingActionBtn = ({ onPress, icon, show, size, color, position }) => (
    <FadeInView
        duration={500}
        style={[
            {
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: color || theme.theme,
                width: size || 50,
                height: size || 50,
                borderRadius: size ? parseFloat(size / 2) : 25,
                elevation: 5,
                flex: -1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
            show === false && { display: 'none' },
            position && position.x && position.x > 0 && { left: position.x },
            position && position.x && position.x < 0 && { right: -position.x },
            position && position.y && position.y > 0 && { top: position.y },
            position && position.y && position.y < 0 && { bottom: -position.y },
        ]}
    >
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    width: size || 44,
                    height: size || 44,
                    borderRadius: size ? parseFloat(size / 2) : 22,
                    flex: -1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Icon
                    name={icon.name || 'angle-double-up'}
                    size={icon.size || 25}
                    color={icon.color || '#ffffff'}
                />
            </View>
        </TouchableOpacity>
    </FadeInView>
);
FloatingActionBtn.propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number,
        color: PropTypes.string,
    }),
    position: PropTypes.shape({
        x: PropTypes.number.isRequired,  // 横向位置（正数：left, 负数： right）
        y: PropTypes.number.isRequired,  // 纵向位置（正数：top, 负数：bottom）
    }),
    show: PropTypes.bool,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};
export default FloatingActionBtn;
