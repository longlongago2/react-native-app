/**
 * __DEV__：true 调试状态 false 生产状态
 * @type {{default?}|configureStore}
 */
module.exports = __DEV__ ? require('./configureStore.dev') : require('./configureStore.pro');
