(
    function (window, document) {
        // document - private var
        let doc = window.document || this.document || document || this;

        /**
         * Enum for insertAdjacentElement Positions.
         * @readonly
         * @enum {string}
         */
        const insertPositions = {
            BEFORE_BEGIN: 'beforebegin', // Before the targetElement itself.
            AFTER_BEGIN: 'afterbegin', // Just inside the targetElement, before its first child.
            BEFORE_END: 'beforeend', // Just inside the targetElement, after its last child.
            AFTER_END: 'afterend', // After the targetElement itself.
        };

        /**
         * insert adjacent element
         * @param $val {_z|HTMLElement|String}
         * @param $position {insertPositions}
         */
        const insertAdjacentElement = function insertElement($val, $position) {
            if (!_z.isset($val) || (!_z.is_z($val) && !_z.isDOM($val) && !_z.isString($val)) || !this.length) {
                return this;
            }

            if ((_z.isDOM($val) || !_z.is_z($val)) && !_z.isString($val)) {
                $val = _z($val);
            }

            let elm = this;
            $position = $position || insertPositions.BEFORE_BEGIN;
            _z.elementMap(elm, function (e) {
                if (!e['insertAdjacentElement']) {
                    return;
                }

                if (!_z.isString($val)) {
                    $val.for(function (key, value) {
                        if (_z.isDOM(value)) {
                            e['insertAdjacentElement']($position, value);
                        }
                    });
                } else {
                    e['insertAdjacentHTML']($position, $val);
                }
            });

            return this;
        };

        // fix: global Element for workers
        const ElementPrototype = ("Element" in window ? window["Element"] : _z.newClass()).prototype;

        // Element.matches function
        const matchesFunction = ElementPrototype.matches ||
            ElementPrototype.matchesSelector ||
            ElementPrototype.mozMatchesSelector ||
            ElementPrototype.msMatchesSelector ||
            ElementPrototype.oMatchesSelector ||
            ElementPrototype.webkitMatchesSelector ||
            function (s) {
                if (!_z.isValidSelector(s)) {
                    return false;
                }

                let _matches = (
                    doc
                    || window.document
                    || this.document
                    || this.ownerDocument
                    || window.ownerDocument
                ).querySelectorAll(s);
                let i = _matches.length;
                while (--i >= 0 && _matches.item(i) !== this) {
                }

                return i > -1;
            };

        // Element.matches() polyfill
        const matches = function elementMatches() {
            let element = arguments[0] || false,
                arg = _z.subArray(1, arguments);
            try {
                let es,
                    $return = [];

                if (arg && element && _z(element).length) {
                    element = _z(element);
                    _z.elementMap(
                        element,
                        function (e) {
                            try {
                                e = e === doc ? doc.documentElement : e;

                                $return.push(..._z.filter(e, $e => matchesFunction.call($e, arg)).toArray());
                            } catch (e) {

                            }
                        },
                        x => _z(x).isDOMElement(true) || _z.isString(x) || x === doc,
                    );

                    $return = _z.filter($return);
                } else {
                    $return = _z();
                }


                es = $return && _z.size($return) ? _z($return) : _z();

                return _z(es).filter().length > 0;
            } catch (e1) {
                console.error("(dom.js:161) Matches Error[matches]:", e1);
                return false;
            }
        };

        // text to html node list
        _z.parse.parseHTMLNode = function parseHTMLNode(str) {
            try {
                if (doc.isdocument !== true) {
                    return;
                }

                let tmp = document.implementation.createHTMLDocument();
                tmp.body.innerHTML = str;
                return tmp.body.childNodes;
            } catch (_err) {
                console.error("(dom.js:60) Parse Error[parseHTMLNode]:", _err);
            }
        };

// DOM functions
        _z.join({
            // element/elements HTML
            html: function html(elm, $val) {
                $val = arguments.length === 1 && (_z.isString(elm) || _z.isNumber(elm))
                    ? elm
                    : $val;
                elm = arguments.length === 1 && (_z.isString(elm) || _z.isNumber(elm)) || !arguments.length
                    ? this
                    : _z(elm);

                let $return = [];
                _z.elementMap(elm, function (e) {
                    if (_z.isset($val) && _z.isset(e['innerHTML'])) {
                        e.innerHTML = $val;
                        $return.push(e.innerHTML);

                        let scriptElements = _z($val).filter((_e) => _z(_e).is("script"));
                        if (scriptElements.length > 0) {
                            _z.execScript(scriptElements);
                        }
                    } else if (_z.isset(e['innerHTML'])) {
                        $return.push(e.innerHTML);
                    }
                });

                return _z.isset($val)
                    ? this
                    : (elm.length === 1 ? ($return[0] || "") : $return);
            },

            // element/elements prop
            prop: function elementProp(prop, val) {
                if (arguments.length === 0) {
                    return this;
                }

                let elm = this;
                let $return = [];
                _z.elementMap(elm, function (e) {
                    if (_z.isset(e[prop])) {
                        if (_z.isset(val)) {
                            e[prop] = val;
                        } else {
                            $return.push(e[prop]);
                        }
                    }
                });

                return _z.isset(val) ? this : (this.length === 1 ? $return[0] : $return);
            },

            // element/elements value
            val: function elementValue(val) {
                if (_z.isset(val)) {
                    val = _z.map(_z.isArray(val) ? val : [val], function () {
                        return _z.trim.call(this);
                    }).filter(k => !!k);
                }

                let elm = this;

                let $return = [];
                _z.elementMap(elm, function (e) {
                    try {
                        if ( // checkbox || radio
                            e['tagName'] && _z.toLowerCase(e['tagName']) === 'input' &&
                            e['type'] && ['checkbox', 'radio'].includes(e['type'])
                        ) {
                            $return.push(_z.isset(val) ? (e['value'] = val) : (e['value'] || "on"));
                        } else if ( // select
                            e['tagName'] && _z.toLowerCase(e['tagName']) === 'select' &&
                            e['options'] && e['options'].length
                        ) {
                            let $return_options = [];
                            _z.each(e['options'], function (k, oE) {
                                // set
                                if (_z.isset(val) && (oE['selected'] = _z.inArray(oE['value'], val) !== -1)) {
                                    $return_options.push(oE['value']);
                                }

                                // get
                                if (
                                    !_z.isset(val) &&	// not in set mode
                                    oE['selected'] &&	// selected option
                                    !oE['disabled'] &&	// not disabled
                                    oE['parentNode'] &&	// has parentNode & not disabled
                                    (!oE['parentNode']['disabled'] || _z.toLowerCase(oE['parentNode']['tagName']) !== 'optgroup')
                                ) {
                                    $return_options.push(oE['value']);
                                }
                            });

                            if (_z.isset(val) && $return_options.length === 0) {
                                e['selectedIndex'] = -1;
                            }

                            if (!_z.isset(val) && _z.toLowerCase(e['type']) === "select-multiple") {
                                $return.push($return_options);
                            } else if (!_z.isset(val)) {
                                $return.push($return_options[0]);
                            }
                        } else {
                            e['value'] = e['value'] || "";
                            if (_z.isset(val)) {
                                e['value'] = val;
                            }
                            $return.push(e['value'] || "");
                        }

                    } catch (err) {
                        console.error(err);
                    }
                });

                return _z.isset(val) ? this : (elm.length === 1 ? $return[0] : (!elm.length ? "" : $return));
            },

            // element/elements TEXT
            text: function text(elm, $val) {
                $val = arguments.length === 1 && (_z.isString(elm) || _z.isNumber(elm)) ? elm : $val;
                elm = arguments.length === 1 && (_z.isString(elm) || _z.isNumber(elm)) ? this : _z(elm);

                if (!arguments.length) {
                    elm = this;
                }

                let $return = [];
                _z.elementMap(elm, function (e) {
                    let findRightAttr = e['innerText'] ? 'innerText' : (e['textContent'] ? 'textContent' : false);
                    if (!findRightAttr) {
                        return;
                    }

                    if (_z.isset($val) && e[findRightAttr]) {
                        e[findRightAttr] = $val;
                    } else if (e[findRightAttr]) {
                        $return.push(e[findRightAttr]);
                    }
                });

                return _z.isset($val) ? this : ((elm.length === 1 ? $return[0] : $return) || "");
            },

            // is element/s contains elm2
            contains: function contains(elm2) {
                let elm = this;
                elm = _z.isDOM(elm) || _z.isArray(elm) || _z.is_z(elm) ? _z(elm) : false;
                elm2 = _z.isDOM(elm2) || _z.isArray(elm2) || _z.is_z(elm2) ? _z(elm2) : false;

                if (!elm) {
                    elm = this;
                }
                if (!elm.length || !elm2.length) {
                    return false;
                }

                let $return = null;
                _z.elementMap(elm, function (e) {
                    if ($return !== false) {
                        _z.elementMap(elm2, function (e2) {
                            $return = e !== e2 && e.contains(e2);
                        });
                    }
                });

                return $return;
            },

            // element/s tagName
            tagName: function tagName(filter) {
                filter = filter || _z.trueFunction;
                let elm = elm || this;
                elm = _z.isDOM(elm) || _z.isArray(elm) || _z.is_z(elm) ? _z(elm) : false;

                if (!elm) {
                    elm = this;
                }
                if (!elm.length) {
                    return "";
                }

                let $return = [];
                _z.elementMap(elm, function (e) {
                    let tn = "";
                    tn = e['tagName'] ? e.tagName.toLowerCase() : tn;
                    tn = !tn && e['outerHTML'] ? (/<([\w:]+)/.exec(e.outerHTML) || ["", ""])[1].toLowerCase() : tn;
                    if (tn && (!_z.isFunction(filter) || filter.callSelf(tn))) {
                        $return.push(tn);
                    }
                });

                return elm.length === 1 ? ($return[0] || "") : $return;
            },

            // clone element/elements
            clone: function cloneNode(deep) {
                deep = deep || false;
                elm = this;

                let $return = [];
                _z.elementMap(elm, function (e) {
                    if (deep && e['cloneNode']) {
                        $return.push(e['cloneNode'](true));
                    } else if (e['cloneNode']) {
                        $return.push(e['cloneNode']());
                    }
                });

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },

            // remove element/elements
            // remove: function () {
            //     return this.rem.apply(this, arguments);
            // },
            rem: function removeElement(elm) {
                elm = elm || this;
                let callback = false;

                if (_z.isFunction(elm)) {
                    callback = elm;
                    elm = this;
                }

                _z.elementMap(elm, function (e) {
                    try {
                        let remThis = true;
                        if (callback && _z.isFunction(callback)) {
                            remThis = callback(e, elm);
                        }

                        if (remThis === true) {
                            e.parentNode.removeChild(e);
                        }
                    } catch (er) {
                    }
                });

                return this;
            },

            // append element
            append: function append($val) {
                if (!_z.isset($val) || (!_z.is_z($val) && !_z.isDOM($val) && !_z.isString($val)) || !this.length) {
                    return this;
                }

                if (_z.isString($val)) {
                    let _$val = _z.parse.parseHTMLNode($val);
                    if (_z.isNodeList(_$val)) {
                        $val = _z.toArray(_$val);
                    }
                }

                if (_z.isDOM($val) || !_z.is_z($val)) {
                    $val = _z($val);
                }

                _z.elementMap(this, function (e) {
                    if (!e['appendChild']) {
                        return;
                    }

                    $val.for(function (key, value) {
                        if (_z.isDOM(value) || _z.type(value) === 'text') {
                            e['appendChild'](value);
                            if (_z(value).tagName() === "script") {
                                _z.execScript(value);
                            }
                        }
                    });
                });

                return this;
            },

            // append to element
            appendTo: function appendTo($elm) {
                if (!_z.isset($elm) || !($elm = _z($elm)).isDOMElement() || !this.length) {
                    return this;
                }

                $elm.append(this);
                return this.newSelector(null);
            },

            // prepend element
            prepend: function prepend($val) {
                if (!_z.isset($val) || (!_z.is_z($val) && !_z.isDOM($val) && !_z.isString($val)) || !this.length) {
                    return this;
                }

                if (_z.isString($val)) {
                    let _$val = _z.parse.parseHTMLNode($val);
                    if (_z.isNodeList(_$val)) {
                        $val = _z.toArray(_$val);
                        if ($val['reverse']) {
                            $val.reverse();
                        }
                    }
                }

                if (_z.isDOM($val) || !_z.is_z($val)) {
                    $val = _z($val);
                }

                let elm = this;
                _z.elementMap(elm, function (e) {
                    if (!e['insertBefore'] || !e['firstChild']) {
                        return;
                    }

                    $val.for(function (key, value) {
                        if (_z.isDOM(value) || _z.type(value) === 'text') {
                            e['insertBefore'](value, e['firstChild']);

                            if (_z(value).tagName() === "script")
                                _z.execScript(value);
                        }
                    });
                });

                return this;
            },

            // prepend to element
            prependTo: function prependTo($elm) {
                if (!_z.isset($elm) || !($elm = _z($elm)).isDOMElement() || !this.length) {
                    return this
                }

                $elm.prepend(this);
                return this.newSelector(null);
            },

            // insert after element
            after: function after($val) {
                return insertAdjacentElement.apply(this, [$val, insertPositions.AFTER_END]);
            },

            // insert before element
            before: function before($val) {
                return insertAdjacentElement.apply(this, [$val, insertPositions.BEFORE_BEGIN]);
            },

            // insert element after element
            insertAfter: function insertAfter($val) {
                _z($val).after(this);
                return this.newSelector(null);
            },

            // insert element before element
            insertBefore: function insertBefore($val) {
                _z($val).before(this);
                return this.newSelector(null);
            },

            // get childrens of an element
            children: function children($val) {
                let elm = this,
                    $return = [];
                _z.elementMap(elm, function (e) {
                    if (e['children']) {
                        if (_z.isset($val)) {
                            _z.for(_z.toArray(e['children']), function (k, v) {
                                if (_z.isDOM($val)) {
                                    if (v['isEqualNode'] && v['isEqualNode']($val)) {
                                        $return.push(v);
                                    }
                                } else if (_z.isTypes('selector', $val) && matches(v, $val)) {
                                    $return.push(v);
                                }
                            });
                        } else {
                            $return.add(..._z.toArray(e['children']));
                        }
                    }
                });

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },

            // get element siblings
            brothers: function elementSiblings($val) {
                let elm = this,
                    $returns = [];

                _z.elementMap(elm, function (e) {
                    let $return = [],
                        prev = e,
                        next = e;

                    while ((prev = prev['previousElementSibling'])) {
                        if ((_z.isset($val) && !_z(prev).is($val)) || $returns.concat($return).includes(prev)) {
                            continue;
                        }

                        $return.push(prev);
                    }

                    $returns.push(...($return.reverse() || []));
                    while ((next = next['nextElementSibling'])) {
                        if (_z.isset($val) && !_z(next).is($val) || $returns.includes(next)) {
                            continue;
                        }

                        $returns.push(next);
                    }
                });

                let newInstance = this.newSelector($returns);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },
            // siblings: function elementInSameLeve() {
            //     return this.brothers.apply(this, arguments);
            // },

            // find in this elements
            find: function findChildren(qSelector) {
                qSelector = qSelector || false;

                if (!qSelector) {
                    return this;
                }

                let $return = [],
                    elm = this;

                _z.elementMap(elm, function (v) {
                    v = v == doc ? doc.documentElement : v;
                    v = _z.toNodeList(v)[0];

                    if (v && v['querySelectorAll']) {
                        v = v.querySelectorAll(qSelector);
                        if (v.length) {
                            $return.add(..._z(v).element());
                        }
                    }
                }, v => _z.isDOM(v) || !_z.isNodeList(v));

                let newInstance = this.newSelector(_z.unique($return));
                newInstance.args = arguments;
                newInstance.selector = qSelector;
                return newInstance;
            },

            // get element has child $_ELM
            has: function hasChild($_ELM) {
                let elm = this,
                    $return = [];

                _z.elementMap(elm, function (e) {
                    if (_z(e).find($_ELM).length) {
                        $return.push(e);
                    }
                });

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },

            // elements to html
            toHTML: function outerHTML() {
                let $return = [],
                    elm = this,
                    getHTML = function getHTML(node) {
                        if (!node || !node.tagName) {
                            return '';
                        }
                        if (node.outerHTML) {
                            return node.outerHTML;
                        }

                        // polyfill:
                        let wrapper = document.createElement('div');
                        wrapper.appendChild(node.cloneNode(true));
                        return wrapper.innerHTML;
                    };

                _z.elementMap(elm, function (v) {
                    if (_z.isDOM(v) || _z.isNodeList(v)) {
                        v = _z.toNodeList(v)[0];
                    }

                    if (v) {
                        $return.push(getHTML(v));
                    }
                });

                return this.length === 1 ? $return[0] : $return;
            },

            // todo: do like $.eq
            // get last element as _z
            last: function lastElement(len) {
                if (_z.isArray(len)) {
                    return _z.subArray(-1, len);
                }

                len = parseInt(len) || 1;
                let newInstance = this.newSelector(this.subArray(len <= 0 ? len : len * -1));
                newInstance.args = arguments;
                newInstance.selector = "::last";

                return newInstance;
            },

            // get first element as _z
            first: function firstElement(len) {
                if (_z.isArray(len)) {
                    return _z.subArray(0, 1, len);
                }

                len = parseInt(len) || 1;

                let newInstance = this.newSelector(this.subArray(0, len >= 0 ? len : len * -1));
                newInstance.args = arguments;
                newInstance.selector = "::first";

                return newInstance;
            },

            // get next element
            next: function next($val) {
                let elm = this,
                    $return = [];
                _z.elementMap(elm, function (e) {
                    if (e['nextElementSibling']) {
                        if (_z.isset($val)) {
                            _z.for([e['nextElementSibling']], function (k, v) {
                                if (
                                    _z.isDOM($val) && v['isEqualNode'] && v['isEqualNode']($val) ||
                                    _z.isString($val) && matches(v, $val)
                                ) {
                                    $return.push(v);
                                }
                            });
                        } else {
                            $return.push(e['nextElementSibling']);
                        }
                    }
                });

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },

            // get next element in document
            // nextElement( selector )
            // nextElement( cb )
            // nextElement( selector, cb )
            nextElement: function nextElement(selector = 'input, select, textarea, button', cb) {
                let elm = this,
                    $return = [];

                if (arguments.length < 1) {
                    try {
                        selector = 'input, select, textarea, button';
                        arguments = [selector];
                    } catch (e) {
                        selector = undefined;
                        arguments = [];
                    }
                }

                if (arguments.length < 1 || this.length !== 1) {
                    return this.newSelector($return);
                }

                // case selector || cb
                if (arguments.length === 1 && !!selector) {
                    cb = _z.isFunction(selector) ? selector : _z.trueFunction;
                    selector = !_z.isFunction(selector) ? selector : "";
                } // case cb && selector
                else if (arguments.length === 2 && !!selector && !!cb) {
                    let _cb = cb;
                    cb = _z.isFunction(selector) ? selector : (
                        _z.isFunction(cb) ? cb : _z.trueFunction
                    );
                    selector = !_z.isFunction(selector) ? selector : (
                        !_z.isFunction(_cb) ? _cb : ""
                    );
                }

                let allElements = selector ? _z(selector).element() : _z('input').element(),
                    ElementIndex = _z.inObject(allElements, elm.element(0));

                ElementIndex = +ElementIndex;
                if (ElementIndex !== -1) {
                    allElements = _z.subArray(ElementIndex + 1, allElements);
                } else {
                    return this.newSelector($return);
                }

                let passCallback = e => cb && _z.isFunction(cb) && cb.call(e, e, selector) === true;
                _z.elementMap(allElements, function (el) {
                    if ($return.length > 0) {
                        return;
                    }

                    if (
                        (selector && _z(el).is(selector) && passCallback(el)) ||
                        (!selector && passCallback(el)) ||
                        (!!selector && _z(el).is(selector) && (!cb || !_z.isFunction(cb)))
                    ) {
                        $return.push(el);
                        return false;
                    }
                });

                let newInstance = this.newSelector($return.length > 0 ? $return[0] : []);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },

            // get previous element
            prev: function prev($val) {
                let elm = this,
                    $return = [];
                _z.elementMap(elm, function (e) {
                    if (e['previousElementSibling']) {
                        if (_z.isset($val)) {
                            _z.for([e['previousElementSibling']], function (k, v) {
                                if (_z.isDOM($val) && v['isEqualNode'] && v['isEqualNode']($val)) {
                                    $return.push(v);
                                } else if (_z.isString($val) && matches(v, $val)) {
                                    $return.push(v);
                                }
                            });
                        } else {
                            $return.push(e['previousElementSibling']);
                        }
                    }
                });

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = "";

                return newInstance;
            },
            // previous: function () {
            //     return this.prev.apply(this, arguments);
            // },

            // is equal elements ?
            is: function isEqual($val) {
                let elm = this,
                    $return = 0;
                $val = _z.is_z($val) || _z.isDOM($val) || _z.isArray($val) || _z.isString($val) ? _z($val) : false;

                if (!$val) {
                    return false;
                }

                _z.elementMap(elm, function (e) {
                    _z.elementMap($val, function (e2) {
                        if (_z.isDOM(e2)) {
                            $return += _z.toNum(e['isEqualNode'] && e['isEqualNode'](e2));
                        } else if (_z.isTypes('selector', e2) && matches(e, e2)) {
                            ++$return;
                        }
                    }, _e => _z.isDOM(_e) || _z.isString(_e));
                });

                $return = _z.toNum($return) || 0;
                return elm.length && elm.length === $return;
            },

            // parent of element ( direct parent )
            parent: function elementParent(selector) {
                let elm = this,
                    $return = [];
                selector = selector || "";

                _z.elementMap(elm, function (e) {
                    if (!!selector && e['parentNode'] && _z(e['parentNode']).is(selector)) {
                        $return.push(e['parentNode']);
                    } else if (!!selector && (!e['parentNode'] || !_z(e['parentNode']).is(selector))) {
                    } else if (!selector) {
                        $return.push(e['parentNode']);
                    }
                });

                let newInstance = this.newSelector(this.length === 1 ? $return[0] : $return);
                newInstance.args = arguments;
                newInstance.selector = selector;

                return newInstance;
            },

            // parents of element ( all parents )
            parents: function elementParents(selector) {
                let elm = this,
                    $return = [],
                    pElement = false;
                selector = selector || "";

                _z.elementMap(elm, function (e) {
                    pElement = e;
                    do {
                        pElement = pElement['parentNode'];

                        if (!!selector && pElement && _z.isDOM(pElement) && _z(pElement).is(selector)) {
                            if (!$return.includes(pElement)) {
                                $return.push(pElement);
                            }
                        } else if (!selector) {
                            $return.push(pElement);
                        }

                    } while (pElement && _z.isDOM(pElement));
                });

                if (!$return.length) {
                    $return = [];
                }

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = selector;

                return newInstance;
            },

            // parents of element ( until the selector )
            parentsUntil: function parentsUntil(selector, filter) {
                let elm = this,
                    $return = [];

                selector = selector || "";
                filter = filter || _z.trueFunction;

                _z.elementMap(elm, function (e) {
                    if (e && e["parentElement"]) {
                        e = e.parentElement;
                        while (e && !_z(e).is(selector) && e["parentElement"]) {
                            if (!filter || filter.callSelf(e)) {
                                $return.push(e);
                            }

                            e = e.parentElement;
                        }
                    }
                });

                if (!$return.length) {
                    $return = [];
                }

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.selector = selector;

                return newInstance;
            },

            // iframe contentDocument
            contents: function contents(elm) {
                elm = _z(elm || this);
                let $return = [];
                _z.elementMap(elm, e => e && e["contentDocument"] && $return.push(e.contentDocument));

                if (!$return.length) {
                    $return = [];
                }

                let newInstance = this.newSelector($return);
                newInstance.args = arguments;
                newInstance.head = elm.length === 1 ? elm[0] : elm;

                return newInstance;
            },

            // replace element with HTML
            replace: function replaceElement($html) {
                let elm = this,
                    $return = [];
                _z.elementMap(elm, function (e) {
                    if (e['outerHTML']) {
                        $return.push(_z(e).clone());
                        e['outerHTML'] = _z.is_z($html) ? $html.toHTML() : $html;
                    } else if (e['replaceWith']) {
                        $return.push(_z(e).clone());
                        e['replaceWith']($html);
                    }
                });

                return this.length === 1 ? $return[0] : $return;
            },

            // replace element with element
            replaceWith: function replaceElementWith($elm) {
                let elm = this;
                _z.elementMap(elm, function (e) {
                    _z.elementMap($elm, $e => e.parentNode.insertBefore($e, e));
                    e.parentNode.removeChild(e);
                });

                return this;
            },

        })
            .alias({
                remove: 'rem',
                siblings: 'brothers',
                previous: 'prev',
            })
            .prop();
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
