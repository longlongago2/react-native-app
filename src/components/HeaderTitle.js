import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import TwinkleView from './TwinkleView';
import theme from '../theme/index';

const titleFont = {
    color: theme.header.foregroundColor,
    fontSize: theme.header.fontSize,
    fontWeight: theme.header.fontWeight,
};

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
                    marginLeft: 16,
                }}
            >
                {
                    headerTip ?
                        <TwinkleView iterations={4}>
                            <Text style={titleFont}>
                                单击标题返回顶部
                            </Text>
                        </TwinkleView> :
                        <Text style={titleFont}>
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
