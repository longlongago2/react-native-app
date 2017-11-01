import { stringify } from 'querystring';
import request from '../utils/request';
import api from '../utils/api';

export async function queryPaginationWorkOrderList(params) {
    const { userId, pageNumber, isDel, wStateClient, queryType, token } = params;
    const filter = Object.assign({}, params);  // 存储筛选条件字段，不需要的删掉
    if (typeof filter.userId !== 'undefined') delete filter.userId;
    if (typeof filter.pageNumber !== 'undefined') delete filter.pageNumber;
    if (typeof filter.isDel !== 'undefined') delete filter.isDel;
    if (typeof filter.wStateClient !== 'undefined') delete filter.wStateClient;
    if (typeof filter.queryType !== 'undefined') delete filter.queryType;
    if (typeof filter.token !== 'undefined') delete filter.token;
    return request(`${api.database}/workorders/queryWorkordersByUserId/${userId}/${pageNumber}/${isDel}/${wStateClient}/${queryType}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(filter),
    });
}

export async function insertWorkorderAllMsgByPOJOs(params) {
    return request(`${api.database}/workorders/insertWorkorderAllMsgByPOJOs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}

export async function deleteWorkorderBatchByCodes(params) {
    const { orderCodes, repler, replyInfo, token } = params;
    return request(`${api.database}/workorders/deleteWorkorderBatchByCodes/${orderCodes}/${repler}/${replyInfo}/1/${token}`, {
        method: 'POST',
    });
}

export async function cleanWorkorderBatchByCodes(params) {
    const { orderCodes, token } = params;
    return request(`${api.database}/workorders/cleanWorkorderBatchByCodes/${orderCodes}/${token}`, {
        method: 'POST',
    });
}

export async function restoreWorkerOrderBatchByOrderCodes(params) {
    const { orderCodes, replier, token } = params;
    return request(`${api.database}/workorders/restoreWorkerOrderBatchByOrderCodes/${orderCodes}/${replier}/${token}`, {
        method: 'POST',
    });
}

export async function updateWorkorderAllMsgByPOJOs(params) {
    return request(`${api.database}/workorders/updateWorkorderAllMsgByPOJOs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}

export async function queryPaginationWorkOrderListByFollowUserId(params) {
    const { userId, token } = params;
    const filter = Object.assign({}, params);  // 存储筛选条件字段，不需要的删掉
    if (typeof filter.userId !== 'undefined') delete filter.userId;
    if (typeof filter.token !== 'undefined') delete filter.token;
    return request(`${api.database}/workorders/queryWorkordersByFollowUserId/${userId}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(filter),
    });
}

export async function cleanWorkorderDetailByMainCodesAndFollowUserId(params) {
    const { orderCodes, followUserId, token } = params;
    return request(`${api.database}/workorders/cleanWorkorderDetailByMainCodesAndFollowUserId/${orderCodes}/${followUserId}/${token}`, {
        method: 'GET',
    });
}
