import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';

const TabBarBadgeWithIcon = ({ icon, image, imageStyle, badge, badgeStyle, tintColor, display, component, containerStyle }) => (
    <View style={containerStyle}>
        {
            component && component === 'icon' ?
                icon : null
        }
        {
            component && component === 'image' ?
                <Image
                    source={image}
                    style={[
                        {
                            width: 25,
                            height: 25,
                        },
                        imageStyle,
                        tintColor ? { tintColor } : null,
                    ]}
                /> : null
        }
        {
            display && display === 'number' ?
                <View
                    style={[{
                        position: 'absolute',
                        right: -3,
                        top: 1,
                        backgroundColor: 'red',
                        borderRadius: 8,
                        width: 16,
                        height: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }, badgeStyle, badge > 0 ? null : { display: 'none' },
                    ]}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 8,
                        }}
                    >
                        {badge > 99 ? '99+' : badge}
                    </Text>
                </View> : null
        }
        {
            display && display === 'dot' ?
                <View
                    style={[{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        backgroundColor: 'red',
                        borderRadius: 4,
                        width: 8,
                        height: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }, badgeStyle, badge > 0 ? null : { display: 'none' },
                    ]}
                /> : null
        }
    </View>
);
TabBarBadgeWithIcon.propTypes = {
    icon: PropTypes.element,
    image: PropTypes.number,
    imageStyle: PropTypes.object,
    badge: PropTypes.number.isRequired,
    badgeStyle: PropTypes.object,
    tintColor: PropTypes.string,
    display: PropTypes.oneOf(['dot', 'number', false]).isRequired,
    component: PropTypes.oneOf(['image', 'icon', false]).isRequired,
    containerStyle: PropTypes.object,
};
export default TabBarBadgeWithIcon;
