/**
 * 通讯录
 * created by zhanqi on 2018-1-22
 */
import createActionTypes from '../../utils/actionSpirit';

export const FRIEND_GROUP = createActionTypes('friend_group'); // 好友分组
export const FRIEND_DETAIL = createActionTypes('friend_detail'); // 好友详情信息
export const CHATGROUP = createActionTypes('chatgroup'); // 群聊
export const CHATGROUP_MEMBERS = createActionTypes('chatgroup_members'); // 群聊成员
