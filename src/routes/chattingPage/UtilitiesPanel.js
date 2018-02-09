import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import ScrollPagerAndroid from '../../components/ScrollPagerAndroid';
import Functions from './Functions';
import Emoji from './Emoji';

const UtilitiesPanel = ({ boardHeight, navigation }) => (
    <ScrollPagerAndroid
        boardHeight={boardHeight}
        items={[
            {
                key: 1,
                component: <Functions navigation={navigation} />,
            }, {
                key: 2,
                title: 'emoji',
                component: <Emoji />,
            }, {
                key: 3,
                title: '斗图',
                component: <Text>自定义表情</Text>,
            },
        ]}
    />
);
UtilitiesPanel.propTypes = {
    boardHeight: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default UtilitiesPanel;
