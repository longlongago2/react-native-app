import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
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
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: ACTIONS.CHAT_LIST.REQUEST });
    }

    render() {
        const { instantMessaging, dispatch } = this.props;
        const { screenHeight } = this.state;
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
                    ListHeaderComponent={ChatListHeader}
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
