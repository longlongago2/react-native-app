import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import theme, { rgba } from '../../theme';

export default class HeaderRight extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        };
    }

    render() {
        return (
            <View style={{ width: '100%', paddingLeft: 10, paddingRight: 15 }}>
                <TextInput
                    autoFocus
                    placeholder=" 搜索服务平台 "
                    placeholderTextColor={rgba(theme.header.foregroundColor, 0.5)}
                    numberOfLines={1}
                    underlineColorAndroid={theme.header.foregroundColor}
                    onSubmitEditing={() => alert(`正在搜索：${this.state.searchText}`)}
                    onChangeText={text => this.setState({ searchText: text })}
                    maxLength={50}
                    selectionColor={theme.header.foregroundColor}
                    returnKeyType="search"
                    style={{ color: theme.header.foregroundColor }}
                />
            </View>
        );
    }
}
HeaderRight.propTypes = {};
