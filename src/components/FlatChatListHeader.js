import React from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import flatChatItemStyle from './FlatChatListItemStyle';

const styles = StyleSheet.create(flatChatItemStyle);

const FlatChatListHeader = ({ onPress, pressColor }) => (
    <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(pressColor, false)}
        onPress={onPress}
    >
        <View style={[styles.itemLayout, {
            height: 45,
            backgroundColor: '#FFEEEE',
        }]}
        >
            <View style={styles.itemSection1}>
                <Icon name="exclamation" size={30} color="#F64522" />
            </View>
            <View style={styles.itemSection2}>
                <Text>网络连接不可用</Text>
            </View>
            <View style={styles.itemSection3}>
                <Icon name="chevron-right" size={25} color="rgba(94, 94, 94, 0.5)" />
            </View>
        </View>
    </TouchableNativeFeedback>
);

FlatChatListHeader.propTypes = {
    onPress: PropTypes.func.isRequired,
    pressColor: PropTypes.string.isRequired,
};

export default FlatChatListHeader;
