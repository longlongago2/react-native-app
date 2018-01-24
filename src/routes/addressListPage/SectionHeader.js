/** created by zhangqi on 2018-1-23 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import RAFTouchableNativeFeedback from '../../components/RAFTouchableNativeFeedback';
import theme from '../../theme';

const SectionHeader = ({ item, onItemPress }) => {
    return (
        <RAFTouchableNativeFeedback
            backgroundColor={theme.rippleColor}
            onPress={() => onItemPress(item)}
        >
            <View style={{
                backgroundColor: '#ffffff',
                flex: 1,
                flexDirection: 'row',
                height: 30,
                padding: 5,
            }}
            >
                <View style={{
                    flex: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                >
                    <Text>{item.friendgroupsname}</Text>
                </View>
            </View>
        </RAFTouchableNativeFeedback>
    );
};
SectionHeader.propTypes = {
    item: PropTypes.object.isRequired,
    onItemPress: PropTypes.func.isRequired,
};

export default SectionHeader;
