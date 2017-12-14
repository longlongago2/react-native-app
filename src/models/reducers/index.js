import { combineReducers } from 'redux';
import user from './user';
import nav from './nav';
import logging from './logging';
import instantMessaging from './instantMessaging';
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

const rootReducer = combineReducers({
    user,
    nav,
    logging,
    instantMessaging,
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
});

export default rootReducer;
