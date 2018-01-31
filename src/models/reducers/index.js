import { combineReducers } from 'redux';
import user from './user';
import nav from './nav';
import logging from './logging';
import workorder from './workorder';
import workorderDetail from './workorderDetail';
import itemCode from './itemCode';
import feedbackImage from './feedbackImage';
import userGroup from './userGroup';
import notice from './notice';
import trackingWorkOrder from './workorderTracking';
import notification from './notification';
import instruction from './instruction';
import browsingHistory from './browsingHistory';
import chatList from './chatList';
import addressBook from './addressBook';
import activeMQ from './activeMQ';

const rootReducer = combineReducers({
    user,
    nav,
    logging,
    workorder,
    workorderDetail,
    itemCode,
    feedbackImage,
    userGroup,
    notice,
    trackingWorkOrder,
    notification,
    instruction,
    browsingHistory,
    chatList,
    addressBook,
    activeMQ,
});

export default rootReducer;
