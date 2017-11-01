import request from '../utils/request';
import api from '../utils/api';

export async function queryUnreadNotificationNumByUserId(params) {
    const { userId, accessToken } = params;
    return request(`${api.database}/message/queryNotReadMessageCount/${userId}/${accessToken}`, {
        method: 'GET',
    });
}

export async function queryNotificationPaginationByUserId(params) {
    const { userId, pageNumber, accessToken } = params;
    return request(`${api.database}/message/queryMessageByUserId/${userId}/${pageNumber}/${accessToken}`, {
        method: 'GET',
    });
}
