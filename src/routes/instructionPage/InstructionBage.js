/** created by zhanqi on 2017-11-23 */
import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import deviceInfo from 'react-native-device-info';
import PropTypes from 'prop-types';

const InstructionBage = ({ latestVersion }) => {
    if (deviceInfo.getVersion() < latestVersion) { // app当前版本小于服务器版本
        return (
            <View style={{
                width: 30,
                height: 15,
                left: 10,
                borderRadius: 15,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Text style={{ color: '#ffffff', fontSize: 10 }}>
                    new
                </Text>
            </View>
        );
    }
    return null;
};

InstructionBage.propTypes = {
    latestVersion: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    latestVersion: state.instruction.latestVersion,
});

export default connect(mapStateToProps)(InstructionBage);
