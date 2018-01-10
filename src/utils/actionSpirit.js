export const INSERT = 'INSERT';    // ACTION:增
export const DELETE = 'DELETE';    // ACTION:删
export const UPDATE = 'UPDATE';    // ACTION:改
export const REQUEST = 'REQUEST';  // ACTION:查
export const LOADING = 'LOADING';  // REDUCER:加载
export const SUCCESS = 'SUCCESS';  // REDUCER:成功
export const FAILURE = 'FAILURE';  // REDUCER:失败
export const INITIAL = 'INITIAL';  // REDUCER:初始值

/**
 * 基于 base action 创建 action 的 7 种形态
 * @param base {string}
 * @return {object} 返回结果 { REQUEST:'BASE_REQUEST', SUCCESS:'BASE_SUCCESS', FAILURE:'BASE_FAILURE' }
 */
export default function createActionTypes(base) {
    const upperBase = base.toUpperCase();
    return [INSERT, DELETE, UPDATE, REQUEST, LOADING, SUCCESS, FAILURE, INITIAL]
        .reduce((acc, type) => {
            acc[type] = `${upperBase}_${type}`;
            return acc;
        }, {});
}
