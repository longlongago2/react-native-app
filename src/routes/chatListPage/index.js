import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Dimensions, NetInfo, ToastAndroid } from 'react-native';
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
        this.setState((prevState) => {
            if (prevState.netStatus === 'none') {
                // alert('重新连接activeMQ', 3000);
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
        const { instantMessaging, dispatch } = this.props;
        const { screenHeight, netStatus } = this.state;
        const { loading, chatList } = instantMessaging;
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
                    keyExtractor={(item, index) => item.userId}
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
                            text="没有聊天数据..."
                            icon={require('../../assets/noData.png')}
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
    instantMessaging: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    instantMessaging: state.instantMessaging,
});

export default connect(mapStateToProps)(ChatListPage);
