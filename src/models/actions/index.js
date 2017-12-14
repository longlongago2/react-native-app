import {
    USER_LOGIN,
    USER_LOGOUT,
    USER_INFO,
    UPLOAD_AVATAR,
    USER_PASSWORD,
} from './user';
import { WORKORDER } from './workorder';
import { WORKORDER_DETAIL, WORKORDER_REPLY } from './workorderDetail';
import { USER_LIST, LOGIN_GATHER } from './logging';
import { CHAT_LIST, ADDRESS_LIST, SYS_LIST } from './instantMessaging';
import { WO_PRODUCT, WO_KIND, WO_TYPE } from './itemCode';
import { FEEDBACK_IMAGE } from './feedbackImage';
import { PRODUCT_DETAIL } from './productDetail';
import { USERGROUP, USERGROUP_DETAIL, USERGROUP_ASSIGNED, USERGROUP_TRACKERS } from './userGroup';
import { NOTICE } from './notice';
import { TRACKINGWORKORDER } from './trackingWorkOrder';
import { NOTIFICATION, UNREAD_NOTIFICATION } from './notification';
import { APPVERSION, LATESTAPP_DOWNLOAD } from './instruction';
import { BROWSING_HISTORY, BROWSING_HISTORY_TABLE } from './browsingHistory';

export default {
    USER_LOGIN,
    USER_LOGOUT,
    USER_LIST,
    LOGIN_GATHER,
    WORKORDER,
    FEEDBACK_IMAGE,
    CHAT_LIST,
    ADDRESS_LIST,
    SYS_LIST,
    USER_INFO,
    UPLOAD_AVATAR,
    USER_PASSWORD,
    WO_KIND,
    WO_PRODUCT,
    WO_TYPE,
    WORKORDER_DETAIL,
    WORKORDER_REPLY,
    PRODUCT_DETAIL,
    USERGROUP,
    USERGROUP_DETAIL,
    USERGROUP_ASSIGNED,
    USERGROUP_TRACKERS,
    NOTICE,
    TRACKINGWORKORDER,
    NOTIFICATION,
    UNREAD_NOTIFICATION,
    APPVERSION,
    LATESTAPP_DOWNLOAD,
    BROWSING_HISTORY,
    BROWSING_HISTORY_TABLE,
};
