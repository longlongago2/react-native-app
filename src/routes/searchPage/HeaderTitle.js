import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import theme from '../../theme';

export default class HeaderRight extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={{ width: '100%' }}>
                <TextInput
                    autoFocus
                    placeholder="搜索服务平台"
                    placeholderTextColor="#cccccc"
                    numberOfLines={1}
                    underlineColorAndroid={theme.header.foregroundColor}
                    onSubmitEditing={() => alert('正在搜索')}
                />
            </View>
        );
    }
}
HeaderRight.propTypes = {};
