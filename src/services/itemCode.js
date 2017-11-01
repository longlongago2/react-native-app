import request from '../utils/request';
import api from '../utils/api';

export async function queryWOTypeCodeItem(params) {
    const { token } = params;
    return request(`${api.database}/codeitem/queryCodeitemListByCodeItemId/woType/${token}`, {
        method: 'GET',
    });
}

export async function queryWOKindCodeItem(params) {
    const { token } = params;
    return request(`${api.database}/codeitem/queryCodeitemListByCodeItemId/woKind/${token}`, {
        method: 'GET',
    });
}

export async function queryProductsCodeItemByUserId(params) {
    const { userid, token } = params;
    return request(`${api.database}/product/queryProductsByUserId/${userid}/${token}`, {
        method: 'GET',
    });
}
