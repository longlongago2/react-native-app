/** created by zhangqi on 2017-11-02 */
import { stringify } from 'querystring';
import request from '../utils/request';
import api from '../utils/api';

/**
 * 查询最新版本号
 * @returns {Promise.<{data}>}
 */
export async function queryTheNewestVersion() {
    return request(`${api.database}/version/queryTheNewestVersion`, {
        method: 'GET',
    });
}
