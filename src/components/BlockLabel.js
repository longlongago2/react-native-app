import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableNativeFeedback, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

const BlockLabel = ({ data, onDelete, itemMap }) => {
    if (Array.isArray(data) && data.length > 0) {
        return (
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
            >
                {
                    data.map(item => (
                        <View
                            key={item[itemMap.value]}
                            style={{
                                width: 80,
                                height: 30,
                                flex: -1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#4C8BF5',
                                borderBottomRightRadius: 15,
                                borderTopRightRadius: 15,
                                borderBottomLeftRadius: 5,
                                borderTopLeftRadius: 5,
                                marginHorizontal: 5,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: '#ffffff',
                                    fontSize: 12,
                                    paddingHorizontal: 5,
                                    width: 50,
                                }}
                            >
                                {item[itemMap.label]}
                            </Text>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple('#ffffff')}
                                onPress={() => onDelete(item)}
                            >
                                <View
                                    style={{
                                        width: 30,
                                        height: 30,
                                        flex: -1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderBottomRightRadius: 15,
                                        borderTopRightRadius: 15,
                                        backgroundColor: '#DD4E42',
                                    }}
                                >
                                    <Icon name="close" size={15} color="#ffffff" />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    ))
                }
            </ScrollView>
        );
    }
    return null;
};

BlockLabel.propTypes = {
    data: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    itemMap: PropTypes.shape(
        {
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        },
    ).isRequired,
};

export default BlockLabel;
