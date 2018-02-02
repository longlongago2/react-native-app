/**
 * 通讯录相关services
 * created by zhangqi on 2018-1-22
 * */
import { stringify } from 'qs';
import request from '../utils/request';
import api from '../utils/api';

/**
 * 根据 userId 查询所有好友分组
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function queryAllFriendGroup(params) {
    const { userId } = params;
    return request(`${api.database}/chat/queryFriendGroupsByUserId/${userId}`, {
        method: 'GET',
    });
}

/**
 * 根据 userId 查询该用户所有好友信息
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function queryAllFriendMsg(params) {
    const { userId } = params;
    return request(`${api.database}/chat/queryFriendsMsg/${userId}`, {
        method: 'GET',
    });
}

/**
 * 根据 friendGroup 对象新增好友分组
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function insertFriendGroupByPOJO(params) {
    return request(`${api.database}/chat/insertFriendGroupByPOJO`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}

/**
 * 根据 friend 对象新增好友
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function insertFriendByPOJO(params) {
    return request(`${api.database}/chat/insertFriendByPOJO`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}

/**
 * 根据 chatUserGroup 对象新增 群聊
 * @param params
 * @returns {Promise.<void>}
 */
export async function insertChatUserGroupByPOJO(params) {
    return request(`${api.database}/chat/insertChatUsergroupByPOJO`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}

/**
 * 根据 chatGroupsToUser 对象添加 群聊成员
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function insertChatUserGroupToUserByPOJO(params) {
    return request(`${api.database}/chat/insertChatUsergroupToUserByPOJO`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}

/**
 * 根据 userId 查询群聊列表
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function queryChatUserGroupByUserId(params) {
    const { userId } = params;
    return request(`${api.database}/chat/queryChatUsergroupsByUserId/${userId}`, {
        method: 'GET',
    });
}

/**
 * 根据 chatUserGroupid 查询群聊 成员
 * @param params
 * @returns {Promise.<{data}>}
 */
export async function queryChatGroupToUserByChatUserGroupId(params) {
    const { chatUserGroupId } = params;
    return request(`${api.database}/chat/queryChatgroupsToUserByChatusergroupId/${chatUserGroupId}`, {
        method: 'GET',
    });
}

