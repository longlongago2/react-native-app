import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Dimensions, NetInfo, ToastAndroid } from 'react-native';
import ActiveMQ from 'react-native-activemq';
import chatListStyle from './indexStyle';
import ChatListItem from './ChatListItem';
import ChatListHeader from './ChatListHeader';
import ItemSeparator from '../../components/ItemSeparator';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(chatListStyle);

class ChatListPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            screenHeight: Dimensions.get('window').height,
            netStatus: 'UNKNOWN',
        };
        this.handleConnectivityChange = this._handleConnectivityChange.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: ACTIONS.CHAT_LIST.REQUEST });
        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange,
        );
    }

    _handleConnectivityChange(connectionInfo) {
        const { userInfo } = this.props;
        this.setState((prevState) => {
            if (prevState.netStatus === 'none') {
                // 重新连接activeMQ
                ActiveMQ.checkConnected((connectStatus) => {
                    if (!connectStatus) {
                        ActiveMQ.connect('CFSP/PTP', userInfo.userid.toString());
                    } else {
                        ToastAndroid.show('通讯已重新连接', 3000);
                    }
                });
            }
            switch (connectionInfo.type) {
                case 'wifi':
                    ToastAndroid.show('您正在使用WIFI网络连接', 3000);
                    break;
                case 'cellular':
                    ToastAndroid.show('您正在使用移动数据连接', 3000);
                    break;
                case 'unknown':
                    ToastAndroid.show('未知网络', 3000);
                    break;
                case 'none':
                    ToastAndroid.show('您的网络已断开', 3000);
                    break;
                default:
            }
            return { netStatus: connectionInfo.type };
        });
    }

    render() {
        const { loading, chatList, dispatch } = this.props;
        const { screenHeight, netStatus } = this.state;
        return (
            <View
                style={styles.container}
                onLayout={() =>
                    this.setState({
                        screenHeight: Dimensions.get('window').height,
                    })}
            >
                <FlatList
                    data={chatList}
                    keyExtractor={item => item.uuid}
                    renderItem={({ item }) => <ChatListItem item={item} />}
                    ItemSeparatorComponent={() => (
                        <ItemSeparator
                            backgroundColor="rgb(255, 255, 255)"
                            border={1}
                            lineColor="rgb(233, 233, 239)"
                            marginHorizontal={15}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmptyComponent
                            text={loading ? '正在拼命加载...' : '没有聊天数据...'}
                            icon={loading ? require('../../assets/loading.png') : require('../../assets/noData.png')}
                            customStyle={{
                                height: screenHeight - 215 > 85 ? screenHeight - 215 : 85,
                            }}
                        />
                    )}
                    ListHeaderComponent={() => netStatus === 'none' && <ChatListHeader dispatch={dispatch} />}
                    refreshing={loading}
                    onRefresh={() => dispatch({ type: ACTIONS.CHAT_LIST.REQUEST })}
                />
            </View>
        );
    }
}

ChatListPage.propTypes = {
    loading: PropTypes.bool.isRequired,
    chatList: PropTypes.array.isRequired,
    userInfo: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    ...state.chatList,
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(ChatListPage);
