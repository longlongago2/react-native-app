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

export default class WoProductSelect extends Component {
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
        const { woProductItems, navigation, workOrderDetail, dispatch } = this.props;
        const { state, setParams } = navigation;
        const { modalVisible, menuVisible } = this.state;
        return (
            <View>
                <TouchableNativeFeedback
                    onPress={() =>
                        this.setState({ modalVisible: true, menuVisible: true })
                    }
                >
                    <View style={styles.contentOption}>
                        <View style={styles.contentLabel}>
                            <Text>所述产品<Text style={{ color: 'red' }}>
                                *</Text></Text>
                        </View>
                        <View style={styles.contentSelect}>
                            <View style={styles.selectTextLayout}>
                                <Text style={styles.selectText}>
                                    {
                                        (state.params && state.params.dataFilling) ?
                                            workOrderDetail.productname : (
                                                state.params &&
                                                state.params.woProduct &&
                                                state.params.woProduct.label
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
                                        <Text style={styles.selectOptionsTitle}>所述产品</Text>
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {options}
                                        </ScrollView>
                                    </View>
                                )}
                            >
                                {
                                    Array.isArray(woProductItems) && woProductItems.length > 0 &&
                                    woProductItems.map(item => (
                                        <MenuOption
                                            key={`${item.productcode}`}
                                            onSelect={() => {
                                                if (state.params && state.params.dataFilling) {
                                                    dispatch({
                                                        type: ACTIONS.WORKORDER_DETAIL.UPDATE,
                                                        payload: {
                                                            workOrderDetail: {
                                                                productname: item.productname,
                                                                productid: item.productcode,
                                                            },
                                                        },
                                                    });
                                                } else {
                                                    setParams({
                                                        woProduct: {
                                                            label: item.productname,
                                                            value: item.productcode,
                                                        },
                                                    });
                                                }
                                                this.setState({ menuVisible: false });
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={styles.selectOptionsText}
                                            >
                                                {item.productname}
                                            </Text>
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

WoProductSelect.propTypes = {
    woProductItems: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
