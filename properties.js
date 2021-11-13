(
    function (window, document) {
// new Date().getUnixTime() = Unix timestamp
        if (typeof Date.prototype.getUnixTime !== 'function')
            Object.defineProperty(Date.prototype, 'getUnixTime', {
                value() {
                    return this.getTime() / 1000 | 0;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// Date.now() = js timestamp
        if (typeof Date.now !== 'function')
            Date.now = function () {
                return (
                    new Date()
                ).getTime();
            };

// Date.time() = Unix timestamp
        if (typeof Date.time !== 'function')
            Date.time = function () {
                return new Date().getUnixTime();
            };

// Function.callSelf(...arguments) = Function.apply( Function, arguments )
        if (typeof Function.prototype.callSelf !== 'function')
            Object.defineProperty(Function.prototype, 'callSelf', {
                value() {
                    return this.apply(this, arguments);
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

        if (typeof Function.prototype.staticProperty !== 'function')
            /**
             * Define new Property to object.
             * <pre>
             *        let fn = function() {};
             *        fn.addStatic({
             *     		prop: val,
             *     		another1: false
             * 		})
             * </pre>
             *
             * @name staticProperty
             * @memberOf Function.prototype
             * @return self
             */
            Object.defineProperty(Function.prototype, 'staticProperty', {
                value(...obj) {
                    let self = this;
                    obj.forEach(args => Object.keys(args).forEach(k => self[k] = args[k]));

                    return self;
                },

                // enumerable: true,
                // configurable: true,
                // writable: true
            });

        if (typeof Function.prototype.publicProperty !== 'function')
            /**
             * Define new Property to object.
             * <pre>
             *        let fn = function() {};
             *        fn.addStatic({
             *     		prop: val,
             *     		another1: false
             * 		})
             * </pre>
             *
             * @name staticProperty
             * @memberOf Function.prototype
             * @return self
             */
            Object.defineProperty(Function.prototype, 'publicProperty', {
                value(...obj) {
                    let self = this.prototype || undefined;
                    if (self !== undefined)
                        obj.forEach(args => Object.keys(args).forEach(k => self[k] = args[k]));


                    return self;
                },

                // enumerable: true,
                // configurable: true,
                // writable: true
            });

        /**
         * console.ldir(Object)
         */
        if (typeof Object.prototype.ldir !== 'function')
            Object.defineProperty(Object.prototype, 'ldir', {
                value(...obj) {
                    let self = this;
                    [self, ...obj].forEach(args => console.dir(args));

                    return self;
                },

                enumerable: false,
                configurable: false,
                writable: false,
            });

        /**
         * console.llog(Object, log type[e,w,t,T,i,l]) default: l
         */
        if (typeof Object.prototype.llog !== 'function')
            Object.defineProperty(Object.prototype, 'llog', {
                value(obj, logType = 'l') {
                    logType = logType || 'l';
                    let self = this;

                    if (logType === false) return self;

                    logType = logType === 'l' ? 'log' : logType;
                    logType = logType === 'e' ? 'error' : logType;
                    logType = logType === 'w' ? 'warn' : logType;
                    logType = logType === 't' ? 'trace' : logType;
                    logType = logType === 'T' ? 'table' : logType;
                    logType = logType === 'i' ? 'info' : logType;

                    obj = Array.isArray(obj) ? obj : [obj];
                    if (logType in console)
                        [self, ...obj].forEach(args => console[logType](args));

                    return self;
                },

                enumerable: false,
                configurable: false,
                writable: false,
            });

// Object.each(function) = Object
        if (typeof Object.prototype.each !== 'function')
            Object.defineProperty(Object.prototype, 'each', {
                value(cb) {
                    cb = cb || false;
                    if (!_z.isFunction(cb)) return this;

                    if (_z && _z["for"]) {
                        let
                            nO = _z.for(this, cb);
                        if (_z.isObject(nO))
                            Object.assign(this, nO);
                    } else {
                        try {
                            let
                                _keys = Object.keys(this),
                                i = 0,
                                l = _keys.length;
                            for (; i < l; i++) {
                                let thisObj = {};
                                thisObj[_keys[i]] = this[_keys[i]];
                                let cbReturn = cb.apply(this, [_keys[i], this[_keys[i]], this[_keys[i]]]);

                                if (cbReturn === false)
                                    break;
                                else if (cbReturn != null) // != null its means (cbReturn !== undefined && cbReturn !== null)
                                    this[_keys[i]] = cbReturn;
                            }
                        } catch (e) {
                            throw e;
                        }
                    }

                    return this;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// Array.pushSetter='value' => Array.push( 'value' )
        if (typeof Array.prototype.pushSetter !== 'function')
            Object.defineProperty(Array.prototype, 'pushSetter', {
                set: function (v) {
                    return this.push(v);
                }, configurable: false,
            });


// Object.getType => type of object lowerCase
        if (typeof Object.prototype.getType !== 'function')
            Object.defineProperty(Object.prototype, 'getType', {
                value(toLowerCase) {
                    toLowerCase = toLowerCase || arguments.length ? false : true;
                    if (this instanceof _z) return "_z";
                    else if (this == _z) return "underz";

                    return Object.prototype.toString.call(this)
                        .replace("[object ", "")
                        .replace("]", "")
                        .trim()[toLowerCase ? "toLowerCase" : "trim"]();
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// Object.isType => true|false check object type
        if (typeof Object.prototype.isType !== 'function')
            Object.defineProperty(Object.prototype, 'isType', {
                value(check) {
                    check = (
                        arguments.length == 1
                    ) ? String(check).toLowerCase() : -1;
                    return this.getType() == check;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// METHD1: Normal Array
        // [1, 2, 3, 1].unique() = [1, 2, 3]
// METHD2: MultiDimensional Array
        // var a=[], b=[];
        // b["ID"]= 1; // [ ID = 1 ]
        // a.push(b); // [ [ ID = 1 ] ]
        // b=[]; // []
        // b["ID"]= 2; // [ ID = 2 ]
        // a.push(b); // [ [ ID = 1 ], [ ID = 2 ] ]
        // b=[]; // []
        // b["ID"]= 3; // [ ID = 3 ]
        // a.push(b); // [ [ ID = 1 ], [ ID = 2 ], [ ID = 3 ] ]
        // b=[]; // []
        // b["ID"]= 1; // [ ID = 1 ]
        // a.push(b); // [ [ ID = 1 ], [ ID = 2 ], [ ID = 3 ], [ ID = 1 ] ]
        // a.unique("ID"); // [ [ ID = 1 ], [ ID = 2 ], [ ID = 3 ] ]
        if (typeof Array.prototype.unique !== 'function')
            Object.defineProperty(Array.prototype, 'unique', {
                value(keyUnique) {
                    keyUnique = keyUnique || null;

                    if (keyUnique == null)
                        return [...new Set(this)];

                    let u = {}, a = [];
                    let
                        i = 0,
                        l = this.length;
                    for (; i < l; ++i) {
                        let currentKeyElement = this[i];
                        let currentKey = this[i][keyUnique];

                        if (u.hasOwnProperty(currentKey)) continue;

                        a.push(currentKeyElement);
                        u[currentKey] = 1;
                    }
                    return a;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// Array.add( ...ARRAY ) = push all the arguments
        if (typeof Array.prototype.add !== 'function') {
            Object.defineProperty(Array.prototype, 'add', {
                value() {
                    var arr = _z.Array(arguments) || [];

                    if (_z.isFunction(this.push))
                        return this.push.apply(this, arr);
                    else
                        return _z.arrayAppend(this, ...arr);
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

        }

// Array.inArray(needle, haystack) = index OR -1 if not found
        if (typeof Array.prototype.inArray !== 'function')
            Object.defineProperty(Array.prototype, 'inArray', {
                value(needle, haystack) {
                    var haystack = haystack || this;
                    if (!_z.isArray(haystack)) return -1;

                    for (var i = 0, length = haystack.length; i < length; i++)
                        if (haystack[i] == needle)
                            return haystack.indexOf(needle) || 0;

                    return -1;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// Array.remove(from, to) = remove vars by index or value
        if (typeof Array.prototype.remove !== 'function')
            Object.defineProperty(Array.prototype, 'remove', {
                value(from, to) {
                    var args = arguments;
                    if (args.length > 0)
                        from = typeof (
                            from
                        ) == typeof (
                            7
                        ) ? from : this.indexOf(from);

                    if (args.length > 1)
                        to = typeof (
                            to
                        ) == typeof (
                            6
                        ) ? to : this.indexOf(to);

                    from = (
                        from === -1 && args[0] !== -1
                    ) ? false : from;
                    to = (
                        to === -1 && args[1] !== -1
                    ) ? false : to;
                    if ((
                        !!!from && typeof (
                            from
                        ) != typeof (
                            4
                        )
                    ) && (
                        !!!to && typeof (
                            to
                        ) != typeof (
                            5
                        )
                    ))
                        return this;

                    // Array Remove - By John Resig (MIT Licensed)
                    var rest = this.slice((
                        to || from
                    ) + 1 || this.length);
                    this.length = from < 0 ? this.length + from : from;

                    return this.push.apply(this, rest);
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// Array Array.removeAll(val) = remove vars by value
        if (typeof Array.prototype.removeAll !== 'function')
            Object.defineProperty(Array.prototype, 'removeAll', {
                value(val) {
                    if (this.indexOf(val) === -1)
                        return this;

                    while (this.indexOf(val) !== -1 && this.remove(val)) ;

                    return this;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// String String.replaceArray(Array needle, Array haystack)
        if (typeof String.prototype.replaceArray !== 'function')
            Object.defineProperty(String.prototype, 'replaceArray', {
                value(find, replace) {
                    var replaceString = this;
                    find = (
                        find && (
                            find
                        ).isType("array")
                    ) ? find : [find] || [];
                    replace = (
                        replace && (
                            replace
                        ).isType("array")
                    ) ? replace : [replace] || [];

                    for (var i = 0, fL = find.length; i < fL; i++)
                        replaceString = replaceString.replace(
                            find[i],
                            (
                                replace && (
                                    replace
                                ).isType("array")
                            ) ? replace[i] || "" : replace,
                        );

                    return replaceString;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// String String.replaceAll(String needle, String haystack)
        if (typeof String.prototype.replaceAll !== 'function')
            Object.defineProperty(String.prototype, 'replaceAll', {
                value(search, replacement) {
                    var target = this;
                    search = (
                        search && (
                            search
                        ).isType("array")
                    ) ? search : [search] || [];
                    replacement = (
                        replacement && (
                            replacement
                        ).isType("array")
                    ) ? replacement : [replacement] || [];

                    if (search.length > 1) {
                        if (replacement.length < search.length)
                            replacement.add(...Array.from({length: search.length - replacement.length}, () => ""));
                        for (var i = 0, fL = search.length; i < fL; i++)
                            target = target.split(search[i]).join((
                                replacement && (
                                    replacement
                                ).isType("array")
                            ) ? replacement[i] : replacement);
                        return target;
                    }

                    search = search[0];
                    replacement = replacement.length ? replacement[0] : "";
                    replacement = (
                        replacement === undefined || replacement === null
                    ) ? "" : replacement;
                    return target.split(search).join(replacement);
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// String String.fromCode(int radix, String seprator, Boolean codeLen)
        if (typeof String.prototype.fromCode !== 'function')
            Object.defineProperty(String.prototype, 'fromCode', {
                value(radix /*binary=2,octal=8,hex=16,code=undefined*/, separator/*""*/, codeLen/*false*/) {
                    radix = Number(radix) || undefined;
                    separator = separator || "";
                    var cLen = "H".charCodeAt(0).toString(radix).length;
                    codeLen = codeLen || (
                        codeLen === true ? 2 : Number(codeLen || 0) || cLen
                    );

                    var hexes = this;
                    if (separator) hexes.replace(separator, "");

                    hexes = hexes.match(new RegExp(".{1," + (
                        codeLen || cLen
                    ) + "}", "g")) || [];
                    var back = "";
                    for (var j = 0, hL = hexes.length; j < hL; j++)
                        back += String.fromCharCode(parseInt(hexes[j], radix));

                    return back;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// todo: wiki+
// String String.toCode(int radix, String seprator, Boolean codeLen)
        if (typeof String.prototype.toCode !== 'function')
            Object.defineProperty(String.prototype, 'toCode', {
                value(radix /*binary=2,octal=8,hex=16,code=undefined*/, separator/*""*/, codeLen/*false*/) {
                    radix = Number(radix) || undefined;
                    separator = separator || "";
                    var cLen = "H".charCodeAt(0).toString(radix).length;
                    codeLen = codeLen || (
                        (
                            codeLen === true ? 2 : Number(codeLen || 0) || cLen
                        ) * (
                            -1
                        )
                    );

                    var hex;
                    try {
                        hex = unescape(encodeURIComponent(this)).split('').map((v) => {
                            return (
                                "000000" + v.charCodeAt(0).toString(radix)
                            ).slice(codeLen || cLen * (
                                -1
                            ));
                        }).join(separator || "");
                    } catch (e) {
                        console.log('Invalid text input: ' + (
                            hex = this
                        ));
                    }

                    return hex;
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

// RegExp.regexes = Regexes source
        if (typeof RegExp.regexes !== 'object') {
            RegExp.regexes = {
                // notInQuote: /(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/,
                notInQuote: /(?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/,
                space: / +?|\t/,
                CSSRole: /((\s*?@media[\s\S]*?){([\s\S]*?)}\s*?})|(([\s\S]*?){([\s\S]*?)})/,
                CSSPropValue: /([a-zA-Z0-9\-\_]*)\s*:\s*(.*)\;/,
            };
        }

// RegExp.mutli(RegExp, RegExp, ...RegExp) = multi RegExp
        if (typeof RegExp.mutli !== 'function')
            RegExp.mutli = function mutli(...regexes) {
                return new RegExp('(' + regexes.map(r => r.source).join(')|(') + ')');
            };

// RegExp.setFlags(...flags) = add flags to the regex
        if (typeof RegExp.prototype.setFlags !== 'function')
            Object.defineProperty(RegExp.prototype, 'setFlags', {
                value(...flags) {
                    return new RegExp(this.source, flags.join(''));
                },

                enumerable: false,
                configurable: true,
                writable: true,
            });

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
