import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, StyleSheet } from 'react-native';
import RAFTouchableNativeFeedback from '../components/RAFTouchableNativeFeedback';
import api from '../utils/api';
import styleModule from './SectionLineItemWithTitleStyle';
import theme from '../theme';

const styles = StyleSheet.create(styleModule);

const SectionLineItemWithTitle = ({ item, onItemPress }) => (
    <RAFTouchableNativeFeedback
        backgroundColor={theme.rippleColor}
        onPress={() => onItemPress(item)}
    >
        <View style={styles.layout}>
            <View style={styles.title}>
                <Text style={styles.titleText}>{item.title}</Text>
            </View>
            <View style={styles.content}>
                {
                    item.show === 'image' &&
                    <View style={{ padding: 10 }}>
                        {
                            item.image ?
                                <Image
                                    source={{ uri: `${api.database}/${item.image}` }}
                                    style={styles.image}
                                /> :
                                <Image
                                    source={require('../assets/avatar_default.png')}
                                    style={styles.image}
                                />
                        }
                    </View>
                }
                {
                    item.show === 'text' &&
                    <Text style={styles.contentText}>{item.text}</Text>
                }
            </View>
        </View>
    </RAFTouchableNativeFeedback>
);
SectionLineItemWithTitle.propTypes = {
    item: PropTypes.object.isRequired,
    onItemPress: PropTypes.func.isRequired,
};

export default SectionLineItemWithTitle;
