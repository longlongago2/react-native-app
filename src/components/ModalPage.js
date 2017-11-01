import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, TouchableNativeFeedback, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderTool from '../components/HeaderTool';
import theme from '../theme';

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
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        backgroundColor: 'rgb(255,255,255)',
                    }}
                >
                    <View
                        style={{
                            height: 60,
                            width: '100%',
                            flex: -1,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            backgroundColor: theme.header.backgroundColor,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                paddingHorizontal: 15,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: theme.header.foregroundColor,
                                }}
                            >
                                {title || '标题'}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: -1,
                                height: '100%',
                                width: 60,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <HeaderTool onPress={() => this.handleModalVisible(false)}>
                                <Icon
                                    name="md-close"
                                    size={22}
                                    color={theme.header.foregroundColor}
                                />
                            </HeaderTool>
                        </View>
                    </View>
                    <View
                        style={{
                            padding: 10,
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                        }}
                    >
                        {
                            Array.isArray(children) ?
                                children.map(item => item) :
                                children
                        }
                    </View>
                    {
                        onSubmit && <View
                            style={{
                                flex: -1,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'stretch',
                                alignSelf: 'stretch',
                                padding: 10,
                            }}
                        >
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
