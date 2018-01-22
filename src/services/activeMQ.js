import request from '../utils/request';
import api from '../utils/api';

export async function sendMSG(params) {
    return request(`${api.database}/chat/sendMSG`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
}
