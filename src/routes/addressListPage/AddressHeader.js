/** 通讯录头部 */
/** created by zhangqi on 2017-1-24 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import theme from '../../theme';

const AddressHeader = ({ item, onItemPress }) => (
    <RAFTouchableNativeFeedback
        backgroundColor={theme.rippleColor}
        onPress={() => onItemPress(item)}
    >
        <View style={{
            backgroundColor: '#ffffff',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
        }}
        >
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                { item.icon }
            </View>
            <View style={{
                flex: 8,
                flexDirection: 'row',
                justifyContent: 'flex-start',
            }}
            >
                <Text style={{ fontSize: 15 }}>{item.text}</Text>
            </View>
        </View>
    </RAFTouchableNativeFeedback>
);
AddressHeader.propTypes = {
    item: PropTypes.object.isRequired,
    onItemPress: PropTypes.func.isRequired,
};

export default AddressHeader;
