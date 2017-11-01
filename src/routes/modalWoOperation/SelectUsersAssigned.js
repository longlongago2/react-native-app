/**
 * created by zhangqi on 2017-9-27
 * */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

class SelectUsersAssigned extends Component {
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
        const { assignedUsersList, navigation } = this.props;
        const { setParams } = navigation;
        return (
            <View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.rippleColor)}
                    onPress={() =>
                        this.setState({ modalVisible: true, menuVisible: true })
                    }
                >
                    <View style={styles.reviewLabel}>
                        <Text>指派给</Text>
                        <Text>{navigation.state.params.assignedPersonName}</Text>
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
                                    Array.isArray(assignedUsersList) && assignedUsersList.length > 0 &&
                                    assignedUsersList.map(item => (
                                        <MenuOption
                                            key={`${item.userid}`}
                                            onSelect={() => {
                                                setParams({ assignedPersonName: item.personname, assignedUser: item.username, assignedUserId: item.userid });
                                                this.setState({ menuVisible: false });
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={styles.selectOptionsText}
                                            >
                                                {item.personname}
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

SelectUsersAssigned.propTypes = {
    assignedUsersList: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    assignedUsersList: state.userGroup.assignedUsersList,
});

export default connect(mapStateToProps)(SelectUsersAssigned);
