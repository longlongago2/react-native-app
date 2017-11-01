import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import ACTIONS from '../../models/actions';
import styleModule from './indexStyle';
import ModalPage from '../../components/ModalPage';

const style = StyleSheet.create(styleModule);

class ModalWOAssign extends PureComponent {
    constructor(props) {
        super(props);
        const { workOrderDetail } = this.props;
        this.state = {
            replyInfo: '',
            assignedPersonName: workOrderDetail.assginpersonname,
            assignedUserName: workOrderDetail.assignedusername,
            assignedUserId: workOrderDetail.assigneduserid,
        };
        this.initAssignedUsers = this._initAssignedUsers.bind(this);
        this.onSelect = this._onSelect.bind(this);
        this.handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount() {
        this.initAssignedUsers();
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

    _onSelect(index, item) {
        this.setState({
            assignedPersonName: item.personname,
            assignedUserName: item.username,
            assignedUserId: item.userid,
        });
    }

    _handleSubmit(close) {
        const { dispatch, workOrderDetail } = this.props;
        const { assignedUserId, assignedUserName, assignedPersonName, replyInfo } = this.state;
        dispatch({
            type: ACTIONS.WORKORDER.UPDATE,
            payload: {
                stateName: 'woMyTask',
                stateValue: {
                    todo: 'reAssign',
                    params: {
                        orderCode: workOrderDetail.ordercode,
                        assignedUserId,
                        assignedUserName,
                        replyInfo,
                    },
                },
            },
        });
        close();
    }

    render() {
        const { assignedUsersList, navigation, workOrderDetail } = this.props;

        function getSelectIndex() {
            let selectIndex = 0;
            if (workOrderDetail && assignedUsersList) {
                assignedUsersList.forEach((element, index) => {
                    if (element.username === workOrderDetail.assignedusername) {
                        selectIndex = index;
                    }
                });
            }
            return selectIndex;
        }

        return (
            <ModalPage
                navigation={navigation}
                title="重新指派"
                onSubmit={this.handleSubmit}
            >
                <View style={{ flex: -1, flexDirection: 'row', alignSelf: 'flex-start' }}>
                    <Text>指派人：</Text>
                    <Text>{this.state.assignedPersonName}</Text>
                </View>
                <ScrollView style={{ width: '100%', alignSelf: 'flex-start' }}>
                    <RadioGroup
                        selectedIndex={getSelectIndex()}
                        onSelect={(index, value) => this.onSelect(index, value)}
                    >
                        {
                            assignedUsersList.map((item, i) => (
                                <RadioButton key={item.userid} value={item}>
                                    <Text>{item.personname}</Text>
                                </RadioButton>
                            ))
                        }
                    </RadioGroup>
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


ModalWOAssign.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    assignedUsersList: PropTypes.array.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    assignedUsersList: state.userGroup.assignedUsersList,
});

export default connect(mapStateToProps)(ModalWOAssign);
