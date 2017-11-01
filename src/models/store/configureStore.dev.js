import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { Alert, BackHandler } from 'react-native';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
    const logs = [];  // action 日志：最多存5条
    const sagaMiddleware = createSagaMiddleware({
        emitter(emit) {
            return (action) => {
                if (logs.length < 5) {
                    logs.push(action.type);
                } else {
                    logs.shift();           // 头部删除
                    logs.push(action.type); // 尾部添加
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
        composeWithDevTools(
            applyMiddleware(sagaMiddleware),
        ),
    );
    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }
    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END); // 中断任务
    return store;
}
