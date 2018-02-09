import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import ScrollPagerAndroid from '../../components/ScrollPagerAndroid';
import Functions from './Functions';
import Emoji from './Emoji';

const UtilitiesPanel = ({ boardHeight }) => (
    <ScrollPagerAndroid
        boardHeight={boardHeight}
        items={[
            {
                key: 1,
                component: <Functions />,
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
};

export default UtilitiesPanel;
