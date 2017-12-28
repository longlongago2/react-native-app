import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Keyboard, Clipboard, StyleSheet } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';
import api from '../../utils/api';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

class ChattingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
        this.onSend = this._onSend.bind(this);
        this.onPressAvatar = this._onPressAvatar.bind(this);
        this.onLongPress = this._onLongPress.bind(this);
        this.onPressPhoneNumber = this._onPressPhoneNumber.bind(this);
        this.onPressHashTag = this._onPressHashTag.bind(this);
    }

    componentWillMount() {
        AndroidKeyboardAdjust.setAdjustResize();
    }

    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: require('../../assets/avatar_default.png'),
                    },
                },
            ],
        });
    }

    componentWillUnmount() {
        AndroidKeyboardAdjust.setAdjustPan();
    }

    _onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
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
        const options = ['呼叫', '短信', '取消'];
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
                    default:
                        break;
                }
            },
        );
    }

    _onPressHashTag(hashTag) {
        const { dispatch } = this.props;
        console.log(hashTag);
    }

    render() {
        const { userInfo } = this.props;
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
        return (
            <GiftedChat
                ref={(component) => {
                    this.giftedChat = component;
                }}
                locale="zh-cn"
                placeholder="输入信息..."
                messages={this.state.messages}
                user={{
                    _id: userInfo.userid,
                    avatar: `${api.database}/${userInfo.avatar}`,
                }}
                onSend={messages => this.onSend(messages)}
                onPressAvatar={this.onPressAvatar}
                onLongPress={this.onLongPress}
                showUserAvatar
                renderAvatarOnTop
                keyboardShouldPersistTaps="never"
                renderSend={renderSend}
                parsePatterns={linkStyle => [
                    {
                        type: 'phone',
                        style: [linkStyle, styles.phone],
                        onPress: this.onPressPhoneNumber,
                    }, {
                        pattern: /#(.+)#/,
                        style: [linkStyle, styles.hashTag],
                        onPress: this.onPressHashTag,
                    },
                ]}
            />
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

