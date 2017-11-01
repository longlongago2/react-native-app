import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    View,
    StatusBar,
    StyleSheet,
    TextInput,
    Text,
    ToastAndroid,
    Image,
    FlatList,
    Keyboard,
} from 'react-native';
import ACTIONS from '../../models/actions';
import theme from '../../theme';
import styleModule from './indexStyle';
import FilletButton from '../../components/FilletButton';
import Loading from '../../components/Loading';
import UserListItem from './UserListItem';
import ItemSeparator from '../../components/ItemSeparator';

const styles = StyleSheet.create(styleModule);

class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleUserInputFocus = this._handleUserInputFocus.bind(this);
        this.handleLogin = this._handleLogin.bind(this);
        this.handleInputChange = this._handleInputChange.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        // 获取本地存储 key = userList 下的数据
        dispatch({
            type: ACTIONS.USER_LIST.REQUEST,
            payload: {
                key: 'userList',
            },
        });
    }

    _handleUserInputFocus() {
        const { dispatch, showUserList, userList } = this.props;
        dispatch({
            type: ACTIONS.LOGIN_GATHER.REQUEST,
            payload: {
                showUserList: !showUserList,
            },
        });
        if (!showUserList && userList.length > 0) {
            Keyboard.dismiss();
        }
    }

    _handleInputChange(text, name) {
        const { dispatch } = this.props;
        const newState = {};
        newState[name] = text;
        dispatch({
            type: ACTIONS.LOGIN_GATHER.REQUEST,
            payload: newState,
        });
    }

    _handleLogin() {
        Keyboard.dismiss();
        const { dispatch, username, password } = this.props;
        if (username.trim() !== '' && password.trim() !== '') {
            dispatch({
                type: ACTIONS.USER_LOGIN.REQUEST,
                payload: {
                    username,
                    password,
                    dispatch,
                    runBackground: false,
                },
            });
        } else {
            ToastAndroid.show('用户名和密码不能为空', 3000);
        }
    }

    render() {
        const commonTextInput = {
            placeholderTextColor: '#BEBEBE',
            underlineColorAndroid: theme.theme,
            keyboardType: 'default',
        };
        const { loading, userList, username, password, showUserList } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor={theme.statusBarColor} />
                <Loading loading={loading} />
                <View style={styles.layout}>
                    <View style={styles.logoItem}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={{ transform: [{ scale: 0.8 }], tintColor: '#EE7621' }}
                        />
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            才丰软件服务平台
                        </Text>
                    </View>
                    <View style={[styles.item, styles.loginItem]}>
                        <TextInput
                            autoFocus
                            style={styles.textInput}
                            onFocus={this.handleUserInputFocus}
                            placeholder="用户名"
                            value={username}
                            onChangeText={text => this.handleInputChange(text, 'username')}
                            {...commonTextInput}
                        />
                        <View style={[styles.dropDownContainer, !showUserList && { display: 'none' }]}>
                            <View style={styles.dropDownLayout}>
                                <FlatList
                                    style={{ maxHeight: 125, width: '100%' }}
                                    ItemSeparatorComponent={() => (
                                        <ItemSeparator
                                            backgroundColor="transparent"
                                            border={1}
                                            lineColor="rgba(255, 255, 255, 0.5)"
                                            marginHorizontal={10}
                                        />)
                                    }
                                    data={userList}
                                    renderItem={({ item }) => (
                                        <UserListItem item={item} />
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.item, styles.loginItem]}>
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry
                            selectTextOnFocus
                            placeholder="密码"
                            value={password}
                            onChangeText={text => this.handleInputChange(text, 'password')}
                            {...commonTextInput}
                        />
                    </View>
                    <View style={styles.item}>
                        <FilletButton title="登 录" onPress={this.handleLogin} />
                    </View>
                    <View style={styles.bottomItem}>
                        <Text style={styles.bottomItemText} onPress={() => alert('尚未开放')}>
                            遇到问题？
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

LoginPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    userList: PropTypes.array.isRequired,
    showUserList: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    loading: state.user.loading,
    ...state.logging,
});


export default connect(mapStateToProps)(LoginPage);
