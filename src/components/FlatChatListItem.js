import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    TouchableNativeFeedback,
    Text,
    View,
    StyleSheet,
    Image,
    Modal,
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuContext,
    renderers,
} from 'react-native-popup-menu';
import moment from 'moment';
import 'moment/locale/zh-cn';
import flatChatItemStyle from './FlatChatListItemStyle';

const styles = StyleSheet.create(flatChatItemStyle);
const { SlideInMenu } = renderers;

class FlatChatListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            popupVisible: false,
        };
        this.handleLongPress = this._handleLongPress.bind(this);
        this.handleHidePopupMenu = this._handleHidePopupMenu.bind(this);
        this.handleMarkRead = this._handleMarkRead.bind(this);
        this.handleMarkAllRead = this._handleMarkAllRead.bind(this);
        this.handleClear = this._handleClear.bind(this);
        this.handleClearAll = this._handleClearAll.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timer);
    }

    _handleLongPress() {
        this.setState({ modalVisible: true, popupVisible: true });
    }

    _handleHidePopupMenu() {
        this.setState({ popupVisible: false });
    }

    _handleMarkRead() {
        const { onClearBadge, item } = this.props;
        this.handleHidePopupMenu();
        onClearBadge(item);
    }

    _handleMarkAllRead() {
        const { onAllClearBadge } = this.props;
        this.handleHidePopupMenu();
        onAllClearBadge();
    }

    _handleClear() {
        const { onDelete, item } = this.props;
        this.handleHidePopupMenu();
        // 防止在动画阶段卸载父组件
        setTimeout(() => onDelete(item), 500);
    }

    _handleClearAll() {
        const { onAllDelete } = this.props;
        this.handleHidePopupMenu();
        setTimeout(() => onAllDelete(), 500);
    }

    render() {
        const { modalVisible, popupVisible } = this.state;
        const { item, itemMap, pressColor, onPress } = this.props;
        return (
            <View style={{ backgroundColor: '#ffffff' }}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(pressColor, false)}
                    onPress={() => onPress(item)}
                    onLongPress={this.handleLongPress}
                >
                    <View style={styles.itemLayout}>
                        <View style={styles.itemSection1}>
                            <View>
                                <View
                                    style={[
                                        styles.itemBadge, item[itemMap.badge] > 0 ? null : { display: 'none' },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 10,
                                        }}
                                    >
                                        {item[itemMap.badge] > 99 ? '99+' : item[itemMap.badge]}
                                    </Text>
                                </View>
                                <View>
                                    {
                                        item[itemMap.avatar] ?
                                            <Image
                                                source={{ uri: item[itemMap.avatar] }}
                                                style={styles.itemAvatar}
                                            /> :
                                            <Image
                                                source={require('../assets/avatar_default.png')}
                                                style={styles.itemDefaultAvatar}
                                            />
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={styles.itemSection2}>
                            <View>
                                <Text style={styles.itemText} numberOfLines={1}>
                                    {item[itemMap.title]}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.itemSubText} numberOfLines={1}>
                                    {item[itemMap.subtitle]}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemSection3}>
                            <View>
                                <Text style={{ fontSize: 11, color: '#AAAAAA' }}>
                                    {(() => {
                                        const nowDate = moment().format('YYYY-MM-DD');
                                        const flagDate = moment(item[itemMap.date]).format('YYYY-MM-DD');
                                        const diff = moment(nowDate).diff(moment(flagDate), 'days');
                                        let time;
                                        if (diff === 0) {
                                            time = moment(item[itemMap.date]).format('HH:mm');
                                        }
                                        if (diff >= 1 && diff < 2) {
                                            time = '昨天';
                                        }
                                        if (diff >= 2) {
                                            time = moment(item[itemMap.date]).format('MMMDo');
                                        }
                                        return time;
                                    })()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={this.handleHidePopupMenu}
                >
                    <MenuContext style={styles.modalContainer}>
                        <Menu
                            opened={popupVisible}
                            renderer={SlideInMenu}
                            onBackdropPress={this.handleHidePopupMenu}
                            onClose={() => {
                                this.timer = requestAnimationFrame(() =>
                                    this.setState({ modalVisible: false }),
                                );
                            }}
                        >
                            <MenuTrigger style={styles.popupMenuTrigger}>
                                <Text numberOfLines={1} style={styles.MenuTriggerText}>
                                    {item[itemMap.title].slice(-2)}
                                </Text>
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption
                                    onSelect={this.handleMarkRead}
                                    disabled={item.unread === 0}
                                >
                                    <Text
                                        style={[styles.popupMenuOption, item.unread === 0 && { color: '#cccccc' }]}
                                    >
                                        标记为已读
                                    </Text>
                                </MenuOption>
                                <MenuOption onSelect={this.handleMarkAllRead}>
                                    <Text style={styles.popupMenuOption}>
                                        全部标记已读
                                    </Text>
                                </MenuOption>
                                <MenuOption onSelect={this.handleClear}>
                                    <Text style={styles.popupMenuOption}>
                                        删除此聊天
                                    </Text>
                                </MenuOption>
                                <MenuOption onSelect={this.handleClearAll}>
                                    <Text style={styles.popupMenuOption}>
                                        删除所有聊天
                                    </Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </MenuContext>
                </Modal>
            </View>
        );
    }
}

FlatChatListItem.propTypes = {
    item: PropTypes.object.isRequired,
    itemMap: PropTypes.shape({                  // 匹配item数据
        title: PropTypes.string.isRequired,     // 标题使用的字段名称
        subtitle: PropTypes.string,             // 副标题使用的字段
        avatar: PropTypes.string,               // 头像使用的字段
        badge: PropTypes.string,                // 徽章使用的字段
        date: PropTypes.string.isRequired,      // 日期使用的字段
    }).isRequired,
    onPress: PropTypes.func.isRequired,         // 按压事件
    onDelete: PropTypes.func.isRequired,        // 删除事件
    onAllDelete: PropTypes.func.isRequired,     // 删除所有
    onClearBadge: PropTypes.func.isRequired,    // 清除徽章
    onAllClearBadge: PropTypes.func.isRequired, // 清除所有
    pressColor: PropTypes.string.isRequired,    // 按压波纹颜色
};
export default FlatChatListItem;
