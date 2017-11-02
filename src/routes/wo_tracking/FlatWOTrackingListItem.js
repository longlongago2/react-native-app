/** created by zhangqi on 2017-10-16 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    TouchableNativeFeedback,
} from 'react-native';
import moment from 'moment';
import styleModule from './FlatWOTrackingListItemStyle';
import theme from '../../theme';
import OperatingProgress from './OperatingProgress';

const styles = StyleSheet.create(styleModule);

export default class FlatWOTrackingListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.handlePress = this._handlePress.bind(this);
        this.handleLongPress = this._handleLongPress.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerOnPress);
        cancelAnimationFrame(this.timerOnLongPress);
    }
    _handleLongPress() {
        const { onLongPress } = this.props;
        this.timerOnLongPress = requestAnimationFrame(() => onLongPress());
    }
    _handlePress() {
        const { onPress, item } = this.props;
        this.timerOnPress = requestAnimationFrame(() => onPress(item));
    }
    render() {
        const { item, index } = this.props;
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.rippleColor)}
                onPress={this.handlePress}
                onLongPress={this.handleLongPress}
            >
                <View style={styles.container}>
                    <View style={styles.contentLayout}>
                        <View style={styles.content}>
                            <View style={styles.mainLayout}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}
                                >
                                    <View style={{
                                        flex: 0.9,
                                    }}
                                    >
                                        <Text
                                            numberOfLines={2}
                                            style={styles.mainTitle}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flex: 0.1,
                                        justifyContent: 'flex-end',
                                    }}
                                    >
                                        {
                                            item.notReadNum > 0 &&
                                            <View style={{
                                                width: 30,
                                                height: 20,
                                                borderRadius: 22,
                                                backgroundColor: 'red',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            >
                                                <Text style={{ color: '#ffffff', fontSize: 10 }}>
                                                    {item.notReadNum < 100 ? item.notReadNum : '99+'}
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.mainSubtitle}
                                    >
                                        {`编号：${item.ordercode}`}
                                    </Text>
                                </View>
                                <OperatingProgress item={item} />
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
                </View>
            </TouchableNativeFeedback>
        );
    }
}

FlatWOTrackingListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func.isRequired,
};
