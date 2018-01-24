import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, SectionList, Button } from 'react-native';
import addressStyle from './indexStyle';
import ACTIONS from '../../models/actions';
import SectionLineItemWithIcon from '../../components/SectionLineItemWithIcon';
import ItemSeparator from '../../components/ItemSeparator';
import FriendListItem from './FriendListItem';
import SectionHeader from './SectionHeader';

const styles = StyleSheet.create(addressStyle);
const addressOptions = [
    {
        data: [
            {
                id: 1,
                text: '新的朋友',
                redirect: { routeName: '' },
                icon: <Icon name="hdd-o" size={20} color="#FFAA25" />,
                showBadge: false,
                key: 'newFriend',
            },
            {
                id: 2,
                text: '群聊',
                redirect: { routeName: '' },
                icon: <Icon name="user" size={20} color="#01A0EA" />,
                showBadge: false,
                key: 'chatUserGroup',
            },
        ],
        key: 's1',
    },
];

class AddressListPage extends Component {
    constructor(props) {
        super(props);
        this.queryInitFriendGroup = this._queryInitFriendGroup.bind(this);
        this.queryInitFriendDetail = this._queryInitFriendDetail.bind(this);
        this.insertFriendGroup = this._insertFriendGroup.bind(this);
        this.insertFriend = this._insertFriend.bind(this);
    }

    componentDidMount() {
        this.queryInitFriendGroup();
        this.queryInitFriendDetail();
    }

    _queryInitFriendGroup() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_GROUP.REQUEST,
        });
    }

    _queryInitFriendDetail() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_DETAIL.REQUEST,
        });
    }

    _insertFriendGroup() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_GROUP.INSERT,
            payload: {
                friendgroupsname: `测试分组${Math.floor(Math.random() * 10000)}`,
            },
        });
    }

    _insertFriend() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_DETAIL.INSERT,
            payload: {
                friendcode: Math.floor(Math.random() * 10000),
                friendid: 0,
                friendname: `测试${Math.floor(Math.random() * 10000)}`,
                friendtype: 0,
                friendgroupsid: 15,
            },
        });
    }

    render() {
        function handItemPress(value) {
            alert(value.text);
        }
        function _handItemPress(value) {
            alert(value.friendname);
        }
        function handleHeaderPress(value) {
            alert(value.friendgroupsname);
        }
        const { friendDetailList, friendGroupList } = this.props;
        return (
            <View style={styles.container}>
                <SectionList
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => <SectionLineItemWithIcon item={item} onItemPress={value => handItemPress(value)} />}
                    sections={addressOptions}
                />
                <SectionList
                    keyExtractor={(item, index) => item.friendgroupsid}
                    renderItem={({ item }) => (
                        <FriendListItem
                            item={item}
                            onItemPress={value => _handItemPress(value)}
                        />
                    )}
                    renderSectionHeader={({ section }) => (
                        <SectionHeader
                            item={section}
                            onItemPress={value => handleHeaderPress(value)}
                        />
                    )}
                    sections={friendDetailList}
                    SectionSeparatorComponent={() => (
                        <ItemSeparator
                            backgroundColor="rgba(255,255,255,0.8)"
                            border={0.8}
                            lineColor="rgba(139,139,139,0.3)"
                            marginHorizontal={15}
                        />
                    )}
                />
            </View>
        );
    }
}

AddressListPage.propTypes = {
    friendGroupList: PropTypes.array.isRequired,
    friendDetailList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    ...state.addressBook,
});

export default connect(mapStateToProps)(AddressListPage);
