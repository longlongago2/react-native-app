/**
 * 创建一个 saga generator，目的是将所有的 effect 注册到 Redux 中
 * takeEvery  ：允许并发（注：即同时处理多个相同的 action）
 * takeLatest ：不允许并发（注：处理中的 action 会被取消），只会执行当前最新的 action
 * fork       ：允许并发，执行一个非阻塞操作，不接受action type，直接执行，可以用于加载初始数据
 * all        : 并发所有 effect，并发任务任何一个抛出错误整个任务（包括待处理任务）将终止，使用批量执行fork，即all([...fork()]);
 * race       : 竞速，只处理最先完成的任务
 */

import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import ACTIONS from '../actions';
import {
    login,
    logout,
    updateUserInfo,
    uploadUserAvatar,
    updateUserPassword,
} from './user';
import {
    queryWorkOrderList,
    initialWorkOrder,
    updateWorkOrder,
    insertWorkOrder,
    cleanWorkOrder,
} from './workorder';
import {
    queryWODetailByOrderCode,
    queryWOReplyByOrderCode,
    updateWODetailState,
    insertWOReplyByOrderCode,
} from './workorderDetail';
import {
    receiveUserList,
    deleteUserListByKeyAndId,
    loginInfoGather,
} from './logging';
import {
    queryWOKindCodeItemList,
    queryWOTypeCodeItemList,
    queryWOProductCodeItemList,
} from './itemCode';
import {
    insertAddressList,
    insertChatList,
    insertSysList,
    queryChatList,
    queryAddressList,
    updateChatList,
    deleteChatList,
} from './instantMessaging';
import {
    insertFeedbackImage,
    deleteFeedbackImage,
    initialFeedbackImage,
} from './feedbackImage';
import {
    queryAllUserGroupInfo,
    queryUGDetailByGroupId,
    queryPersonNameByProductCode,
    insertWOTrackers,
} from './userGroup';
import { queryValidNotice, initialNotice } from './notice';
import {
    queryWorkOrderListByFollowUserId,
    initWOTracking,
    cleanWOTrackingByMainCodeAndFollowUserId,
    updateWODetailLastReadTimeByOrderCodeAndUserId,
} from './workorderTracking';
import {
    queryNotificationListByUserId,
    queryUnreadNotificationNum,
    initialNotification,
} from './notification';
import { queryLatestVersion } from './instruction';
import {
    openDataBase,
    closeDataBase,
    deleteDataBase,
    insertHistory,
    createTable,
    queryHistoryList,
} from './browsingHistory';

export default function* rootSaga() {
    yield all([
        takeLatest(ACTIONS.USER_LOGIN.REQUEST, login),                          // 用户登录
        takeLatest(ACTIONS.USER_LOGOUT.REQUEST, logout),                        // 用户登出
        takeLatest(ACTIONS.WO_TYPE.REQUEST, queryWOTypeCodeItemList),           // 查询工单类型下拉菜单代码项
        takeLatest(ACTIONS.WO_KIND.REQUEST, queryWOKindCodeItemList),           // 查询工单种类下拉菜单代码项
        takeLatest(ACTIONS.WO_PRODUCT.REQUEST, queryWOProductCodeItemList),     // 查询所述产品下拉菜单代码项
        takeLatest(ACTIONS.WORKORDER.REQUEST, queryWorkOrderList),              // 查询工单列表
        takeLatest(ACTIONS.WORKORDER_DETAIL.REQUEST, queryWODetailByOrderCode), // 查询工单详情
        takeLatest(ACTIONS.WORKORDER_REPLY.REQUEST, queryWOReplyByOrderCode),   // 查询工单回复信息
        takeLatest(ACTIONS.CHAT_LIST.REQUEST, queryChatList),                   // 查询本地消息列表
        takeLatest(ACTIONS.ADDRESS_LIST.REQUEST, queryAddressList),             // 查询聊天通讯录
        takeLatest(ACTIONS.USERGROUP.REQUEST, queryAllUserGroupInfo),           // 查询用户组列表
        takeLatest(ACTIONS.USERGROUP_DETAIL.REQUEST, queryUGDetailByGroupId),   // 查询用户组下的用户列表
        takeLatest(ACTIONS.USERGROUP_ASSIGNED.REQUEST, queryPersonNameByProductCode), // 查询产品项目成员
        takeLatest(ACTIONS.NOTICE.REQUEST, queryValidNotice),                    // 查询公告列表
        takeLatest(ACTIONS.TRACKINGWORKORDER.REQUEST, queryWorkOrderListByFollowUserId), // 查询跟踪工单列表
        takeLatest(ACTIONS.NOTIFICATION.REQUEST, queryNotificationListByUserId), // 查询本地消息列表
        takeLatest(ACTIONS.UNREAD_NOTIFICATION.REQUEST, queryUnreadNotificationNum), // 查询未读消息
        takeLatest(ACTIONS.APPVERSION.REQUEST, queryLatestVersion),           // 查询最新的app版本
        takeLatest(ACTIONS.BROWSING_HISTORY.OPEN, openDataBase),              // 打开sqlite
        takeLatest(ACTIONS.BROWSING_HISTORY.CLOSE, closeDataBase),            // 关闭sqlite
        takeLatest(ACTIONS.BROWSING_HISTORY.DELETE, deleteDataBase),          // 删除database
        takeEvery(ACTIONS.USER_PASSWORD.UPDATE, updateUserPassword),          // 修改密码
        takeEvery(ACTIONS.FEEDBACK_IMAGE.INSERT, insertFeedbackImage),        // 创建工单上传工单图片
        takeEvery(ACTIONS.FEEDBACK_IMAGE.DELETE, deleteFeedbackImage),        // 删除创建工单回显的图片
        takeEvery(ACTIONS.FEEDBACK_IMAGE.INITIAL, initialFeedbackImage),      // 初始化
        takeEvery(ACTIONS.WORKORDER.INITIAL, initialWorkOrder),               // 初始化
        takeEvery(ACTIONS.WORKORDER.INSERT, insertWorkOrder),                 // 创建工单
        takeEvery(ACTIONS.WORKORDER.DELETE, cleanWorkOrder),                  // 删除工单
        takeEvery(ACTIONS.WORKORDER.UPDATE, updateWorkOrder),                 // 更新工单
        takeEvery(ACTIONS.WORKORDER_DETAIL.UPDATE, updateWODetailState),       // 更改本地数据
        takeEvery(ACTIONS.WORKORDER_REPLY.INSERT, insertWOReplyByOrderCode),  // 插入回复内容
        takeEvery(ACTIONS.LOGIN_GATHER.REQUEST, loginInfoGather),             // 登陆信息填充
        takeEvery(ACTIONS.USER_LIST.REQUEST, receiveUserList),                // 获取本地用户列表
        takeEvery(ACTIONS.USER_LIST.DELETE, deleteUserListByKeyAndId),        // 删除本地用户列表
        takeEvery(ACTIONS.CHAT_LIST.INSERT, insertChatList),                  // 插入聊天个人数据
        takeEvery(ACTIONS.CHAT_LIST.UPDATE, updateChatList),                  // 更新消息列表
        takeEvery(ACTIONS.CHAT_LIST.DELETE, deleteChatList),                  // 删除消息列表
        takeEvery(ACTIONS.ADDRESS_LIST.INSERT, insertAddressList),            // 插入通讯录
        takeEvery(ACTIONS.SYS_LIST.INSERT, insertSysList),                    // 插入聊天系统消息
        takeEvery(ACTIONS.USER_INFO.UPDATE, updateUserInfo),                  // 修改用户信息
        takeEvery(ACTIONS.UPLOAD_AVATAR.INSERT, uploadUserAvatar),            // 上传用户头像
        takeEvery(ACTIONS.USERGROUP_TRACKERS.INSERT, insertWOTrackers),       // 新增跟踪者
        takeEvery(ACTIONS.NOTICE.INITIAL, initialNotice),                     // 初始化公告栏
        takeEvery(ACTIONS.TRACKINGWORKORDER.INITIAL, initWOTracking),         // 初始化我的跟踪
        takeEvery(ACTIONS.TRACKINGWORKORDER.DELETE, cleanWOTrackingByMainCodeAndFollowUserId), // 删除我跟踪的工单
        takeEvery(ACTIONS.TRACKINGWORKORDER.UPDATE, updateWODetailLastReadTimeByOrderCodeAndUserId), // 修改工单最后读取时间
        takeEvery(ACTIONS.NOTIFICATION.INITIAL, initialNotification),         // 初始化通知信息
        takeEvery(ACTIONS.BROWSING_HISTORY.REQUEST, queryHistoryList),        // 查询历史记录
        takeEvery(ACTIONS.BROWSING_HISTORY.INSERT, insertHistory),            // 插入历史记录
        takeEvery(ACTIONS.BROWSING_HISTORY_TABLE.INSERT, createTable),        // 创建表
    ]);
}
