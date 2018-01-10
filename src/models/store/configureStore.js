/**
 * dev：工程版本，pro：生产版本
 * @type {{default?}|configureStore}
 */
module.exports = __DEV__ ? require('./configureStore.dev') : require('./configureStore.pro');
