/** created by zhanqi on 2017-11-23 */
import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import deviceInfo from 'react-native-device-info';
import PropTypes from 'prop-types';

const InstructionBadge = ({ latestVersion }) => {
    if (deviceInfo.getVersion() < latestVersion) { // app当前版本小于服务器版本
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                    height: 15,
                    left: 10,
                    borderRadius: 15,
                    backgroundColor: 'red',
                }}
            >
                <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '500' }}>
                    new
                </Text>
            </View>
        );
    }
    return null;
};

InstructionBadge.propTypes = {
    latestVersion: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    latestVersion: state.instruction.latestVersion,
});

export default connect(mapStateToProps)(InstructionBadge);
