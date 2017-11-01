/** created by zhangqi on 2017/8/24  * */
import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../../theme/default';

class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = { oldPwd: '', newPwd: '', confirmNewPwd: '' };
    }

    render() {
        const { setParams, state } = this.props.navigation;
        const commonTextInput = {
            placeholderTextColor: '#BEBEBE',
            secureTextEntry: true,
            underlineColorAndroid: theme.theme,
            keyboardType: 'default',
            maxLength: 18,
        };
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}
            >
                <TextInput
                    style={{ height: 50, width: '100%' }}
                    onChangeText={(oldPwd) => {
                        this.setState({ oldPwd });
                        setParams({ item: { ...state.params.item, oldPwd } });
                    }}
                    placeholder={'原密码'}
                    autoFocus
                    {...commonTextInput}
                />
                <TextInput
                    style={{ height: 50, width: '100%' }}
                    onChangeText={(newPwd) => {
                        this.setState({ newPwd });
                        setParams({ item: { ...state.params.item, newPwd } });
                    }}
                    placeholder={'新密码'}
                    {...commonTextInput}
                />
                <TextInput
                    style={{ height: 50, width: '100%' }}
                    onChangeText={(confirmNewPwd) => {
                        this.setState({ confirmNewPwd });
                        setParams({ item: { ...state.params.item, confirmNewPwd } });
                    }}
                    placeholder={'确认新密码'}
                    {...commonTextInput}
                />
                <View style={{ marginTop: 10 }}>
                    <Text>温馨提示：密码必须由6-18位的字母、数字、下划线组成</Text>
                </View>
            </View>
        );
    }
}

UpdatePassword.propTypes = {
    navigation: PropTypes.object.isRequired,
};
export default UpdatePassword;

