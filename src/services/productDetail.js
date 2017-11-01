/** created by zhangqi on 2017-9-15 */
import { stringify } from 'querystring';
import request from '../utils/request';
import api from '../utils/api';

export async function queryProductDetailByProductid(params) {
    const { productid, token } = params;
    return request(`${api.database}/product/queryProductByCode/${productid}/${token}`, {
        method: 'GET',
    });
}
