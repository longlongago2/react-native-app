import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';
import emoji from 'node-emoji';

export default class Emoji extends PureComponent {
    render() {
        return (
            <View><Text style={{ fontSize: 20 }}>{emoji.emojify('I :heart: :coffee:!')}</Text></View>
        );
    }
}
Emoji.propTypes = {};
