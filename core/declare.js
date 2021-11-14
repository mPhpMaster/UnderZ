(
    function (window, document) {
        // check if this module is _z declare system & exist
        var isDeclare = function isDeclare(module, obj) {
            obj = obj || false;
            if (obj === false)
                return _z.isset(_z['declaresMap']) && _z.isset(_z['declaresMap'][module]) && isDeclare(
                    module,
                    _z['declaresMap'][module],
                ) || false;

            return obj
                && _z.isset(obj['declares'])
                && _z.isset(obj['declares'][module])
                && obj['declares'][module]
                || false;
        };
        _z.extend.validators.push((prop, obj) => !isDeclare(prop, obj));

// declare module system
        _z.join({
            // defaultValues
            dec_Default: {
                // moduleName
                id: "",

                // registery of all requirments
                requires: "",

                // is module requirments loaded
                loaded: false,

                // default main function
                callback: false,

                // default init function
                initFunction: "",

                // call when module requesting function, return false = cancel load
                whenRequest: "",

                // register this module in window.[MODULE]
                global: function global() {
                    if (_z.isset(this.global.registered) && this.global.registered === true) return this;

                    this.global.registered = true;
                    // todo:
                    return this.hook(window);
                    var w = window;
                    if (!_z.isWindow(w)) return console.error("UnderZ["
                        + this.id
                        + "]: No Window Found."), this;

                    if (_z.isset(w[this.id])) return console.error("UnderZ["
                        + this.id
                        + "]: Already Exist!"), this;

                    this.global.registered = true;
                    return this.hook(window);
                },

                // recall function after while
                timeout: function timeout(method, limiter) {
                    if (!!method && _z.isFunction(method)) {
                        if (limiter) { // limiter = seconds of tryng
                            limiter = (
                                (
                                    parseFloat(limiter - 1) * 1000
                                ) / 10
                            ) || 0;
                            this.limiter = this.limiter || 0;

                            if (limiter)
                                if ((
                                    parseFloat(this.limiter) * 10
                                ) > limiter) return;
                                else this.limiter++;
                        }

                        if (this.timeout.timeoutHandler)
                            clearTimeout(this.timeout.timeoutHandler);

                        this.timeout.timeoutHandler = setTimeout(method, 100);
                    }

                    return this;
                },

                // set requirment of module ( execute before load module )
                require: function require(req) {
                    if (!!req) this.requires.push(req);

                    return this;
                },

                // call when module requesting, return false = cancel load
                onRequest: function whenRequest(fn) {
                    if (!!fn && _z.isFunction(fn))
                        this.whenRequest = fn;

                    return this;
                },

                // set main module function ( execute when function called )
                method: function method(method) {
                    if (!!method && _z.isFunction(method))
                        this.callback = method;

                    // check if load request sent
                    if (this.loaded && this.loaded === true)
                        this.init(_z.trueFunction);

                    return this;
                },

                // execute right now, if return true load all requirments
                init: function init(method) {
                    if (!!method && _z.isFunction(method)) {
                        if (method.apply(this) == true && this.whenRequest.apply(this) !== false) {
                            this.loadDeclare.apply(this);
                        }
                    }

                    return this;
                },

                // todo: load method when called
                // try to load requirments
                loadDeclare: function loadDeclare() {
                    var module = this || false;
                    if (!!!module || module.loaded) return this.callback || this;

                    if (module.whenRequest.apply(module) === false) return this;

                    if (module.requires.length) {
                        _z(module.requires).each(function () {
                            if (!!!this || this['loaded']) return this;

                            if (_z.isFunction(this)) {
                                this.apply(this);

                            } else if (this['js']) {
                                _z.loader.js(this['js']);

                            } else if (this['css']) {
                                _z.loader.css(this['css']);
                            }
                            this.loaded = true;
                        });
                    }
                    this.loaded = true;

                    return this.callback || this;
                },

                // declare new module in specifiec object
                hook: function hookObject(obj) {
                    if (!_z.isObject(obj)
                        && !_z.isArray(obj)
                        && !_z.isFunction(obj)
                        && !_z.isWindow(obj))
                        obj = false;

                    if (obj) {
                        // register main function
                        var loadDeclareCallback = this.loadDeclare.bind(this);

                        // register loader
                        Object.defineProperty(
                            obj,
                            this.id,
                            {get: loadDeclareCallback, configurable: !!!_z.isCore(obj)},
                        );
                    }

                    return this;
                },
            },

            // registery of all declareed modules for this Object
            declares: {},

            // registery of all declareed modules => object
            declaresMap: {},

            // check if this module is _z declare system & exist
            isDeclare: isDeclare,

            // declare new module
            declare: function declare(module, obj) {
                var hook = {
                    obj: _z.getSet(obj, this),
                    module: module,
                };
                var newDeclare = _z.extend({}, _z.dec_Default);

                if (!_z.isArray(newDeclare.requires))
                    newDeclare.requires = [];

                if (!_z.isFunction(newDeclare.initFunction))
                    newDeclare.initFunction = _z.trueFunction;

                if (!_z.isFunction(newDeclare.whenRequest))
                    newDeclare.whenRequest = _z.trueFunction;

                if (!!!module) return newDeclare;

                if (!_z.isset(hook.obj['declares'])) hook.obj['declares'] = {};

                if (isDeclare(module)) return isDeclare(module);

                newDeclare.id = module;
                hook.obj['declares'][module] = newDeclare;

                // register this plugin in Map
                _z.declaresMap[module] = hook.obj;

                // register main function
                hook.obj[module] = _z.getDeclare.bind(hook.obj, module);
                var loadDeclareCallback = () => newDeclare.loadDeclare.apply(newDeclare);

                // register loader
                Object.defineProperty(
                    hook.obj,
                    module,
                    {get: loadDeclareCallback, configurable: !!!_z.isCore(obj)},
                );

                return newDeclare;
            },

            // main function loader
            getDeclare: function getDeclare(moduleName) {
                var module = this.declares[moduleName] || false;

                if (!!!module) {
                    console.warn("Module Not Found: " + moduleName);
                    return _z.emptyFunction;
                }

                // try to load requirments
                module.loadDeclare();

                if (module.callback && _z.isFunction(module.callback)) {
                    var handler = this,
                        arg = arguments;
                    return module.callback.apply(handler, _z(arg).subArray(1) || []);
                }

                return this;
            },
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
