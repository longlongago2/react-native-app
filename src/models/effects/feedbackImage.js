import { call, put, select } from 'redux-saga/effects';
import uuid from 'uuid/v4';
import { fileUpload, fileDelete } from '../../services/fileOperation';
import ACTIONS from '../actions';


/**
 * 异步方法：上传并回显图片业务逻辑
 * @param image
 */
function* fileUploadGenerator(image) {
    const formData = new FormData();
    const fileName = image.path.split('/').slice(-1);
    const file = {
        uri: image.path,
        type: 'multipart/form-data',
        name: `_react_native_image_${fileName}`,
    };
    formData.append('file', file);
    const { data, err } = yield call(fileUpload, formData);
    if (data && data.data.status === '20000') {
        const uri = (data.data.info.url).replace('download?fileUrl=', '');
        const feedbackImage = {
            key: uuid(),  // 随机生成
            uri,
        };
        const { feedbackImageList } = yield select(state => state.feedbackImage);
        const newFeedbackImageList = feedbackImageList.concat();
        newFeedbackImageList.push(feedbackImage); // 新的回显图片数组
        yield put({
            type: ACTIONS.FEEDBACK_IMAGE.SUCCESS,
            payload: {
                feedbackImageList: newFeedbackImageList,
            },
        });
    } else {
        const message = (err && err.message) || (data && data.data.info);
        yield put({
            type: ACTIONS.FEEDBACK_IMAGE.FAILURE,
            payload: {
                message,
            },
        });
    }
}

/**
 * ACTIONS.FEEDBACK_IMAGE.INSERT 触发
 * @param payload
 */
export function* insertFeedbackImage({ payload }) {
    const { online } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.FEEDBACK_IMAGE.LOADING,
            payload: {
                loading: true,
            },
        });
        const { images } = payload;
        if (Array.isArray(images) && images.length > 0) {
            // 上传多张图片
            for (let i = 0; i < images.length; i++) {
                yield fileUploadGenerator(images[i]);
            }
        }
    }
}

/**
 * ACTIONS.FEEDBACK_IMAGE.DELETE 触发
 * @param payload
 */
export function* deleteFeedbackImage({ payload }) {
    const { online, token, feedbackImageList } = yield select(state => ({
        online: state.user.online,
        token: state.user.token,
        feedbackImageList: state.feedbackImage.feedbackImageList,
    }));
    if (online) {
        yield put({
            type: ACTIONS.FEEDBACK_IMAGE.LOADING,
            payload: {
                loading: true,
            },
        });
        const { key, uri } = payload;
        const params = { token, uri };
        const { data, err } = yield call(fileDelete, params);
        if (data && data.data.status === '20100') {
            const newFeedbackImageList = feedbackImageList.concat()
                .filter(item => item.key !== key);
            yield put({
                type: ACTIONS.FEEDBACK_IMAGE.SUCCESS,
                payload: {
                    feedbackImageList: newFeedbackImageList,
                },
            });
        } else {
            const message = (err && err.message) || (data && data.data.info);
            yield put({
                type: ACTIONS.FEEDBACK_IMAGE.FAILURE,
                payload: {
                    message,
                },
            });
        }
    }
}

/**
 * ACTIONS.FEEDBACK_IMAGE.INITIAL 触发
 * @param payload
 */
export function* initialFeedbackImage({ payload }) {
    const { online } = yield select(state => state.user);
    if (online) {
        yield put({
            type: ACTIONS.FEEDBACK_IMAGE.SUCCESS,
            payload,
        });
    }
}
