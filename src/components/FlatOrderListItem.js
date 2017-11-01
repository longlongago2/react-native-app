import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    BackHandler,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import FadeInView from '../components/FadeInView';
import hanZiLetter from '../utils/hanZiLetter';
import englishLetter from '../utils/englishLetter';
import styleModule from './FlatOrderListItemStyle';
import theme from '../theme';

const styles = StyleSheet.create(styleModule);

export default class OrderListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.handlePress = this._handlePress.bind(this);
        this.handleLongPress = this._handleLongPress.bind(this);
        this.handleCheckPress = this._handleCheckPress.bind(this);
        this.handleBackAndroid = this._handleBackAndroid.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerOnPress);
        cancelAnimationFrame(this.timerOnLongPress);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid);
    }

    _handlePress() {
        const { onPress, item, navigation } = this.props;
        const { state } = navigation;
        if (state.params && state.params.checkBoxVisible === true) {
            this.handleCheckPress();
        } else {
            this.timerOnPress = requestAnimationFrame(() => onPress(item));
        }
    }

    _handleBackAndroid() {
        const { navigation, onBackRequest, checkBoxEnabled } = this.props;
        const { setParams, state } = navigation;
        if (state.params && state.params.checkBoxVisible) {
            if (checkBoxEnabled) {
                setParams({
                    checkBoxVisible: false,
                    checkedList: [],
                    allChecked: false,
                });
            }
            if (onBackRequest) onBackRequest(state.params && state.params.checkedList);
            return true;
        }
        return false;
    }

    _handleLongPress() {
        const { navigation, onLongPress, checkBoxEnabled, item } = this.props;
        const { setParams, state } = navigation;
        this.timerOnLongPress = requestAnimationFrame(() => {
            const checkBoxVisible = (state.params && state.params.checkBoxVisible) || false;
            if (checkBoxEnabled) {
                if (checkBoxVisible === false) {
                    setParams({
                        checkBoxVisible: true,
                        checkedList: [item.ordercode],
                    });
                } else {
                    setParams({
                        checkBoxVisible: false,
                        checkedList: [],
                        allChecked: false,
                    });
                }
            }
            if (onLongPress) onLongPress(!checkBoxVisible);
        });
    }

    _handleCheckPress() {
        const { onChecked, item, navigation } = this.props;
        const { setParams, state } = navigation;
        const preCheckedList = (state.params && state.params.checkedList) || [];
        // 当前按钮选中状态
        const checked = preCheckedList.concat().filter(arr => arr === item.ordercode).length > 0;
        // 新的选中项列表
        let newCheckedList;
        if (!checked) {
            newCheckedList = preCheckedList.concat();
            newCheckedList.push(item.ordercode);
        } else {
            newCheckedList = preCheckedList.concat().filter(arr => arr !== item.ordercode);
        }
        setParams({ checkedList: newCheckedList });
        // 点击checkBox回调，参数1：工单编号；参数2：选中状态
        if (onChecked) onChecked(item.ordercode, !checked);
    }

    render() {
        const { item, index, itemMap, navigation } = this.props;
        const { state } = navigation;
        let checked;
        if (state.params &&
            Array.isArray(state.params.checkedList) &&
            state.params.checkedList.length > 0) {
            checked = state.params.checkedList.concat().filter(arr =>
                arr === item.ordercode).length > 0;
        } else {
            checked = false;
        }

        function handleRandomColor(text) {
            if (text) {
                // 根据字母生成颜色
                const arrLetter = hanZiLetter(text)[0].split('');
                const r = arrLetter[0] ? englishLetter(arrLetter[0]) * 5 : 0;
                const g = arrLetter[1] ? englishLetter(arrLetter[1]) * 8 : 0;
                const b = arrLetter[2] ? englishLetter(arrLetter[2]) * 10 : 0;
                return `rgb(${r},${g},${b})`;
            }
            return null;
        }

        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.rippleColor)}
                onPress={this.handlePress}
                onLongPress={this.handleLongPress}
            >
                <View style={styles.container}>
                    <View style={styles.contentLayout}>
                        <View style={styles.content}>
                            <View style={styles.logoLayout}>
                                <View
                                    style={[
                                        styles.logo,
                                        { backgroundColor: handleRandomColor(item.personname) },
                                    ]}
                                >
                                    <Text style={styles.logoText}>
                                        {item.personname.slice(-2)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.mainLayout}>
                                <View>
                                    <Text
                                        numberOfLines={2}
                                        style={styles.mainTitle}
                                    >
                                        {item.title}
                                    </Text>
                                </View>
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.mainSubtitle}
                                    >
                                        {`编号：${item.ordercode}`}
                                    </Text>
                                </View>
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.mainSubtitle}
                                    >
                                        {`产品：${item.productname}`}
                                    </Text>
                                </View>
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.mainSubtitle}
                                    >
                                        状态：
                                        <Text
                                            style={{
                                                color: itemMap.modification.color(
                                                    item[itemMap.status],
                                                ),
                                            }}
                                        >{itemMap.modification.text(item[itemMap.status])}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <Text
                                style={styles.footerText}
                            >{`#${index + 1}  ${item.wstypename}`}</Text>
                            <Text
                                style={styles.footerText}
                            >{moment(item.createtime).format('YYYY.MM.DD')}</Text>
                        </View>
                    </View>
                    {
                        state.params && state.params.checkBoxVisible &&
                        <TouchableOpacity onPress={this.handleCheckPress}>
                            <FadeInView>
                                <View style={styles.checkBox}>
                                    {
                                        checked ?
                                            <Icon
                                                name="ios-checkmark-circle"
                                                size={25}
                                                color={theme.theme}
                                            /> :
                                            <Icon
                                                name="ios-radio-button-off"
                                                size={25}
                                                color={theme.theme}
                                            />
                                    }
                                </View>
                            </FadeInView>
                        </TouchableOpacity>
                    }
                </View>
            </TouchableNativeFeedback>
        );
    }
}

OrderListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func,                 // 长按的回调函数：参数visible,checkBox显示状态
    navigation: PropTypes.object.isRequired,
    itemMap: PropTypes.shape({
        status: PropTypes.string.isRequired,     // 状态使用的字段名称
        modification: PropTypes.shape({
            text: PropTypes.func.isRequired,
            color: PropTypes.func.isRequired,
        }).isRequired, // 状态的修饰方法
    }).isRequired,
    checkBoxEnabled: PropTypes.bool,             // 是否允许长按打开 check box 按钮组
    onChecked: PropTypes.func,                   // check box 点击后回调函数
    onBackRequest: PropTypes.func,               // 点击物理返回按键：参数 checkedList,所有选中项
};
