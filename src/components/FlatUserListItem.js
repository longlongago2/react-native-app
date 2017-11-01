import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    TouchableNativeFeedback,
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import flatUserItemStyle from './FlatUserListItemStyle';
import api from '../utils/api';

const styles = StyleSheet.create(flatUserItemStyle);

class FlatUserListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.handleExpensiveAction = this._handleExpensiveAction.bind(this);
    }

    componentWillUnmount() {
        // 清除异步定时器
        const { onPress } = this.props;
        if (onPress) {
            cancelAnimationFrame(this.timer);
        }
    }

    _handleExpensiveAction() {
        const { onPress } = this.props;
        if (onPress) {
            // 异步定时器：在动画后执行
            this.timer = requestAnimationFrame(onPress);
        }
    }

    render() {
        const { item, onDelete } = this.props;
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.5)', false)}
                onPress={this.handleExpensiveAction}
            >
                <View style={styles.itemLayout}>
                    <View style={styles.itemLeft}>
                        {
                            item.avatar ?
                                <Image
                                    source={{ uri: `${api.database}/${item.avatar}` }}
                                    style={styles.itemAvatar}
                                /> :
                                <Image
                                    source={require('../assets/user_default.png')}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        tintColor: 'rgb(255,255,255)',
                                    }}
                                />
                        }
                    </View>
                    <View style={styles.itemCenter}>
                        <Text style={styles.itemText}>
                            {item.username}
                        </Text>
                    </View>
                    <View style={styles.itemRight}>
                        <TouchableOpacity onPress={onDelete}>
                            <Icon name="minus" size={25} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

FlatUserListItem.propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
export default FlatUserListItem;
