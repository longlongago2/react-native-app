const api = {
    debug: {
        database: 'http://192.168.1.101:80/CFSP',
        webSocket: 'ws://192.168.1.101:80/CFSP',
    },
    release: {
        database: 'http://www.ezhr.com.cn:10101/CFSP',
        webSocket: 'ws://www.ezhr.com.cn:10101/CFSP',
    },
};

if (__DEV__) {
    module.exports = api.debug;
} else {
    module.exports = api.release;
}
