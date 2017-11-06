import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderTool from '../components/HeaderTool';
import theme from '../theme';
import styleModule from './ModalPageStyle';

const styles = StyleSheet.create(styleModule);

export default class ModalFilter extends PureComponent {
    constructor(props) {
        super(props);
        this.handleModalVisible = this._handleModalVisible.bind(this);
        this.handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerVisible);
    }

    _handleModalVisible(visible) {
        const { setParams } = this.props.navigation;
        this.timerVisible = requestAnimationFrame(() => {
            setParams({ modalVisible: visible });
        });
    }

    _handleSubmit() {
        const { onSubmit } = this.props;
        if (onSubmit) onSubmit(this.handleModalVisible);
    }

    render() {
        const { title, children, onSubmit } = this.props;
        const { state } = this.props.navigation;
        return (
            <Modal
                animationType="slide"
                transparent
                visible={(state.params && state.params.modalVisible) || false}
                onRequestClose={() => this.handleModalVisible(false)}
            >
                <View style={styles.layout}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitleText} numberOfLines={1}>
                                {title || '标题'}
                            </Text>
                        </View>
                        <View style={styles.headerRightContainer}>
                            <HeaderTool onPress={() => this.handleModalVisible(false)}>
                                <Icon
                                    name="md-close"
                                    size={22}
                                    color={theme.header.foregroundColor}
                                />
                            </HeaderTool>
                        </View>
                    </View>
                    <View style={styles.bodyContainer}>
                        {
                            Array.isArray(children) ?
                                children.map(item => item) :
                                children
                        }
                    </View>
                    {
                        onSubmit &&
                        <View style={styles.footerContainer}>
                            <Button
                                onPress={this.handleSubmit}
                                title="确定"
                                color={theme.theme}
                            />
                        </View>
                    }
                </View>
            </Modal>
        );
    }
}

ModalFilter.propTypes = {
    navigation: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
