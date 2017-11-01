import React from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import TabBarBadgeWithIcon from '../components/TabBarBadgeWithIcon';
import flatChatItemStyle from './FlatChatListItemStyle';

const styles = StyleSheet.create(flatChatItemStyle);

const FlatChatListHeader = ({ onPress, sysList, pressColor }) => (
    <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(pressColor, false)}
        onPress={onPress}
    >
        <View style={[styles.itemLayout, {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: 'rgb(233, 233, 239)',
        }]}
        >
            <View style={styles.itemSection1}>
                <TabBarBadgeWithIcon
                    component="image"
                    image={require('../assets/broadcast.png')}
                    imageStyle={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: '#ffffff',
                    }}
                    badge={sysList.length}
                    display="dot"
                />
            </View>
            <View style={styles.itemSection2}>
                <Text>{sysList.length > 0 ? `广播消息(${sysList.length})` : '广播消息'}</Text>
            </View>
            <View style={styles.itemSection3}>
                <Icon name="chevron-right" size={25} color="rgba(94, 94, 94, 0.5)" />
            </View>
        </View>
    </TouchableNativeFeedback>
);

FlatChatListHeader.propTypes = {
    onPress: PropTypes.func.isRequired,
    sysList: PropTypes.array.isRequired,
    pressColor: PropTypes.string.isRequired,
};

export default FlatChatListHeader;
