import { stringify } from 'qs';
import request from '../utils/request';
import api from '../utils/api';


// 上传文件
export async function fileUpload(formData) {
    return request(`${api.database}/uploadByPC`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        body: formData,
    });
}

// 删除文件
export async function fileDelete(params) {
    const { token, uri } = params;
    const localParams = {
        sessionid: token,
        mediaUrl: `${api.database}/${uri}`,
    };
    return request(`${api.database}/media/deleteMedia`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: stringify(localParams),
    });
}

