/** created by zhangqi on 2017-1-23 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import theme from '../../theme';

const FriendListItem = ({ item, onItemPress }) => (
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
                <Image
                    style={{ width: 30, height: 30 }}
                    source={{ uri: 'http://192.168.1.101/CFSP/images/5c5d23266a09e368e5c594536dc9428ca.png' }}
                />
            </View>
            <View style={{
                flex: 8,
                flexDirection: 'row',
                justifyContent: 'flex-start',
            }}
            >
                <Text style={{ fontSize: 15 }}>{item.friendname}</Text>
            </View>
        </View>
    </RAFTouchableNativeFeedback>
);
FriendListItem.propTypes = {
    item: PropTypes.object.isRequired,
    onItemPress: PropTypes.func.isRequired,
};

export default FriendListItem;
