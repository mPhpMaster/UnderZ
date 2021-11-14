(
    function (window, document) {
        // loaded files
        const __loaders = [];

        const loader = function () {
            // Function which returns a function: https://davidwalsh.name/javascript-functions
            function _load(tag) {
                return function (url) {
                    if (_z.isArguments(url)) url = _z.Array(url);

                    var cb = _z.isArray(url) ? url.slice(1) : false;
                    url = _z.isArray(url) ? url[0] : url;
                    cb = cb && cb.length ? (cb[0] || false) : false;


                    if (_z['isLoaded'] && _z['isLoaded'](url))
                        return new Promise(function (resolve, reject) {
                            reject("file exist");
                        });

                    let _url = String(url).split('/');
                    if (_url && _url.length)
                        __loaders.push(_url);
                    else
                        __loaders.push(url.replace(/^.*[\\\/]/, ''));

                    var loadInBody = false;
                    tag = tag.trim().toLowerCase();
                    if ((document.readyState !== 'complete' && tag === 'script') || ((loadInBody = true) && tag === 'script')) {
                        return new Promise(function (resolve, reject) {
                            try {
                                // _z.execScript({ src: url });
                                _z(loadInBody ? "body" : "head").append(
                                    '<script type="text/javascript" class="_z-loader" src="'
                                    + url
                                    + '"></script>');
                            } catch (_err) {
                                reject(_err);
                            }

                            try {
                                if (cb && _z.isFunction(cb)) cb();
                            } catch (_err) {
                                reject(_err);
                            }

                            resolve(true);
                        });
                    } else {
                        // todo: when this code is active
                        console.log([
                            document.readyState,
                            tag,
                            cb,
                            url,
                        ]);
                    }

                    if (tag === 'data') {
                        try {
                            if (cb && _z.isFunction(cb)) {
                                return _z.URLToBlob64(url, cb);
                            }
                        } catch (_err) {
                        }
                        return false;
                    }
                    // This promise will be used by Promise.all to determine success or failure
                    return new Promise(function (resolve, reject) {
                        var element = document.createElement(tag);
                        var parent = 'body';
                        var attr = 'src';

                        // Important success and error for the promise
                        element.onload = function () {
                            if (cb && _z.isFunction(cb)) cb();

                            resolve(url);
                        };
                        element.onerror = function () {
                            reject(url);
                        };

                        // Need to set different attributes depending on tag type
                        switch (tag) {
                            case 'script':
                                element.async = false;
                                break;
                            case 'link':
                                element.type = 'text/css';
                                element.rel = 'stylesheet';
                                attr = 'href';
                                parent = 'head';
                        }

                        // Inject into document to kick off loading
                        element[attr] = url;
                        document[parent].appendChild(element);
                        resolve([element]);
                    });
                };
            }

            return {
                css: _load('link'),
                js: _load('script'),
                data: _load('data'),
            }
        };

// loader include js, css, data
        _z.join({
            // check if file has been loaded
            isLoaded: function (f) {
                // var f = "a/b/c.d";
                if (!!!f) return false;

                var a = String(f).split('/');
                a = _z.isArray(a) ? a.reverse() : [];

                var returns = false;
                for (var ii = 0, LIL = __loaders.length; ii < LIL; ii++) {
                    var a2 = __loaders[ii];
                    a2 = _z.isArray(a2) ? Array.from(a2).reverse() : [];

                    returns = true;
                    for (var i = 0, aL = a.length; i < aL; i++)
                        if (a[i] != a2[i]) {
                            returns = false;
                            break;
                        }

                    if (returns) return returns;
                }

                return returns;
            },

            // load single
            loader: loader(),

        })
            .core();
    }
)
(
    this, this.document || {
    isdocument: false,
    getRootNode: () => {
    },
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
},
);
