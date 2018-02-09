/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Root from './src/routes';
import configureStore from './src/models/store/configureStore';
import rootSaga from './src/models/effects';

export const store = configureStore();

export default class App extends Component {
    render() {
        if (!global.saga) {
            global.saga = store.runSaga(rootSaga);
        }
        return (
            <Provider store={store}>
                <Root />
            </Provider>
        );
    }
}
