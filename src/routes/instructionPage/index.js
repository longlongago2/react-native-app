import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, SectionList } from 'react-native';
import { connect } from 'react-redux';
import deviceInfo from 'react-native-device-info';
import InstructionOption from './instructionListOption';
import ItemSeparator from '../../components/ItemSeparator';
import { fetchInstructionOptions } from '../../services/menuOptions';
import styleModule from './indexStyle';
import DownloadProgress from './DownloadProgress';

const styles = StyleSheet.create(styleModule);

class Instruction extends PureComponent {
    render() {
        const { dispatch, navigation, downloading } = this.props;
        const { state } = navigation;
        return (
            <View style={styles.container}>
                {
                    state.params && state.params.showDownloadComponent === true &&
                    <DownloadProgress
                        downloading={downloading}
                        text="正在下载"
                        dispatch={dispatch}
                        navigation={navigation}
                    />
                }
                <View style={styles.body}>
                    <View style={styles.logo}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={{ width: 50, height: 50, tintColor: '#E26F26' }}
                            resizeMethod="scale"
                        />
                        <Text style={styles.logoTitle}>
                            才丰服务平台 {deviceInfo.getVersion()}
                        </Text>
                    </View>
                    <SectionList
                        sections={fetchInstructionOptions()}
                        renderItem={({ item }) => (
                            <InstructionOption
                                item={item}
                                dispatch={dispatch}
                                navigation={navigation}
                            />
                        )}
                        ItemSeparatorComponent={() => (
                            <ItemSeparator
                                backgroundColor="#ffffff"
                                border={1}
                                lineColor="rgba(139,139,139,0.3)"
                                marginHorizontal={15}
                            />
                        )}
                        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>南京才丰软件技术开发有限公司 版权所有</Text>
                    <Text style={styles.footerText}>Copyright ©2016-2017 CAI FENG</Text>
                    <Text style={styles.footerText}>All rights reserved</Text>
                </View>
            </View>
        );
    }
}

Instruction.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    downloading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    ...state.instruction,
});

export default connect(mapStateToProps)(Instruction);
