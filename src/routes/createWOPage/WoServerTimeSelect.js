import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableNativeFeedback,
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuContext,
    renderers,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/EvilIcons';
import ACTIONS from '../../models/actions';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

export default class WoServerTimeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            menuVisible: false,
        };
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timer);
    }

    render() {
        const { woServerTimeItems, navigation, workOrderDetail, dispatch } = this.props;
        const { state, setParams } = navigation;
        const { modalVisible, menuVisible } = this.state;

        function modification(code) {
            switch (code) {
                case '1':
                    return '当天';
                case '2':
                    return '3日内';
                case '3':
                    return '一周内';
                case '4':
                    return '一周以后';
                default:
                    return '';
            }
        }

        return (
            <View>
                <TouchableNativeFeedback
                    onPress={() =>
                        this.setState({ modalVisible: true, menuVisible: true })
                    }
                >
                    <View style={styles.contentOption}>
                        <View style={styles.contentLabel}>
                            <Text>期望服务时间</Text>
                        </View>
                        <View style={styles.contentSelect}>
                            <View style={styles.selectTextLayout}>
                                <Text style={styles.selectText}>
                                    {
                                        (state.params && state.params.dataFilling) ?
                                            modification(workOrderDetail.servertime) : (
                                                state.params &&
                                                state.params.woServerTime &&
                                                state.params.woServerTime.label
                                            )
                                    }
                                </Text>
                            </View>
                            <View style={styles.selectIconLayout}>
                                <Icon
                                    name="chevron-right"
                                    size={25}
                                    color="rgba(94, 94, 94, 0.5)"
                                />
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => this.setState({ menuVisible: false })}
                >
                    <MenuContext
                        style={{
                            flexDirection: 'column',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <Menu
                            renderer={renderers.SlideInMenu}
                            opened={menuVisible}
                            onBackdropPress={() => this.setState({ menuVisible: false })}
                            onClose={() => {
                                this.timer = requestAnimationFrame(() =>
                                    this.setState({ modalVisible: false }),
                                );
                            }}
                        >
                            <MenuTrigger />
                            <MenuOptions
                                renderOptionsContainer={options => (
                                    <View>
                                        <Text style={styles.selectOptionsTitle}>期望服务时间</Text>
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {options}
                                        </ScrollView>
                                    </View>
                                )}
                            >
                                {
                                    Array.isArray(woServerTimeItems) &&
                                    woServerTimeItems.length > 0 &&
                                    woServerTimeItems.map(item => (
                                        <MenuOption
                                            key={item.value}
                                            onSelect={() => {
                                                if (state.params && state.params.dataFilling) {
                                                    dispatch({
                                                        type: ACTIONS.WORKORDER_DETAIL.UPDATE,
                                                        payload: {
                                                            workOrderDetail: {
                                                                servertime: item.value,
                                                            },
                                                        },
                                                    });
                                                } else {
                                                    setParams({
                                                        woServerTime: {
                                                            label: item.label,
                                                            value: item.value,
                                                        },
                                                    });
                                                }
                                                this.setState({ menuVisible: false });
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={styles.selectOptionsText}
                                            >{item.label}</Text>
                                        </MenuOption>
                                    ))
                                }
                            </MenuOptions>
                        </Menu>
                    </MenuContext>
                </Modal>
            </View>
        );
    }
}
WoServerTimeSelect.propTypes = {
    woServerTimeItems: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
