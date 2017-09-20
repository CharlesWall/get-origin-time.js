const DEFAULT_URL = window.location.origin;
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_METHOD = 'HEAD';

module.exports = function getDomainTime(options) {
    let {url, method, timeout} = options;

    url = url || DEFAULT_URL;
    method = method || DEFAULT_METHOD;
    timeout = timeout || DEFAULT_TIMEOUT;

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        let timeoutId;
        if (timeout > 0) {
            timeoutId = setTimeout(function() {
                reject(new Error(`Timed out after ${timeout}ms trying to get time from ${url}`));
            }, timeout);
        }
        request.onload = function() {
            const time = this.getResponseHeader('Date');
            timeoutId && clearTimeout(timeoutId);
            resolve(time);
        };

        request.onerror = function(err) {
            timeoutId && clearTimeout(timeoutId);
            reject(err);
        };
        request.open(method, url);
        request.send();
    });
};
