import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import RAFTouchableNativeFeedback from '../components/RAFTouchableNativeFeedback';
import styleModule from './SectionLineItemWithIconStyle';
import theme from '../theme';

const styles = StyleSheet.create(styleModule);

const SectionLineItemWithIcon = ({ item, onItemPress }) => (
    <RAFTouchableNativeFeedback
        backgroundColor={theme.rippleColor}
        onPress={() => onItemPress(item)}
    >
        <View style={styles.layout}>
            <View style={styles.icon}>
                {item.icon}
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>{item.text}</Text>
                {
                    item.showBadge && item.badge
                }
            </View>
        </View>
    </RAFTouchableNativeFeedback>
);
SectionLineItemWithIcon.propTypes = {
    item: PropTypes.shape({
        text: PropTypes.string.isRequired,
        showBadge: PropTypes.bool.isRequired,
        badge: PropTypes.element,
        icon: PropTypes.element.isRequired,
        redirect: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object,
        ]).isRequired,
        key: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
    }).isRequired,
    onItemPress: PropTypes.func.isRequired,
};

export default SectionLineItemWithIcon;
