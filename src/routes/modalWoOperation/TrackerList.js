/**
 * created by zhangqi on 2017-09-26
 * */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
    ScrollView,
    Modal,
    ActivityIndicator,
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
import BlockLabel from '../../components/BlockLabel';
import styleModule from './indexStyle';
import theme from '../../theme';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(styleModule);

class TrackerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            menuVisible: false,
        };
        this.handleTrackerSelect = this._handleTrackerSelect.bind(this);
        this.handleTrackerRemove = this._handleTrackerRemove.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerModal);
        cancelAnimationFrame(this.timerTrakerSelect);
        cancelAnimationFrame(this.timerTrakerRemove);
    }

    _handleTrackerSelect(item) {
        const { navigation } = this.props;
        this.timerTrakerSelect = requestAnimationFrame(() => {
            const { state, setParams } = navigation;
            const preTrackerList = (state.params && state.params.trackerList) || [];
            const repeat = preTrackerList.filter(preItem => preItem.followUserId === item.id)
                .length > 0; // 防止数组元素重复添加
            if (!repeat) {
                preTrackerList.push({
                    followPersonName: item.name,
                    followUserId: item.id,
                });
            }
            setParams({
                trackerList: preTrackerList,
            });
        });
    }

    _handleTrackerRemove(params) {
        const { navigation } = this.props;
        this.timerTrakerRemove = requestAnimationFrame(() => {
            const { state, setParams } = navigation;
            const preTrackerList = (state.params && state.params.trackerList) || [];
            setParams({
                trackerList: preTrackerList.filter(item =>
                    item.followUserId !== params.followUserId),
            });
        });
    }

    render() {
        const { modalVisible, menuVisible } = this.state;
        const { userGroupList, dispatch, usersList, userGroupLoading, navigation } = this.props;
        const { state } = navigation;
        return (
            <View>
                <View style={styles.reviewLabel}>
                    <Text>跟踪者</Text>
                    {
                        state.params &&
                        Array.isArray(state.params.trackerList) &&
                        state.params.trackerList.length > 0 &&
                        <BlockLabel
                            data={state.params.trackerList}
                            onDelete={this.handleTrackerRemove}
                            itemMap={{ value: 'followUserId', label: 'followPersonName' }}
                        />
                    }
                    {
                        userGroupLoading ?
                            <ActivityIndicator animating color="red" size={20} />
                            :
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({ modalVisible: true, menuVisible: true })
                                }
                            >
                                <Icon
                                    size={30}
                                    name="plus"
                                    color={theme.theme}
                                />
                            </TouchableOpacity>
                    }
                </View>
                <View style={styles.reviewUserList}>
                    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                        {
                            Array.isArray(usersList) && usersList.length > 0 ?
                                usersList.map((item, i) => (
                                    <TouchableNativeFeedback
                                        key={item.id}
                                        onPress={() => this.handleTrackerSelect(item)}
                                    >
                                        <View style={styles.reviewUserListOption}>
                                            <Text>{item.name}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                )) :
                                <View style={styles.reviewUserListNoData}>
                                    <Icon
                                        size={25}
                                        name="exclamation"
                                        color="red"
                                    />
                                    <Text> 没有数据，请点击 </Text>
                                    <Icon
                                        size={25}
                                        name="plus"
                                        color={theme.theme}
                                    />
                                    <Text> 选择用户组 </Text>
                                </View>
                        }
                    </ScrollView>
                </View>
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
                                this.timerModal = requestAnimationFrame(() =>
                                    this.setState({ modalVisible: false }),
                                );
                            }}
                        >
                            <MenuTrigger />
                            <MenuOptions
                                renderOptionsContainer={options => (
                                    <View>
                                        <Text style={styles.selectOptionsTitle}>用户组</Text>
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {options}
                                        </ScrollView>
                                    </View>
                                )}
                            >
                                {
                                    Array.isArray(userGroupList) && userGroupList.length > 0 &&
                                    userGroupList.map(item => (
                                        <MenuOption
                                            key={`${item.id}`}
                                            onSelect={() => {
                                                dispatch({
                                                    type: ACTIONS.USERGROUP_DETAIL.REQUEST,
                                                    payload: {
                                                        groupId: item.id,
                                                    },
                                                });
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

TrackerList.propTypes = {
    userGroupList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    usersList: PropTypes.array.isRequired,
    userGroupLoading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    userGroupLoading: state.userGroup.loading,        // 查询用户组用户正在加载
    userGroupList: state.userGroup.userGroupList,     // 用户组列表
    usersList: state.userGroup.usersList,             // 用户组下所有用户
});

export default connect(mapStateToProps)(TrackerList);

