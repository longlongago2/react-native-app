import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, SectionList, FlatList } from 'react-native';
import addressStyle from './indexStyle';
import ACTIONS from '../../models/actions';
import ItemSeparator from '../../components/ItemSeparator';
import FriendListItem from './FriendListItem';
import SectionHeader from './SectionHeader';
import AddressHeader from './AddressHeader';
import ModalAddressOperation from '../modalAddressOperation';

const styles = StyleSheet.create(addressStyle);
const addressOptions = [
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
];

class AddressListPage extends Component {
    constructor(props) {
        super(props);
        this.queryInitFriendDetail = this._queryInitFriendDetail.bind(this);
    }

    componentDidMount() {
        this.queryInitFriendDetail();
    }

    _queryInitFriendDetail() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.FRIEND_DETAIL.REQUEST,
        });
    }

    render() {
        const { friendDetailList, dispatch, navigation, loading } = this.props;
        const { setParams } = navigation;
        function handItemPress(value) {
            setParams({
                modalVisible: true,
                type: value.key,
            });
        }

        function _handItemPress(value) {
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: 'Chatting',
                params: {
                    userId: value.friendid,
                    personName: value.friendname,
                    type: '1', // 私聊
                },
            });
        }

        return (
            <View style={styles.container}>
                <ModalAddressOperation
                    navigation={navigation}
                    dispatch={dispatch}
                />
                <View>
                    <FlatList
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => (
                            <AddressHeader
                                item={item}
                                onItemPress={value => handItemPress(value)}
                            />
                        )}
                        data={addressOptions}
                        ItemSeparatorComponent={() => (
                            <ItemSeparator
                                backgroundColor="rgba(255,255,255,0.8)"
                                border={0.8}
                                lineColor="rgba(139,139,139,0.1)"
                                marginHorizontal={10}
                            />
                        )}
                    />
                </View>
                <View style={{ marginBottom: 90 }}>
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
                                dispatch={dispatch}
                                navigation={navigation}
                            />
                        )}
                        refreshing={loading}
                        onRefresh={this.queryInitFriendDetail}
                        sections={friendDetailList}
                    />
                </View>
            </View>
        );
    }
}

AddressListPage.propTypes = {
    friendDetailList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    ...state.addressBook,
});

export default connect(mapStateToProps)(AddressListPage);
