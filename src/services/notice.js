import request from '../utils/request';
import api from '../utils/api';

export default async function queryValidNoticeByExpirationTime(params) {
    const { expirationTime, pageNumber, accessToken } = params;
    return request(`${api.database}/notice/queryNoticeByExpirationtime/${expirationTime}/${pageNumber}/${accessToken}`, {
        method: 'GET',
    });
}
