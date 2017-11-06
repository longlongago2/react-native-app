import { call, put, select } from 'redux-saga/effects';
import { ToastAndroid } from 'react-native';
import ACTIONS from '../actions';
import {
    queryPaginationWorkOrderList,
    insertWorkorderAllMsgByPOJOs,
    cleanWorkorderBatchByCodes,
    restoreWorkerOrderBatchByOrderCodes,
    updateWorkorderAllMsgByPOJOs,
    deleteWorkorderBatchByCodes,
} from '../../services/workorder';

/**
 * ACTIONS.WORKORDER.REQUEST 触发
 * @param payload
 */
export function* queryWorkOrderList({ payload }) {
    const { stateName, stateValue } = payload;
    const { pageNumber, workorderList } = yield select(state => state.workorder[stateName]);
    const { online, userInfo, token } = yield select(state => state.user);
    if (online) {
        const locals = {
            pageNumber,
            userId: userInfo.userid,
            token,
        };
        const params = { ...locals, ...stateValue };
        if (params.pageNumber <= 0) {
            yield put({
                type: ACTIONS.WORKORDER.LOADING,
                payload: {
                    stateName,
                    stateValue: {
                        loading: true,
                    },
                },
            });
        } else {
            yield put({
                type: ACTIONS.WORKORDER.LOADING,
                payload: {
                    stateName,
                    stateValue: {
                        pageLoading: true,
                    },
                },
            });
        }
        const { data, err } = yield call(queryPaginationWorkOrderList, params);
        if (data && data.data.status === '20100') {
            const paginationData = data.data.info;
            let newPageNumber;
            let newWorkorderList;
            let newLoaded;
            if (paginationData.length === 0) {
                // 数据全部加载完毕
                newPageNumber = pageNumber;
                newWorkorderList = workorderList;
                newLoaded = true;
            } else {
                newPageNumber = parseInt(pageNumber, 0) + 1;
                newWorkorderList = workorderList.concat(paginationData);
                newLoaded = false;
            }
            yield put({
                type: ACTIONS.WORKORDER.SUCCESS,
                payload: {
                    stateName,
                    stateValue: {
                        pageNumber: newPageNumber,
                        workorderList: newWorkorderList,
                        loaded: newLoaded,
                    },
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WORKORDER.FAILURE,
                payload: {
                    stateName,
                    message,
                },
            });
        }
    } else {
        yield put({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
            params: null,
        });
    }
}

/**
 * ACTIONS.WORKORDER.INSERT 触发
 * @param payload
 */
export function* insertWorkOrder({ payload }) {
    const { online, token, userInfo } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.WORKORDER.LOADING,
            payload: {
                loading: true,
            },
        });
        const locals = {
            accessToken: token,
            userid: userInfo.userid,
        };
        const params = { ...locals, ...payload };
        const { data, err } = yield call(insertWorkorderAllMsgByPOJOs, params);
        if (data && data.data.status === '20100') {
            yield put({ type: ACTIONS.WORKORDER.SUCCESS });
            ToastAndroid.show('创建成功！', 3000);
            yield put({
                type: 'Navigation/BACK',
                key: null,
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WORKORDER.FAILURE,
                payload: {
                    message,
                },
            });
        }
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 *  ACTIONS.WORKORDER.UPDATE 触发
 * @param payload
 */
export function* updateWorkOrder({ payload }) {
    const { stateName, stateValue } = payload;
    const { online, token, userInfo } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.WORKORDER.LOADING,
            payload: {
                stateName,
                stateValue: {
                    loading: true,
                },
            },
        });
        const payloadParams = stateValue.params;
        const { workorderList } = yield select(state => state.workorder[stateName]);
        switch (stateValue.todo) {
            case 'update':
                yield put({
                    type: ACTIONS.WORKORDER.LOADING,
                    payload: {
                        loading: true,
                    },
                });
                // 常规修改
                const updateParams = {
                    accessToken: token,
                    ...payloadParams,
                };
                if (!updateParams.ordercode) throw new Error('更新工单需要ordercode');
                const { data, err } = yield call(updateWorkorderAllMsgByPOJOs, updateParams);
                if (data && data.data.status === '20100') {
                    const newItemAttr = Object.assign({}, payloadParams);
                    delete newItemAttr.mediaInfo;  // 非原始属性
                    delete newItemAttr.mediaType;  // 非原始属性
                    delete newItemAttr.repler;     // 非原始属性
                    delete newItemAttr.replyInfo;  // 非原始属性
                    let newWorkorderList = workorderList.concat();
                    newWorkorderList = newWorkorderList.map((item) => {
                        if (item.ordercode === payloadParams.ordercode) {
                            return {
                                ...item,
                                ...newItemAttr,
                            };
                        }
                        return item;
                    });
                    yield put({
                        type: ACTIONS.WORKORDER.SUCCESS,
                        payload: {
                            stateName,
                            stateValue: {
                                workorderList: newWorkorderList,
                            },
                        },
                    });
                    ToastAndroid.show(`工单编号：${payloadParams.ordercode}，修改成功！`, 5000);
                    yield put({ type: 'Navigation/BACK' });
                } else {
                    const message = (err && err.message) || (data && data.data.info);
                    yield put({
                        type: ACTIONS.WORKORDER.FAILURE,
                        payload: {
                            stateName,
                            message,
                        },
                    });
                }
                break;
            case 'delete':
                // 假删操作
                const deleteParams = {
                    repler: userInfo.userid,
                    replyInfo: '删除工单到回收站',
                    token,
                    ...payloadParams,
                };
                const {
                    data: _data,
                    err: _err,
                } = yield call(deleteWorkorderBatchByCodes, deleteParams);
                if (_data && _data.data.status === '20100') {
                    const orderCodesArr = payloadParams.orderCodes.split(',');
                    let newWorkorderList = workorderList.concat();
                    orderCodesArr.forEach((orderCode) => {
                        newWorkorderList = newWorkorderList.filter(item => (
                            item.ordercode !== orderCode
                        ));
                    });
                    yield put({
                        type: ACTIONS.WORKORDER.SUCCESS,
                        payload: {
                            stateName,
                            stateValue: {
                                workorderList: newWorkorderList,
                            },
                        },
                    });
                    ToastAndroid.show('删除成功，工单放入回收站！', 3000);
                } else {
                    const message = (_err && _err.message) || (_data && _data.data.info);
                    yield put({
                        type: ACTIONS.WORKORDER.FAILURE,
                        payload: {
                            stateName,
                            message,
                        },
                    });
                }
                break;
            case 'restore':
                // 还原
                const restoreParams = {
                    replier: userInfo.userid,
                    token,
                    ...payloadParams,
                };
                const {
                    data: __data,
                    err: __err,
                } = yield call(restoreWorkerOrderBatchByOrderCodes, restoreParams);
                if (__data && __data.data.status === '20100') {
                    const orderCodesArr = payloadParams.orderCodes.split(',');
                    let newWorkorderList = workorderList.concat();
                    orderCodesArr.forEach((orderCode) => {
                        newWorkorderList = newWorkorderList.filter(item => (
                            item.ordercode !== orderCode
                        ));
                    });
                    yield put({
                        type: ACTIONS.WORKORDER.SUCCESS,
                        payload: {
                            stateName,
                            stateValue: {
                                workorderList: newWorkorderList,
                            },
                        },
                    });
                    ToastAndroid.show('工单已还原', 3000);
                } else {
                    const message = (__err && __err.message) || (__data && __data.data.info);
                    yield put({
                        type: ACTIONS.WORKORDER.FAILURE,
                        payload: {
                            stateName,
                            message,
                        },
                    });
                }
                break;
            case 'recall':
            case 'reSubmit':
            case 'reAssign':
                let params;
                if (stateValue.todo === 'recall') {
                    // 撤回
                    params = {
                        accessToken: token,
                        ordercode: payloadParams.orderCode,
                        wstateclient: 0,
                        wstateemployee: 0,
                    };
                }
                if (stateValue.todo === 'reSubmit') {
                    // 重新提交
                    params = {
                        accessToken: token,
                        ordercode: payloadParams.orderCode,
                        wstateclient: 1,
                        wstateemployee: 0,
                        replyinfo: '工单重新提交',
                        repler: userInfo.userid,
                        isinside: 1,
                    };
                }
                if (stateValue.todo === 'reAssign') {
                    // 重新指派
                    params = {
                        accessToken: token,
                        ordercode: payloadParams.orderCode,
                        assigneduserid: payloadParams.assignedUserId,
                        assignedusername: payloadParams.assignedUserName,
                        repler: userInfo.userid,
                        replyinfo: payloadParams.replyInfo,
                        isinside: 1,
                    };
                }
                const {
                    data: ___data,
                    err: ___err,
                } = yield call(updateWorkorderAllMsgByPOJOs, params);
                if (___data && ___data.data.status === '20100') {
                    let newWorkorderList = workorderList.concat();
                    newWorkorderList = newWorkorderList.filter(item => (
                        item.ordercode !== payloadParams.orderCode
                    ));
                    yield put({
                        type: ACTIONS.WORKORDER.SUCCESS,
                        payload: {
                            stateName,
                            stateValue: {
                                workorderList: newWorkorderList,
                            },
                        },
                    });
                } else {
                    const message = (___err && __err.message) || (___data && ___data.data.info);
                    yield put({
                        type: ACTIONS.WORKORDER.FAILURE,
                        payload: {
                            stateName,
                            message,
                        },
                    });
                }
                break;
            default:
        }
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 *  ACTIONS.WORKORDER.INITIAL 触发
 * @param payload
 */
export function* initialWorkOrder({ payload }) {
    const { stateName, stateValue } = payload;
    const { online } = yield select(state => state.user);
    if (online) {
        // 初始化
        yield put({
            type: ACTIONS.WORKORDER.SUCCESS,
            payload: {
                stateName,
                stateValue: {
                    pageNumber: 0,
                    workorderList: [],
                    loaded: false,
                    ...stateValue,
                },
            },
        });
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}

/**
 * ACTIONS.WORKORDER.DELETE
 * @param payload
 */
export function* cleanWorkOrder({ payload }) {
    const { stateName, stateValue } = payload;
    const { online, token } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.WORKORDER.LOADING,
            payload: {
                stateName,
                stateValue: {
                    loading: true,
                },
            },
        });
        const params = {
            token,
            orderCodes: stateValue.orderCodes,
        };
        const { err, data } = yield call(cleanWorkorderBatchByCodes, params);
        if (data && data.data.status === '20100') {
            const { workorderList } = yield select(state => state.workorder[stateName]);
            const orderCodesArr = stateValue.orderCodes.split(',');
            let newWorkorderList = workorderList.concat();
            orderCodesArr.forEach((orderCode) => {
                newWorkorderList = newWorkorderList.filter(item => (
                    item.ordercode !== orderCode
                ));
            });
            yield put({
                type: ACTIONS.WORKORDER.SUCCESS,
                payload: {
                    stateName,
                    stateValue: {
                        workorderList: newWorkorderList,
                    },
                },
            });
            ToastAndroid.show('工单删除成功', 3000);
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.WORKORDER.FAILURE,
                payload: {
                    stateName,
                    message,
                },
            });
        }
    } else {
        ToastAndroid.show('尚未登录', 3000);
    }
}
