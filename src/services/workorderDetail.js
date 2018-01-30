import { stringify } from 'qs';
import request from '../utils/request';
import api from '../utils/api';

export async function queryWorkorderDetailByOrdercode(params) {
    const { orderCode, token } = params;
    return request(`${api.database}/workorders/queryWorkorderAllMsgByOrderCode/${orderCode}/${token}`, {
        method: 'GET',
    });
}

export async function queryWorkorderReplyByOrdercode(params) {
    const { orderCode, isInside, token } = params;
    return request(`${api.database}/workorders/queryWorkorderRepByOrderCode/${orderCode}/${isInside}/${token}`, {
        method: 'GET',
    });
}

export async function insertWorkorderReplyByOrdercode(params) {
    return request(`${api.database}/workorders/insertWorkorderRepliesByPOJOs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: stringify(params),
    });
}
