/** created by zhangqi on 2017-10-23 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Menu, {
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { ToastAndroid, Alert } from 'react-native';
import WOTrackingListItem from './FlatWOTrackingListItem';
import ACTIONS from '../../models/actions';

export default class WorkorderListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuVisible: false,
        };
        this.handlePress = this._handlePress.bind(this);
        this.handleMenuOptionSelect = this._handleMenuOptionSelect.bind(this);
        this.onBackdropPress = () => this.setState({ menuVisible: false });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerMenuSelect);
    }
    _handlePress(item) {
        const { dispatch, navigation } = this.props;
        dispatch({
            type: ACTIONS.TRACKINGWORKORDER.UPDATE,
            payload: {
                orderCode: item.ordercode,
            },
        });
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WorkOrderDetail',
            params: {
                obj: item,
                workOrderType: navigation.state.params.workOrderType,
            },
        });
    }
    _handleMenuOptionSelect(value) {
        const { dispatch, item, navigation } = this.props;
        this.timerMenuSelect = requestAnimationFrame(() => {
            this.setState({ menuVisible: false }, () => {
                switch (value) {
                    case 'reply':
                        // 留言
                        dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'WorkOrderDetail',
                            params: {
                                obj: item,
                                workOrderType: navigation.state.params.workOrderType,
                                modalVisible: true,
                                type: 'reply',
                            },
                        });
                        break;
                    case 'noTracking':
                        // 取消跟踪
                        Alert.alert(
                            '询问',
                            '取消跟踪后，会从跟踪列表中移除，是否继续？',
                            [
                                {
                                    text: '取消',
                                    style: 'cancel',
                                },
                                {
                                    text: '是',
                                    onPress: () => {
                                        dispatch({
                                            type: ACTIONS.TRACKINGWORKORDER.DELETE,
                                            payload: {
                                                orderCodes: item.ordercode,
                                            },
                                        });
                                    },
                                },
                            ]);
                        break;
                    default:
                        ToastAndroid.show('未识别操作', 3000);
                }
            });
        });
    }

    render() {
        const { item, index, navigation } = this.props;
        const { menuVisible } = this.state;

        function handleTextTranslate(status) {
            switch (status.toString()) {
                case '1':
                    return '未处理';
                case '2':
                    return '处理中';
                case '3':
                    return '已解决';
                case '4':
                    return '已关闭';
                default:
                    return '未识别编码';
            }
        }

        function handleTextColor(status) {
            switch (status.toString()) {
                case '1':
                    return '#FF4040';
                case '2':
                    return '#009ACD';
                case '3':
                    return '#008B00';
                case '4':
                    return '#8F8F8F';
                default:
                    return '#000000';
            }
        }

        return (
            <Menu
                opened={menuVisible}
                onBackdropPress={this.onBackdropPress}
                onSelect={value => this.handleMenuOptionSelect(value)}
            >
                <MenuTrigger>
                    <WOTrackingListItem
                        item={item}
                        index={index}
                        onPress={this.handlePress}
                        itemMap={{
                            status: 'wstateclient',
                            modification: {
                                text: handleTextTranslate,
                                color: handleTextColor,
                            },
                        }}
                        navigation={navigation}
                        onLongPress={() => this.setState({ menuVisible: true })}
                    />
                </MenuTrigger>
                <MenuOptions
                    optionsContainerStyle={{ maxWidth: 110 }}
                    customStyles={{
                        optionWrapper: {
                            paddingVertical: 10,
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        optionText: {
                            fontSize: 15,
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <MenuOption
                        value="noTracking"
                        text="取消跟踪"
                    />
                    <MenuOption
                        value="reply"
                        text="留言"
                    />
                </MenuOptions>
            </Menu>
        );
    }
}

WorkorderListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
