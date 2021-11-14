(
    function (window, document) {
// Function.bindWith(...arguments) = Function.bind( Function, arguments )
        if (typeof Function.prototype.bindWith !== 'function')
            Object.defineProperty(Function.prototype, 'bindWith', {
                value() {
                    return this.bind(this, ...arguments);
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// todo: add in wiki (added local)
// Object.getSize => size of object
        if (typeof Object.prototype.getSize !== 'function')
            Object.defineProperty(Object.prototype, 'getSize', {
                value(obj) {
                    obj = obj || this;
                    return (['string', 'object'].includes(typeof obj) && obj.length) ? obj.length : Object.keys(obj || {}).length || 0;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// is it real document
        if (!("isdocument" in document)) {
            document.isdocument = true;
        }
// variables
        // window - private var
        window = window || this;

        var
            // document - private var
            doc = window.document || this.document || document || this,

            // empty function
            emptyFunction = new Function(" "),

            // function return true
            trueFunction = () => true,

            // function return false
            falseFunction = () => false,

            // undefined as a string
            Undefined = 'undefined',

            // read HTMLCollection
            HTMLCollection = !window['HTMLCollection'] ? emptyFunction : window['HTMLCollection'],

            // global variable - public var for private use in window.gVar
            gVar = window.gVar || (
                window.gVar = gVar = {}
            ),

            // global jQuery - private var
            globaljQuery = window["jQuery"] || new Function("return false"),

            // engine version - public var in _z.$.underZ, _z.selectorHistoryController.prototype.underZ, _z.$.newSelector.prototype.underZ
            version = '1.1.2',

            // set prototype of function and return it - private function
            newClass = function setFunctionPtoyotype(f, p) {
                let func = f ? f : () => {
                };
                try {
                    f.prototype = p ? p : () => {
                    };
                } catch (e) {
                    (f = () => {
                    }).prototype = {};
                }
                return f;
            },

            // fix: global Element for workers
            Element = "Element" in window ? window["Element"] : newClass(),

            // prototypes of objects - public var in _z.$underz.prototypies
            prototypies = {
                object: Object && Object.prototype || emptyFunction,
                element: Element.prototype,
                array: Array && Array.prototype || emptyFunction,
                likeArray: {
                    push: [].push,
                    sort: [].sort,
                    splice: [].splice,
                },

                // default Object Prop
                objectProp: {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                },
            },

            // is `elm` instanceof _z - public function in _z.is_z( Object ) = true|false
            is_z = elm => elm instanceof _z,

            // is _z prototype - public function in _z.isCore( Object ) = true|false
            isCore = elm => _z === elm && elm.prototype === _z.prototype,

            // `val` in `obj` - public function in _z.hasProp( Object, Property), _z(Object).hasProp(Property) = true | false
            hasProp = function hasProp(obj, val) {
                return Object.prototype.hasOwnProperty.call(
                    arguments.length === 1 ? this : obj,
                    arguments.length === 1 ? obj : val
                );
            },

            // `val` in `obj` - public function in _z.hasVar( Object, var), _z(Object).hasVar(var) = true | false
            hasVar = function hasVar(obj, val) {
                try {
                    return val in obj;
                } catch (e) {
                    return false;
                }
            },

            // all `val` in `obj` - function in fns.getPrototypeOf( Object ), hooked to Objects: Object.getPrototypeOf()
            getPrototypeOf = Object.getPrototypeOf,

            // isset `val` - public function in _z.isset(var) = true|false
            isset = function isset(val) {
                if (arguments.length > 1) {
                    for (let i = 0, i2 = arguments.length; i < i2; i++) {
                        if (!isset(arguments[i])) {
                            return false;
                        }
                    }
                }

                return val !== void 0 ||
                    typeof (val) !== 'undefined';
            },


            // trim prototype - public function in _z.trim( String ) = trimmed String
            triming = function trimString(str) {
                return (
                    str !== undefined && str != null
                ) ? String(str).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : "";
            };

        triming["call"] = (x) => triming(x);

        var
            // return isset argument
            getSet = function getSet() {
                arguments = Array.from(arguments);
                let valid;
                if (this === true) // just skip undefined
                {
                    while (!isset(valid = arguments.shift()) && arguments.length) ;
                } else {
                    while (!(valid = arguments.shift()) && arguments.length) ;
                }
                return valid;
            },

            // type of `val` as string toLowerCase
            typeOf = function typeOfVar(val, cb) {
                let $val = prototypies.object.toString.call(val).replaceAll('[object ', '').replaceAll(']', '').trim();
                return cb && typeof cb === 'function' ? cb($val) : $val.toLowerCase();
            };

        // to avoid calling twice typeOf
        [
            "number",
            "string",
            "array",
            "object",
            "function",
            "boolean",
        ].forEach(function (v) {
            typeOf[v[0]] = v;
        });

        var
            // toLowerCase
            toLC = function ($var, $reDefine) {
                if (typeOf($var) === typeOf.a) {
                    if (!isset($reDefine))
                        $var = (
                            $var2 = Array.from($var)
                        );

                    foreach($var, function (k, v) {
                        $var[k] = toLC(v);
                    });

                    return $var;
                }

                return (
                    String($var) || ""
                ).toLowerCase();
            },
            // toUpperCase
            toUC = function ($var, $reDefine) {
                if (typeOf($var) === typeOf.a) {
                    if (!isset($reDefine))
                        $var = (
                            $var2 = Array.from($var)
                        );

                    foreach($var, function (k, v) {
                        $var[k] = toUC(v);
                    });

                    return $var;
                }

                return (
                    String($var) || ""
                ).toUpperCase();
            },

            // for stop loops
            loops_Stop = new Error("stopLoopinException"),
            // "DELETE_VAR".toCode(16)
            // for delete this in loops
            loops_delThis = (
                function () {
                    let ld_e = function deleteThisVar(message) {
                        let error = new Error(message || 'Error');
                        error.name = 'delThisVar';
                        throw error;
                        return error;
                    };
                    ld_e.prototype = Error.prototype;
                    return ld_e;
                }
            )(),

            // reduce
            // todo: make it accept object & arrayLike ...
            reduce = function reduce(array, callback, iniVal, useZeroIndexAsIniVal) {
                array = _z.Array(array);
                callback = _z.isFunction(callback) ? callback : (p, c, i, arr) => p + c;
                iniVal = (
                    useZeroIndexAsIniVal || false
                ) ? array[0] : iniVal;

                return array.reduce(callback, iniVal || "");
            },

            // loop forEach
            loop = function loop(object, callback, args) {
                let $is_z;
                try {
                    if (arguments.length === 1 || _z.isFunction(object)) {
                        args = callback || undefined;
                        callback = _z.isFunction(object) ? object : false;
                        object = is_z(this) && this || false;
                    } else {
                        args = args || undefined;
                        callback = _z.isFunction(callback) ? callback : false;
                        object = object || (
                            is_z(this) && this
                        ) || false;
                    }

                    if (!_z.isFunction(callback)) {
                        callback = () => callback;

                    }

                    if (object === false || !(
                        _z.isObject(object) || _z.isArray(object)
                    )) {
                        throw new TypeError('Invalid `object` (object), NOT Arrayable.');

                    }
                    /*else if(args && !_z.isArray(args)) {
                     args = [args];

                     }*/

                    $is_z = object && is_z(object);

                    // clone
                    object = $is_z ? object.element() : _z.extend({}, object);

                    let
                        $keys = Object.keys(object),
                        i = 0,
                        l = $keys.length,
                        removeKeys = [];

                    for (; i < l; i++) {
                        let
                            // current row key
                            $key = $keys[i],

                            // callback properties:
                            $row = [

                                // callback: this, value: carrent mapped Object
                                object,

                                // callback: argument 1, value: row value
                                object[$key],

                                // callback: argument 2, value: row key
                                $key,

                                // callback: argument 3, value: carrent mapped Object
                                object,

                                // callback: argument 4, value: args row (sent by caller)
                                // callback: argument 4, value: args (sent by caller)
                                args, //&& args.length ? args.shift() : undefined
                            ],
                            cbReturn = callback.call(...$row),
                            hasReturn = object[$key] !== cbReturn;

                        // skip		=> when callback return: undefined (no return)
                        if (hasReturn && cbReturn === undefined) {
                            continue;
                        }
                        // delete	=> when callback return: null
                        else if (hasReturn && cbReturn === null) {
                            removeKeys.push($keys[i]);
                        }
                        // break	=> when callback return: false
                        else if (hasReturn && cbReturn === false) {
                            let keys = Object.keys(object);
                            keys = keys.slice(0, i);
                            let newObject = keys.map((index) => object[index]);
                            object = newObject;
                            break;
                        }
                        // update	=> when callback return: !undefined && !false && !null
                        else {
                            object[$keys[i]] = cbReturn;
                            // if($is_z) {
                            // 	this[$keys[i]] = object[$keys[i]] = cbReturn;
                            // }
                        }
                    }

                    if (removeKeys.length) {
                        let removeKey;
                        while ((
                            removeKey = removeKeys.shift()
                        ) || removeKeys.length) {
                            if (_z.isArray(object)) {
                                // this.remove( removeKey );
                                object.remove(removeKey);
                            } else {
                                // delete this[ removeKey ];
                                delete object[removeKey];
                            }
                        }
                    }

                } catch (e) {
                    throw e;
                }

                object = $is_z ? this.newSelector(_z.toArray(object)) : object;

                return object;
            },

            // forEach
            foreach = function foreach(obj, cb, context) {
                if (typeOf(obj) === typeOf.f) {
                    context = cb || this;
                    cb = obj;
                    obj = this['element'] && this.element() || [];
                }

                obj = obj || false;
                if (!obj || !cb || typeOf(cb) !== typeOf.f)
                    return false;

                obj = is_z(obj) ? obj.element() : obj;
                if (typeof loops_Stop === "undefined") {
                    let loops_Stop = new Error("stopLoopinException");
                }

                let returns =
                    (
                        (
                            typeOf(obj) === typeOf.a && []
                        ) ||
                        (
                            typeOf(obj) === typeOf.o && {}
                        ) ||
                        (
                            _z['createAs'] && _z.createAs(obj, false, {})
                        )
                    ) || {};

                try {
                    let _keys = Object.keys(obj);

                    for (let i = 0, l = _keys.length; i < l; i++) {
                        let key = _keys[i];
                        let cbReturn = cb.apply(context || obj, [key, obj[key], obj]);

                        if (!cbReturn && cbReturn !== undefined)
                            throw loops_Stop;
                        else if (cbReturn !== undefined)
                            returns[key] = cbReturn;
                        else
                            returns[key] = obj[key];
                    }
                } catch (e) {
                    if (e !== loops_Stop) throw e;
                }

                return returns;
            },

            // toArray
            toArray = function toArray() {
                let sliced = prototypies.array.slice.call(arguments.length && arguments[0] || this);
                sliced = sliced.length && sliced || false;

                if (arguments.length && sliced === false && !is_z(arguments[0]))
                    try {
                        sliced = [...arguments[0]];
                    } catch (e) {
                        sliced = [arguments[0]];
                    }

                return sliced === false ? [] : sliced;
            },

            // subArray
            subArray = function subArray(startFrom, endTo, array) {
                if (endTo && !isset(array))
                    if (typeOf(endTo) != typeOf.n)
                        array = endTo,
                            endTo = false;
                var sliceit = [startFrom || 0];
                if (endTo !== false)
                    sliceit.push(endTo);

                return toArray(getSet(array, this)).slice(...sliceit);
            },

            // filterArray
            filterArray = function filterArray(array, callback) {
                let tunning = fns.argsFix(arguments, this, undefined);
                arguments = tunning("arguments");
                array = tunning.call();
                callback = tunning.call();

                let isUZContainer = is_z(this);
                if (isset(callback) && !_z.isFunction(callback)) {
                    let _callback = _z(callback);
                    callback = (x) => _z(x).is(_callback);
                }

                if (_z.isFunction(array) && !isset(callback) && isUZContainer)
                    callback = array,
                        array = this;

                if (isUZContainer)
                    array = this.element();

                if (!_z.isArray(array)) array = _z(array).element();

                callback = _z.isFunction(callback) && callback || (
                    x => x
                );
                let result = prototypies.array.filter.apply(array, [callback]) || array;

                if (isUZContainer && is_z(this)) {
                    let newInstance = this.newSelector(result);
                    newInstance.args = [array];
                    newInstance.selector = "";

                    return newInstance;
                } else return _z(result);
            },

            // Keys
            Keys = function Keys(x) {
                return Object.keys(x);
            },

            // Row
            Row = function Row(x, removeKey = false) {
                let $keys = Keys(x),
                    $key, $value;

                $value = x[(
                    $key = $keys.shift()
                )];

                if (removeKey && $key)
                    delete x[$key];

                return [$key, $value];
            },

            // tap
            tap = function tap(elm, callback) {
                callback(elm);
                return elm;
            },

            // values of all CSS properties of an element
            compStyle = (...args) => (window.getComputedStyle || falseFunction)(...args),

            // clone object
            cloneObj = function cloneObj(obj) {
                try {
                    let copy = Object.create(getPrototypeOf(obj)),
                        propNames = Object.getOwnPropertyNames(obj);

                    propNames.forEach(function (name) {
                        let desc = Object.getOwnPropertyDescriptor(obj, name);
                        Object.defineProperty(copy, name, desc);
                    });

                    return copy;
                } catch (e) {
                    console.error(e);
                    return obj;
                }
            },

            // check css selector
            isValidSelector = selector => {
                try {
                    document.createDocumentFragment().querySelector(selector);
                } catch (e) {
                    return false
                }
                return true
            };


// all registeredEvents
        var events = {
                lastEvent: version,
                // addEventListener
                register: function eventListenerHandler(data) {
                    if (typeOf(data) !== typeOf.o || !data['eventName'] || !data['element']) return false;

                    let eventName, target = data['element'];
                    let listenerMethod = (
                            eventName = data['eventName']
                        ) && target.addEventListener ||
                        (
                            eventName = 'on' + data['eventName']
                        ) && target.attachEvent ||
                        (
                            eventName = data['eventName']
                        ) && fns.ef;
                    let removeMethod = target.removeEventListener || target.detachEvent || fns.ef;

                    let registerData = {
                        element: target || false,
                        eventName: data['eventName'] || false,
                        eventNameMethod: eventName,
                        qselector: data['qselector'] || "",
                        alias: data['alias'] || [],
                        proxyCallback: data['proxyCallback'] || data['callback'] || data['realcallback'] || false,
                        realcallback: data['callback'] || data['realcallback'] || false,
                    };

                    let arg = [eventName, registerData['proxyCallback'] || registerData['realcallback']];
                    let deArg = Array.from(arg);
                    registerData['remover'] = () => {
                        removeMethod.apply && removeMethod.apply(target, deArg);
                        return true;
                    };

                    if (target.addEventListener)
                        arg.push(false);

                    events.add(registerData);
                    listenerMethod.apply && listenerMethod.apply(target, arg);

                    return true;
                },
                // removeEventListener
                unRegister: function eventUnListenerHandler(data) {
                    if (typeOf(data) !== typeOf.o) return false;
                    let rEL = events.find(data);

                    if (!rEL)
                        return false;
                    else if (rEL.length)
                        _z.for(rEL, function (ELK, ELV) {
                            ELV['remover'] && _z.isFunction(ELV['remover']) && ELV['remover']();
                        });
                    else if (rEL['remover'])
                        rEL['remover'] && _z.isFunction(rEL['remover']) && rEL['remover']();

                    return true;
                },
                data: {},
                find: function findRegisteredEvents(fn) {
                    let ev = this.data,
                        $return = [];

                    let dataID = fn['dataID'] || false;

                    if (dataID && !ev[dataID]) {
                        return false;
                    } else
                        fn = dataID && ev[dataID] ? [ev[dataID]] : fn;

                    _z.for(ev, function (k, v) {
                        if (_z.isFunction(fn) && v['realcallback'] && v['realcallback'] === fn)
                            $return.push(v);
                        else if (_z.isObject(fn)) {
                            var $return2 = {};
                            _z.for(fn, function ($k, $v) {
                                if (v[$k] != $v && $k != "alias")
                                    return $return2 = false, false;
                                else if ($k == "alias" && _z.size($v) > 0) {
                                    $v = !_z.isArray($v) ? $v.split(".") : $v;
                                    var rAlies = v["alias"] || [];
                                    if (_z.size(rAlies) > 0) {
                                        var match = [];
                                        _z.for($v, function (vAI, vAV) {
                                            if (rAlies.includes(vAV))
                                                match.push(vAV);
                                            else
                                                return false;
                                        });
                                        if (match.length != $v.length) match = [];
                                    } else return $return2 = false, false;

                                    $return2 = !!match.length;
                                    return false;
                                } else
                                    $return2[$k] = $v;
                            });
                            if ($return2 !== false) $return.push(v);
                        }
                    });

                    return $return || false;
                },
                add: function addRegisteredEvents(data) {
                    data = arguments.length === 1 && typeOf(data) === typeOf.o ? data : {name: data};
                    let _data = {
                        element: data['element'] || false,
                        eventName: data['eventName'] || data['name'] || false,
                        qselector: data['qselector'] || "",
                        alias: data['alias'] || [],
                        proxyCallback: data['proxyCallback'] || data['realcallback'] || false,
                        realcallback: data['callback'] || data['realcallback'] || false,
                    };
                    _data['eventNameMethod'] = data['eventNameMethod'] || _data['eventName'] || false;
                    let remover = data['remover'] || fn.ef;

                    let fName = 'cb' + fns.time();
                    while (isset(this.data[fName]))
                        fName = 'cb' + fns.time() + '_' + _z.size(this.data);

                    _data['remover'] = function () {
                        remover();
                        delete events.data[fName];
                    };

                    this.data[fName] = _data;

                    return this.data[fName]['realcallback'] || true;
                },
                getEventName: function eventNameWithOutAlias(eventName) {
                    if (!eventName || !_z.isString(eventName)) return false;

                    let alias = (
                        eventName = eventName.split(".")
                    ).splice(1);
                    return eventName[0] || "";
                },
                getAlias: function eventNameAlias(eventName) {
                    if (!eventName || !_z.isString(eventName)) return false;

                    let alias = (
                        eventName = eventName.split(".")
                    ).splice(1);
                    return alias || [];
                },
                dispatch: function dispatchEvent(event, data) {
                    if (!event || !(
                        e = this
                    )) return false;

                    if (e instanceof EventTarget) {
                        events.lastEvent = undefined;
                        let dE = e.dispatchEvent(event, true);
                        events.lastEvent = version;
                        return dE;
                    } else {
                        let _elmentWithNS = events.find(data || {
                            element: e,
                            eventName: event.type || false,
                        });

                        if (_z.size(_elmentWithNS) === 0)
                            return false;
                        else {
                            _z.for(_elmentWithNS, function (_Index, _e) {

                                let eventName = events.getEventName(_e["eventName"]);
                                events.lastEvent = undefined;
                                let cb = (
                                    _e["proxyCallback"] || _e["realcallback"] || fns.ef
                                );
                                cb['apply'] && cb.apply(_e["element"], [event, _e["alias"]]);
                                events.lastEvent = version;
                            });
                        }
                    }

                    return true;
                },
                createEventAnddispatch: function createEventAnddispatch(e, eventName) {
                    try {
                        // if( hasVar(e, eventName) && _z.isFunction(e[eventName]) )
                        //     e[eventName](event, alias);
                        // else
                        // todo: must try to call element.eventname first
                        //     events.dispatch.apply(e, [event, { element: e, eventName: eventName, alias: alias }]);

                        let alias = events.getAlias(eventName),
                            aliasQry = alias.length ? (
                                "." + alias.join(".")
                            ) : "";

                        eventName = events.getEventName(eventName);

                        events.lastEvent = version;
                        let _doc = e.ownerDocument ? e.ownerDocument : e;
                        if (e.dispatchEvent && hasVar(_doc, "createEvent")) {
                            let event = _doc.createEvent(["click", "mousedown", "mouseup"].inArray(eventName) > -1
                                ? "MouseEvents"
                                : "HTMLEvents");
                            event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

                            event.synthetic = true; // allow detection of synthetic events
                            // The second parameter says go ahead with the default action
                            // e.dispatchEvent(event, true);
                            return events.dispatch.apply(e, [event, {element: e, eventName: eventName, alias: alias}]);
                        } else if (e.fireEvent && hasVar(_doc, "createEventObject")) {
                            // IE-old school style, you can drop this if you don't need to support IE8 and lower
                            let event = _doc.createEventObject();
                            event.synthetic = true; // allow detection of synthetic events
                            return e.fireEvent("on" + eventName, event);
                        } else if (e[eventName] && _z.isFunction(e[eventName])) {
                            return e[eventName]();
                        } else if (e["on" + eventName] && _z.isFunction(e["on" + eventName])) {
                            return e["on" + eventName]();
                        } else {
                            let _elmentWithNS = events.find({element: e, eventName: eventName, alias: alias});

                            if (_z.size(_elmentWithNS) === 0)
                                return false;
                            else {
                                _z.for(_elmentWithNS, function (_Index, _e) {

                                    let eventName = events.getEventName(_e["eventName"]);

                                    let event = document.createEvent([
                                        "click",
                                        "mousedown",
                                        "mouseup",
                                    ].inArray(eventName) > -1
                                        ? "MouseEvents"
                                        : "HTMLEvents");
                                    event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

                                    event.synthetic = true; // allow detection of synthetic events
                                    // The second parameter says go ahead with the default action
                                    events.lastEvent = undefined;
                                    e.dispatchEvent(event, true);

                                    if (events.lastEvent === undefined) {
                                        let cb = _e["proxyCallback"] || _e["realcallback"] || fns.ef;
                                        cb['apply'] && cb.apply(_e["element"], [event, _e["alias"]]);
                                    }
                                    events.lastEvent = undefined;

                                });
                                events.lastEvent = version;

                                return true;
                            }
                        }

                    } catch (er) {
                        console.error(er);
                    }
                },
            },
            // todo: use one function for element matches
            // elements functions
            elmFunc = {

                // prepare css style
                prepareCSS: function prepareCSS(css) {
                    if (_z.is_z(css))
                        return (
                                _z.trim(css) || ""
                            ).replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, (all, fst) => fst.toUpperCase())
                            || "";

                    let s = {};
                    if (!css) return s;

                    // todo: check if hasOwnProperty
                    if (css instanceof CSSStyleDeclaration) {
                        for (let i in css)
                            if ((
                                css[i]
                            ).toLowerCase)
                                if (!!css[css[i]] || css[css[i]] === "")
                                    s[(
                                        css[i]
                                    ).toLowerCase()] = (
                                        css[css[i]]
                                    );

                    } else if (typeof css === "string") {
                        css = css.split("; ");
                        for (let i in css)
                            if (css[i] && typeof css[i] !== 'object' && typeof css[i] !== 'function')
                                try {
                                    let l = css[i].split(": ");
                                    if (!!l[1] || l[1] === "")
                                        s[l[0].toLowerCase()] = (
                                            l[1]
                                        );
                                } catch (e) {
                                    console.warn([css[i], !css[i]]);
                                }
                    }

                    return s;
                },

                // set or get element prop
                elementMap: function elementMap(elm, callback, tester) {
                    elm = elm || this;
                    elm = !_z.is_z(elm) ? _z(elm) : elm;
                    callback = (!callback || !_z.isFunction(callback)) ? fns.ef : callback;

                    let $results = [];
                    if (elm.length) {
                        let $this = this;
                        tester = tester && _z.isFunction(tester) ? tester : (x => _z(x).isDOMElement(true));
                        // if( elm.length == 1 && (e = elm[0]) ) {
                        //     if( tester(e) )
                        //         ( $results.pushSetter = callback.apply( $this, [ e, 0 ]) );
                        // } else
                        elm.each(function (i, e) {
                            if (tester(e)) {
                                return ($results.pushSetter = callback.apply($this, [e, ...arguments]));
                            }
                        });
                    }

                    return $results;
                },

                // Element.matchesAll() polyfill
                where: function elementMatchesAll(elm, $elm, $not) {
                    let tunning = _z.argsFix(arguments, this, undefined);
                    arguments = tunning("arguments");
                    elm = tunning.call();
                    $elm = tunning.call();
                    $not = tunning.call() || false;

// todo: tunning issue
//             todo: this commented lines
                    /*if( arguments.length==2 || _z.isBoolean($elm) )
                     $not = $elm,
                     $elm= elm,
                     elm = this;

                     if( arguments.length==1 || $elm==undefined )
                     $elm = elm,
                     elm = this;
                     */
                    let $return = [];
                    if (arguments.length) {
                        let __sel = _z.isString($elm) ? [$elm] : $elm;
                        let $arguments = arguments;
                        $elm = _z(__sel);

                        _z.elementMap(
                            elm,
                            function (e) {
                                let _e = e;
                                e = e === doc ? doc.documentElement : e;
                                let $currentElement = [];
                                _z.elementMap(
                                    _z($elm),
                                    function (e2) {
                                        e2 = e2 === doc ? doc.documentElement : e2;

                                        if (!_z.isDOM(e2) && _z.isString(e2)) {
                                            $currentElement.push(matches(e, e2) !== $not && !$return.includes(_e) ? _e : false);
                                        } else {
                                            $currentElement.push(e['isEqualNode'] && e['isEqualNode'](e2) !== $not && !$return.includes(_e) ? _e : false);
                                        }
                                    }, x => _z(x).isDOMElement(true) || _z.isString(x) || x === doc
                                );

                                if (_z.filter($currentElement).length === $elm.length) {
                                    $return.push(_e);
                                }
                            }, x => _z(x).isDOMElement(true) || _z.isString(x) || x === doc
                        );

                        $return = _z.filter($return);
                    } else {
                        $return = _z();
                    }

                    if (_z.is_z(this)) {
                        let newInstance = this.newSelector($return),
                            eSelector = _z.Array($return.selector || $return.for((k, e) => _z.cssSelector(e, 1))).unique();
                        newInstance.args = eSelector;
                        newInstance.selector = eSelector.toString();

                        return newInstance;
                    }

                    return _z($return);
                },

            },
            // parse functions
            parssing = {
                // parseHTML
                html: function () {
                    return parssing.parseHTML.apply(parssing, arguments);
                },
                parseHTML: function parseHTML(str) {
                    try {
                        if (doc.isdocument !== true) return;

                        let tmp = document.implementation.createHTMLDocument();
                        tmp.body.innerHTML = str;
                        return tmp.body.children;
                    } catch (_err) {
                        console.error("Parse Error[parseHTML]:", _err);
                        return false;
                    }
                },

                // parseJSON
                json: function () {
                    return parssing.parseJSON.apply(parssing, arguments);
                },
                parseJSON: function parseJSON(str) {
                    try {
                        return JSON.parse(str);
                    } catch (_err) {
                        console.error("Parse Error[parseJSON]:", _err);
                    }
                },

                // JSON.stringify
                stringJSON: function () {
                    return parssing.unjson.apply(parssing, arguments);
                },
                unjson: function JSONstringify(str) {
                    try {
                        return JSON.stringify(str);
                    } catch (_err) {
                        console.error("Parse Error[unjson]:", _err);
                    }
                },

                // parseXML
                xml: function parseXML(str) {
                    try {
                        let xml, parser;
                        if (!str || !_z.isString(str))
                            return null;

                        try {
                            if (window.DOMParser) {
                                parser = new DOMParser();
                                xml = parser.parseFromString(str, "text/xml");
                            } else // Internet Explorer
                            {
                                xml = new ActiveXObject("Microsoft.XMLDOM");
                                xml.async = false;
                                xml.loadXML(str);
                            }
                        } catch (e) {
                            xml = null;
                        }

                        if (!xml) {
                            fns.t.e("Invalid XML: " + str);
                            return null;
                        }

                        return xml;
                    } catch (e) {
                        fns.t.e("Parse Error:" + e);
                    }
                },
                parseXML: function parseXML(htmlString) {
                    return (
                        new DOMParser()
                    ).parseFromString(htmlString, "text/xml");
                },

                // parseXML from url
                xmlFromURL: function parseXMLFromUrl(url) {
                    try {
                        let xml, xmlhttp, parser;
                        if (!url || !_z.isString(url))
                            return null;

                        try {
                            if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
                                xmlhttp = new XMLHttpRequest();
                            else // code for IE6, IE5
                                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

                            xmlhttp.open("GET", url, false);
                            xmlhttp.send();
                            xml = xmlhttp.responseXML;
                        } catch (e) {
                            return fns.t.e("error while parssing: " + e), null;
                        }

                        return xml;
                    } catch (e) {
                        fns.t.e("Parse Error:" + e);
                    }
                },
            },

            // functions ( shortcuts )
            fns = {
                // this for programming test
                // registeredEvents: events,
                propertyGetter: function (cb, args) {
                    return {
                        get() {
                            return cb(...(
                                args || []
                            ));
                        },
                    };
                },
                ef: emptyFunction,
                inputbox: function inputbox() {
                    return prompt.apply(window, arguments) || undefined;
                },
                argLimit: function consoleArgumentsLimited(limitStart = 0, LimitEnd = null) {
                    return function () {
                        let lStart = limitStart === 0 ? limitStart : (
                            Number(limitStart) || 0
                        );
                        let lEnd = LimitEnd === null ? arguments.length : (
                            Number(LimitEnd) || arguments.length
                        );
                        console.log.apply(console, subArray(lStart, lEnd, arguments));
                    };
                },
                arg: function consoleArguments() {
                    console.log.apply(console, arguments)
                },
                argRev: function consoleArgumentsReversed() {
                    console.log.apply(console, toArray(arguments).reverse())
                },
                trc: function consoleTrace() {
                    console.trace.apply(console, arguments)
                },
                logthis: function consoleThis() {
                    console.log.apply(console, this)
                },
                log: function consoleThisAndArguments() {
                    console.log.apply(console, [this, arguments])
                },
                wrn: function consoleWarn() {
                    console.warn.apply(console, arguments)
                },
                dir: function consoleDir() {
                    console.dir.apply(console, arguments)
                },
                info: function consoleDir() {
                    console.info.apply(console, arguments)
                },
                confirm: function yesOrNo() {
                    this.confirm.off = !!this.confirm.off;
                    if (this.confirm.off)
                        return true;

                    return confirm.apply(window, arguments);
                },
                alert: new Function("alert.apply(null, arguments)"),
                'true': trueFunction,
                'false': falseFunction,

                toLowerCase: toLC,
                toUpperCase: toUC,

                /**
                 * multi call for {@link fns.objProp}
                 *
                 * @param obj
                 * @param ps
                 *
                 * @returns {boolean|Array|{}|*|{}}
                 */
                objProps: function objProps(obj, ps) {
                    return foreach(_z.Array(obj), function (i, v) {
                        fns.objProp(v, ps);
                    });
                },

                objProp: function objProp(obj, ps) {
                    ps = ps === undefined ? [] : ps;
                    var newProping = extendFunction({}, prototypies.objectProp);
                    newProping['enumerable'] = ps['e'] !== undefined ? !!ps['e'] : true;
                    newProping['configurable'] = ps['c'] !== undefined ? !!ps['c'] : true;
                    newProping['writable'] = ps['w'] !== undefined ? !!ps['w'] : true;
                    newProping['add'] = ps['add'] !== undefined && typeOf(ps['add']) == typeOf.a
                        ? ps['add']
                        : false;
                    newProping['skip'] = ps['skip'] !== undefined ? !!ps['skip'] : false;

                    if (newProping['add'])
                        foreach(newProping['add'], (i, p) => {
                            p && Object.defineProperty(obj, p, newProping);
                        });

                    if (!!!newProping['skip'])
                        foreach(obj, (p) => {
                            Object.defineProperty(obj, p, newProping);
                        });

                    return obj;
                },

                isSetisFunc: function isSetAndIsFunction(v, k) {
                    k = k || false;
                    return !!(
                        v && !!(
                            k !== false ? v[k] : v
                        ) && _z.isFunction((
                            k !== false ? v[k] : v
                        ))
                    );
                },

                // create new error type
                newErrorType: function createNewErrorType(errorName, typeName) {
                    typeName = typeName || 'Error',
                        errorName = errorName || '_zError';

                    return fns.tryEval(
                        `
            return function ` + errorName + `( message ) {
                var error = new ` + typeName + `( message||'Error' );
                error.name = '` + errorName + `';
                return error;
            }
            `,
                    );
                },

                // current timestamp
                time: function time(c) {
                    c = c || false;
                    var t = new Date();
                    return c === false ? t.getTime() : (
                        c == 's' ? t.getSeconds() : (
                            c == 'm' ? t.getMinutes() : (
                                c == 'h' ? t.getHours() : t
                            )
                        )
                    );
                },

                // eval
                eval: (
                    window.execScript || function _zEval(code) {
                        window["eval"].call(window, code);
                    }
                ),
                tryEval: function tryEval(code) {
                    var returns = "";
                    code = code.replace("/\\/", "/\\/\\");
                    if (triming.call(code))
                        try {
                            returns = fns.eval(triming.call(code)) || "";
                        } catch (e1) {
                            try {
                                returns = fns.eval('(' + triming.call(code) + ')') || "";
                            } catch (e2) {
                                try {
                                    returns = (
                                        new Function(triming.call(code))
                                    )() || "";
                                } catch (e3) {
                                    console.error(e3);
                                    returns = "";
                                }
                            }
                        }
                    return returns;
                },

                // define randome vars ( development purpose )
                get defineRandom() {
                    var VarsNames = [
                            'a',
                            'o',
                            's',
                            'f',
                            'n',
                            'b',
                        ],

                        VarsValues = [
                            VarsNames,
                            {
                                num: 123,
                                str: "hlaCk _z",
                                bool: true,
                                arr: Array.from(VarsNames),
                                obj: {
                                    a: 'a', b: 'b', c: 'c',
                                },
                            },
                            'The hlaCk ..',
                            function () {
                                return arguments;
                            },
                            1234567890,
                            true,
                        ],

                        override = false,

                        $return = [],
                        $_all = {};
                    tWin = window;

                    foreach(VarsNames, function (rVar) {
                        // do not override
                        if (isset(tWin[VarsNames[rVar]]) && !override)
                            return;

                        // register as defined
                        $return.push(VarsNames[rVar]);

                        // add functions
                        tWin[VarsNames[rVar]] = VarsValues[rVar];
                        $_all[VarsNames[rVar]] = VarsValues[rVar];
                    });

                    if (window["hlaCk"] == "Uni") window["_iData"] = _iData;

                    return (
                        tWin['o'] = $_all
                    ), $return;
                },

                // throw functions
                t: {
                    // throw new error
                    e: function () {
                        throw new Error(...arguments);
                    },

                    // throw new type error
                    t: function () {
                        throw new TypeError(...arguments);
                    },

                    // throw new refrance error
                    r: function () {
                        throw new ReferenceError(...arguments);
                    },

                    // throw generator
                    generate: function (e) {
                        throw !(
                            e instanceof Error
                        ) ? new Error(e) : e
                    },
                },

                // return isset argument
                getSet: getSet,

                // fix arguments to set this as first var
                argsFix: function argumentsFix(_args, _self, _default, coreMethod) {
                    coreMethod = coreMethod || false;
                    var isABinded;
                    if (!(
                        isABinded = isset(this['ARGS_BINDED'])
                    ) && (
                        !arguments.length || !isset(_args)
                    )) return;

                    // not binded yet
                    if (!isABinded) {
                        var def = {
                            default: _default,
                            args: _args,
                            arguments: undefined,
                            self: _self,
                        };
                        def["default"] = isset(def["default"]) ? def["default"] : undefined; // default value
                        def["args"] = _z.Array(def["args"]);

                        var isSelfUZ = is_z(def["self"]);

                        if (coreMethod) { // for _z.METOD
                            if (!isCore(def["self"])) // add this to arguments if its not core
                                def["args"].unshift(..._z.Array(def["self"]));
                        } else if (def["self"] && isSelfUZ) { // add self to arguments
                            // no arguments
                            if (def["args"].length == 0)
                                def["args"] = [def["self"]];
                            else // add self to arguments
                            if (isSelfUZ && !def["self"].equalsAll(() => {
                                return is_z(def["args"][0]) ? def["args"][0] : _z([def["args"][0]]);
                            }) || !isSelfUZ && def["self"] != def["args"][0]) // add if not exist
                                def["args"].unshift(def["self"]);
                        }

                        var oData = def;
                        oData["arguments"] = _z.Array(oData["args"]);
                        return argumentsFix.bind({ARGS_BINDED: 1, oData: oData});
                    } else { // binded and has data
                        if (arguments.length && _args)
                            return this["oData"][_args] || undefined;

                        if (this["oData"]["args"].length == 0) { // no more arguments to send
                            return this["oData"]["default"];
                        } else return this["oData"]["args"].shift();
                    }
                },
            },

            // search by indexed element
            cssSelectorsIndexedSelector = function cssSelectorReadIndexedSelector(str) {
                str = str || false;
                if (
                    !!!str ||
                    !!!_z.isString(str) ||
                    !!!(
                        new RegExp(selectorPatterns.indexed)
                    ).test(str)
                ) return false;

                var selectorVal = str.replace(selectorPatterns.indexed, function () {
                    return (
                        matches = [...arguments].slice(1, 5)
                    ).length ?
                        "[" +
                        (
                            matches[0] =
                                matches[0] != '#' ?
                                    (
                                        (
                                            matches2 = selectorPatterns.indexedAttr.exec(matches[0])
                                        ) ? matches2[1] : "name"
                                    )
                                    : "id"
                        ) +
                        "^='" +
                        matches[1] + matches[2] +
                        "'][" +
                        matches[0] +
                        "$='" +
                        matches[3] +
                        "']"
                        : false;
                });

                if (!!!selectorVal || !!!selectorVal.length) return false;

                return selectorVal;
            },

            // is element == window
            isWindow = function isWindow(element) {
                let isW = element != null && element["window"] && element == element.window;
                return isW || _z.is_z(element) && elmFunc.elementMap(element, trueFunction, isWindow).length == element.length;
            },


            // find free id
            new_zID = function createNew_zID(isEngine) {
                let newStamp = fns.time() || 0,
                    newID = ++_z._counter || 0,
                    _newID = 0,
                    _zIDData = (
                        isEngine = isEngine || false
                    ) ? new_zID.edata : new_zID.data;

                while (isset(_zIDData['UnderZ_' + newID + '_' + newStamp + '_' + _newID]))
                    _newID++;

                _zIDData['UnderZ_' + newID + '_' + newStamp + '_' + _newID] = isEngine ? true : {
                    data: {},
                    idata: {}, // internal
                };
                return 'UnderZ_' + newID + '_' + newStamp + '_' + _newID;
            };
        new_zID.data = [];
        new_zID.edata = [];

// register global variables
        window.fns = window.fns || fns;
        window.Math = window.Math || Math;
        window.Math.__random = isset(window.Math['__random'])
            ? window.Math['__random'].bindWith()
            : window.Math['random'].bindWith();
        window.Math.random = function () {
            return arguments.length ? _z.rnd(...arguments) : window.Math['__random']();
        };
// register global variables

        var selectorPatterns = {
            // selector get indexed elements
            indexed: /\s*?(^|\#|\s|!\.|[PATTREN]?)\b(\w+)\b(\[)\*(\])/,
            indexedAttr: /\b(\w+)\b[\=]{2}/,
            index: ["(?:(.*?)\\:{2}([PATTREN])|.+)"],
            indexFullPattrenTpl: "(.*?)\\:{2}([PATTREN])",
            idx: {
                // selector get first element
                first: "first\\b",
                // last
                last: "last\\b",
            },
        };

// css selector pattrens prepare
        Object.keys(selectorPatterns.idx).forEach(function (s) {
            selectorPatterns.index.push(selectorPatterns.idx[s]);
        });
        selectorPatterns.index =
            selectorPatterns.indexBackup =
                selectorPatterns.index.length > 2 ?
                    new RegExp(
                        selectorPatterns.index.shift().replace('[PATTREN]', selectorPatterns.index.join('|')),
                        'g',
                    )
                    : "";

        selectorPatterns.indexed = new RegExp(
            selectorPatterns.indexedAttr && selectorPatterns.indexedAttr ?
                selectorPatterns.indexed.toString()
                    .replace(/\\/g, "\\")
                    .replace(/\//g, "")
                    .replace('[PATTREN]', selectorPatterns.indexedAttr.toString()
                        .replace(/\/|\(|\)/g, "")
                        .replace(/\\\\/g, "\\"),
                    )
                : selectorPatterns.indexed.toString().replace(/\/|\|\[PATTREN\]/g, "")
            , 'g');

// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
// For a ArrayLike extend, set the first argument to `[]`.
        var extendFunction = function extend() {
            // Variables
            var extended = {},
                deep = false,
                idx = 0,
                length = arguments.length,
                args = arguments;

            if (typeOf(args[0]) === typeOf.b) {
                deep = args[idx++];
                extended = args[idx] || extended;
            }

            // extend _z when use _z()
            if (length === (
                idx + 1
            ))
                extended = this;

            // extend as ArrayLike
            if (typeOf(args[0]) == typeOf.a && Object.keys(extended).length === 0)
                extended = [];

            // Merge the object into the extended object
            var merge = function (obj) {
                for (var prop in obj) {
                    if (
                        (
                            hasProp(obj, prop) && !extendFunction.shouldExtend(prop, obj, extended)
                        ) ||
                        obj[prop] === extended
                    ) continue;

                    if (hasProp(obj, prop))//&& !(obj[prop] && extended[prop] && obj[prop] === extended[prop]))
                        // If deep merge and property is an object, merge properties
                        if (deep && typeOf(obj[prop]) === typeOf.o)
                            extended[prop] = extend(true, extended[prop], obj[prop]);
                        else
                            extended[prop] = obj[prop];
                }
            };

            // Loop through each object and conduct a merge
            for (; idx < length; idx++) {
                var obj = args[idx];
                merge(obj);
            }

            return extended;
        };

        extendFunction.shouldExtend = function (prop, obj, extended) {
            for (var validators = extendFunction.validators, i = 0, len = validators.length; i < len; i++) {
                if (!validators[i](prop, obj, extended)) {
                    return false;
                }
            }

            return true;
        };

        extendFunction.validators = [];

// extend objects
        var extendObjFunction = function extendObjects() {
            var objs = Array.from(arguments);
            objs.unshift({});

            return Object.assign(...objs);
        };

// arg1, arg2, ... assign all prototypes of all args in arg1
        var mix = function mix(arg1) {
            argsLen = arguments.length || 0;
            if (argsLen <= 1) return arg1 || {};

            var i, j, newObj = arg1 || {};

            for (i = 1; i < argsLen; i++)
                for (j in arguments[i])
                    if (arguments[i].hasOwnProperty(j))
                        newObj[j] = arguments[i][j];

            return newObj;
        };

        /**
         *    ( _z.$ || _z ).extend.status = [ true | false ]
         *    status of ( [ {}, {} ].extend )
         */
        Object.defineProperty(extendFunction, 'status', {
            // get status of ( {}.extendIn & {}.extendIn$ )
            get() {
                return !!this._status;
            },

            // stop status of ( {}.extendIn & {}.extendIn$ )
            set(s) {
                this._status = !!s;
            },
            configurable: false,
        });
        extendFunction._status = true;

        /**
         * UnderZ
         *
         * @class _z
         * @mixin
         * @this _z.prototype
         *
         * @var info
         * @var elements
         *
         * @returns {_z}
         */
        var _z = function _z() {
            if (false && !arguments.length && !(
                this && this.info && this.info.lastSelector
            )) {
                let baseSelector = function (info = {}, elements = [], ...data) {

                    _z.extend(true, this, elements, {
                        info: info || {},
                        data: data,
                        length: elements.length,
                        get: function () {
                            return Array.from(this);
                        },
                    });

                    return this;
                };

                // return new ( $this.$.init.bind( $this.$ ) )( ...arguments );
                return new _z.topSelector({}, [doc]);
            }

            $this = (
                this && this.window === this
            ) ? _z : (
                !this['window'] ? _z : this
            );

            if (arguments.length === 1 && arguments[0] instanceof _z) return arguments[0];

            // check if the argument is function to try to execute it
            if (arguments[0] && _z.isFunction(arguments[0]) && !isCore(arguments[0])) {
                return _z.document.isReady() ?
                    _z(arguments[0].call(doc, arguments[0])) :
                    _z.ready(arguments[0]);
            }
            arguments[0] = isCore(arguments[0]) ? doc : arguments[0];
            return new (
                $this.$.init.bind($this.$)
            )(...arguments);
        };

        _z.extend = extendFunction;
        _z.mix = mix;
// engine id
        _z._counter = 0;
// internal data
        var __data = {};

// register .is[type] functions
        [
            'Arguments',
            'Function',
            'String',
            'Number',
            'Date',
            'RegExp',
            'Object',
            'Array',
            'WeakSet',
            'Set',
            'Symbol',
            'Error',
            'WeakMap',
            'Map',
            'NodeList',
            'Boolean',
            'Null',
            'Undefined',
        ].forEach(function (name) {
            // do not override// if( isset( _z['is' + name] ) && !override )// return;
            if (!isset(_z['is' + name])) {
                _z['is' + name] = obj => typeOf(obj) == toLC(name);
            }
        });

// do not return if NaN #fix
        _z.isNumber = function isNumber(n) {
            return typeOf(n) === typeOf.n && !isNaN(n);
        };

// attach Promiser module to engine
// ex:
// var p =_z.Promiser(function(r,j) {
// r([1]);
// }).then( (z)=>{log(z)}, (z)=>{log(z,'e')} );

// static objects
        fns.objProp(_z, {
            c: 0,
            add: [
                // ENGINE's
                '$', 'is_z', 'isCore', '_data', '_counter',
                // mine :$
                '$underz',
            ],
            'skip': true,
        });

        let selectorsHead = function (info = {}, elements = [doc], ...data) {

            _z.extend(true, this, elements, {
                info: info || {},
                data: data,
                length: elements.length,
                get: function () {
                    return Array.from(this);
                },
                toArray: function () {
                    return Array.from(this);
                },
            });

            return this;
        };

        /**
         * _z Core
         *
         * @class _z
         * @mixin
         * @this _z.prototype
         *
         * @var info
         * @var elements
         *
         * @returns {_z}
         *
         *
         * @instance
         *
         *
         * @type {Object}
         * @class
         * @instance
         */
        _z.$ = _z.prototype = {
            // engine version
            underZ: version,

            constructor: _z,

            /**
             * create new instance _z()
             * @constructor
             * @function Under
             * @memberOf _z
             * @lends _z.prototype
             * @return {boolean|_z|*}
             */
            init: function UnderZ() {
                this.info = {
                    // created timestamp
                    stamp: 0,

                    // arguments of _z object when called
                    args: null,

                    // like context in jQuery
                    head: "",

                    // selector
                    selector: "",

                    // previous selector
                    lastSelector: undefined,

                    id: new_zID(true),
                };
                this.stamp = fns.time();
                this.args = arguments;

                let
                    /**
                     * Optimize selector
                     * @type {string|null} = null|DOM|LIST|SELECTOR
                     */
                    elementsFound = null,
                    // object, DOM, window
                    $elements = arguments[0] &&
                        (
                            _z.isDOMOW(arguments[0]) || (
                                isObj = _z.isObject(arguments[0])
                            ) || arguments[0]['nodeType']
                        ) &&
                        [arguments[0]] || false;

                // the given argument is DOM
                $elements && (
                    elementsFound = 'DOM'
                );

                // NodeList, HTMLCollection
                $elements = $elements || arguments[0] &&
                    (
                        _z.type(arguments[0]) === 'nodelist' || (
                            arguments[0] instanceof HTMLCollection
                        )
                    ) &&
                    _z.toArray(arguments[0]) || false;

                // the given argument is LIS of elements
                !elementsFound && $elements && (
                    elementsFound = 'LIST'
                );

                if (
                    !elementsFound && (
                        _z.isArray(arguments[0]) && (
                            elementsFound = _z.Array(arguments[0])
                        ) ||
                        arguments.length > 2 && (
                            elementsFound = _z.Array(arguments)
                        )
                    ) &&
                    _z.isNotEmpty(elementsFound)
                ) {
                    $elements = tap(_z(), x => x.push(...elementsFound));
                    return $elements;
                    // elmFunc.elementMap(, function (e, k) {
                    //     _z.for($var, function ($k, $v) {
                    //         _z(e).css($k, $v);
                    //     });
                    // });
                }

                // !string, !number
                $elements = $elements || arguments[0] &&
                    !(
                        _z.isString(arguments[0]) || _z.isNumber(arguments[0])
                    ) &&
                    arguments[0] || false;

                // the given argument is Selector
                !elementsFound && $elements && (
                    elementsFound = 'SELECTOR'
                );

                var head;
                // context
                if (!isObj) {
                    // DOM
                    head = arguments[1] &&
                        (
                            _z.isDOM(arguments[1]) || _z.is_z(arguments[1])
                        ) &&
                        arguments[1] || false;
                    // nodeList
                    head = head || _z.type(arguments[1]) === 'nodelist' &&
                        _z.toArray(arguments[1]) || false;
                    // string
                    head = head || _z.isString(arguments[1]) &&
                        _z(arguments[1]) ||
                        doc;
                }
                /*else
                 var head;*/

                // search by underZ pattrens
                if ($elements === false && isset(arguments[0]) && _z.isString(arguments[0])) {
                    if (
                        selectorPatterns.index &&
                        (
                            arguments[0].match(new RegExp(selectorPatterns.index)) || []
                        ).length > 0 &&
                        (
                            testSelector = new RegExp(selectorPatterns.index).exec(arguments[0])
                        ) &&
                        isset(testSelector[1], testSelector[2])
                    ) {
                        var testPattren = null,
                            testPattrens = [];
                        while ((
                            testPattren = selectorPatterns.index.exec(arguments[0])
                        ) != null) testPattrens.push(testPattren);

                        if (testPattrens.length) {
                            var _lastElement = false,
                                _lastElementArgs = arguments;
                            _z.for(testPattrens, function (i, path) {
                                // no pattren result
                                if (!(
                                    path[2] && path[1]
                                )) {
                                    path[0] = triming.call(path[0]);

                                    if (_lastElement === false)
                                        _lastElement = _z(path[0] || undefined);
                                    else
                                        _lastElement = _lastElement.find(path[0] || undefined);

                                    _lastElement.args.length = 1;
                                    _lastElement.args[0] = path[0];
                                    _lastElement.selector = path[0];

                                    return;
                                }

                                path[2] && path[1] && (
                                    path[1] = triming.call(path[1])
                                );
                                _lastElement = _lastElement === false ?
                                    _z(path[2] && path[1]) :
                                    _lastElement.find(path[2] && path[1]);

                                _lastElement = _lastElement[path[2]]();

                                // return ;
                            });

                            return _lastElement;
                        }

                    }

                    // search by indexed element
                    $elements = cssSelectorsIndexedSelector(arguments[0]) || false;
                    if ($elements !== false && !_z($elements).length)
                        console.warn([arguments[0], $elements, arguments]);

                    if ($elements !== false && $elements.length)
                        $elements = falseFunction(arguments[0] = $elements);
                }

                // string selector
                if (elementsFound === 'SELECTOR' && isset(arguments[0]) && head && head !== doc && _z.isString(
                    arguments[0])) {
                    var qSelector = arguments[0];
                    $elements = [];
                    _z(head).for(function (k, v, _all) {
                        if (_z.isDOM(v) || _z.type(v) !== 'nodelist')
                            v = _z.toNodeList(v)[0];

                        if (v && v['querySelectorAll'] && isValidSelector(qSelector)) {
                            v = v.querySelectorAll(qSelector);
                            if (v.length) $elements.add(..._z(v).element());
                        }
                    });
                    $elements = $elements.unique();
                }

                // try querySelector
                try {
                    if (!elementsFound && !isValidSelector(arguments[0]))
                        throw new Error('not query selector: ' + arguments[0]);

                    if (!elementsFound)
                        $elements = $elements || _z.toArray(
                            (
                                window.document || window.ownerDocument
                            ).querySelectorAll(arguments[0]) || [],
                        );
                }
                    // try parseHTML
                catch (e) {
                    // try to parse html
                    try {
                        if (!elementsFound)
                            // is string
                            if (isset(arguments[0])
                                && _z.isTypes('HTMLDOM', arguments[0])
                                && arguments[0].length) {
                                $elements = parssing.parseHTML(arguments[0]);
                                // not html code
                                if (!!!$elements.length)
                                    fns.t.generate(e);
                                else { // html code
                                    head = document;
                                    $elements = _z.toArray($elements) || [];
                                }
                            }
                            // empty
                            else fns.t.generate(e);
                    } catch (eParse) {
                        if (!elementsFound)
                            $elements = [arguments[0]];
                    }
                }

                // the given argument is Selector
                if (elementsFound === 'SELECTOR' && arguments[0] && _z.isString(arguments[0]))
                    arguments[0] && (
                        this.selector = arguments[0]
                    );

                // the given argument is List of elements
                if (elementsFound === 'LIST' && !$elements.length) {
                    $elements = _z.toArray(arguments[0]);
                }

                this.length = (
                    $elements.length || 0
                );
                this.extend($elements);
                head && (
                    this.head = head
                );

                if (this.info && (
                    isset(this.info.lastSelector) || this.info.lastSelector === null
                ))
                    delete this.info.lastSelector;

                return this;
            },

            // created timestamp
            get stamp() {
                return this.info.stamp || 0;
            },
            set stamp(stamp) {
                this.info.stamp = stamp || 0;
            },

            // arguments of _z object when called
            get args() {
                return this.info.args || [];
            },
            set args(args) {
                this.info.args = args || [];
            },

            // selector
            get selector() {
                return this.info.selector || "";
            },
            set selector(args) {
                this.info.selector = args || "";
            },

            // elements count
            length: 0,
            /**
             * getter, Check if this set has at least 1 element
             * @return {boolean}
             */
            get exists() {
                return this.length > 0;
            },

            // like context in jQuery
            get head() {
                return this.info.head || "";
            },
            set head(head) {
                this.info.head = head || "";
            },

            // last selector
            get lastSelector() {
                return this.info.lastSelector || undefined;
            },
            set lastSelector(lastSelector) {
                this.info.lastSelector = lastSelector || "";
            },

            // private data
            info: "",

            /**
             * todo: change method name, in case arguments.length = 0
             * @param {Number|undefined} index
             * @returns {_z}
             */
            at: function elementIndexAt(index) {
                // find index || undefined
                return this.newSelector(index === undefined ? [] : this.element(index));
            },

            // Get element by index
            element: function getElement(index) {
                // find index || undefined || get all if no index
                return isset(index) ? this[(index < 0 ? index + this.length : index)] : this.toArray();
            },
            /**
             * wiki
             *
             * @param index
             * @returns {*|Array}
             */
            get: function elementByIndexOrFilter(index) {
                // find index || undefined || get all if no index
                return isset(index) ?
                    (
                        index.isType('number') ? this.element(index) : this.filter(index)
                    ) : this.toArray();
            },

            // update current elements
            update: function updateElements(a) {
                a = _z(a).element();
                this.newSelector(null);

                this.filter((v, k) => {
                    if (k > a.length - 1) {
                        delete this[k];
                        return false;
                    }
                    this[k] = a[k];
                    return true;
                });

                this.extend(a);
                this.length = a.length;

                this.args = arguments;
                this.selector = a;
                return this;
            },

            // add elements, return new underz
            add: function addElements(anElements) {
                try {
                    anElements = _z(anElements).toArray();
                } catch (err) {
                }

                (
                    $anElements = this.element()
                ).push(...(
                    typeOf(anElements) === typeOf.a ? anElements : [anElements]
                ));
                return this.newSelector($anElements);
            },

            // add elements to this object, return same underz
            addThis: function addThisElements(anElements) {
                try {
                    (
                        aE = toArray(anElements)
                    ) && (
                        anElements = aE
                    );
                } catch (err) {
                }
                (
                    $anElements = this.element()
                ).push(...(
                    typeOf(anElements) === typeOf.a ? anElements : [anElements]
                ));

                this.update($anElements);
                return this;
            },

            // create new selector and save current
            newSelector: function newSelector() {
                var lastSelector = new (
                    newSelector.proto.init.bind(newSelector.proto)
                )(this.info, this.element());
                var a = (
                    arguments.length === 1 && arguments[0] === null
                ) ? this : _z(...arguments);
                a.lastSelector = lastSelector;

                return (
                    arguments.length === 1 && arguments[0] === null
                ) ? this : a;
            },

            // get Last saved Selector
            getLastSelector: function getLastSelector() {
                if (!!this.info.lastSelector && isset(this.info.lastSelector)) {
                    var z = _z(this.info.lastSelector.element());
                    z.info = this.info.lastSelector.info;
                    return z;
                }
                return _z();
            },
            end: function getLastSelector() {
                return this.getLastSelector();
            },

        };

        _z.$.init.prototype = _z.$;
        _z.$.extend = extendFunction;
        _z.$.extend(prototypies.likeArray);

// static objects _z.$
        fns.objProp(_z.$, {
            c: 0,
            add: [
                // ENGINE's
                'underZ', 'constructor', 'init', 'length', 'info',
                'end', 'getLastSelector', 'newSelector',
                'updateElements', 'element',
            ],
            'skip': true,
        });

// lastSelector holder
        _z.$.newSelector.proto = _z.$.newSelector.prototype = {
            // engine version
            underZ: version,
            // lastSelector info
            info: "",
            constructor: _z.$.newSelector,
            // create new instance newSelector()
            init: function UnderZSelector(info, $elements) {
                info = _z.extend({}, info) || {};
                $elements = _z.extend([], $elements) || [];

                this.info = info || {};
                this.extend($elements || []);
                this.length = $elements['length'] || 0;
                return this;
            },
            // Get elements
            element: function getElements() {
                return Array.from(this);
            },
        };
        _z.$.newSelector.proto.init.prototype = _z.$.newSelector.proto;
        _z.$.newSelector.proto.extend = extendFunction;
        _z.$.newSelector.proto.extend(prototypies.likeArray);

// static objects _z.$.newSelector
        fns.objProp(_z.$.newSelector, {
            c: 0,
            add: [
                // ENGINE's
                'underZ', 'constructor', 'init', 'info',
                'proto', 'element',
            ],
            'skip': true,
        });

// internal data
        var _iData = {
            // get/set data for element
            data: function updateiData(elm, $var, $val) {
                var $return = [];
                $val = getSet.call(true, $val, undefined);
                var $isVal = _z.isset($val);
                var newData = (
                    !!$var && !!$isVal
                ) || (
                    !!$var && !!!$isVal && _z.isObject($var)
                );
                var getData = (
                    !!$var && !!!$isVal
                ) || (
                    !!!$var && !!!$isVal
                );

                if (elm.length) {
                    var $this = elm;
                    elm.each(function (i, e) {
                        // get idata & no idata
                        if (!isset(e[version]) && getData) {
                            $return.push(undefined);
                            return;
                        }

                        // new data & create object
                        if (!isset(e[version]))
                            e[version] = new_zID();

                        var crnt_zIDData = new_zID.data[e[version]];

                        // set data
                        if (!!$var && !!$isVal && !!e[version]) {
                            crnt_zIDData['idata'][$var] = $val;
                            $return.push(e);
                        } else if (!!$var && !!!$isVal)
                            if (!_z.isObject($var)) // get data
                                $return.push(getSet.call(true, crnt_zIDData['idata'][$var], undefined));
                            else { // set data
                                crnt_zIDData['idata'] = crnt_zIDData['idata'] || {data: {}, idata: {}};
                                crnt_zIDData['idata'] = _z.extend(crnt_zIDData['idata'], $var);
                            }
                        else if (!!!$var && !!!$isVal) // get all data
                            $return.push(crnt_zIDData['idata']);
                    });
                }

                return $return;
            },

            // remove data\s for element
            remData: function removeiData(elm, $var) {

                elmFunc.elementMap(elm, function (e, v) {
                    if (!isset(e[version]))
                        return;

                    if (!!$var && !!e[version])
                        delete new_zID.data[e[version]]['idata'][$var];
                    else if (!!!$var && !!e[version]) {
                        new_zID.data[e[version]]['idata'] = {};
                    }

                    if (_z.size(new_zID.data[e[version]]['idata']) == 0
                        && _z.size(new_zID.data[e[version]]['data']) == 0) {
                        delete new_zID.data[e[version]];
                        delete e[version];
                    }
                }, trueFunction);

                return elm;
            },
            removeData: function removeiData() {
                return _iData.remData(...arguments);
            },
            clearData: function removeiData() {
                return _iData.remData(...arguments);
            },
        };

// element/elements value
        Object.defineProperty(_z.$, 'value', {
            get() {
                return this.val();
            },
            set(v) {
                return this.val(v);
            },
            configurable: false,
        });

// [ arg1, args... ].extend => _z.extend( arg1, ...args )
        Object.defineProperty(Array.prototype, 'extend', {
            get: function () {
                return extendFunction.status === false ? this : (
                    (
                        !!!this.length || this.length < 2
                    ) ? (
                            this[0] || this
                        ) :
                        _z.extend(true, this[0], ...subArray(1, this))
                );
            },
            configurable: false,
        });

// [ arg1, args... ].mix => _z.mix( arg1, ...args )
        Object.defineProperty(Array.prototype, 'mix', {
            get: function () {
                return this.length > 1 ? mix(this[0], ...subArray(1, this)) : this[0];
            },
            configurable: false,
        });

// add method - easy way
        var join = function attachToUnderZ() {
            var aData = _z.extend(true, {}, ...arguments);

            var $join = {
                // add to object
                "in": function () {
                    var l = arguments.length;
                    for (var li = 0; li < l; li++)
                        _z.extend(true, arguments[li], aData);

                    return $join;
                },
                // add to _z core
                "core": function () {
                    _z.extend(true, _z, aData);
                    return $join;
                },
                // add to _z.$
                "prop": function () {
                    _z.extend(true, _z.$, aData);
                    return $join;
                },
                // add to window
                "window": function () {
                    var _ks = Object.keys(aData);

                    for (var li = 0, l = _ks.length; li < l; li++)
                        window[_ks[li]] = aData[_ks[li]];

                    return $join;
                },
                // add prop, value in same object || value
                "alias": function (obj) {
                    var _ks = Object.keys(obj);

                    for (var li = 0, l = _ks.length; li < l; li++)
                        if (typeOf(obj[_ks[li]]) === typeOf.s && isset(aData[obj[_ks[li]]]))
                            aData[_ks[li]] = aData[obj[_ks[li]]];
                        else
                            aData[_ks[li]] = obj[_ks[li]];

                    return $join;
                },
            };

            return $join;
        };

        // main
        join({
            join: join,
            // fix arguments to set this as first var
            argsFix: fns.argsFix,
            time: fns.time,
        })
            .core();

        join({
            // is this element/elements = HTMLDOM
            isDOMElement: function isDOMElement(orIsWindow) {
                orIsWindow = orIsWindow || false;
                if (this.element().length) {
                    return _z.elementMap(this, _z.trueFunction, orIsWindow ? _z.isDOMOW : _z.isDOM).length === this.length;
                }

                return false;
            },
        })
            .prop();

        join({
            compStyle,
            toLowerCase: toLC,
            toUpperCase: toUC,
            trim: triming,
        })
            .core();

        join({
            emptyFunction,
            trueFunction,
            falseFunction,
            Undefined,
        })
            .core();

        join({
            getSet,
            newClass,
            isValidSelector,

            // return css selector from dom element
            cssSelector: function getCSSSelectorByElement(node, limit, path, returnType) {
                path = path || [];
                limit = limit || 1024;
                returnType = returnType || "string";
                path = !_z.isArray(path) ? [path] : path;
                let _path = Array.from(path) || [""];

                if (node.parentNode && limit !== 1) {
                    path = getCSSSelectorByElement(node.parentNode, limit - 1, path, "array");
                }

                if (node.nodeType === 1) {
                    let _selector = node.nodeName.toLowerCase();
                    _selector += node.id ? "[id='" + node.id + "']" : '';
                    _selector += node.name ? "[name='" + node.name + "']" : '';
                    _selector += node.className ? '.' + node.className.split(' ').filter(cn => _z.trim(cn)).join('.') : '';

                    path.push(_selector);
                }

                limit = limit !== false && limit > path.length ? path.length : limit;

                let result = limit !== false ? Array.from(path).reverse().slice(0, limit).reverse() : path;

                result.unshift(..._path);
                result = returnType === 'string' ? result.filter(cn => _z.trim(cn)).join(' ') : result;

                return result;
            },
        })
            .core();

        join({
            // add last selector elements, elm = filter by selector
            addBack: function addBack(elm) {
                return this.newSelector(this.add(...(
                    isset(elm) ? this.end().whereIn(elm) : this.end()
                ).element()));
            },

            equalsAll: function matchesAllElements(iObj) {
                var o1 = this.element();
                var o2 = _z(!_z.isFunction(iObj) ? iObj : [iObj]).element();

                if (o1.length !== o2.length) return false;

                if (_z.isArray(o1) && _z.isArray(o2)) {
                    for (var a = 0, aa = o1.length; a < aa; a++)
                        if (o2.inArray(o1[a]) == -1) return false;

                    return true;
                }


                var aMemberCount = 0;
                for (var a in o1) {
                    if (!o1.hasOwnProperty(a)) continue;

                    if (typeof o1[a] === 'object' && typeof o2[a] === 'object'
                        ? !o1[a].equals(o2[a])
                        : o1[a] !== o2[a]) return false;
                    ++aMemberCount;
                }

                for (var a in o2)
                    if (o2.hasOwnProperty(a))
                        --aMemberCount;

                return aMemberCount ? false : true;
            },

            // scroll To element
            scrollTo: function scrollToElement(elm/* , eIdx */) {
                if (!isset(elm) && !isset(this['underZ'], this['element'])) return false;

                var topOfElement,
                    $return = false;

                // check if elm is Top
                if (_z.isNumber(elm)) {
                    topOfElement = elm;
                    elm = undefined;
                }

                var scroller = isset(this['underZ'], this['element']) && !_z.isWindow(this) ?
                    this.filter(($e) => (
                        _z($e).isShow() && _z.isDOM($e)
                    )).element(0) :
                    window;

                if (isset(elm) && !!!_z(elm).isDOMElement(true) && !!!_z.isNumber(elm))
                    return isset(this['underZ'], this['element']) ? this : _z(scroller);

                if (isset(elm) && _z(elm).isDOMElement())
                    elm = _z(elm).filter($e => (
                        _z($e).isShow() && _z.isDOM($e)
                    ));

                if (isset(scroller) && !!!_z(scroller).isDOMElement(true))
                    scroller = window;

                try {
                    var scrollIntoView;

                    if (isset(elm) && _z.isFunction((
                        scrollIntoView = elm.prop('scrollIntoView')
                    )))
                        return scrollIntoView.call(elm[0]), _z(elm[0]);
                    else if (
                        (
                            arguments.length == 0 || (
                                !isset(elm) && !_z.isNumber(topOfElement)
                            )
                        ) &&
                        scroller && _z.isDOM(scroller) &&
                        _z.isFunction((
                            scrollIntoView = _z(scroller).prop('scrollIntoView')
                        ))
                    ) return scrollIntoView.call(scroller), _z(scroller);

                    var $returnTester = isset(elm) ? elm.rect('top') : 1;
                    if ((
                        topOfElement = topOfElement || $returnTester
                    ) == $returnTester) $return = _z(elm.element(0));

                    $returnTester = _z(scroller).rect('top');
                    if ((
                        topOfElement = topOfElement || $returnTester
                    ) == $returnTester) $return = _z(_z(scroller).element(0));

                    if (_z.isArray(topOfElement)) topOfElement = topOfElement[0];

                    if (_z.isNumber(topOfElement)) {
                        if (_z.isWindow(scroller))
                            return scroller.scroll(0, topOfElement),
                            $return || _z(scroller);
                        else if (isset(scroller['scrollTop']) && !!!elm)
                            return scroller['scrollTop'] = topOfElement || 0,
                            $return || _z(scroller);
                        else if (isset(scroller['scrollTop']))
                            return scroller['scrollTop'] = (
                                (
                                    topOfElement + (
                                        Number(_z(scroller).scrollTop()) || 0
                                    )
                                ) -
                                (
                                    Number(_z(scroller).rect('top')) || 0
                                )
                            ) || topOfElement,
                            $return || _z(scroller);

                    } else {
                        console.error('elm not found', [scroller, elm, topOfElement]);
                    }
                } catch (e) {
                    fns.t.generate(e);
                }

                return this;
            },

            // execute functions that in _z(FUNCTION)
            exec: function execFtunctions(doExec) {
                doExec = doExec == false ? false : true;
                elms = is_z(this) ? this : false;
                if (!elms || elms.length < 1) return this;

                try {
                    var resp = [];

                    elmFunc.elementMap(elms, function (e) {
                        try {
                            if (doExec) {
                                e.call(doc);
                            } else {
                                resp.push(e);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }, (f) => _z.isFunction(f));

                    if (!doExec) return _z(resp);

                } catch (eEval) {
                    console.error(eEval);
                }

                return this;
            },
        })
            .prop();

        join({
            // String.trim
            trim: function trimString(str) {
                var tunning = fns.argsFix(arguments, this, undefined, true);
                arguments = tunning("arguments");
                str = tunning.call();

                if (!isset(str)) return "";
                //
                // if( str && !!!is_z(str) ) str = _z(str);
                //
                // if( !str.selector && !str.length ) return "";

                var t = triming,
                    trimmedContext = str.selector ? String(str.selector) : (
                        typeOf(str) === typeOf.s ? str : false
                    );

                trimmedContext = trimmedContext || (
                    is_z(str) && str.element(0)
                ) || trimmedContext;
                if (!trimmedContext) return "";

                if (_z.isDOM(trimmedContext) && trimmedContext['textContent'])
                    trimmedContext = trimmedContext.textContent || trimmedContext;

                try {
                    if (!trimmedContext.length && t.call(trimmedContext).length)
                        return trimmedContext = t.call(trimmedContext);
                } catch (e) {

                }

                if (trimmedContext.length) return t.call(trimmedContext);

                return trimmedContext;
            },

            // Object, Array, String length
            size: function size(obj) {
                var obj = obj || false;
                if (!!!obj) return this.length || 0;

                if (_z.is_z(obj)) obj = obj.element();

                return Object.keys(obj || {}).length || 0;
            },

            // new typeof(`obj`), sameValue = new typeof(`obj`)( obj )
            createAs: function createAs(obj, sameValue, $default = {}) {
                obj = obj || false,
                    sameValue = sameValue || false;
                if (!!!obj) return false;

                try {
                    var newObject = eval(_z.type(obj, x => x));
                    if (newObject['constructor'])
                        if (sameValue)
                            return new newObject(obj);
                        else
                            return new newObject;
                } catch (e) {
                    if (arguments.length === 3)
                        return $default;

                    console.error("No Constructor in `" + (
                        obj.toString() || String(obj) || obj.name || _z.type(obj, x => x) || "Unknown"
                    ) + "` !!");
                }
                return false;
            },

            // if all array membar is numbers
            isNumbers: function isArrayNumber(n) {
                n = isset(n) ? (
                    _z.isArray(n) ? n : [n]
                ) : undefined;

                return _z.customLoop.apply(
                    this,
                    [
                        {
                            // assign or _z.elements
                            elements: n, // element to loop

                            // required
                            callback: function (e) {
                                return _z.isNumber(e);
                            }, // function for each callback

                            // assign or all elements is valid
                            valid: trueFunction, // function to filter elements before looping

                            // assign or return all results
                            result: function (r, ra) {
                                return !!(
                                    ra.length && r.filter((v) => v).length === ra.length
                                );
                            }, // function for fillter results
                        },
                    ],
                );
            },

            // isJson( JSONString ) true|false
            isJson: function isJson(json) {
                json = json || "";
                try {
                    return !!(
                        json = JSON.parse(json)
                    );
                } catch (_err) {
                    console.error("Parse Error[parseJSON]:", _err);
                }

                return false;
            },

        }, {
            // effect status, true = enabled, false = disabled
            eff: true,

            // extends objects only
            extendObjects: extendObjFunction,

            // return current time stamp
            now: function currentTimeStamp() {
                return Date.now();
            },

            // bind function
            proxy: function proxy(fn, fn2, ...args) {
                if (arguments.length > 1 && _z.isString(fn2) && isset(fn[fn2])) {
                    var _fn = fn[fn2];
                    fn2 = fn;
                    fn = _fn;
                }

                if (!_z.isFunction(fn)) return fn;

                // var args = prototypies.array.slice.call( arguments, 2 );
                args = toArray(args);
                var $this = this;
                let newProxy = proxy.proxyHandler && _z.isFunction(proxy.proxyHandler) ? proxy.proxyHandler : (
                    function newProxy(fn, fn2, args, ...$arguments) {
                        return fn.apply(fn2 || this, [_z.toArray(args), ..._z.toArray($arguments)]);
                    }
                );

                // functions guid
                proxy["_fguid"] = proxy["_fguid"] || 0;

                newProxy.guid = fn.guid = fn.guid || proxy._fguid++;
                // engine version
                newProxy.underZ = `UnderZ ${version} Proxy`;

                return newProxy.bind(fn, fn, fn2, ...args);
            },

            // global eval
            globaleval: function globaleval(code) {
                try {
                    const script = document.createElement('script');
                    script.text = code;

                    document.head.appendChild(script).parentNode.removeChild(script);
                } catch (e1) {
                }
                return this;
            },

            // load js file
            include: function jsFileIncluder(
                src,
                {
                    context = null,
                    args = null,
                    onload = emptyFunction,
                    onerror = emptyFunction,
                },
            ) {

                const Resolver = (x) => {
                    console.error('[resolver]');

                    let p = _z.isFunction(x) ? ($x) => new Promise(x) : ($x) => Promise.resolve(x);
                    // let $x = _z.isFunction(x) ? x : ($R, $J)=>$R(x);

                    return p();
                };

                context = {
                    context: context,

                    run: ($callable) => {

                        if (context.element) {
                            document.head.appendChild(context.element);
                            context.element.parentNode.removeChild(context.element);
                            context.element = undefined;
                            context.promise = _z.isFunction($callable) ? new Promise($callable) : (
                                $callable instanceof Promise ? $callable : Promise.resolve($callable)
                            );//Resolver(context.resolveMethod);
                            // context.then = context.run;
                            // delete context.run;
                        }

                        if (context.promise) {
                            $callable !== undefined && context.then($callable);
                        } else {
                            (
                                context.thenChain || (
                                    context.thenChain = []
                                )
                            ).push($callable);
                        }

                        return context.runChain();
                    },

                    then: ($callable) => {
                        (
                            context.thenChain || (
                                context.thenChain = []
                            )
                        ).push($callable);

                        return context.runChain();
                    },

                    runChain: () => {
                        if (context.promise) {
                            if (context.thenChain && context.thenChain.length) {
                                while (context.thenChain.length) {
                                    let $crntCallable = context.thenChain.shift();
                                    if ($crntCallable === undefined) continue;

                                    $crntCallable = $crntCallable && (
                                        _z.isFunction($crntCallable) || $crntCallable instanceof Promise
                                    )
                                        ? $crntCallable
                                        : (y) => $crntCallable;
                                    context.promise = context.promise.then($crntCallable);
                                }
                            }
                        }

                        return context;
                    },

                    thenRun: x => {
                        if (context.resolveMethod) {
                            return context.then(Resolver(x));
                        }

                        context.resolveMethod = Resolver(x);

                        return context.runChain();
                    },
                };

                try {
                    $return = function ($onload, $onerror) {
                        $onload = $onload || onload || fns.ef;
                        $onerror = $onerror || onerror || fns.ef;

                        const callableMaker = function callableMaker(callable, thisArg = null, $arguments) {
                            let $This = this;
                            if ($This instanceof callableMaker) {
                                $This.callable = callable;
                                $This.thisArg = thisArg;
                                $This.args = toArray($arguments);

                                return _z.proxy(
                                    $This.callable,
                                    $This.thisArg ? $This.thisArg : $This,
                                    $This.args || [],
                                );
                            }

                            return new callableMaker(...arguments);
                        };
                        callableMaker.prototype = {
                            constructor: callableMaker,
                            version: '0.0.2-b',
                            g: (x) => {
                                return [
                                    this.thisArg,
                                    this.callable,
                                    this.args,
                                    this,
                                ];
                            },
                        };

                        let
                            onloadCallable = callableMaker(
                                function ($args, e) {

                                    let $self = this, $_args = arguments;

                                    if (e && e.type && e.type !== 'load') {
                                        let newC = function () {
                                            var state = this.readyState;
                                            if (state === 'loaded' || state === 'complete') {
                                                script.onreadystatechange = null;
                                                // $onload.call($self, ...arguments);
                                                new Promise(function (r, j) {
                                                    try {
                                                        let $loading = $onload.call($self, ...$_args);
                                                        r($loading);
                                                    } catch (e) {
                                                        j(e);
                                                    }
                                                })
                                                    .then(x => context.then(x));
                                                return context;
                                                // setTimeout(() => document.head.removeChild(script), 1000);
                                            }
                                        };

                                        return newC.call($self, ...$_args, {});
                                    }

                                    new Promise(function (r, j) {
                                        try {
                                            let $loading = $onload.call($self, ...$_args);
                                            r($loading);
                                        } catch (e) {
                                            j(e);
                                        }
                                    })
                                        .then(x => context.then(x));
                                    return context;
                                    return context.resolve(function (r, j) {
                                        try {
                                            let $loading = $onload.call($self, ...$_args);
                                            r($loading);
                                        } catch (e) {
                                            j(e);
                                        }
                                    });
                                },
                                context || this,
                                [...args],
                            ),

                            onerrorCallable = callableMaker(
                                function ($args, e) {
                                    console.error([
                                        this,
                                        arguments,
                                        $onerror,
                                        e.type,
                                        e,
                                    ]);
                                    if (e && e.type && e.type !== 'load') {
                                        let newC = function () {
                                            var state = this.readyState;
                                            if (state === 'loaded' || state === 'complete') {
                                                script.onreadystatechange = null;
                                                $onerror.call(this, ...arguments);
                                                setTimeout(() => document.head.removeChild(script), 1000);
                                            }
                                        };

                                        return newC.call(this, ...arguments);
                                    }
                                    return $onload.call(this, ...arguments);
                                },
                                context || this,
                                [...args],
                            );

                        const script = context.element = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = src;
                        script.onreadystatechange = script.onload = onloadCallable;
                        script.onerror = onerrorCallable;

                        // document.head.appendChild(script);
                        script.addEventListener('load', onloadCallable, false);

                        return context;//(onload !== emptyFunction || onerror !== emptyFunction) ?
                        //$return() : $return;
                    };

                    // return $return;
                    return (
                        onload !== emptyFunction || onerror !== emptyFunction
                    ) ? $return() : $return;
                } catch (e1) {
                    throw e1;
                }

                return this;
            },

            // execute codes in HTMLDOM, exec src or innertext
            execScript: function execScript(e) {
                if (!e) return false;

                try {
                    var resp;

                    elmFunc.elementMap(_z(e), (elem) => {
                        if (elem.src) {
                            _z.ready({ajax: _z._URL_(elem.src)});
                        } else {
                            resp = _z.globaleval((
                                elem.text || elem.textContent || elem.innerHTML || ""
                            ).replace(/^\s*<!(?:\[CDATA\[|\-\-)/, "/*$0*/"));
                        }
                    }, (x) => _z.isObject(x) && x['src'] || _z(x).isDOMElement(true));
                } catch (eEval) {
                    console.error(eEval);
                    resp = false;
                }

                return resp;
            },

        })
            .alias({
                // scroll To element
                scrollTo: _z.$.scrollTo,
            })
            .core();

        join({
            // String.toString
            toString: toString,

            // Array.reduce
            reduce: reduce,

            // object.hasOwnProperty
            hasProp: hasProp,

            // var in obj
            hasVar: hasVar,

            /**
             * Get the closest matching element up the DOM tree.
             * @private
             * @param  {Element} elm     Starting element
             * @param  {String}  selector Selector to match against
             * @return {Boolean|Element}  Returns null if not match found
             */
            closest: function closest(elm, selector) {
                if (!is_z(this)) return _z(elm).closest(selector);

                selector = arguments.length == 1 && arguments[0] || selector;
                elm = arguments.length == 2 && arguments[0] || this;

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length)
                    return this.newSelector([]);


                elm = (
                    _z.is_z(elm) ? elm : _z(elm)
                );
                if (elm.length || elm.length) {
                    var $return = [],
                        copyOfElm;
                    elm.each(function () {
                        if (_z.isDOM(this)) {
                            copyOfElm = this;
                            // Get closest match
                            for (; copyOfElm && copyOfElm !== document; copyOfElm = copyOfElm.parentNode) {
                                if (elmFunc.matches(copyOfElm, selector))
                                    $return.push(copyOfElm), copyOfElm = document;
                            }
                        }
                    });

                    return this.newSelector($return);
                }

                return this.newSelector([]);
            },

            // random number // salt
            rnd: function (min, max) {
                if (arguments.length > 2 || (
                    min && !_z.isNumber(min)
                ) || (
                    max && !_z.isNumber(max)
                ))
                    return arguments[_z.rnd(arguments.length - 1)];

                if (_z.isNull(max))
                    max = Number.MAX_SAFE_INTEGER;

                if (!!!max)
                    max = min,
                        min = 0;

                max = Math.__random() * (
                    (
                        (
                            max - min
                        ) + 1
                    ) || 100
                ),
                    max = Math.floor(max || 100);

                return min + max;
            },

            // argument to array
            Array: function Array(input) {
                input = input || [];
                if (_z.isString(input) || _z.isFunction(input) || _z.isNumber(input)) input = [input];

                return _z.toArray(input);
            },

            // arguments to array
            toArray: toArray,

            // array slice
            subArray: subArray,

            /**
             * filter Array
             * @return _z.prototype
             */
            filter: filterArray,

            // apply function to all array membar
            /**
             *    return boolean
             *
             *    _z.customLoop({
             *		// _z.elements or assign
             *		elements: [1,2,3,4,5], // element to loop
             *
             *		// required
             *		callback: function(e) { return _z.isNumber(e); }, // function for each callback
             *
             *		// assign or all elements is valid
             *		valid: trueFunction, // function to filter elements before looping
             *
             *		// assign or return all results
             *		result: function(r,ra) { return ra.length?r[0]:false; } // function for fillter results
             * 	})
             */
            customLoop: function customLoop(op) {
                var
                    op = op || false,
                    elm = op !== false ? (
                        op['elements'] = (
                            isset(op['elements']) ? op['elements'] : (
                                isset(this['element']) && this || false
                            )
                        )
                    ) : false;
                if (!!!op || !!!(
                    op['callback'] = fns.isSetisFunc(op['callback']) && op['callback'] || false
                )) return false;

                elm = _z(elm);

                op['result'] = fns.isSetisFunc(op['result']) && op['result'] || function (c) {
                    return c;
                };
                op['valid'] = fns.isSetisFunc(op['valid']) && op['valid'] || trueFunction;

                var result = [false];
                if (_z.is_z(elm))
                    result = elm.length ? elmFunc.elementMap(elm, op['callback'], op['valid']) : [false];

                return op['result'](result, elm);
            },

            // forEach
            each: function each(obj, callback, args) {
                if (_z.isFunction(obj)) {
                    if (callback) args = callback;

                    callback = obj;
                    obj = this.toArray();
                }

                var obj = obj || [],
                    value,
                    i = 0,
                    length = obj.length,
                    isArray = _z.isArray(obj);

                if (isArray) {
                    for (; i < length; i++) {
                        value = args ? callback.apply(obj[i], args) : callback.call(obj[i], i, obj[i]);
                        if (value === false) break;
                    }
                } else {
                    for (i in obj) {
                        value = args ? callback.apply(obj[i], args) : callback.call(obj[i], i, obj[i]);
                        if (value === false) break;
                    }
                }

                return obj;
            },

            loop: loop,

            // foreach( Object|Array, function ), when function return false will break the loop
            for: foreach,

            elementMap: elmFunc.elementMap,

            // array map
            map: function map(array, func) {
                // _z.map["delete_var"] = var cc=0;
                // d=_z.toArray("DELETE_VAR").map(x=>{ cc += x.charCodeAt(0); return x.charCodeAt(0); })
                if (_z.isFunction(array) && !!!func) {
                    func = array;
                    array = this['element'] && this.element() || this || [];
                }

                if (_z.type(array) != "array")
                    array = this.toArray(array);

                if (_z.type(func) != "function")
                    throw new TypeError('Second argument IS NOT a Function!');

                var l = array.length;
                var rmIndex = [], i = 0;
                for (; i < l; i++) {
                    try {
                        var res = loops_Stop;
                        res = func.apply(array[i], [array[i], i, array]);
                    } catch (e) {
                        if (e instanceof loops_delThis)
                            rmIndex.push(i);
                    }
                    if (res != loops_Stop)
                        array[i] = res;
                }

                if (rmIndex.length)
                    _z.for(rmIndex, (i, v) => {
                        array.remove(v - i);
                    });

                return array;
            },

            getTransitionEventName: function getTransitionEventName(getCSSProp) {
                getCSSProp = getCSSProp || false;
                var el = is_z(this) && this.length ? this[0] : _z("body");
                el = (
                    el.length ? el : [doc["createElement"] && doc.createElement("atestElement")]
                )[0];

                if (!el) return "";

                var transitions = {
                    "transition": "transitionend",
                    "OTransition": "oTransitionEnd",
                    "MozTransition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd",
                };
                var _style = (
                    compStyle(el, null) || el.currentStyle
                ) || el.style;

                var _keys = Object.keys(transitions);
                for (var i = 0, l = _keys.length; i < l; i++) {
                    var key = _keys[i];
                    if (isset(_style[key]))
                        return getCSSProp ? key : transitions[key];
                }

                return "";
            },

        })
            .core()
            .prop();


        join({
            Keys: Keys,
            Row: Row,
            tap: tap,
        })
            .core()
            .window();

// ajax system
        var ajax = function ajax() {
            if (!!!(
                this instanceof ajax
            )) return new (
                ajax.bind(this)
            )(...arguments);

            return new (
                this.init.bind(this)
            )(...arguments);
        };

        ajax.config = {
            // counter
            id: 0,
            stopCalling: false,

            // XMLHttpRequest
            xhr: function () {
                assign = function assign(arg) {
                    var $this = this;
                    if (arg.length)
                        _z.each(arg, function (k, v) {
                            if (_z.isObject(v) && arg[k]['ajaxer']) {
                                arg[k].xhr = xhr;
                                $this.xhrs.push(arg[k]);
                            }
                        });

                    _z.each($this.xhrs || [], function (k, v) {
                        if (_z.isObject(v) && v['xhr'])
                            if ((
                                parseFloat(v['xhr']['status']) || 0
                            ) == 200)
                                $this.xhrs.remove(v['xhr']);
                    });
                };

                if (typeof XMLHttpRequest !== 'undefined') {
                    var xhr = new XMLHttpRequest();
                    ++this.id;
                    assign.call(this, arguments);
                    return;
                }

                var versions = [
                    "MSXML2.XmlHttp.6.0",
                    "MSXML2.XmlHttp.5.0",
                    "MSXML2.XmlHttp.4.0",
                    "MSXML2.XmlHttp.3.0",
                    "MSXML2.XmlHttp.2.0",
                    "Microsoft.XmlHttp",
                ];

                var xhr;
                for (var i = 0; i < versions.length; i++)
                    try {
                        xhr = new ActiveXObject(versions[i]);
                        break;
                    } catch (e) {
                    }

                ++this.id;
                assign.call(this, arguments);
                return;
            },

            // delete this keys from return new ajax ..
            deleteKeys: [
                'get',
                'init',
                // 'xhrFuncs',
            ],

            params: function params(obj) {
                return _z.param(...arguments);
            },

            urling: function urling(url) {
                url = String(url)
                    .replaceAll('&&', '&').replaceAll('??', '?')
                    .replaceAll('&&', '&').replaceAll('?&', '?')
                    .replaceAll('&&', '&');
                if (url.substr(-1) == '&')
                    url = url.substr(0, url.length - 1);

                return url;
            },

            xhrs: [],
        };

        ajax.ajaxer = ajax.prototype = {
            aguid: 0,
            callbacks: [],
            // callback: function(action, data) {
            // if(this.callbacks[action] && _z.size(this.callbacks[action]) > 0) {
            // 		let cb;
            // 		while(this.callbacks[action].length) {
            // 			cb = this.callbacks[action].shift();
            // 			if(_z.isFunction(cb))
            // 				cb.apply(this, _z.isArray(data) ? data : [data]);
            // 		}
            // 		return true;
            // 	}
            // return false;
            // },
            init: function Ajaxer(options, response) {
                this.aguid = ++ajax.config.id;
                // this['xhrFuncs'][ this.aguid ] = [];

                var param = this.param = _z.extend({xhr: false}, _z.ajaxSettings, options || {}),
                    $this = this,
                    xhr = {},
                    $callbacks = $this.callbacks = [],
                    // xhrFuncs = this['xhrFuncs'][ this.aguid ],
                    convertResponse = this.convertResponse;
                $callbacks[this.aguid] = [];

                foreach([
                        'done', 'fail', 'always',
                    ], function (k, action) {
                        $callbacks[$this.aguid][action] = $callbacks[$this.aguid][action] || [];
                        $this[action] = function (callback) {

                            $callbacks[$this.aguid][action] = $callbacks[$this.aguid][action] || [];
                            $callbacks[$this.aguid][action].push(callback);

                            if ($this.param.promise) {
                                let _callback = function (args) {
                                    return $this.callback(
                                        action,
                                        [
                                            ...(
                                                args && _z.Array(args) || []
                                            ),
                                        ],
                                    );
                                };
                                action === 'done' && $this.param.promise.then(_callback);
                                action === 'fail' && $this.param.promise.catch(_callback);
                                action === 'always' && $this.param.promise.finally(_callback);
                            } else {
                            }
                            return $this;
                        };
                    },
                );

                foreach([
                        'progress', 'timeout', 'onreadystatechange',
                    ], function (k, action) {
                        $callbacks[$this.aguid][action] = $callbacks[$this.aguid][action] || [];
                        $this[action] = function (callback) {
                            $callbacks[$this.aguid][action] = $callbacks[$this.aguid][action] || [];
                            $callbacks[$this.aguid][action].push(callback);
                            return $this;
                        };
                    },
                );

                if (param.done && _z.isFunction(param.done)) {
                    $this.done(param.done);
                    delete param.done;
                }
                if (param.fail && _z.isFunction(param.fail)) {
                    $this.fail(param.fail);
                    delete param.fail;
                }
                if (param.always && _z.isFunction(param.always)) {
                    $this.always(param.always);
                    delete param.always;
                }

                param.xhr = xhr;
                param.xhr.ajaxer = {};
                ajax.config.xhr(param.xhr);

                if (isset(param.xhr['xhr'])) param.xhr = param.xhr.xhr;

                xhr = param.xhr;

                try {
                    xhr['withCredentials'] = param['withCredentials'];
                } catch ($withCredentials) {
                }

                // url
                if (!!!param['url'])
                    try {
                        param['url'] = location.href;
                    } catch (e) {
                        // Use the href attribute of an A element
                        // since IE will modify it given document.location
                        param['url'] = document.createElement("a");
                        param['url'].href = "";
                        param['url'] = param['url'].href;
                    }

                param['url'] += (
                    param['url'].indexOf('?') === -1 ? '?' : '&'
                );
                var cacheVar = !!param['cache'] ? "_cache=" + fns.time() + '&' : '';

                param.async = param.async === undefined ? true : param.async;

                _z.mix($this, {
                    pipe: param.promise,
                    then: function (s, e) {
                        return param.promise.then(s).catch(e), this;
                    },
                    abort: $this.abort,
                    param: param,
                    readyState: param.xhr.readyState,
                    response: param.xhr.response,
                    responseText: param.xhr.responseText,
                    responseType: param.xhr.responseType,
                    responseURL: param.xhr.responseURL,
                    responseXML: param.xhr.responseXML,
                    status: param.xhr.status,
                    statusText: param.xhr.statusText,
                    timeout: param.xhr.timeout,
                    upload: param.xhr.upload,
                    withCredentials: param.xhr.withCredentials,
                    xhr: param.xhr,
                });

                if (!!!(
                    $this.param.async !== false
                )) {
                    var data = convertResponse($this.param);

                    $this.callback('done', [data, 'done', xhr, $this]);
                }

                var start = function start() {
                    if (param.fired === true) return this;

                    // search for ContentType
                    let hasContentType = false;
                    if (param.headers.getSize() > 0) {
                        param.headers.each((hKey, hVal) => {
                            if (['x-requested-with', 'xrequestedwith'].includes(toLC(triming(hKey)))) {
                                delete param.headers[hKey];
                                return;
                            }

                            if (['content-type', 'contenttype'].includes(toLC(triming(hKey)))
                                && !hasContentType) {
                                param.contentType = hVal;
                                delete param.headers[hKey];
                                return !(
                                    hasContentType = true
                                );
                            }
                        });
                    }

                    if (toLC(param.type) !== "get") {
                        xhr.open(param.type, ajax.config.urling(param.url + cacheVar), param.async !== false);

                        if (param.processData === false && param.contentType === false) {

                        } else if (param.processData === true && !!!param.contentType)
                            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        else if (!!param.contentType)
                            xhr.setRequestHeader('Content-Type', param.contentType);

                        // set Request Header
                        if (param.headers.getSize() > 0) {
                            param.headers.each((hKey, hVal) => {
                                if (['content-type', 'contenttype'].includes(toLC(triming(hKey))))
                                    return;

                                xhr.setRequestHeader(triming(hKey), triming(hVal));
                            });
                        }

                        // if( param.processData === false ) {
                        //
                        // }
                        // else if( param.processData === true && hasContentType === false ) {
                        //     xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
                        // }
                    } else
                        xhr.open(
                            param.type,
                            ajax.config.urling(param.url + ajax.config.params(param.data) + '&' + cacheVar),
                            param.async !== false,
                        );

                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                    if (param.data != null || param.data !== undefined) {
                        // xhr.send( ( param.processData === false && param.contentType === false ) ?
                        //     param.data : ajax.config.params( param.data ) );
                        xhr.send(
                            param.processData === false
                                ? param.data
                                : ajax.config.params(param.data),
                        );
                    } else xhr.send();

                    $this.callback('always', [xhr, $this]);

                    param.fired = true;
                    return this;
                };

                $this.promise = param.promise = new Promise(function (resolve, reject) {
                    let xhrLoaded = {
                        'onprogress': false,
                        'ontimeout': false,
                        'onerror': false,
                        'onreadystatechange': false,
                        'onload': false,
                    };
                    xhr.onprogress = function onprogress(event) {
                        xhrLoaded['onprogress'] = true;
                        $this.callback(['progress', 'onprogress'], [{loaded: event.loaded}, "progress", event]);
                    };

                    xhr.ontimeout = function ontimeout() {
                        xhrLoaded['ontimeout'] = true;
                        $this['abort'] && $this.abort();
                        this.abort();

                        $this.callback(['timeout', 'ontimeout'], ["timeout"]);
                        reject([undefined, "timeout", xhr]);
                    };

                    xhr.onerror = function onerror() {
                        xhrLoaded['onerror'] = true;
                        $this.callback(['error', 'onerror'], [xhr.responseText, "error"]);
                        reject([xhr.responseText, 'error', xhr]);
                    };

                    xhr.onreadystatechange = function onreadystatechange(event) {
                        xhrLoaded['onreadystatechange'] = true;
                        if (param['statusCodes'] && param['statusCodes'][this.status] &&
                            _z.isFunction(param['statusCodes'][this.status]))
                            param['statusCodes'][this.status](xhr);

                        if (param['states'] && param['states'][this.readyState] &&
                            _z.isFunction(param['states'][this.readyState]))
                            param['states'][this.readyState](xhr);

                        $this.callback(['onreadystatechange', 'readystatechange'], [this.readyState, xhr]);
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                // --ajax.config.id,
                                $this.callback('success', [xhr.responseText, 'success', xhr, $this]);
                                // xhr.onload(event);
                            } else {
                                $this.callback('done', [xhr.responseText, 'done', xhr, $this]);
                            }

                            $this.callback('always', [xhr, $this]);
                        }

                        var newXHRStatus = {
                            readyState: xhr.readyState,
                            response: xhr.response,
                            responseText: xhr.responseText,
                            responseType: xhr.responseType,
                            responseURL: xhr.responseURL,
                            responseXML: xhr.responseXML,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            timeout: xhr.timeout,
                            upload: xhr.upload,
                            withCredentials: xhr.withCredentials,
                        };
                        $this = _z.extend(true, $this, newXHRStatus);
                        $this['param'] = _z.extend(true, $this['param'], newXHRStatus);

                    };

                    xhr.onload = function onloadFunction(event) {
                        if (xhrLoaded['onload'] === true) return;

                        xhrLoaded['onload'] = true;
                        // var xhr = param.xhr,
                        //     xhrFuncs = param.xhrFuncs;
                        $this.callback('onload', [event, xhr]);

                        if (param.xhr.status === 200) {
                            var data = convertResponse(param);

                            if (resolve)
                                resolve([data, "success", xhr, $this]);
                        } else {
                            $this.callback('fail', [param.xhr.responseText, "error", xhr, $this]);
                            reject([param.xhr.responseText, "error", xhr, $this]);
                        }

                        var newXHRStatus = {
                            readyState: xhr.readyState,
                            response: xhr.response,
                            responseText: xhr.responseText,
                            responseType: xhr.responseType,
                            responseURL: xhr.responseURL,
                            responseXML: xhr.responseXML,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            timeout: xhr.timeout,
                            upload: xhr.upload,
                            withCredentials: xhr.withCredentials,
                        };

                        $this = _z.extend(true, $this, newXHRStatus);
                        $this['param'] = _z.extend(true, $this['param'], newXHRStatus);
                        return;
                    };

                    if (param.timeout !== undefined && param.async !== false)
                        xhr.timeout = param.timeout;
                    else if (param.async !== false)
                        xhr.timeout = 20000;

                    return start();
                })
                    .then(x => _z.isArray(x) && x.length === 1 ? x.shift() : x)
                    .then(x => $this.callback('done'))
                    .finally(x => $this.callback('always'))
                    .catch(x => $this.callback('fail'));

                // 'always', 'done', 'fail'
                // $this.promise.then(function(result) {
                //     $this.xhrFuncsApply( 'done', true, result );
                // }, function(result) {
                //     $this.xhrFuncsApply( 'error', true, result );
                // });

                return $this; // param.promise;//
            },

            // current ajax options
            param: {},

            abort: function abort(response) {
                if (XMLHttpRequest != null) {
                    this.param.xhr.abort();
                    ajax.config.stopCalling = false;

                    if (_z.isFunction(response))
                        response({status: "success"});
                }
            },

            // exec function
            callback: function callback(fname, args) {
                let self = this;
                if (_z.isArray(fname)) {
                    return foreach(fname, function (i, f) {
                        callback.call(self, f, args);
                    });
                }

                var fnsList = this['callbacks'][this.aguid] || [];
                fnsList = fnsList[fname] || [];
                var fs, fnsLen = fnsList.length || 0;

                if (fnsList.length)
                    for (var i = 0; i < fnsLen; i++) {
                        fs = fnsList.shift();
                        if (_z.isFunction(fs))
                            fs.call(
                                this,
                                ...(
                                    args || []
                                ),
                            );
                    }
            },

            // create function
            // xhrFuncsSetTest: "",

            xhrFuncsSet: function xhrFuncsSet(fname, fn) {
                if (!_z.isFunction(fn)) return false;

                this['xhrFuncs'][this.aguid][fname] = this['xhrFuncs'][this.aguid][fname] || [];
                this['xhrFuncs'][this.aguid][fname].push(fn);

                // if( _z.isFunction($this.xhrFuncsSetTest) ) this.xhrFuncsSetTest();
            },

            // return setter function
            xhrFuncsSetter: function xhrFuncsSetter(fname, $return) {
                var funcSet = this.xhrFuncsSet,
                    _this = this;
                return function ($fn) {
                    if (_z.isFunction($fn))
                        funcSet.apply(_this, [fname, $fn]);

                    return (
                        $return['param'] && $return['param']['scoop']
                    ) || $return;
                };
            },

            xhrFuncs: [],

            // convert responseText by dataType
            convertResponse: function convertResponse(_param) {

                let
                    data = _param.xhr.responseText,
                    ct = _param.xhr.getResponseHeader("content-type") || "",
                    $ct = (
                            ct.indexOf('html') > -1 && 'html'
                        ) ||
                        (
                            ct.indexOf('xml') > -1 && 'xml'
                        ) ||
                        (
                            ct.indexOf('json') > -1 && 'json'
                        ) ||
                        (
                            ct.indexOf('script') > -1 && 'script'
                        ) || false;

                if ($ct) {
                    if (_param['converters'] && _param['converters'][$ct])
                        if (_z.isFunction(_param['converters'][$ct]))
                            return data = _param['converters'][$ct](_param.xhr.responseText);
                }

                if (_param.dataType && _param.dataType !== "text")
                    if (_param['converters'] && _param['converters'][_param.dataType])
                        if (_z.isFunction(_param['converters'][_param.dataType]))
                            data = _param['converters'][_param.dataType](_param.xhr.responseText);

                return data;
            },

            // ajaxs
            pipe: null,
            then: null,
            // param: null,
            readyState: null,
            response: null,
            responseText: null,
            responseType: null,
            responseURL: null,
            responseXML: null,
            status: null,
            statusText: null,
            timeout: null,
            upload: null,
            withCredentials: null,
            xhr: null,
        };
        ajax.ajaxer.init.prototype = ajax.ajaxer;

// abort all xhr
        ajax.config.xhrs.abortAll = function () {
            var requests = [];
            for (var index in this)
                if (isFinite(index) === true)
                    requests.push(this[index]);

            for (index in requests && requests[index]['ajaxer'])
                requests[index]['ajaxer'].abort();
        };

// remove one xhr
        ajax.config.xhrs.remove = function removeXHR(xhr) {
            var $this = this;
            for (var index in $this)
                if ($this[index]['xhr'] === xhr) {
                    try {
                        $this[index]['xhr'].abort();
                    } catch (e) {

                    }
                    $this.splice(index, 1);
                    break;
                }
        };

// ajax & url tools
        join({
            // hash from url
            hash: function getHash(setHash) {
                if (_z.isset(setHash))
                    window.location.hash = _z.trim(setHash);

                var hash = window.location.hash || "";
                return hash.substr(1);
            },

            // object to url query
            param: function param(object, perfix, parts) {
                var parts = parts || [],
                    perfix = perfix || false,
                    add = function (n, v) {
                        parts.push(
                            encodeURIComponent(n) + "=" +
                            encodeURIComponent(_z.isFunction(v) ? v() : (
                                v == null && "" || v
                            )),
                        );
                    };

                // append
                if (perfix) {
                    // array
                    if (typeOf(object) === typeOf.a) {
                        for (i = 0, len = object.length; i < len; i++)
                            if (/\[\]$/.test(perfix))
                                add(perfix, object[i]);
                            else
                                param(
                                    object[i],
                                    perfix + '[' + (
                                        typeOf(object[i]) === typeOf.o ? i : ''
                                    ) + ']',
                                    parts,
                                );
                    }
                    // object
                    else if (typeOf(object) === typeOf.o) {
                        for (var prop in object)
                            param(object[prop], perfix + '[' + prop + ']', parts);
                    }
                    // string
                    else add(perfix, object);
                } else if (typeOf(object) === typeOf.a) {
                    // elements
                    elmFunc.elementMap(object, function (e, v) {
                        if (e.name)
                            add(e.name, e.value);
                    }, trueFunction);
                }
                // init
                else {
                    for (var prop in object)
                        param(object[prop], prop, parts);
                }

                return parts.join('&').replace(/%20/g, '+');
            },

        }, {
            // normal ajax
            ajax: ajax,

            // load data to elment ajax
            getInTo: function ajaxGETInToElement(elm, url, callback) {
                var url = url || "",
                    elm = elm || false,
                    callback = callback || false;

                if (!url) return this;

                var pr = fetch(url).then(data => data.text());
                pr.then(data => {
                    elm && _z(elm).html(data);
                });

                if (callback)
                    pr.then(callback);

                return pr;
            },

            // get ajax
            get: function ajaxGET(url, data, callback) {
                var url = url || "",
                    data = data || false,
                    callback = callback || false,
                    tmp;
                if (_z.isFunction(data) && !!!callback)
                    callback = data,
                        data = {};

                if (_z.isFunction(data) && !!callback)
                    tmp = callback,
                        callback = data,
                        data = tmp,
                        tmp = "";

                data = data || {};
                tmp = _z.ajax({
                    dataType: 'text',
                    url: url || "",
                    type: 'GET',
                    data: data,
                });
                if (callback)
                    tmp.done(callback);

                return tmp;
            },

            // post ajax
            post: function ajaxPOST(url, data, callback) {
                url = url || "";
                data = data || false;
                callback = callback || false;
                let tmp, _options = {};

                if (arguments.length === 1 && _z.isObject(url)) {
                    let getFromObject = (obj, attr, def_val) => {
                        if (hasVar(obj, attr)) {
                            let _return = obj[attr];
                            delete obj[attr];
                            return _return;
                        } else return def_val || false;
                    };
                    _options = url;
                    url = getFromObject(_options, "url", '');
                    data = getFromObject(_options, "data", false);
                    callback = getFromObject(_options, "done", false);

                }

                if (_z.isFunction(data) && !!!callback)
                    callback = data,
                        data = {};

                if (_z.isFunction(data) && !!!callback)
                    callback = data,
                        data = {};

                if (_z.isFunction(data) && !!callback)
                    tmp = callback,
                        callback = data,
                        data = tmp,
                        tmp = "";

                data = data || {};
                _options = _z.mix({
                    dataType: 'text',
                    url: url || "",
                    type: 'POST',
                    data: data,
                }, _options);
                // console.warn(_options);
                tmp = _z.ajax(_options);
                if (callback)
                    tmp.done(callback);

                return tmp;
            },

            // json ajax
            getJSON: function ajaxJSON(url, data, callback) {
                var url = url || "",
                    data = data || false,
                    callback = callback || false,
                    tmp;
                if (_z.isFunction(data) && !!!callback)
                    callback = data,
                        data = {};

                if (_z.isFunction(data) && !!callback)
                    tmp = callback,
                        callback = data,
                        data = tmp,
                        tmp = "";
                data = data || {};
                tmp = _z.ajax({
                    dataType: 'json',
                    url: url || "",
                    type: 'GET',
                    data: data,
                });
                if (callback)
                    tmp.done(callback);

                return tmp;
            },

            // script ajax
            getScript: function ajaxScript(url, data, callback) {
                var url = url || "",
                    data = data || false,
                    callback = callback || false,
                    tmp;
                if (_z.isFunction(data) && !!!callback)
                    callback = data,
                        data = {};

                if (_z.isFunction(data) && !!callback)
                    tmp = callback,
                        callback = data,
                        data = tmp,
                        tmp = "";
                data = data || {};
                tmp = this.ajax({
                    dataType: 'script',
                    url: url || "",
                    type: 'GET',
                    data: data,
                });

                if (callback)
                    tmp.doneAndArguments(callback);

                return tmp;
            },

            // default ajax options
            ajaxSettings: {
                url: "",
                type: "GET",
                isLocal: false,
                global: true,
                cache: true,
                processData: true,
                async: true,
                headers: {},
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                // contentType: true,
                data: {},
                timeout: 20000,
                fired: false,
                dataType: "json",
                accepts: {
                    "*": "*/*",
                    "text": "text/plain",
                    "html": "text/html",
                    "xml": "application/xml, text/xml",
                    "json": "application/json, text/javascript",
                    "script": "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
                },

                statusCodes: {},
                states: {},

                contents: {
                    script: /(?:java|ecma)script/,
                    xml: /xml/,
                    html: /html/,
                    json: /json/,
                },

                responseFields: {
                    "xml": "responseXML",
                    "text": "responseText",
                    "json": "responseJSON",
                },

                converters: {
                    // return from eval
                    "return": function returnFromEval(s) {
                        try {
                            return fns.tryEval(s);
                        } catch (e) {
                            console.error(e);
                            return {};
                        }
                    },
                    // toString
                    "text": window.String,
                    // toJSON
                    "json": parssing.json,
                    // toXML
                    "xml": parssing.xml,
                    // js
                    "script": function (text) {
                        return fns.tryEval(text), text;
                    },
                },
            },

            ajaxSetup: function changeDefaultAjaxOption(opt) {
                _z.ajaxSettings = _z.extend(true, _z.ajaxSettings, opt);
                return _z.ajaxSettings;
            },
        })
            .core();

// DOM functions
        join({
            // get equal elements
            whereIn: function isEqual2() {
                return elmFunc.where.apply(this, [...arguments, false]);
            },

            // get not equal elements
            whereNotIn: function isNotEqual2() {
                return elmFunc.where.apply(this, [...arguments, true]);
            },
        })
            .alias({
                not: 'whereNotIn'
            })
            .prop();

        join({
            // is element shown
            isShow: function isShow(ret) {
                ret = ret || false;
                status = false;

                if (this.length > 1) {
                    var elm = this,
                        $return = [];
                    elmFunc.elementMap(elm, function (e) {
                        if (ret == true && _z(e).isShow())
                            $return.push(e);
                        else if (ret != true)
                            $return.push(_z(e).isShow());
                    });

                    return ret == true ? this.newSelector($return) : $return;
                }

                if (_z(this))
                    var status = _z(this).hasClass('hidden') ? true :
                        (
                            /hidden|none/i.test(_z(this).css('visibility') + " " + _z(this).css(
                                'display'))
                        );

                status = (
                    ret == true && !!!status
                ) ? this : !!!status;

                return status;
            },

            // is element hidden
            isHidden: function isHidden(ret) {
                ret = ret || false;
                status = false;

                if (this.length > 1) {
                    var elm = this,
                        $return = [];

                    elmFunc.elementMap(elm, function (e) {
                        if (ret == true && _z(e).isHidden())
                            $return.push(e);
                        else if (ret != true)
                            $return.push(_z(e).isHidden());
                    });

                    return ret == true ? this.newSelector($return) : $return;
                }

                if (_z(this))
                    var status = _z(this).hasClass('hidden') ? true :
                        (
                            /hidden|none/i.test(_z(this).css('visibility') + " " + _z(this).css(
                                'display'))
                        );

                status = (
                    ret == true && !!status
                ) ? this : !!status;

                return status;
            },

            isHide: function isHidden() {
                return !!!this.isShow();
            },

            // is element in view
            inViewport: function inViewport() {
                $ele = this;
                var lBound = _z(window).scrollTop(),
                    uBound = lBound + _z(window).height(),
                    top = $ele.offset().top,
                    bottom = top + $ele.outerHeight(true);

                return (
                        top > lBound && top < uBound
                    )
                    || (
                        bottom > lBound && bottom < uBound
                    )
                    || (
                        lBound >= top && lBound <= bottom
                    )
                    || (
                        uBound >= top && uBound <= bottom
                    );
            },

            // element rect (top/left/height/width)
            rect: function elementRect(scrolls) {
                var elm = this,
                    scrolls = isset(scrolls) ? scrolls : true,
                    $return = [],
                    returnKey = _z.isBoolean(scrolls) ? false : scrolls,
                    scrolls = _z.isBoolean(scrolls) ? scrolls : true;

                elmFunc.elementMap(elm, function (e) {
                    var tResult = {};

                    if (isWindow(e)) {
                        var height = e.innerHeight ||
                                e.document.documentElement.clientHeight ||
                                e.document.body.clientHeight || 0,

                            width = e.innerWidth ||
                                e.document.documentElement.clientWidth ||
                                e.document.body.clientWidth || 0;

                        tResult = {
                            top: e.document.documentElement["client" + 'Top'] | 0,
                            right: e.document.documentElement["client" + 'Width'] | 0,
                            left: e.document.documentElement["client" + 'Left'] | 0,
                            bottom: e.document.documentElement["client" + 'Height'] | 0,

                            outerHeight: height,
                            outerHeightWP: height,
                            innerHeight: height,
                            height: height,

                            outerWidth: width,
                            outerWidthWP: width,
                            innerWidth: width,
                            width: width,
                        };
                    }// document
                    else if (e.nodeType === 9) {
                        var height = Math.max(
                                e.body["scroll" + 'Height'], e.documentElement["scroll" + 'Height'],
                                e.body["offset" + 'Height'], e.documentElement["offset" + 'Height'],
                                e.documentElement["client" + 'Height'],
                            ),
                            width = Math.max(
                                e.body["scroll" + 'Width'], e.documentElement["scroll" + 'Width'],
                                e.body["offset" + 'Width'], e.documentElement["offset" + 'Width'],
                                e.documentElement["client" + 'Width'],
                            );

                        tResult = {
                            top: Math.max(
                                e.body["scroll" + 'Top'], e.documentElement["scroll" + 'Top'],
                                e.body["offset" + 'Top'], e.documentElement["offset" + 'Top'],
                                e.documentElement["client" + 'Top'],
                            ) | 0,
                            right: Math.max(
                                e.body["scroll" + 'Width'], e.documentElement["scroll" + 'Width'],
                                e.body["offset" + 'Width'], e.documentElement["offset" + 'Width'],
                                e.documentElement["client" + 'Width'],
                            ) | 0,
                            left: Math.max(
                                e.body["scroll" + 'Left'], e.documentElement["scroll" + 'Left'],
                                e.body["offset" + 'Left'], e.documentElement["offset" + 'Left'],
                                e.documentElement["client" + 'Left'],
                            ) | 0,
                            bottom: Math.max(
                                e.body["scroll" + 'Height'], e.documentElement["scroll" + 'Height'],
                                e.body["offset" + 'Height'], e.documentElement["offset" + 'Height'],
                                e.documentElement["client" + 'Height'],
                            ) | 0,

                            outerHeight: height,
                            outerHeightWP: height,
                            innerHeight: height,
                            height: height,

                            outerWidth: width,
                            outerWidthWP: width,
                            innerWidth: width,
                            width: width,
                        };
                    } else {
                        var rect = (
                            e['getBoundingClientRect']
                        ) ? e.getBoundingClientRect() : {
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        };
                        var style = compStyle(e) || e.currentStyle;
                        tResult = {
                            top: (
                                rect.top || 0
                            ) + (
                                scrolls ? (
                                    document.body.scrollTop || 0
                                ) : 0
                            ),
                            right: (
                                rect.right || 0
                            ),
                            left: (
                                rect.left || 0
                            ) + (
                                scrolls ? (
                                    document.body.scrollLeft || 0
                                ) : 0
                            ),
                            bottom: (
                                rect.bottom || 0
                            ),
                            // height of element
                            height: parseInt(style.height),

                            // outer
                            // the height of an element (includes padding and border).
                            outerHeight: e.offsetHeight,

                            // outer
                            // the height of an element (includes padding, border and margin).
                            outerHeightWP: (
                                e.offsetHeight +
                                parseInt(style.marginTop) +
                                parseInt(style.marginBottom)
                            ),

                            // inner
                            // the height of an element (includes padding).
                            innerHeight: e.clientHeight || e.scrollHeight,

                            width: parseInt(style.width),

                            // the width of an element (includes padding and border).
                            outerWidth: e.offsetWidth,

                            // the width of an element (includes padding, border and margin).
                            outerWidthWP: (
                                e.offsetWidth +
                                parseInt(style.marginLeft) +
                                parseInt(style.marginRight)
                            ),

                            innerWidth: e.clientWidth || e.scrollWidth,
                        };
                    }

                    if (returnKey !== false && isset(tResult[returnKey]))
                        tResult = tResult[returnKey];

                    $return.push(tResult);

                }, (x) => {
                    return _z.isDOM(x) || isWindow(x) || x.nodeType === 9;
                });

                return this.length == 1 ? $return[0] : $return;
            },

            // element position (top/left)
            position: function position() {
                var elm = this,
                    $return = [];

                elmFunc.elementMap(elm, function (e) {
                    if (e['offsetLeft'] && e['offsetLeft'])
                        $return.push({
                            top: (
                                e['offsetTop'] || 0
                            ),
                            left: (
                                e['offsetLeft'] || 0
                            ),
                        });
                });

                return this.length == 1 ? $return[0] : $return;
            },

            // offsetParent of element ( closest visable parent)
            offsetParent: function offsetParent() {
                var elm = this,
                    $return = [];
                elmFunc.elementMap(elm, function (e) {
                    $return.push(e['offsetParent'] || e);
                });

                return this.length === 1 ? $return[0] : $return;
            },
        })
            .prop();

        join({
            // trigger an event
            trigger: function triggerEvent(eventName) {
                var elm = this,
                    eventName = eventName || false;
                if (!eventName) return this;

                // handle multi event
                if (_z.isString(eventName) && eventName.split(" ").length > 1)
                    eventName = eventName.split(" ");

                if (_z.isArray(eventName)) {
                    eventName = _z.filter(eventName).toArray();

                    _z.for(eventName, function (eKey, eName) {
                        _z(elm).trigger(eName);
                    });

                    return this;
                }

                var _alias = [], alias = [];
                if (alias.length) {
                    _alias = alias;
                    alias = [];
                }

                alias = events.getAlias(eventName);
                var aliasQry = (
                    alias.length ? "." + alias.join(".") : ""
                );
                eventName = events.getEventName(eventName);

                var elmentWithNS = [];
                if (alias.length) {
                    _z.for(elm, function (Index, e) {
                        var needleData = {};
                        e && (
                            needleData['element'] = e
                        );
                        eventName && (
                            needleData['eventName'] = eventName
                        );
                        alias && (
                            needleData['alias'] = alias
                        );
                        var _elmentWithNS = events.find(needleData);

                        if (_z.size(_elmentWithNS) == 0) return;
                        else {
                            elmentWithNS.push(_elmentWithNS);
                            _z.for(_elmentWithNS, function (_Index, _e) {

                                eventName = events.getEventName(_e["eventName"]);
                                var NSalias = _e["alias"];
                                var NSaliasQry = (
                                    NSalias.length ? "." + NSalias.join(".") : ""
                                );

                                var event = (
                                    e.ownerDocument ? e.ownerDocument : e
                                ).createEvent('HTMLEvents');
                                event.initEvent(eventName + NSaliasQry, true, true);
                                try {
                                    event.synthetic = true;
                                    events.lastEvent = undefined;
                                    if (e.dispatchEvent)
                                        e.dispatchEvent(event);
                                    else
                                        event = {target: e, type: eventName + NSaliasQry};

                                    if (events.lastEvent == undefined) {
                                        _e["proxyCallback"].apply(e, [event, _e]);
                                    }
                                    events.lastEvent = undefined;
                                } catch (er) {
                                    console.error(er);
                                }
                            });
                            events.lastEvent = version;
                            return this;
                        }
                    });

                    return this;
                }

                elmFunc.elementMap(elm, function (e) {
                    // todo: must try to call element.eventname first
                    events.createEventAnddispatch(e, eventName + aliasQry);
                }, trueFunction);

                return this;
            },

            // attach an event
            on: function attachEvent(eventName, qselector, callback) {
                var elm = this,
                    eventName = eventName || false,
                    qselector = qselector || false,
                    callback = callback || false,
                    alias = [];

                // if multi elements
                if (eventName && _z.isObject(eventName) && arguments.length < 2) {
                    _z.for(eventName, function (eName, eCB) {
                        if (_z.isFunction(eCB)) {
                            _z(elm).on(eName, eCB);
                        } else if (_z.isObject(eCB)) {
                            _z.for(eCB, function (eSelector, eCB_) {
                                if (_z.isFunction(eCB_))
                                    _z(elm).on(eName, eSelector, eCB_);
                            });
                        }
                    });
                    return this;
                }

                if (!eventName && !qselector)
                    return this;

                if (arguments.length == 2 && _z.isFunction(qselector))
                    callback = qselector,
                        qselector = false;

                if (!_z.isFunction(callback)) return this;

                // handle multi event
                if (_z.isString(eventName) && eventName.split(" ").length > 1)
                    eventName = eventName.split(" ");

                if (_z.isArray(eventName)) {
                    var oldArgs = _z.filter([eventName, qselector || "", callback || ""]).toArray();

                    _z.for(eventName, function (eKey, eName) {
                        oldArgs.shift();
                        oldArgs.unshift(eName);
                        _z(elm).on(...oldArgs);
                    });
                    return this;
                }

                var alias = events.getAlias(eventName);
                var aliasQry = (
                    alias.length ? "." + alias.join(".") : ""
                );
                eventName = events.getEventName(eventName);

                // .on("hover")
                if (eventName == "hover") {
                    eventName = "mouseenter" + aliasQry + " mouseleave" + aliasQry;
                    return _z(elm).on(...[eventName, qselector || "", callback || ""].filter(x => x));
                }

                elmFunc.elementMap(elm, function (e) {
                    var elms = e;

                    if (!elms) return this;

                    var proxyCallback = function proxyCallback(event) {
                        if (events.lastEvent && events.lastEvent != version) return;

                        if (events.lastEvent != version) console.info("Event: ", events.lastEvent);

                        events.lastEvent = events.lastEvent == version ? version : event;
                        var eventName = events.getEventName(event.type);
                        if (qselector && event && event.target && _z(event.target).parents(qselector).addBack(
                            qselector).length || !qselector)
                            return callback.call(event.target, event);
                    };

                    events.register({
                        element: elms,
                        eventName: eventName,
                        qselector: qselector,
                        alias: alias,
                        proxyCallback: proxyCallback,
                        realcallback: callback,
                    });
                }, trueFunction);

                return this;
            },

            // deattach an event
            un: function attachEvent(eventName, qselector, callback) {
                var elm = this,
                    eventName = eventName || false,
                    qselector = qselector || false,
                    callback = callback || false;

                if (!eventName && !qselector && arguments.length < 1)
                    return this;

                // .un(callback)
                if (arguments.length == 1 && _z.isFunction(eventName)) {
                    callback = eventName;
                    qselector = false;
                    eventName = "*";
                }

                // .un(eventName, callback)
                if (arguments.length == 2) {
                    if (_z.isFunction(qselector) || (
                        _z.isArray(qselector) && _z.isFunction(qselector[0])
                    ))
                        callback = qselector,
                            qselector = false;
                }

                // handle multi event
                if (_z.isString(eventName) && eventName.split(" ").length > 1)
                    eventName = eventName.split(" ");

                if (_z.isArray(eventName)) {
                    var oldArgs = _z.filter([eventName, qselector || "", callback || ""]).toArray();

                    _z.for(eventName, function (eKey, eName) {
                        oldArgs.shift();
                        oldArgs.unshift(eName);
                        _z(elm).un(...oldArgs);
                    });
                    return this;
                }

                var alias = events.getAlias(eventName);
                var aliasQry = (
                    alias.length ? "." + alias.join(".") : ""
                );
                eventName = events.getEventName(eventName);

                // .un("hover")
                if (eventName == "hover") {
                    eventName = "mouseenter" + aliasQry + " mouseleave" + aliasQry;
                    return _z(elm).un(...[eventName, qselector || "", callback || ""].filter(x => x));
                }

                // hamdle multi callback
                if (callback && _z.isArray(callback)) {
                    var oldArgs = _z.filter([eventName + aliasQry, qselector || "", callback || ""])
                        .toArray();

                    _z.for(callback, function (cKey, cName) {
                        oldArgs.pop();
                        oldArgs.push(cName);
                        _z(elm).un(...oldArgs);
                    });
                    return this;
                }

                elmFunc.elementMap(elm, function (e) {
                    var needleData = false;

                    if (needleData == false) {
                        needleData = {};
                        e && (
                            needleData['element'] = e
                        );
                        eventName && (
                            needleData['eventName'] = eventName
                        );
                        qselector && (
                            needleData['qselector'] = qselector
                        );
                        callback && (
                            needleData['realcallback'] = callback
                        );
                        alias && (
                            needleData['alias'] = alias
                        );
                    }

                    try {
                        needleData && events.unRegister(needleData);
                    } catch (__error) {
                    }

                }, trueFunction);

                return this;
            },

            // attach an event once
// todo: check the arguments
            once: function once(eventName, qselector, callback) {
                var elm = this;

                if (!_z.isFunction(callback))
                    if (_z.isFunction(qselector)) {
                        callback = qselector,
                            qselector = false;
                    } else return elm;

                var cb = function callBackProxy() {
                    elm.un(eventName, qselector, cb);
                    return callback.apply(this, arguments);
                };

                return elm.on(eventName, qselector, cb);
            },

            // trigger event
            callEvent: function callEvent(evt) {
                var evt = evt || false;
                if (!evt)
                    return this;

                var alias = events.getAlias(evt);
                var aliasQry = (
                    alias.length ? "." + alias.join(".") : ""
                );
                evt = events.getEventName(evt);

                events.lastEvent = version;

                return this.each(function (evtN, alias, elm) {
                    if (alias.length) {
                        var needleData = {};
                        this && (
                            needleData['element'] = this
                        );
                        evtN && (
                            needleData['eventName'] = evtN
                        );
                        alias && (
                            needleData['alias'] = alias
                        );
                        var _elmentWithNS = events.find(needleData);

                        if (_z.size(_elmentWithNS) == 0) return;
                        else
                            return _z.for(_elmentWithNS, function (_Index, _e) {
                                evtN = events.getEventName(!evtN ? _e['eventName'] : evtN);

                                elm.callEvent(evtN);
                            });
                    }

                    var _doc;
                    if (hasVar(this, 'ownerDocument') && hasVar((
                        _doc = this.ownerDocument
                    ), 'createEvent') || hasVar(
                        (
                            _doc = document
                        ),
                        'createEvent',
                    )) {
                        var evt = _doc.createEvent('MouseEvents');
                        evt.initMouseEvent(
                            evtN,
                            true,
                            true,
                            _doc.defaultView,
                            1,
                            0,
                            0,
                            0,
                            0,
                            false,
                            false,
                            false,
                            false,
                            0,
                            null,
                        );
                        // this.dispatchEvent( evt );
                        events.dispatch.apply(this, [evt, {element: this, eventName: evtN, alias: alias}]);
                    } else if (hasVar(this, evtN)) {
                        this[evtN](); // IE Boss!
                    } else if (hasVar(this, "on" + evtN))
                        this["on" + evtN](); // IE Boss!

                }, [evt, alias, this]);
            },

            // trigger keyboard event
            callKEvent: function callKEvent(evt, evtData) {
                var evt = evt || false;
                var evtData = evtData || false;

                if (!evt)
                    return this;

                var alias = events.getAlias(evt);
                var aliasQry = (
                    alias.length ? "." + alias.join(".") : ""
                );
                evt = events.getEventName(evt);


                return this.each(function (evtN, evtD, alias, elm) {
                    if (alias.length) {
                        var needleData = {};
                        this && (
                            needleData['element'] = this
                        );
                        evtN && (
                            needleData['eventName'] = evtN
                        );
                        alias && (
                            needleData['alias'] = alias
                        );
                        var _elmentWithNS = events.find(needleData);

                        if (_z.size(_elmentWithNS) == 0) return;
                        else
                            return _z.for(_elmentWithNS, function (_Index, _e) {
                                evtN = events.getEventName(!evtN ? _e['eventName'] : evtN);

                                elm.callKEvent(evtN, evtD);
                            });
                    }

                    events.lastEvent = version;
                    if (hasVar(document, 'createEvent')) {
                        var keyboardEvent = document.createEvent("KeyboardEvent");
                        var initMethod = typeof (
                            keyboardEvent.initKeyboardEvent
                        ) !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

                        keyboardEvent[initMethod](
                            evtN, // event type : keydown, keyup, keypress
                            evtD['bubbles'] ? evtD['bubbles'] : true, // bubbles
                            evtD['cancelable'] ? evtD['cancelable'] : true, // cancelable
                            evtD['view'] ? evtD['view'] : window, // viewArg: should be window
                            evtD['ctrlKey'] ? evtD['ctrlKey'] : false, // ctrlKeyArg
                            evtD['altKey'] ? evtD['altKey'] : false, // altKeyArg
                            evtD['shiftKey'] ? evtD['shiftKey'] : false, // shiftKeyArg
                            evtD['metaKey'] ? evtD['metaKey'] : false, // metaKeyArg
                            evtD['keyCode'] ? evtD['keyCode'] : 0, // keyCodeArg : unsigned long the virtual key code, else 0
                            evtD['charCode'] ? evtD['charCode'] : 0, // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
                        );
                        // this.dispatchEvent(keyboardEvent);
                        events.dispatch.apply(
                            this,
                            [keyboardEvent, {element: this, eventName: evtN, alias: alias}],
                        );
                    } else if (hasVar(this, evtN)) {
                        this[evtN](evtD, alias); // IE Boss!
                    } else if (hasVar(this, "on" + evtN))
                        this["on" + evtN](evtD, alias); // IE Boss!

                }, [evt, evtData, alias, this]);
            },

            // on DOM change event
            dchange: function DOMChange(func) {
                if (!_z.isFunction(func))
                    throw new Error(func + " Is not function!!");

                return this.on("DOMSubtreeModified", func);
            },

            // un DOM change event
            undchange: function unBindDOMChange(func) {
                var arg = ["DOMSubtreeModified"];
                if (_z.isFunction(func))
                    arg.push(func);

                return this.un(...arg);
            },

            // todo: what is this ! ;wait for DOM change on specifiec selector
            watchIn: function watchInDOMTree(forSelector, callback) {
                var watch = this;
                if (!isset(callback) && _z.isFunction(forSelector)) {
                    callback = forSelector;
                    forSelector = '*';
                }
                if (!_z.isFunction(callback))
                    throw new Error(callback + " Is not function!!");

                forSelector = (
                    _z.is_z(forSelector) ? forSelector :
                        (
                            (
                                _z.isDOM(forSelector) || _z.isArray(forSelector)
                            ) ? _z(forSelector) :
                                (
                                    _z.isString(forSelector) ? forSelector : '*'
                                )
                        )
                );

                if (!watch.length || (
                    !callback || !_z.isFunction(callback)
                ))
                    return this;

                elmFunc.elementMap(watch, function (e, k) {
                    _z(e).dchange(function (event) {
                        if (forSelector && _z(event.target).is(forSelector))
                            return callback.apply(event.target, arguments);
                    });
                });

                return this;
            },
        })
            .prop();

// DOM functions
        join({ // selection enabled/disabled
            __selection: function __selection(mod) {
                var mod = mod || 0;
                var retFalse = [
                    function () {
                        if (_z.cookie.get('selection') != 'on') return false;
                    },
                    function () {
                    },
                ];
                this.each(function () {
                    if (typeof this.onselectstart != 'undefined') {
                        this.onselectstart = retFalse[mod] || mod[0];
                    } else if (typeof this.style.MozUserSelect != 'undefined') {
                        this.style.MozUserSelect = 'none';
                    } else {
                        this.onmousedown = retFalse[mod] || mod[0];
                    }
                });
                return this;
            },

            selection: function selection(mod) {
                if (!!!(
                    "cookie" in _z
                )) return this;

                var mod = mod || 0;
                this.each(function () {
                    _z(this).parents().__selection(mod);
                });
                return this;
            },
        }, {
            // element scrollTop
            scrollTop: function scrollTop(element) {
                var element = getSet(element, this),
                    $return = [];

                elmFunc.elementMap(element, function (e) {
                    var w = isWindow(e) ? e :
                        (
                            e.nodeType === 9 ? (
                                e.defaultView || e.parentWindow
                            ) : false
                        );

                    $return.push((
                        w ? (
                            (
                                'pageYOffset' in w
                            ) ? w['pageYOffset'] : w.document.documentElement['scrollTop']
                        ) : e['scrollTop']
                    ) || 0);

                }, (x) => {
                    return _z.isDOM(x) || isWindow(x) || x.nodeType === 9;
                });

                return element.length == 1 ? $return[0] : $return;
            },

            // element scrollLeft
            scrollLeft: function scrollLeft(element) {
                var element = getSet(element, this),
                    $return = [];

                elmFunc.elementMap(element, function (e) {
                    var w = isWindow(e) ? e :
                        (
                            e.nodeType === 9 ? (
                                e.defaultView || e.parentWindow
                            ) : false
                        );

                    $return.push((
                        w ? (
                            (
                                'pageXOffset' in w
                            ) ? w['pageXOffset'] : w.document.documentElement['scrollLeft']
                        ) : e['scrollLeft']
                    ) || 0);

                }, (x) => {
                    return _z.isDOM(x) || isWindow(x) || x.nodeType === 9;
                });
                return this.length == 1 ? $return[0] : $return;
            },

        }, {

            // element rect (top/left/height/width)
            rect: function elementRect(scrolls) {
                scrolls = _z.isset(scrolls) ? scrolls : true;
                let elm = this,
                    $return = [],
                    returnKey = _z.isBoolean(scrolls) ? false : scrolls;
                scrolls = _z.isBoolean(scrolls) ? scrolls : true;

                _z.elementMap(elm, function (e) {
                    let tResult = {};

                    if (isWindow(e)) {
                        let height = e.innerHeight ||
                                e.document.documentElement.clientHeight ||
                                e.document.body.clientHeight || 0,

                            width = e.innerWidth ||
                                e.document.documentElement.clientWidth ||
                                e.document.body.clientWidth || 0;

                        tResult = {
                            top: e.document.documentElement["client" + 'Top'] | 0,
                            right: e.document.documentElement["client" + 'Width'] | 0,
                            left: e.document.documentElement["client" + 'Left'] | 0,
                            bottom: e.document.documentElement["client" + 'Height'] | 0,

                            outerHeight: height,
                            outerHeightWP: height,
                            innerHeight: height,
                            height: height,

                            outerWidth: width,
                            outerWidthWP: width,
                            innerWidth: width,
                            width: width,
                        };
                    }// document
                    else if (e.nodeType === 9) {
                        let height = Math.max(
                                e.body["scroll" + 'Height'], e.documentElement["scroll" + 'Height'],
                                e.body["offset" + 'Height'], e.documentElement["offset" + 'Height'],
                                e.documentElement["client" + 'Height'],
                            ),
                            width = Math.max(
                                e.body["scroll" + 'Width'], e.documentElement["scroll" + 'Width'],
                                e.body["offset" + 'Width'], e.documentElement["offset" + 'Width'],
                                e.documentElement["client" + 'Width'],
                            );

                        tResult = {
                            top: Math.max(
                                e.body["scroll" + 'Top'], e.documentElement["scroll" + 'Top'],
                                e.body["offset" + 'Top'], e.documentElement["offset" + 'Top'],
                                e.documentElement["client" + 'Top'],
                            ) | 0,
                            right: Math.max(
                                e.body["scroll" + 'Width'], e.documentElement["scroll" + 'Width'],
                                e.body["offset" + 'Width'], e.documentElement["offset" + 'Width'],
                                e.documentElement["client" + 'Width'],
                            ) | 0,
                            left: Math.max(
                                e.body["scroll" + 'Left'], e.documentElement["scroll" + 'Left'],
                                e.body["offset" + 'Left'], e.documentElement["offset" + 'Left'],
                                e.documentElement["client" + 'Left'],
                            ) | 0,
                            bottom: Math.max(
                                e.body["scroll" + 'Height'], e.documentElement["scroll" + 'Height'],
                                e.body["offset" + 'Height'], e.documentElement["offset" + 'Height'],
                                e.documentElement["client" + 'Height'],
                            ) | 0,

                            outerHeight: height,
                            outerHeightWP: height,
                            innerHeight: height,
                            height: height,

                            outerWidth: width,
                            outerWidthWP: width,
                            innerWidth: width,
                            width: width,
                        };
                    } else {
                        let rect = (
                            e['getBoundingClientRect']
                        ) ? e.getBoundingClientRect() : {
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        };
                        let style = compStyle(e) || e.currentStyle;
                        tResult = {
                            top: (
                                rect.top || 0
                            ) + (
                                scrolls ? (
                                    document.body.scrollTop || 0
                                ) : 0
                            ),
                            right: (
                                rect.right || 0
                            ),
                            left: (
                                rect.left || 0
                            ) + (
                                scrolls ? (
                                    document.body.scrollLeft || 0
                                ) : 0
                            ),
                            bottom: (
                                rect.bottom || 0
                            ),
                            // height of element
                            height: parseInt(style.height),

                            // outer
                            // the height of an element (includes padding and border).
                            outerHeight: e.offsetHeight,

                            // outer
                            // the height of an element (includes padding, border and margin).
                            outerHeightWP: (
                                e.offsetHeight +
                                parseInt(style.marginTop) +
                                parseInt(style.marginBottom)
                            ),

                            // inner
                            // the height of an element (includes padding).
                            innerHeight: e.clientHeight || e.scrollHeight,

                            width: parseInt(style.width),

                            // the width of an element (includes padding and border).
                            outerWidth: e.offsetWidth,

                            // the width of an element (includes padding, border and margin).
                            outerWidthWP: (
                                e.offsetWidth +
                                parseInt(style.marginLeft) +
                                parseInt(style.marginRight)
                            ),

                            innerWidth: e.clientWidth || e.scrollWidth,
                        };
                    }

                    if (returnKey !== false && _z.isset(tResult[returnKey]))
                        tResult = tResult[returnKey];

                    $return.push(tResult);

                }, x => _z.isDOM(x) || _z.isWindow(x) || x.nodeType === 9);

                return this.length === 1 ? $return[0] : $return;
            },

            // offset
            offset: function offset() {
                var rect = this.rect.call(this);
                return {
                    top: +(rect['top'] || 0),
                    left: +(rect['left'] || 0),
                };
            },

            // element position (top/left)
            position: function position() {
                let elm = this,
                    $return = [];

                _z.elementMap(elm, function (e) {
                    if (e['offsetLeft'] && e['offsetLeft']) {
                        $return.push({
                            top: +(e['offsetTop'] || 0),
                            left: +(e['offsetLeft'] || 0),
                        });
                    }
                });

                return this.length === 1 ? $return[0] : $return;
            },

            // offsetParent of element ( closest visable parent)
            offsetParent: function offsetParent() {
                let elm = this,
                    $return = [];
                _z.elementMap(elm, e => $return.push(e['offsetParent'] || e));

                return this.length === 1 ? $return[0] : $return;
            },

        })
            .prop();

// data functions
        join({
            // get/set data for element
            data: function updateData($var, $val) {
                var elm = this,
                    $return = [];
                $val = _z.isset($val) ? $val : undefined;
                var $isVal = _z.isset($val);

                var newData = (
                    !!$var && !!$isVal
                ) || (
                    !!$var && !!!$isVal && _z.isObject($var)
                );
                var getData = (
                    !!$var && !!!$isVal
                ) || (
                    !!!$var && !!!$isVal
                );

                if (elm.length) {
                    var $this = this;
                    elm.each(function (i, e) {
                        // get data & no data
                        if (!isset(e[version]) && getData) {
                            $return.push({});
                            return;
                        }

                        // new data & create object
                        if (!isset(e[version]))
                            e[version] = new_zID();

                        var crnt_zIDData = new_zID.data[e[version]];

                        // set data
                        if (!!$var && !!$isVal && !!e[version]) {
                            crnt_zIDData['data'][$var] = $val;
                            $return.push(e);
                        } else if (!!$var && !!!$isVal)
                            if (!_z.isObject($var)) // get data
                                $return.push(getSet(crnt_zIDData['data'][$var], undefined));
                            else { // set data
                                crnt_zIDData['data'] = crnt_zIDData['data'] || {data: {}, idata: {}};
                                crnt_zIDData['data'] = _z.extend(crnt_zIDData['data'], $var);
                            }
                        else if (!!!$var && !!!$isVal) // get all data
                            $return.push(crnt_zIDData['data']);
                    });
                }

                return newData ? this : (
                    this.length == 1 ? $return[0] : $return
                );
            },

            // remove data\s for element
            remData: function removeData($var) {
                var elm = this;

                elmFunc.elementMap(elm, function (e, v) {
                    if (!isset(e[version]))
                        return;

                    if (!!$var && !!e[version])
                        delete new_zID.data[e[version]]['data'][$var];
                        // else if( !!!$var && !!e[ version ] ) {
                        //     delete new_zID.data[ e[ version ] ];
                        //     delete e[ version ];
                    // }
                    else if (!!!$var && !!e[version]) {
                        new_zID.data[e[version]]['data'] = {};
                    }

                    if (_z.size(new_zID.data[e[version]]['idata']) == 0
                        && _z.size(new_zID.data[e[version]]['data']) == 0) {
                        delete new_zID.data[e[version]];
                        delete e[version];
                    }
                }, trueFunction);

                return this;
            },
            removeData: function removeData() {
                return this.remData.apply(this, arguments);
            },
            clearData: function removeData() {
                return this.remData.apply(this, arguments);
            },

        })
            .prop();

// shortcuts functions
        join(
            // rect functions
            ...foreach("top left outerHeight outerHeightWP innerHeight height outerWidth outerWidthWP innerWidth width".split(
                ' '), (k, v) => {
                return {
                    [v]: function (WP) {
                        var rect = this.rect.call(this/* , [ ...arguments ].splice(1)  */);
                        if ((
                            toLC(v) == 'outerheight' || toLC(v) == 'outerwidth'
                        ) && WP && _z.isBoolean(WP))
                            v += 'WP';

                        rect = rect && rect[v] || 0;

                        return _z.isArray(rect) ? rect : +(
                            rect || 0
                        );
                    },
                };
            }),
            // on && un functions
            ...foreach([
                "focusin",
                "focusout",
                "focus",
                "blur",
                "load",
                "resize",
                "scroll",
                "unload",
                "click",
                "dblclick",
                "mousedown",
                "mouseup",
                "mousemove",
                "mouseover",
                "mouseout",
                "mouseenter",
                "mouseleave",
                "change",
                "select",
                "keydown",
                "keypress",
                "keyup",
                "error",
            ], function (k, event) {
                return {
                    [event]: function (callback) {
                        return (
                            arguments.length
                        ) ?
                            this.on(event, callback) :
                            this.trigger(event);
                    },
                };
            }), {

                // mouse hover
                hover: function hover(enterCB, outCB) {
                    if (!arguments.length)
                        return this.trigger("mouseenter mouseleave");

                    if (_z.isFunction(enterCB))
                        this.on("mouseenter", enterCB);
                    if (_z.isFunction(outCB))
                        this.on("mouseleave", outCB);

                    return this;
                },

                // form submit
                submit: function onSubmit(event) {
                    if (!arguments.length)
                        return this.trigger("submit");

                    if (_z.isFunction(event)) {
                        let warpper = function submit(e) {
                            let res = event.call(this, ...arguments);
                            if (res === false) {
                                console.error(this);
                                e.preventDefault();
                            }
                        };

                        this.on("submit", warpper);
                    }

                    return this;
                },
            },
        )
            .prop();

// todo: remove this
// private usage
        join({
            /**
             * Utilities
             */
            $underz: {
                private: true,
                // typeof `obj`
                type: function __type(obj) {
                    if (!obj)
                        return false;

                    var step = [false, false, false, false];

                    try { // is jquery
                        step[0] = !!(
                            obj instanceof globaljQuery || obj.constructor.prototype.jquery
                        );
                    } catch (e) {
                        step[0] = false;
                    }

                    try { // is jquery || DOM
                        step[1] = !!(
                            obj instanceof globaljQuery ? obj.size() > 0 : !!(
                                obj['tagName']
                            )
                        );
                    } catch (e) {
                        step[1] = false;
                    }

                    try { // is DOM
                        step[2] = !!(
                            obj['nodeType']
                        );
                    } catch (e) {
                        step[2] = false;
                    }

                    try { // is Window
                        step[3] = !!(
                            obj != null && obj == obj.window
                        );
                    } catch (e) {
                        step[3] = false;
                    }

                    var isJQ = !!(
                            step[0] && step[1]
                        ),
                        isDOM = !!(
                            step[2] && step[1]
                        ),
                        isArray = !!(
                            (
                                !isJQ && !isDOM
                            ) && (
                                obj instanceof Array
                            )
                        ),
                        isObject = !!(
                            (
                                !isJQ && !isDOM && !isArray && !step[3]
                            ) && typeof (
                                obj
                            ) == typeof (
                                {}
                            )
                        ),
                        isWindow = !!(
                            step[3]
                        );

                    return {
                        'jquery': isJQ,
                        'dom': isDOM,
                        'object': isObject,
                        'array': isArray,
                        'window': isWindow,
                        'typeof': typeof (
                            obj
                        ),
                        'document': !!(
                            obj == doc || obj == doc.documentElement
                        ),
                    };
                },

                // underZ prototypes
                prototypies: prototypies,

                // prepareCSS function
                prepareCSS: elmFunc.prepareCSS,

                // elm function
                elmFunc: elmFunc,
            },
        })
            .core();

// Objects function
        join({
            // todo: optmize remove from `obj` the `attr`
            removeFrom: function removeFrom(obj, attr) {
                if (arguments.length == 0)
                    return [];

                // array
                if (_z.isArray(obj)) {
                    obj = Array.from(obj);
                    if (obj.indexOf(attr) !== -1)
                        obj.splice(obj.indexOf(attr), 1);
                }

                // object
                if (_z.isObject(obj)) {
                    var $return = _z.extend(
                        {},
                        (
                            _z.is_z(obj) ? obj.element() : obj
                        ),
                    );
                    _z.for($return, function ($var) {
                        if ($var == attr)
                            delete $return[$var];
                    });
                    return $return;
                }

                return obj || [];
            },

            // isset `val`
            isset: isset,

            // return v as number || 0
            toNum: function toNumber(v) {
                return Number(v) || 0;
            },
            // todo: add dom is empty; isEmpty array, string, object
            isEmpty: function isEmpty(obj) {
                if (obj == null || !!!obj)
                    return true;

                if (_z.isArray(obj) || _z.isString(obj) || _z.isArguments(obj))
                    return obj.length === 0;

                return _z.size(obj) === 0;
            },

            // todo: add dom is not empty; isNotEmpty array, string, object
            isNotEmpty: function isNotEmpty() {
                return !!!_z.isEmpty.apply(this, arguments);
            },

            // type of `val`
            type: typeOf,

            // check if object is Object
            isPlainObject: (x) => Object.is(Object.getPrototypeOf(x), Object.getPrototypeOf({})),

            // is element == window
            isWindow: isWindow,

            // is element== document
            isDocument: function isDocument(element) {
                return !!(
                    element instanceof Document || element == doc
                );//!!(element==doc || element==doc.documentElement);
            },

            // (`obj` == jQuery)
            isjQuery: function isjQuery(obj) {
                var t = _z.$underz.type(obj);
                return (
                    !!(
                        !!(
                            t
                        ) && !!(
                            t['jquery']
                        )
                    )
                );
            },

            // (`obj` == DOMElement)
            isDOM: function isDOM(obj) {
                obj = [obj];
                var robj = obj.filter((k) => k && (
                    Element && (
                        k instanceof Element
                    ) || (
                        (
                            k instanceof Object
                        ) && k.nodeType === 1 && _z.isString(k.nodeName)
                    )
                ));
                return obj.length === robj.length && obj.length > 0;
            },

            // (`obj` == DOMElement || Window)
            isDOMOW: function isDOMOrWindow(obj) {
                return _z.isDOM(obj) || _z.isWindow(obj);
            },

            // (`obj` == NodeElement)
            isNode: function isNode(obj) {
                obj = [obj];
                var robj = obj.filter((k) => k && (
                    Node && (
                        k instanceof Node
                    ) || (
                        (
                            k instanceof Object
                        ) && _z.isNumber(k.nodeType) && _z.isString(k.nodeName)
                    )
                ));
                return obj.length === robj.length && obj.length > 0;
            },

            // all (typeof arguments) is equal
            isTypes: function isTypes() {
                var args = _z.toArray(arguments);
                if (!args || args.length < 2)
                    return false;

                // first check
                let a = args.shift(),
                    b = args.shift();

                if (!(
                    this.type(a) === this.type(b)
                ))
                    return false;

                while (!!args.length) {
                    // compare last input with last shifted item
                    if (args.length === 1)
                        args.push(a);

                    // same as first check
                    let a = args.shift(),
                        b = args.shift();

                    if (!(
                        this.type(a) === this.type(b)
                    ))
                        return false;
                }
                return true;
            },

            // is `elm` instanceof _z
            is_z: is_z,

            // is `elm` == _z
            isCore: isCore,

            // unique Array
            unique: function uniqueArray(arr) {
                return Array.from((
                    new Set(_z.toArray(arr))
                )) || arr;
            },

            // search inArray
            inArray: Array.prototype.inArray,

            // search inArray & inObject
            inObject: function inObject(obj, needle, searchInKey) {
                var object;
                if (!isset(searchInKey) && _z.isObject(obj))
                    searchInKey = true;

                if (_z.isObject(obj))
                    object = Object.keys(obj);
                else if (_z.isArray(obj))
                    object = obj;
                else if (_z.isFunction(obj))
                    return _z.hasProp(obj, needle);
                else {
                    try {
                        return arguments.callee.call(this, _z.extend({}, obj), needle, searchInKey);
                    } catch (e) {
                        console.error(e);
                        return -1;
                    }
                }

                if (_z.is_z(obj))
                    obj = obj.element();

                if (_z.isArray(needle) || _z.isObject(needle))
                    needle = JSON.stringify(needle);

                var result = -1;
                _z(object).each(function (key) {
                    if (result != -1)
                        return;

                    key = obj[object[key]] && object[key] || obj[key] && key;

                    var value = obj[key];
                    if (_z.isArray(value) || _z.isObject(value))
                        value = JSON.stringify(value);

                    if (searchInKey && (
                        value === needle || key === needle
                    ))
                        return result = key;
                    else if (value === needle)
                        return result = key;
                });

                return result;
            },

            // element to NodeList
            toNodeList: function toNodeList(elm, context) {
                var list,
                    context = context || elm.parentNode;

                this.fragment = null;
                this.fragmentsCreate = function () {
                    this.fragment = document.createDocumentFragment();
                    return this;
                };

                this.fragmentsAppend = function (appendElement) {
                    this.fragment.appendChild(appendElement);
                    return this;
                };

                this.fragmentsGet = function () {
                    return this.fragment ? this.fragment.childNodes : null;
                };

                this.fragmentsDelete = function () {
                    try {
                        this.fragment.textContent = "";

                        while (this.fragment.firstChild)
                            this.fragment.removeChild(this.fragment.firstChild);

                        this.fragment = this.fragment.lastChild;
                        if (this.fragment)
                            this.fragment.removeChild(this.fragment);

                    } catch (e) {
                    }

                    return this;
                };

                // is part of a document
                if (!context && elm.ownerDocument)
                    // is <html> or in a fragment
                    if (elm === elm.ownerDocument.documentElement
                        || elm.ownerDocument.constructor.name === 'DocumentFragment')
                        context = elm.ownerDocument;

                // fragment
                if (!context) {
                    this.fragmentsCreate();
                    this.fragmentsAppend(elm);

                    list = _z(this.fragmentsGet());

                    this.fragmentsDelete();
                    return list;
                }

                // element in DOM tree
                // selector method
                elm.setAttribute('wrapNodeList', '');

                list = context.querySelectorAll('[wrapNodeList]');

                elm.removeAttribute('wrapNodeList');

                return list;
            },

            // from Object to likeArray
            toLikeArray: function toLikeArray(obj) {
                var obj = getSet(obj, this);

                if (_z.is_z(obj))
                    obj = obj.element();

                if (!!!_z.isObject(obj) && !!!_z.isArray(obj))
                    return obj;

                return _z.extend([], obj);
            },

            // clone Objects
            clone: cloneObj,

            // add to end of array
            arrayAppend: function arrayAppend(array1, array2) {
                var array1 = array1 || [],
                    array2 = array2 || false,
                    args = [];

                if (!!!array2)
                    array2 = array1,
                        array1 = this.toArray();

                args = (
                    arguments.length > 1
                ) ? _z.subArray(1, arguments) : [array2];
                while (args && (
                    array2 = args.pop()
                ))
                    for (var i = 0, length = array2.length; i < length; i++)
                        array1.push(array2[i]);

                return array1.length;
            },

            // todo: what is this for ?; DOM Node Types
            nodesTypes: {
                query: function query(rootNode, isDeepSearch) {
                    var nodeTypesObjects = [],
                        args = arguments;
                    _z.for(this, function (x, v) {
                        if (x != args.callee.name)
                            nodeTypesObjects[x] = _z.HTMLNodes.bind(_z, rootNode, isDeepSearch, v);
                    });
                    return nodeTypesObjects;
                },
                element: doc.ELEMENT_NODE || 1,
                attr: doc.ATTRIBUTE_NODE || 2,
                text: doc.TEXT_NODE || 3,
                comment: doc.COMMENT_NODE || 8,
                document: doc.DOCUMENT_NODE || 9,
            },

            // todo: what is this for ?; get HTMLNodes by types
            HTMLNodes: function HTMLNodes(rootNode, isDeepSearch, nodeType) {
                var _nodes = [],
                    node = rootNode && rootNode.firstChild || document.body.firstChild,
                    nodeType = nodeType || _z.nodesTypes.element;

                while (node) {
                    if (node.nodeType === nodeType)
                        _nodes.push(node);
                    else if (isDeepSearch && (
                        node.nodeType === _z.nodesTypes.element
                    ))
                        _z.arrayAppend(_nodes, _z.HTMLNodes(node, isDeepSearch));

                    node = node.nextSibling;
                }

                return _nodes;
            },


        })
            .core();

// _z features
        join({
            // _z.URLToBlob64( url_to_get, function_callback)
            // convert url to data base64
            URLToBlob64: function URLToBlob64(url, callback) {
                try {
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            callback(reader.result);
                        }
                        reader.readAsDataURL(xhr.response);
                    };
                    xhr.open('GET', url);
                    xhr.responseType = 'blob';
                    xhr.send();
                } catch (e) {

                }
            },
            // _z.stringToBlob64(string, function_callback, content_type)
            // convert string to data base64
            stringToBlob64: function stringToBlob64(string, callback, type) {
                try {
                    var blob = new Blob([string], {type: type || 'plain/text'});
                    var reader = new FileReader();
                    reader.onload = () => callback(reader.result);
                    reader.readAsDataURL(blob);
                } catch (e) {

                }
            },
        }, {
            // selector, action, prevent true||false
            prevent: function prevent(s, a, p) {
                var s = s || '*',
                    a = a || '*',
                    p = p || false;

                if (a.indexOf(' ') >= 0)
                    a = a.split(' ');

                if (a instanceof Array) {
                    if (a.length == 0) {
                        fns.t.r("Unknown Action: " + a.join(' '));
                        return this;
                    }
                    a.forEach(function (e) {
                        this.prevent(s, e, p);
                    }.bind(this));

                    return this;
                }

                if (s.indexOf(' ') >= 0)
                    s = s.split(' ');

                if (s instanceof Array) {
                    if (s.length == 0) {
                        fns.t.r("Unknown Selector: " + s.join(' '));
                        return this;
                    }
                    s.forEach(function (e) {
                        this.prevent(e, a, p);
                    }.bind(this));

                    return this;
                }

                var elm = _z(s);

                switch (a) {
                    case "*":
                    case "selection":
                        elm.selection(!p ? 1 : 0);
                        if (a != '*')
                            break;

                    case "*":
                    case "cut":
                        elm.un("cut");
                        p && elm.on("cut", function (e) {
                            e.preventDefault();
                        });
                        if (a != '*')
                            break;

                    case "*":
                    case "copy":
                        elm.un("copy");
                        p && elm.on("copy", function (e) {
                            e.preventDefault();
                        });
                        if (a != '*')
                            break;

                    case "*":
                    case "contextmenu":
                        elm.un("contextmenu");
                        p && elm.on("contextmenu", function (e) {
                            e.preventDefault();
                        });

                        if (a != '*')
                            break;

                    case "*":
                    case "autocomplete":
                        elm.attr('autocomplete', p ? 'on' : 'off');
                        if (a != '*')
                            break;

                    default:
                        if (a != '*')
                            fns.t.r("Unknown Action: " + a);
                }

                if (!_z.document.isReady || !_z.document.isReady())
                    _z.ready(function () {
                        _z.prevent(s, a, !p);
                    });

                return this;
            },

            // document functions
            document: {
                // get document Status
                status: function documentStatus() {
                    return doc.readyState;
                },

                // document is ready ?
                isReady: function documentIsReady() {
                    return (
                        doc.readyState === 'complete'
                    );
                },

            },

            // parse functions
            parse: parssing,

            // base64 en/decoder
            base64: {
                // base64_encode
                encode: function base64_encode(code) {
                    // encoder polyfill
                    // [https://gist.github.com/999166] by [https://github.com/nignag]
                    if (!isset(window["btoa"]))
                        window.btoa = (
                            function (input) {
                                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                                    InvalidCharacterError = fns.newErrorType('InvalidCharacterError'),
                                    str = String(input);
                                for (
                                    // initialize result and counter
                                    var block, charCode, idx = 0, map = chars, output = '';
                                    // if the next str index does not exist:
                                    //   change the mapping table to "="
                                    //   check if d has no fractional digits
                                    str.charAt(idx | 0) || (
                                        map = '=', idx % 1
                                    );
                                    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                                    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
                                ) {
                                    charCode = str.charCodeAt(idx += 3 / 4);
                                    if (charCode > 0xFF)
                                        throw new InvalidCharacterError(
                                            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");

                                    block = block << 8 | charCode;
                                }

                                return output;
                            }
                        ).bind(window);

                    return window.btoa(unescape(encodeURIComponent(code)));
                },

                // base64_decode
                decode: function base64_decode(code) {
                    // decoder polyfill
                    // [https://gist.github.com/1020396] by [https://github.com/atk]
                    if (!isset(window["atob"]))
                        window.atob = (
                            function (input) {
                                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                                    InvalidCharacterError = fns.newErrorType('InvalidCharacterError'),
                                    str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=

                                if (str.length % 4 == 1)
                                    throw new InvalidCharacterError(
                                        "'atob' failed: The string to be decoded is not correctly encoded.");

                                for (
                                    // initialize result and counters
                                    var bc = 0, bs, buffer, idx = 0, output = '';
                                    // get next character
                                    buffer = str.charAt(idx++);
                                    // character found in table? initialize bit storage and add its ascii value;
                                    ~buffer && (
                                        bs = bc % 4 ? bs * 64 + buffer : buffer,
                                            // and if not first of each 4 characters,
                                            // convert the first 8 bits to one ascii character
                                        bc++ % 4
                                    ) ? output += String.fromCharCode(255 & bs >> (
                                        -2 * bc & 6
                                    )) : 0
                                )
                                    // try to find character in table (0-63, not found => -1)
                                    buffer = chars.indexOf(buffer);

                                return output;
                            }
                        ).bind(window);

                    return decodeURIComponent(escape(window.atob(code)));
                },
            },

            // get variables from location
            _GET: function _GET(variable) {
                if (!!!(
                    location && doc.location
                )) return false;

                try {
                    var q = decodeURI((
                            location || doc.location
                        ).search.substring(1)),
                        asArray = [],
                        asArrayIndexing = [],
                        p = [],
                        getAll = (
                            !!!variable
                        );

                    var v = q.split("&");
                    for (var i = 0, iv = v.length; i < iv; i++) {
                        p = v[i].split("=");
                        p[1] = (
                            p[1].indexOf('%20') != -1
                        ) ? decodeURIComponent(p[1]) : p[1];
                        asArrayIndexing[p[0]] = isset(asArrayIndexing[p[0]]) ? [
                            ...parseArray(asArrayIndexing[p[0]]), p[1],
                        ] : p[1];

                        var _mainVar = p[0].indexOf("[") != -1 ? p[0].split("[")[0] : p[0];
                        if (p[0].indexOf("[") != -1) {
                            var _ps = p[0].split("["),
                                prv,
                                crnt = asArray,
                                _pVar = _ps.shift();

                            var _psArray = crnt = asArray;
                            prv = _pVar;

                            for (var i2 = 0, iv2 = sizeOfAny(_ps); i2 < iv2; i2++) {
                                var _psv = _ps[i2].replaceAll("]", "");
                                // console.log(_psv, _ps,i2);

                                if (isset(prv)) {
                                    crnt[prv] = getSet(crnt[prv], []);
                                    crnt = crnt[prv];
                                }

                                if (sizeOfAny(_psv) == 0) { // []
                                    prv = crnt.push("") - 1;
                                } else {
                                    crnt[_psv] = getSet(crnt[_psv], []);
                                    prv = _psv;
                                }
                            }

                            asArray[_pVar] = getSet(asArray[_pVar], []);
                            asArray = mix(true, asArray, _psArray);

                            if (sizeOfAny(crnt[prv]) == 0) {
                                crnt[prv] = p[1];
                            } else {
                                crnt[prv].push(p[1]);
                            }
                        } else asArray[p[0]] = isset(asArray[p[0]]) ? asArray[p[0]] : p[1];
                    }

                    var _ret;
                    if (!getAll &&
                        isset(_ret = getSet.call(
                            true,
                            asArray[variable],
                            asArray[decodeURI(variable)],
                            asArrayIndexing[variable],
                            asArrayIndexing[decodeURI(variable)],
                            undefined,
                        ))) return _ret;

                    if (getAll)
                        return typeOf(this) == typeOf.s ? asArrayIndexing : asArray;

                    return '';
                } catch (e) {
                    return '';
                }
            },

            // get current file name from location
            _FILE_: function _FILE_() {
                try {
                    var url = window.location.pathname;
                    return url.substring(url.lastIndexOf('/') + 1) || "";
                } catch (e) {
                    return false;
                }
            },

            // get current url location
            _URL_: function _URL_(f) {
                f = f || false;
                try {
                    if (f && f.indexOf("://") > -1) return f;

                    var _URL_ = _z._FILE_() && (
                        window.location.href.indexOf(_z._FILE_()) > -1
                    ) && location.href.split(_z._FILE_())[0] || location.href.toString();
                    if (f) {
                        _URL_ += (
                            _URL_.substr(-1) === "/" ? "" : "/"
                        );
                        _URL_ = (
                            f.indexOf("://") > -1
                        ) ? f : _URL_ + f;
                    }
                    return _URL_;
                } catch (e) {
                    return false;
                }
            },

        })
            .core();

// document ready
        join({
            ready_Blobs: {
                ajax: () => {
                    return [
                        "importScripts('" + _z._URL_("_z.js") + "');",
                        `self.onmessage = function (event) { var rr=self.postMessage; _z.ajax({ url: event.data.url, type: "GET", dataType: "text", async: false, success: function(a,x){ x.onloadend=function(){ rr(this.responseText); }; }, }); };`,
                    ]
                },
                return: () => [`self.onmessage = function (event) { self.postMessage(event.data); };`],
            },
            ready_workers: {
                'return': [], 'ajax': [], 'count': function () {
                    var _ajax = this["ajax"].filter(x => x).length;
                    var _return = this["return"].filter(x => x).length;
                    if (_ajax == 0) this["ajax"] = [];
                    if (_return == 0) this["return"] = [];
                    return _ajax + _return;
                },
            },
            runWorker: function runWorker() {
                var wArray;
                var a1 = $this.ready_workers[(
                    wArray = 'ajax'
                )].filter(x => !(
                    x === false || !(
                        !x['isCalled'] || !x['isDone']
                    )
                ));
                if (!a1.getSize()) {
                    if (!$this.ready_workers[(
                        wArray = 'return'
                    )].filter(x => !(
                        x === false || x['isCalled']
                    )).getSize()) return 0;
                }

                var totalRun = 0;
                _z.for($this.ready_workers[wArray], function (i, w) {
                    if (!!!w || (
                        !!w['isCalled']
                    )) return;

                    if (w['send'] && _z.isFunction(w['send'])) {
                        $this.ready_workers[wArray][i].send();
                        $this.ready_workers[wArray][i]['isCalled'] = true;
                        totalRun++;
                    }

                    return false;
                });

                return totalRun;
            },
            newWorker: function newWorker(type) {
                type = type || 'return';
                var $this = this;

                var _worker = {type: type},
                    wType = (
                        $this.ready_workers[type] ? type : 'return'
                    ),
                    thisIndx = $this.ready_workers[wType].push(_worker);

                _worker.worker = new Worker(window.URL.createObjectURL(new Blob(
                    (
                        this.ready_Blobs[type]
                        || fns.ef
                    )(),
                    {type: 'application/javascript'},
                )));
                _worker.terminate = function () {
                    if (_z.isFunction(_worker['done']))
                        try {
                            _worker['done']();
                        } catch (fnError) {
                            console.error(fnError);
                        }

                    $this.ready_workers[wType][thisIndx - 1] = false;
                    _worker.worker.terminate();
                    _worker = {};
                };

                _worker.worker.onmessage = function (event) {
                    var respText = event.data;

                    if (respText && type == 'ajax')
                        resp = _z.ajaxSettings.converters.script((
                            respText || ""
                        ).replace(
                            /^\s*<!(?:\[CDATA\[|\-\-)/,
                            "/*$0*/",
                        ));

                    _worker.terminate();
                };
                _worker.worker.onerror = function () {
                    console.error(...arguments);
                    _worker.terminate();
                };
                _worker.send = function (data) {
                    _worker.worker.postMessage(data || "");
                };
                return _worker;
            },

            // eval function when document is ready
            ready: function ready(fn) {
                var d = doc,
                    w = window,
                    $this = this;

                if (!_z.isFunction(fn)) {
                    if (_z.isObject(fn) && fn['ajax']) {
                        var worker = $this.newWorker('ajax');
                        var worker_send = worker.send;
                        worker['isDone'] = false;
                        worker['isCalled'] = false;
                        worker.send = function () {
                            worker_send({url: fn['ajax']});
                        };
                        worker.done = () => {
                            worker['isDone'] = true;
                        };
                    } else return $this;
                } else {
                    var worker = $this.newWorker('return');
                    worker['isDone'] = false;
                    worker['isCalled'] = false;
                    worker.done = () => {
                        fn.call(doc);
                        worker['isDone'] = true;
                    };
                }

                var $DOMContentLoaded = function () {
                    if (d.readyState == 'complete') {
                        if ($this.runWorker() == 1 || $this.ready_workers.count() == 0)
                            cleanLoadinEvents();
                        else
                            setTimeout($DOMContentLoaded, 16);
                    }
                };

                var cleanLoadinEvents = function () {
                    if (d.addEventListener) {
                        d.removeEventListener("readystatechange", $DOMContentLoaded, false);
                        w.removeEventListener("load", $DOMContentLoaded, false);
                    } else {
                        d.detachEvent("onreadystatechange", $DOMContentLoaded);
                        w.detachEvent("onload", $DOMContentLoaded);
                    }
                };

                switch (d.readyState) {
                    // The document has finished loading. We can now access the DOM elements.
                    // But sub-resources such as images, stylesheets and frames are still loading.
                    case "interactive":
                        $DOMContentLoaded();
                        break;

                    // The page is fully loaded.
                    case "complete":
                        $DOMContentLoaded();
                        break;

                    // case "loading": // The document is still loading.
                    default:
                        if (d.addEventListener) {
                            d.addEventListener('readystatechange', $DOMContentLoaded, false);
                            w.addEventListener('load', $DOMContentLoaded, false);
                        } else {
                            d.attachEvent('onreadystatechange', $DOMContentLoaded);
                            w.attachEvent("onload", $DOMContentLoaded);
                        }

                        break;
                }

                return _z(doc);
            },
        })
            .core();

// cookie system
        join({ // cookie
            cookie: {
                set: function (name, value, days) {
                    return this.setBySec(name, value, days * 24 * 60 * 60);
                },

                // add cookie expires within seconds
                setBySec: function (name, value, seconds) {
                    if (!!!name) return this;

                    var expires = "";
                    if (seconds && typeOf(seconds) == typeOf.n) {
                        var date = new Date();
                        date.setTime(date.getTime() + (
                            seconds * 1000
                        ));
                        expires = "; expires=" + date.toGMTString();
                    }
                    var ck = name + "=" + (
                        value || ""
                    ) + expires + "; path=/";
                    document.cookie = ck;
                    return this;
                },

                get: function (name) {
                    name = name || "";
                    let nameEQ = name + "=",
                        ca = document.cookie.split(';').filter(Boolean),
                        cs = {};
                    for (var i = 0, caL = ca.length; i < caL; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') c = c.substring(1, c.length);

                        if (name && c.indexOf(nameEQ) == 0)
                            return c.substring(nameEQ.length, c.length);
                        else if (!!!name) {
                            c = c.split('=');
                            cs[c[0]] = c.length > 2 ? c.slice(1) : c[1];
                        }
                    }

                    return name ? "" : (
                        cs || {}
                    );
                },

                delete: function (name) {
                    return this.set(name, '', -1);
                },
            },
        })
            .core();

// disable [_z, {}].extend
// _z.extend.status = false;
        _z.extend.status = true;

// bind library
        window._z = _z;

// bind load function
        (
            !window._1
        ) && (
            window._1 = _z.ready.bind(_z)
        );

        if (typeof define === "function" && define.amd && define.amd._z)
            define("_z", [], function () {
                return _z;
            });

// auto load script
        var scripts = _z('[underZ]').element(-1); // last
        if (scripts && scripts['innerText']) // auto load
            try {
                eval(scripts['innerText']);
            } catch (e) {
                console.error(e);
            }

        const $_z = tap(_z, function (_z) {
            // assign function

            // notification module
            _z.notification = function Notifications(options, options2) {
                if (!!!(
                    this instanceof Notifications
                ))
                    return fns.t.e("Failed to construct 'Notifications': Please use the 'new' operator.");

                // if notification blocked try to grant permission
                if (!!!this.status && !!!this.blocked)
                    return this.request(() => new Notifications(...(
                        arguments || []
                    )));

                options2 = options2 || {};
                options = options || "DefaultTag";
                options = _z.isObject(options) ? options : (
                    _z.isString(options) ? {tag: options} : options || {}
                );
                options = _z.extend(
                    {},
                    this.options || {},
                    {data: arguments},
                    options || {},
                    options2 || {},
                );
                options['data'] && (
                    options.data = _z.extend({}, options || {})
                );
                options['events'] = options['events'] || {};

                // remove events from options to this
                _z.for(this.events, function (eIdx, eName) {
                    eName = (
                        eName && _z.isArray(eName) ? eName : [eName]
                    )[0] || false;
                    if (
                        eName &&
                        (
                            isset(options['events'][eName]) || (
                                options['events'][eName] = []
                            )
                        ) &&
                        (
                            _z.isArray(options['events'][eName]) || (
                                options['events'][eName] = [options['events'][eName]]
                            )
                        ) &&
                        isset(options[eName]) &&
                        (
                            (
                                _z.isArray(options[eName]) && options[eName]
                            ) ||
                            (
                                options[eName] = [options[eName]]
                            )
                        ) &&
                        (
                            options['events'][eName].push(...(
                                options[eName] || []
                            ))
                        )
                    ) delete options[eName];

                }, options['events']);

                this.length = _z.toArray(this).filter(x => x).length || 0;
                // current notification options
                this.options = _z.extend({}, options);

                return this;
            };

            tap(_z.notification.prototype = {
                options: {
                    title: "UnderZ Notifications.",
                    body: "By M.F.Al-Safadi, UnderZ Library.",

                    icon: "favicon.ico",
                    image: "favicon.ico",
                    badge: "favicon.ico",

                    dir: "auto",
                    lang: "en",
                    tag: "DefaultTag",

                    data: [],
                },

                // engine version
                underZ: version,

                constructor: _z.notification,

                // open notification module
                open: function openNotification(options) {
                    if (!!!this.options) this.options = {};

                    var newOptions = _z.extend({}, this['options'] || {}, {data: false, events: false});

                    delete newOptions['events'];
                    delete newOptions['data'];
                    newOptions = _z.extend({}, newOptions || {}, options || {});

                    var n = new Notification(newOptions['title'] || "", newOptions || {});

                    this['options']['events'] = _z.extend({}, newOptions['events'] || {});

                    // add registered handleEvent to current notification
                    _z.for(this.events, function (eIdx, eName) {
                        eName = eName && _z.isArray(eName) ? eName : [eName];
                        eName = eName[0] || false;

                        if (isset(newOptions[eName])) {
                            this['events'][eName] = tap(
                                _z.Array(this['events'][eName]),
                                x => x.add(...(
                                    _z.Array(newOptions[eName]) || []
                                )),
                            );
                        }

                        if (isset(this['events'][eName]) && (
                            this['events'][eName].length
                        )) {
                            _z.for(this['events'][eName], function (fIdx, fName) {
                                var ELArgs = [
                                        (
                                            eName || 'click'
                                        ).replace(/^on/, ''), fName,
                                    ],
                                    addEL;
                                if (n.addEventListener) {
                                    ELArgs.push(false);
                                    addEL = n.addEventListener;
                                } else addEL = n.detachEvent;

                                if (fns.isSetisFunc(fName))
                                    return addEL.apply(n, ELArgs);

                            });
                        }

                    }, this['options']);

                    // attach notification object to options
                    let nodes = tap(_z.toArray(this).filter(x => x), $nodes => $nodes.push(n));
                    nodes.forEach((
                        function (v, k) {
                            if (v) {
                                this[k] = v;
                            } else {
                                delete this[k];
                            }
                        }
                    ).bind(this));

                    return tap(this, (e) => e.length = nodes.length);
                },

                // update notification status - request permission
                request: function requestPermission() {
                    try {
                        return Notification.requestPermission(...(
                            arguments || []
                        ));
                    } catch (NotificationException) {
                        return false;
                    }
                },

                // all available eventhandlers
                events: [
                    'onclick',
                    'onshow',
                    'onerror',
                    'onclose',
                ],

                // notification status get
                get status() {
                    return Notification.permission == 'granted' || false;
                },
                // notification status is denied
                get blocked() {
                    return Notification.permission == 'denied' || false;
                },

                extend: extendFunction,

                length: 0,
            }, function ($prototype) {
                $prototype.extend(prototypies.likeArray);
            });
            // notification module

            return _z;
        });

        if (typeof (
            module
        ) !== "undefined" && module.exports) {
            module.exports = _z;
        }
        return $_z;
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
