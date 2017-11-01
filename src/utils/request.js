function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           New fetch with some handler
 */
function _fetch(url, options) {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON);
}

const defaultOpts = {
    timeout: 20000,         // 默认超时时间
    credentials: 'include', // 允许跨域携带cookie
};

/**
 * request: fetch with timeout
 * @param url
 * @param options
 * @return {Promise.<{data}>}
 * @private
 */
export default function request(url, options) {
    let abortFn = null;
    const abortPromise = new Promise((resolve, reject) => {
        abortFn = () => reject(new Error('网络请求超时，请稍候重试！'));
    });
    const racePromise = Promise.race([
        _fetch(url, { ...defaultOpts, ...options }),
        abortPromise,
    ]);
    setTimeout(() => abortFn(), options.timeout || defaultOpts.timeout);
    return racePromise
        .then(data => ({ data }))
        .catch(err => ({ err }));
}
