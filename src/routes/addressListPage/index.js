import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import addressStyle from './indexStyle';

const styles = StyleSheet.create(addressStyle);

class AddressListPage extends Component {
    render() {
        const { state } = this.props.navigation;
        // state 内容存放 路由参数
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    通讯录
                </Text>
            </View>
        );
    }
}
AddressListPage.propTypes = {
    navigation: PropTypes.object.isRequired,
};
export default connect()(AddressListPage);
