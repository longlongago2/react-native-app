import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Menu, {
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import OrderListItem from '../../components/FlatOrderListItem';

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
        const { state } = navigation;
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'WorkOrderDetail',
            params: {
                obj: item,
                workOrderType: state.params && state.params.workOrderType,
            },
        });
    }

    _handleMenuOptionSelect(type) {
        const { dispatch, item, navigation } = this.props;
        this.timerMenuSelect = requestAnimationFrame(() => {
            this.setState({ menuVisible: false }, () => {
                dispatch({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'WorkOrderDetail',
                    params: {
                        obj: item,
                        workOrderType: navigation.state.params.workOrderType,
                        modalVisible: true,
                        type,
                    },
                });
            });
        });
    }

    render() {
        const { item, index, navigation, userInfo } = this.props;
        const { menuVisible } = this.state;

        function handleTextTranslate(status) {
            switch (status) {
                case 0:
                    return '未评审';
                case 1:
                    return '已评审';
                default:
                    return '未识别编码';
            }
        }

        function handleTextColor(status) {
            switch (status) {
                case 0:
                    return '#FF4040';
                case 1:
                    return '#008B00';
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
                    <OrderListItem
                        item={item}
                        index={index}
                        onPress={this.handlePress}
                        itemMap={{
                            status: 'wsstatus',
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
                        value="reply"
                        text="留言"
                    />
                    <MenuOption
                        value="review"
                        text="评审"
                        disabled={item.wsstatus.toString() === '1' || item.productprincipal.toString() !== userInfo.userid.toString()}
                    />
                </MenuOptions>
            </Menu>
        );
    }
}

WorkorderListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
};
