import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Keyboard, Clipboard, StyleSheet, BackHandler } from 'react-native';
import { GiftedChat, Send, LoadEarlier, Actions, Composer, InputToolbar, Bubble } from 'react-native-gifted-chat';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/Feather';
import uuid from 'uuid/v4';
import moment from 'moment';
import ACTIONS from '../../models/actions';
import api from '../../utils/api';
import styleModule from './indexStyle';
import theme from '../../theme';
import UtilitiesPanel from './UtilitiesPanel';

const styles = StyleSheet.create(styleModule);

class ChattingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],      // 聊天数据：应该接入Redux
            inputText: '',     // 文本框内容
            messageType: '0',  // 消息类型（文本，语音...）
            utilities: false,  // 消息扩展功能栏显示状态 true:显示，false:隐藏
            actionBtn: true,   // 消息框扩展按钮状态 true:打开按钮，false:关闭按钮
            layoutHeight: 0,
            keyboardHeight: 0,
        };
        this.onLayout = this._onLayout.bind(this);
        this.onSend = this._onSend.bind(this);
        this.onPressAvatar = this._onPressAvatar.bind(this);
        this.onLongPress = this._onLongPress.bind(this);
        this.onPressPhoneNumber = this._onPressPhoneNumber.bind(this);
        this.onPressHashTag = this._onPressHashTag.bind(this);
        this.keyboardDidShow = this._keyboardDidShow.bind(this);
        this.keyboardDidHide = this._keyboardDidHide.bind(this);
        this.handleBackPress = this._handleBackPress.bind(this);
    }

    componentWillMount() {
        AndroidKeyboardAdjust.setAdjustResize();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentDidMount() {
        // test code ...
        this.setState({
            messages: [
                {
                    _id: uuid(),
                    text: 'Hello developer',
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    user: {
                        _id: 1,
                        name: 'React Native',
                        avatar: require('../../assets/avatar_default.png'),
                    },
                },
                {
                    _id: uuid(),
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    user: {
                        _id: 1,
                        name: 'React Native',
                        avatar: require('../../assets/avatar_default.png'),
                    },
                    image: 'http://192.168.1.101/CFSP/media/images/20171122/d6248a2a-75e6-4699-8649-243d9f9fdb06avatar.jpg',
                },
            ],
        });
    }

    componentWillUnmount() {
        const { dispatch, navigation } = this.props;
        const { state } = navigation;
        AndroidKeyboardAdjust.setAdjustPan();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        clearTimeout(this.timerFirstAction);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        // 清除徽章
        dispatch({
            type: ACTIONS.CHAT_LIST.UPDATE,
            payload: {
                item: {
                    unread: 0,
                },
                condition: {
                    topicId: state.params.userId,
                },
            },
        });
    }

    _handleBackPress() {
        const { utilities } = this.state;
        if (utilities) {
            AndroidKeyboardAdjust.setAdjustResize();
            this.setState({
                actionBtn: true,
                utilities: false,
            });
            return true;
        }
        return false;
    }

    _keyboardDidShow() {
        this.keyboardShow = true;
    }

    _keyboardDidHide() {
        this.keyboardShow = false;
    }

    _onSend(messages = []) {
        const { dispatch, navigation } = this.props;
        const { state } = navigation;
        const { inputText, messageType } = this.state;
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            messageType: '0',  // 消息类型：0文本
        }), () => {
            // 发送消息
            dispatch({
                type: ACTIONS.ACTIVE_MQ.REQUEST,
                payload: {
                    receiver: state.params.personName,
                    receiverId: state.params.userId,
                    type: state.params.type,        // 聊天类型
                    text: inputText,                // 消息体
                    portrayal: messageType,         // 消息体类型
                },
            });
            // 记录chatList
            dispatch({
                type: ACTIONS.CHAT_LIST.INSERT,
                payload: {
                    item: {
                        topicId: state.params.userId,
                        topicName: state.params.personName,
                        type: state.params.type,
                        newestMsg: inputText,
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    },
                },
            });
        });
    }

    _onPressAvatar(user) {
        const { dispatch, userInfo } = this.props;
        Keyboard.dismiss();
        if (user._id === userInfo.userid) {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: 'Profile',
            });
        } else {
            alert('暂不跳转');
        }
    }

    _onLongPress(context, message) {
        const { dispatch } = this.props;
        const options = [
            '复制文本',
            '搜索',
            '删除',
            '取消',
        ];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions(
            { options, cancelButtonIndex },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        Clipboard.setString(message.text);
                        break;
                    case 1:
                        dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'Search',
                            params: {
                                keyword: message.text.substring(0, 50),
                            },
                        });
                        break;
                    case 2:
                        const nextMessages = this.state.messages
                            .filter(item => item._id !== message._id);
                        this.setState({ messages: nextMessages });
                        // 删除本地数据库
                        // ...
                        break;
                    default:
                        break;
                }
            });
    }

    _onPressPhoneNumber(phone) {
        const options = ['呼叫', '短信', '复制号码', '取消'];
        const cancelButtonIndex = options.length - 1;
        this.giftedChat.getChildContext().actionSheet().showActionSheetWithOptions(
            { options, cancelButtonIndex },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        Communications.phonecall(phone, true);
                        break;
                    case 1:
                        Communications.text(phone);
                        break;
                    case 2:
                        Clipboard.setString(phone);
                        break;
                    default:
                        break;
                }
            },
        );
    }

    _onPressHashTag(hashTag) {
        const { dispatch } = this.props;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'Search',
            params: {
                keyword: hashTag.replace(/#/g, ''),
            },
        });
    }

    _onLayout(e) {
        const currentLayoutHeight = e.nativeEvent.layout.height;
        // 计算并赋值：键盘高度
        this.setState((prevState) => {
            const nextState = { layoutHeight: currentLayoutHeight };
            if (this.keyboardShow) {
                nextState.keyboardHeight = prevState.layoutHeight - currentLayoutHeight;
            }
            return nextState;
        });
    }

    render() {
        const { userInfo } = this.props;
        const { utilities, keyboardHeight, actionBtn } = this.state;
        const user = {
            _id: userInfo.userid,
            name: userInfo.username,
            avatar: `${api.database}/${userInfo.avatar}`,
        };
        const parsePatterns = linkStyle => [
            {
                type: 'phone',
                style: [linkStyle, styles.phone],
                onPress: this.onPressPhoneNumber,
            }, {
                pattern: /#(.+)#/,
                style: [linkStyle, styles.hashTag],
                onPress: this.onPressHashTag,
            },
        ];
        const actionPress = () => {
            if (actionBtn) {
                AndroidKeyboardAdjust.setAdjustNothing();
                this.setState({
                    utilities: true,
                    actionBtn: false,
                }, () => Keyboard.dismiss());
            } else {
                this.setState({ actionBtn: false }, () => {
                    this.giftedChat.focusTextInput();
                });
            }
        };
        const renderSend = props => (
            <Send {...props}>
                <View
                    style={{
                        flex: -1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#4C8CF5',
                        width: 50,
                        height: '100%',
                    }}
                >
                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>发送</Text>
                </View>
            </Send>
        );
        const renderLoadEarlier = props => (
            <LoadEarlier
                {...props}
                label="加载更早..."
            />
        );
        const renderActions = props => (
            <Actions
                {...props}
                containerStyle={{ elevation: 0 }}
                icon={() => (
                    <Icon
                        name="plus-circle"
                        size={26}
                        color={actionBtn ? theme.theme : '#87939A'}
                        style={actionBtn ? {} : { transform: [{ rotate: '45deg' }] }}
                    />
                )}
                onPressActionButton={() => {
                    if (keyboardHeight !== 0) {
                        actionPress();
                    } else {
                        this.giftedChat.focusTextInput();
                        this.timerFirstAction = setTimeout(() => {
                            actionPress();
                        }, 500);
                    }
                }}
            />
        );
        const renderComposer = props => (
            <Composer
                {...props}
                textInputProps={{
                    ...props.textInputProps,
                    selectionColor: theme.theme,
                    onBlur: () => {
                        if (this.state.actionBtn) {
                            AndroidKeyboardAdjust.setAdjustResize();
                            this.setState({ utilities: false });
                        }
                    },
                    onFocus: () => {
                        if (!this.state.actionBtn) {
                            this.setState({ actionBtn: true });
                        }
                    },
                }}
            />
        );
        const renderInputToolbar = props => (
            <InputToolbar
                {...props}
                containerStyle={{
                    borderTopWidth: 0,
                    elevation: 3,
                }}
            />
        );
        const renderBubble = props => (
            <Bubble
                {...props}
                containerStyle={{
                    right: { marginVertical: 5 },
                    left: { marginVertical: 5 },
                }}
            />
        );
        return (
            <View style={{ flex: 1 }} onLayout={this.onLayout}>
                <GiftedChat
                    ref={(component) => {
                        this.giftedChat = component;
                    }}
                    showUserAvatar
                    renderAvatarOnTop
                    loadEarlier
                    locale="zh-cn"
                    placeholder="输入消息..."
                    messages={this.state.messages}
                    user={user}
                    text={this.state.inputText}
                    onInputTextChanged={text => this.setState({ inputText: text })}
                    onSend={messages => this.onSend(messages)}
                    onPressAvatar={this.onPressAvatar}
                    onLongPress={this.onLongPress}
                    onLoadEarlier={() => alert('loading')}
                    isLoadingEarlier={false}
                    keyboardShouldPersistTaps="never"
                    renderSend={renderSend}
                    renderLoadEarlier={renderLoadEarlier}
                    renderActions={renderActions}
                    parsePatterns={parsePatterns}
                    renderInputToolbar={renderInputToolbar}
                    renderBubble={renderBubble}
                    renderComposer={renderComposer}
                />
                {
                    utilities &&
                    <UtilitiesPanel
                        boardHeight={keyboardHeight}
                    />
                }
            </View>
        );
    }
}

ChattingPage.propTypes = {
    navigation: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(ChattingPage);

