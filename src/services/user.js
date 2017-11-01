import { stringify } from 'querystring';
import request from '../utils/request';
import api from '../utils/api';


// 登录
export async function fetchLogin(params) {
    const { username, password } = params;
    return request(`${api.database}/users/login/${username}/${password}`, {
        method: 'GET',
    });
}

// 登出
export async function fetchLogout() {
    return request(`${api.database}/users/logout`, {
        method: 'POST',
    });
}

// 修改用户信息
export async function updateUserOptions(params) {
    return request(`${api.database}/users/updateUser`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: stringify(params),
    });
}

// 修改密码
export async function updateUserPwd(params) {
    const { oldPassword, newPassword, accessToken, userid } = params;
    return request(`${api.database}/users/updatePassword/${userid}/${oldPassword}/${newPassword}/${accessToken}`, {
        method: 'GET',
    });
}
