import React from 'react';
import PropTypes from 'prop-types';
import ModalWOReview from './modalWOReview';
import ModalWOScheduleUpdate from './modalWOScheduleUpdate';
import ModalWOReAssign from './modalWOReAssign';
import ModalWOReply from './modalWOReply';
import ModalWOClose from './modalWOClose';

const ModalWoOperation = ({ navigation, dispatch, workOrderDetail, userid }) => {
    const { state } = navigation;
    const item = state.params.type;
    switch (item) {
        case 'review': // 评审
            return (
                <ModalWOReview
                    navigation={navigation}
                    dispatch={dispatch}
                    workOrderDetail={workOrderDetail}
                    userid={userid}
                />
            );
        case 'update': // 更新
            return (
                <ModalWOScheduleUpdate
                    navigation={navigation}
                    dispatch={dispatch}
                    workOrderDetail={workOrderDetail}
                    userid={userid}
                />
            );
        case 'reAssign': // 转交
            return (
                <ModalWOReAssign
                    navigation={navigation}
                    dispatch={dispatch}
                    workOrderDetail={workOrderDetail}
                />
            );
        case 'reply': // 回复
            return (
                <ModalWOReply
                    navigation={navigation}
                    dispatch={dispatch}
                    workOrderDetail={workOrderDetail}
                    userid={userid}
                />
            );
        case 'close': // 关闭
            return (
                <ModalWOClose
                    navigation={navigation}
                    workOrderDetail={workOrderDetail}
                    userid={userid}
                    dispatch={dispatch}
                />
            );
        default:
            return null;
    }
};

ModalWoOperation.propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    userid: PropTypes.number.isRequired,
};

export default ModalWoOperation;
