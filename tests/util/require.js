module.exports = function() {
    window.require = function require(url) {
        const cache = require.cache = require.cache || {};
        
        async function _require(url) {
            const module = {
                name: url,
                url
            };

            /*eslint-disable no-unused-vars*/
            let exports = module.exports = {};

            const code = await new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();

                request.onload = () => {
                    resolve(request.responseText);
                };

                request.onerror = err => {
                    reject(new Error(`Failed to load module ${url}: ${err.toString()}`));
                };

                request.open('GET', url);
                request.send();
            });

            eval(code);

            return module.exports;
        }

        return cache[url] || (cache[url] = _require(url));
    };
};
