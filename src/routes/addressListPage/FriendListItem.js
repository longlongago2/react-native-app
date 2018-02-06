/** created by zhangqi on 2017-1-23 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import theme from '../../theme';
import api from '../../utils/api';

const FriendListItem = ({ item, onItemPress }) => {
    const arr = Object.keys(item);
    if (arr.length !== 0) {
        return (
            <RAFTouchableNativeFeedback
                backgroundColor={theme.rippleColor}
                onPress={() => onItemPress(item)}
            >
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
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
                        <Text style={{ fontSize: 13 }}>{item.friendname}</Text>
                    </View>
                </View>
            </RAFTouchableNativeFeedback>
        );
    }
    return null;
};
FriendListItem.propTypes = {
    item: PropTypes.object.isRequired,
    onItemPress: PropTypes.func.isRequired,
};

export default FriendListItem;
