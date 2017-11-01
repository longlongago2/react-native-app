import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import uuid from 'uuid/v4';
import Icon from 'react-native-vector-icons/Ionicons';
import styleModule from './BottomFuncBtnGroupStyle';

const styles = StyleSheet.create(styleModule);

const BottomFuncBtnGroup = ({ data }) => {
    if (Array.isArray(data) && data.length > 0) {
        return (
            <View style={styles.bottomBtnLayout}>
                {
                    data.map(item => (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            key={uuid()}
                            onPress={item.onPress}
                        >
                            <View style={styles.bottomBtn}>
                                <Icon
                                    name={item.icon}
                                    size={30}
                                    color="#ADADAD"
                                />
                                <Text
                                    style={{ fontSize: 10, lineHeight: 15 }}
                                >
                                    {item.text || '???'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        );
    }
    return null;
};
BottomFuncBtnGroup.propTypes = {
    data: PropTypes.array.isRequired,
};

export default BottomFuncBtnGroup;
