const api = {
    debug: {
        database: 'http://192.168.1.101/CFSP',
        activeMQ: 'tcp://192.168.1.101:1883',
    },
    release: {
        database: 'http://cfsoft.8866.org:10101/CFSP',
        activeMQ: 'tcp://cfsoft.8866.org:11883',
    },
};

if (__DEV__) {
    module.exports = api.debug;
} else {
    module.exports = api.release;
}
