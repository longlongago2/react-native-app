/** created by zhangqi on 2017-1-23 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import theme from '../../theme';
import api from '../../utils/api';

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
        }}
        >
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
            }}
            >
                {
                    item.avatar ?
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={{ uri: `${api.database}/${item.avatar}` }}
                        /> :
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../assets/avatar_default.png')}
                        />
                }
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
