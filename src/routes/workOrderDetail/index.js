/** created by zhangqi on 2017-9-5 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Dimensions,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import ACTIONS from '../../models/actions';
import WODetailHeader from './WODetailHeader';
import WODetailBody from './WODetailBody';
import WorkOrderReply from './WorkOrderReply';
import WODetailBottom from './WODetailBottom';
import ModalWoOperation from '../modalWoOperation';

class WorkOrderDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            screenHeight: Dimensions.get('window').height, // 设备屏幕高度
            screenWidth: Dimensions.get('window').width,   // 设备屏幕宽度
        };
        this.queryInitialData = this._queryInitialData.bind(this);
    }

    componentDidMount() {
        this.queryInitialData();
    }

    _queryInitialData() {
        const { dispatch } = this.props;
        const { state } = this.props.navigation;
        // 查询单条工单的详情信息(主表+图片)
        dispatch({
            type: ACTIONS.WORKORDER_DETAIL.REQUEST,
            payload: {
                orderCode: state.params.obj.ordercode,
            },
        });
        // 查询工单回复信息
        dispatch({
            type: ACTIONS.WORKORDER_REPLY.REQUEST,
            payload: {
                orderCode: state.params.obj.ordercode,
            },
        });
    }

    render() {
        const {
            workOrderDetail,
            dispatch,
            loading,
            workOrderReply,
            navigation,
            userid,
        } = this.props;
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
            }}
            >
                <ModalWoOperation
                    navigation={navigation}
                    dispatch={dispatch}
                    workOrderDetail={workOrderDetail}
                    userid={userid}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={this.queryInitialData}
                        />
                    }
                >
                    <View style={{ backgroundColor: '#ffffff', padding: 20 }}>
                        <WODetailHeader workOrderDetail={workOrderDetail} />
                        <WODetailBody workOrderDetail={workOrderDetail} dispatch={dispatch} />
                    </View>
                    <WorkOrderReply workOrderReply={workOrderReply} dispatch={dispatch} />
                </ScrollView>
                <WODetailBottom
                    workOrderDetail={workOrderDetail}
                    navigation={navigation}
                    userid={userid}
                    dispatch={dispatch}
                />
            </View>
        );
    }
}

WorkOrderDetail.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    workOrderReply: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    userid: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    ...state.user.userInfo,
    ...state.workorderDetail,
});

export default connect(mapStateToProps)(WorkOrderDetail);

