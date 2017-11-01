/**
 * created by zhangqi on 2017-9-30
 * */
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
import theme from '../../theme';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

class SelectPriority extends Component {
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
        const { modalVisible, menuVisible } = this.state;
        const { navigation } = this.props;
        const { setParams } = navigation;
        const priorityList = navigation.state.params.priorityList;
        return (
            <View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.rippleColor)}
                    onPress={() =>
                        this.setState({ modalVisible: true, menuVisible: true })
                    }
                >
                    <View style={styles.reviewLabel}>
                        <Text>优先级</Text>
                        <Text>{navigation.state.params.priorityName}</Text>
                        <Icon
                            name="chevron-right"
                            size={25}
                            color={theme.header.foregroundColor}
                        />
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
                                        <Text style={styles.selectOptionsTitle}>指派给</Text>
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {options}
                                        </ScrollView>
                                    </View>
                                )}
                            >
                                {
                                    Array.isArray(priorityList) && priorityList.length > 0 &&
                                    priorityList.map(item => (
                                        <MenuOption
                                            key={`${item.id}`}
                                            onSelect={() => {
                                                setParams({ priorityName: item.name, priorityId: item.id });
                                                this.setState({ menuVisible: false });
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={styles.selectOptionsText}
                                            >
                                                {item.name}
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

SelectPriority.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default SelectPriority;

