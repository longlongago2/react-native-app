import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { Alert, BackHandler } from 'react-native';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
    const logs = [];
    const sagaMiddleware = createSagaMiddleware({
        emitter(emit) {
            return (action) => {
                if (logs.length < 5) {
                    logs.push(action.type);
                } else {
                    logs.shift();
                    logs.push(action.type);
                }
                emit(action);
            };
        },
        onError(err) {
            Alert.alert(
                '警告',
                `:-( 发生未处理错误：${err.message}，是否将问题提交至后台？`,
                [
                    { text: '退出APP', onPress: () => BackHandler.exitApp() },
                    { text: '取消' },
                    {
                        text: '是的',
                        onPress: () => console.log(`发送邮件！主题：${err.toString()}；内容：距离错误最近的5个action：${logs.toString()}`),
                    },
                ],
                { cancelable: false },
            );
        },
    });
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(sagaMiddleware),
    );
    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);
    return store;
}
