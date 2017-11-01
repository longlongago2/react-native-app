import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    ToastAndroid,
} from 'react-native';
import ModalPage from '../../components/ModalPage';
import styleModule from './indexStyle';
import ACTIONS from '../../models/actions';
import TrackerList from './TrackerList';
import SelectUsersAssigned from './SelectUsersAssigned';
import SelectPriority from './SelectPriority';

const style = StyleSheet.create(styleModule);

export default class ModalWOReview extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            replyInfo: '',
        };
        this.handleSubmit = this._handleSubmit.bind(this);
        this.initTrackers = this._initTrackers.bind(this);
        this.initAssignedUsers = this._initAssignedUsers.bind(this);
        this.initPriority = this._initPriority.bind(this);
    }

    componentDidMount() {
        this.initTrackers();
        this.initAssignedUsers();
        this.initPriority();
    }

    _initTrackers() {
        const { dispatch } = this.props;
        dispatch({
            type: ACTIONS.USERGROUP.REQUEST,
        });
    }

    _initAssignedUsers() {
        const { dispatch } = this.props;
        const { state } = this.props.navigation;
        dispatch({
            type: ACTIONS.USERGROUP_ASSIGNED.REQUEST,
            payload: {
                productId: state.params.obj.productid,
            },
        });
    }

    _initPriority() {
        const { navigation } = this.props;
        const priorityList = [
            { id: 1, name: '紧急' },
            { id: 2, name: '高' },
            { id: 3, name: '普通' },
            { id: 4, name: '低' },
        ];
        const { setParams } = navigation;
        setParams({
            priorityList,
        });
    }

    _handleSubmit(close) {
        const { dispatch, navigation, workOrderDetail, userid } = this.props;
        const { state } = navigation;
        const trackList = JSON.stringify(state.params.trackerList);
        if (state.params.assignedUserId && state.params.priorityId) {
            if (trackList && trackList.length > 0) {
                dispatch({
                    type: ACTIONS.USERGROUP_TRACKERS.INSERT,
                    payload: {
                        woDetail: trackList,
                        orderCode: workOrderDetail.ordercode,
                    },
                });
            }
            dispatch({
                type: ACTIONS.WORKORDER.UPDATE,
                payload: {
                    stateName: 'woGroup',
                    stateValue: {
                        todo: 'update',
                        params: {
                            ordercode: workOrderDetail.ordercode,
                            assigneduserid: state.params.assignedUserId,
                            assignedusername: state.params.assignedUser,
                            wsstatus: 1,
                            priority: state.params.priorityId,
                            repler: userid,
                            replyinfo: this.state.replyInfo,
                            isinside: 1,
                        },
                    },
                },
            });
            close();  // 关闭 modal
        } else {
            ToastAndroid.show('指派人与优先级不能为空', 3000);
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <ModalPage
                navigation={navigation}
                title="工单评审"
                onSubmit={this.handleSubmit}
            >
                <ScrollView style={{ width: '100%' }}>
                    <TrackerList navigation={navigation} />
                    <SelectUsersAssigned navigation={navigation} />
                    <SelectPriority navigation={navigation} />
                    <View style={[style.commonStyle, {
                        flexDirection: 'row',
                        height: 60,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }]}
                    >
                        <Text style={{ flex: 0.2 }}>填写描述</Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="输入内容"
                            placeholderTextColor="#cccccc"
                            style={{ flex: 0.8 }}
                            onChangeText={(text) => {
                                this.setState({ replyInfo: text });
                            }}
                        />
                    </View>
                </ScrollView>
            </ModalPage>
        );
    }
}

ModalWOReview.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    userid: PropTypes.number.isRequired,
};
