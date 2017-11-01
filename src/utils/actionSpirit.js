const INSERT = 'INSERT';    // ACTION:增
const DELETE = 'DELETE';    // ACTION:删
const UPDATE = 'UPDATE';    // ACTION:改
const REQUEST = 'REQUEST';  // ACTION:查
const LOADING = 'LOADING';  // REDUCER:加载
const SUCCESS = 'SUCCESS';  // REDUCER:成功
const FAILURE = 'FAILURE';  // REDUCER:失败
const INITIAL = 'INITIAL';  // REDUCER:初始值

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
