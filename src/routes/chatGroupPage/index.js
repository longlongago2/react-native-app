/**
 * 群聊模块：
 * created by zhangqi on 2018-2-1
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import ACTIONS from '../../models/actions';
import ItemSeparator from '../../components/ItemSeparator';
import ChatGroupItemList from './ChatGroupItemList';

class ChatUserGroup extends Component {
    constructor(props) {
        super(props);
        this.initChatGroupData = this._initChatGroupData.bind(this);
    }
    componentDidMount() {
        this.initChatGroupData();
    }
    _initChatGroupData() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.CHATGROUP.REQUEST,
        });
    }
    render() {
        const { chatGroupList } = this.props;
        return (
            <View>
                <FlatList
                    keyExtractor={(item, index) => item.chatusergroupid}
                    data={chatGroupList}
                    renderItem={({ item }) => (
                        <ChatGroupItemList item={item} />
                    )}
                    ItemSeparatorComponent={() => (
                        <ItemSeparator
                            backgroundColor="rgba(255,255,255,0.8)"
                            border={0.8}
                            lineColor="rgba(139,139,139,0.1)"
                            marginHorizontal={15}
                        />
                    )}
                />
            </View>
        );
    }
}

ChatUserGroup.propTypes = {
    dispatch: PropTypes.func.isRequired,
    chatGroupList: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    chatGroupList: state.addressBook.chatGroupList,
});

export default connect(mapStateToProps)(ChatUserGroup);
