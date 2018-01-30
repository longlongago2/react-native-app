import request from '../utils/request';
import api from '../utils/api';

// 查询所有用户组
export async function queryAllUserGroup(params) {
    const { token } = params;
    return request(`${api.database}/usergroups/queryUsergroupsTreeAllMsg/${token}`, {
        method: 'GET',
    });
}

// 查询用户组下的详情信息
export async function queryUserGroupDetailByGroupId(params) {
    const { token, groupId } = params;
    return request(`${api.database}/users/queryUsersOrGroupByUserGroupCodeHaveChild/${groupId}/0/${token}`, {
        method: 'GET',
    });
}

// 查询可以指派的人员
export async function queryUserGroupAssignedByProductCode(params) {
    const { token, productId } = params;
    return request(`${api.database}/product/queryPersonNameByProductCode/${productId}/${token}`, {
        method: 'GET',
    });
}

// 新增跟踪人员
export async function insertWorkOrderTrackers(params) {
    const { token, orderCode, woDetail } = params;
    return request(`${api.database}/workorders/insertWorkorderDetailBatchByMainCodeAndWorkororderDetailArr/${orderCode}/${woDetail}/${token}`, {
        method: 'GET',
    });
}

