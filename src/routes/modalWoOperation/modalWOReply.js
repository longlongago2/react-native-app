import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmojiPicker from 'react-native-emoji-picker-panel';
import theme from '../../theme';
import ACTIONS from '../../models/actions';

export default class ModalWOReply extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showEmojiPanel: false,
            replyInfo: '',
        };
        this.handleModalVisible = this._handleModalVisible.bind(this);
        this.handleCloseEmojiPanel = () => this.setState({ showEmojiPanel: false });
        this.handleOpenEmojiPanel = () => this.setState({ showEmojiPanel: true });
        this.handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerVisible);
    }

    _handleModalVisible(visible) {
        const { setParams } = this.props.navigation;
        this.timerVisible = requestAnimationFrame(() => {
            setParams({ modalVisible: visible });
            if (!visible) {
                this.setState({ replyInfo: '', showEmojiPanel: false });
            }
        });
    }

    _handleSubmit() {
        const { dispatch, workOrderDetail, userid } = this.props;
        const { replyInfo } = this.state;
        if (replyInfo.trim() !== '') {
            this.handleModalVisible(false);
            dispatch({
                type: ACTIONS.WORKORDER_REPLY.INSERT,
                payload: {
                    workordercode: workOrderDetail.ordercode,
                    replyinfo: replyInfo,
                    repler: userid,
                    isinside: 0,
                },
            });
        } else {
            ToastAndroid.show('消息框内容为空！', 3000);
        }
    }

    render() {
        const { navigation } = this.props;
        const { state } = navigation;
        const { showEmojiPanel, replyInfo } = this.state;
        // 使用 TouchableWithoutFeedback 模拟点击其他区域关闭 modal
        return (
            <Modal
                animationType="fade"
                transparent
                visible={(state.params && state.params.modalVisible) || false}
                onRequestClose={() => this.handleModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => this.handleModalVisible(false)}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            alignItems: 'stretch',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                    />
                </TouchableWithoutFeedback>
                {
                    state.params && state.params.modalVisible &&
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            backgroundColor: '#ffffff',
                            flex: -1,
                            width: '100%',
                            height: 'auto',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flex: -1,
                                width: '100%',
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                paddingHorizontal: 5,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={(_ref) => {
                                        this.textInput = _ref;
                                    }}
                                    autoFocus
                                    multiline
                                    underlineColorAndroid={theme.theme}
                                    placeholder="输入内容"
                                    placeholderTextColor="#cccccc"
                                    selectionColor={theme.theme}
                                    style={{ color: '#6B6B6B', paddingHorizontal: 10 }}
                                    onFocus={this.handleCloseEmojiPanel}
                                    value={replyInfo}
                                    onChangeText={text => this.setState({ replyInfo: text })}
                                />
                            </View>
                            <View
                                style={{
                                    flex: -1,
                                    width: 30,
                                    height: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {
                                    showEmojiPanel ?
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.handleCloseEmojiPanel();
                                                this.textInput.focus();
                                            }}
                                        >
                                            <Icon name="keyboard-o" size={20} color="#6B6B6B" />
                                        </TouchableWithoutFeedback> :
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                this.handleOpenEmojiPanel();
                                                Keyboard.dismiss();
                                            }}
                                        >
                                            <Icon name="smile-o" size={25} color="#6B6B6B" />
                                        </TouchableWithoutFeedback>
                                }
                            </View>
                            <View
                                style={{
                                    flex: -1,
                                    width: 45,
                                    height: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.theme,
                                        fontSize: 15,
                                    }}
                                    onPress={this.handleSubmit}
                                >
                                    发送
                                </Text>
                            </View>
                        </View>
                        <EmojiPicker
                            style={{
                                flex: -1,
                                width: '100%',
                                height: 200,
                                backgroundColor: '#ffffff',
                            }}
                            visible={showEmojiPanel}
                            onEmojiSelected={(emoji) => {
                                this.setState({
                                    replyInfo: `${replyInfo}${emoji}`,
                                });
                            }}
                        />
                    </View>
                }
            </Modal>
        );
    }
}

ModalWOReply.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    userid: PropTypes.number.isRequired,
};
