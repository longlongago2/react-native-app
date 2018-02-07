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
import { CHAT_LIST } from './chatList';
import { MESSAGES } from './messages';
import { TYPE } from './type';
import { WO_PRODUCT, WO_KIND, WO_TYPE } from './itemCode';
import { FEEDBACK_IMAGE } from './feedbackImage';
import { PRODUCT_DETAIL } from './productDetail';
import { USERGROUP, USERGROUP_DETAIL, USERGROUP_ASSIGNED, USERGROUP_TRACKERS } from './userGroup';
import { NOTICE } from './notice';
import { TRACKINGWORKORDER } from './trackingWorkOrder';
import { NOTIFICATION, UNREAD_NOTIFICATION } from './notification';
import { APPVERSION, LATESTAPP_DOWNLOAD } from './instruction';
import { BROWSING_HISTORY } from './browsingHistory';
import { ACTIVE_MQ, SEND_MSG, PUSH_SYSTEM_MSG } from './activeMQ';
import { FRIEND_DETAIL, FRIEND_GROUP, CHATGROUP, CHATGROUP_MEMBERS } from './addressBook';

export default {
    USER_LOGIN,
    USER_LOGOUT,
    USER_LIST,
    LOGIN_GATHER,
    WORKORDER,
    FEEDBACK_IMAGE,
    CHAT_LIST,
    MESSAGES,
    TYPE,
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
    ACTIVE_MQ,
    SEND_MSG,
    FRIEND_DETAIL,
    FRIEND_GROUP,
    CHATGROUP,
    CHATGROUP_MEMBERS,
    PUSH_SYSTEM_MSG,
};
