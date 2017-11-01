import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import TwinkleView from './TwinkleView';
import theme from '../theme/index';

const HeaderTitle = ({ title, navigation, onPress }) => {
    const { state } = navigation;
    const headerTip = state.params && state.params.headerTip;
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingLeft: 15,
                }}
            >
                {
                    headerTip ?
                        <TwinkleView iterations={4}>
                            <Text
                                style={{
                                    color: theme.header.foregroundColor,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                }}
                            >
                                单击标题返回顶部
                            </Text>
                        </TwinkleView> :
                        <Text
                            style={{
                                color: theme.header.foregroundColor,
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        >
                            {title}
                        </Text>
                }
            </View>
        </TouchableWithoutFeedback>
    );
};

HeaderTitle.propTypes = {
    title: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default HeaderTitle;
