(
    function (window, document) {
        const version = _z.$.underZ;

        // todo: use one function for element matches
// all registeredEvents
        const events = {
            lastEvent: version,
            // addEventListener
            register: function eventListenerHandler(data) {
                if (!_z.isObject(data) || !data['eventName'] || !data['element']) {
                    return false;
                }

                let eventName, target = data['element'];
                let listenerMethod = (eventName = data['eventName']) && target.addEventListener ||
                    (eventName = 'on' + data['eventName']) && target.attachEvent ||
                    (eventName = data['eventName']) && _z.emptyFunction;
                let removeMethod = target.removeEventListener || target.detachEvent || _z.emptyFunction;

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

                if (target.addEventListener) {
                    arg.push(false);
                }

                events.add(registerData);
                listenerMethod.apply && listenerMethod.apply(target, arg);
                return true;
            },

            // removeEventListener
            unRegister: function eventUnListenerHandler(data) {
                if (!_z.isObject(data)) {
                    return false;
                }
                let rEL = events.find(data);

                if (!rEL) {
                    return false;
                } else if (rEL.length) {
                    _z.for(rEL, function (ELK, ELV) {
                        ELV['remover'] && _z.isFunction(ELV['remover']) && ELV['remover']();
                    });
                } else if (rEL['remover']) {
                    rEL['remover'] && _z.isFunction(rEL['remover']) && rEL['remover']();
                }

                return true;
            },

            data: {},

            find: function findRegisteredEvents(fn) {
                let ev = this.data,
                    $return = [];

                let dataID = fn['dataID'] || false;

                if (dataID && !ev[dataID]) {
                    return false;
                } else {
                    fn = dataID && ev[dataID] ? [ev[dataID]] : fn;
                }

                _z.for(ev, function (k, v) {
                    if (_z.isFunction(fn) && v['realcallback'] && v['realcallback'] === fn) {
                        $return.push(v);
                    } else if (_z.isObject(fn)) {
                        let $return2 = {};
                        _z.for(fn, function ($k, $v) {
                            if (v[$k] != $v && $k != "alias") {
                                $return2 = false;
                                return false;
                            } else if ($k == "alias" && _z.size($v) > 0) {
                                $v = !_z.isArray($v) ? $v.split(".") : $v;
                                let rAlies = v["alias"] || [];
                                if (_z.size(rAlies) > 0) {
                                    let match = [];
                                    _z.for($v, function (vAI, vAV) {
                                        if (rAlies.includes(vAV)) {
                                            match.push(vAV);
                                        } else {
                                            return false;
                                        }
                                    });

                                    if (match.length !== $v.length) {
                                        match = [];
                                    }
                                } else {
                                    $return2 = false;
                                    return false;
                                }

                                $return2 = !!match.length;
                                return false;
                            } else {
                                $return2[$k] = $v;
                            }
                        });

                        if ($return2 !== false) {
                            $return.push(v);
                        }
                    }
                });

                return $return || false;
            },

            add: function addRegisteredEvents(data) {
                data = arguments.length === 1 && _z.isArray(data) ? data : {name: data};
                let _data = {
                    element: data['element'] || false,
                    eventName: data['eventName'] || data['name'] || false,
                    qselector: data['qselector'] || "",
                    alias: data['alias'] || [],
                    proxyCallback: data['proxyCallback'] || data['realcallback'] || false,
                    realcallback: data['callback'] || data['realcallback'] || false,
                };
                _data['eventNameMethod'] = data['eventNameMethod'] || _data['eventName'] || false;
                let remover = data['remover'] || _z.emptyFunction;
                let fName = 'cb' + _z.time();

                while (_z.isset(this.data[fName])) {
                    fName = 'cb' + _z.time() + '_' + _z.size(this.data);
                }

                _data['remover'] = function () {
                    remover();
                    delete events.data[fName];
                };

                this.data[fName] = _data;

                return this.data[fName]['realcallback'] || true;
            },

            getEventName: function eventNameWithOutAlias(eventName) {
                if (!eventName || !_z.isString(eventName)) {
                    return false;
                }

                let alias = (eventName = eventName.split(".")).splice(1);
                return eventName[0] || "";
            },

            getAlias: function eventNameAlias(eventName) {
                if (!eventName || !_z.isString(eventName)) {
                    return false;
                }

                let alias = (eventName = eventName.split(".")).splice(1);
                return alias || [];
            },

            dispatch: function dispatchEvent(event, data) {
                if (!event || !(e = this)) {
                    return false;
                }

                if (e instanceof EventTarget) {
                    events.lastEvent = undefined;
                    let dE = e.dispatchEvent(event/*, true*/);
                    events.lastEvent = version;
                    return dE;
                } else {
                    let _elmentWithNS = events.find(data || {
                        element: e,
                        eventName: event.type || false,
                    });

                    if (_z.size(_elmentWithNS) === 0) {
                        return false;
                    } else {
                        _z.for(_elmentWithNS, function (_Index, _e) {

                            let eventName = events.getEventName(_e["eventName"]);
                            events.lastEvent = undefined;
                            let cb = _e["proxyCallback"] || _e["realcallback"] || _z.emptyFunction;
                            cb['apply'] && cb.apply(_e["element"], [event, _e["alias"]]);
                            events.lastEvent = version;
                        });
                    }
                }

                return true;
            },

            createEventAndDispatch: function createEventAndDispatch(e, eventName) {
                try {
                    // if( _z.hasVar(e, eventName) && _z.isFunction(e[eventName]) )
                    //     e[eventName](event, alias);
                    // else
                    // todo: must try to call element.eventname first
                    //     events.dispatch.apply(e, [event, { element: e, eventName: eventName, alias: alias }]);

                    let alias = events.getAlias(eventName),
                        aliasQry = alias.length ? ("." + alias.join(".")) : "";
                    eventName = events.getEventName(eventName);
                    events.lastEvent = version;
                    let _doc = e.ownerDocument ? e.ownerDocument : e;
                    if (e.dispatchEvent && _z.hasVar(_doc, "createEvent")) {
                        let event = _doc.createEvent(["click", "mousedown", "mouseup"].inArray(eventName) > -1
                            ? "MouseEvents"
                            : "HTMLEvents");
                        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

                        event.synthetic = true; // allow detection of synthetic events
                        // The second parameter says go ahead with the default action
                        // e.dispatchEvent(event, true);
                        return events.dispatch.apply(e, [event, {element: e, eventName: eventName, alias: alias}]);
                    } else if (e.fireEvent && _z.hasVar(_doc, "createEventObject")) {
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

                        if (_z.size(_elmentWithNS) === 0) {
                            return false;
                        } else {
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
                                e.dispatchEvent(event/*, true*/);

                                if (events.lastEvent === undefined) {
                                    let cb = _e["proxyCallback"] || _e["realcallback"] || _z.emptyFunction;
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
        };

        _z.join({
            // trigger an event
            trigger: function triggerEvent(eventName) {
                let elm = this;
                eventName = eventName || false;
                if (!eventName) {
                    return this;
                }

                // handle multi event
                if (_z.isString(eventName) && eventName.split(" ").length > 1) {
                    eventName = eventName.split(" ");
                }

                if (_z.isArray(eventName)) {
                    eventName = _z.filter(eventName).toArray();

                    _z.for(eventName, function (eKey, eName) {
                        _z(elm).trigger(eName);
                    });

                    return this;
                }

                let _alias = [], alias = [];
                if (alias.length) {
                    _alias = alias;
                    alias = [];
                }

                alias = events.getAlias(eventName);
                let aliasQry = alias.length ? "." + alias.join(".") : "";
                eventName = events.getEventName(eventName);

                let elmentWithNS = [];
                if (alias.length) {
                    _z.for(elm, function (Index, e) {
                        let needleData = {};
                        e && (needleData['element'] = e);
                        eventName && (needleData['eventName'] = eventName);
                        alias && (needleData['alias'] = alias);
                        let _elmentWithNS = events.find(needleData);

                        if (_z.size(_elmentWithNS) === 0) {
                            return;
                        } else {
                            elmentWithNS.push(_elmentWithNS);
                            _z.for(_elmentWithNS, function (_Index, _e) {
                                eventName = events.getEventName(_e["eventName"]);
                                let NSalias = _e["alias"];
                                let NSaliasQry = NSalias.length ? "." + NSalias.join(".") : "";
                                let event = (e.ownerDocument ? e.ownerDocument : e).createEvent('HTMLEvents');
                                event.initEvent(eventName + NSaliasQry, true, true);
                                try {
                                    event.synthetic = true;
                                    events.lastEvent = undefined;
                                    if (e.dispatchEvent) {
                                        e.dispatchEvent(event);
                                    } else {
                                        event = {target: e, type: eventName + NSaliasQry};
                                    }

                                    if (events.lastEvent === undefined) {
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

                _z.elementMap(elm, function (e) {
                    // todo: must try to call element.eventname first
                    events.createEventAndDispatch(e, eventName + aliasQry);
                }, _z.trueFunction);

                return this;
            },

            // attach an event
            on: function attachEvent(eventName, qselector, callback) {
                let elm = this,
                    alias = [];

                eventName = eventName || false;
                qselector = qselector || false;
                callback = callback || false;

                // if multi elements
                if (eventName && _z.isObject(eventName) && arguments.length < 2) {
                    _z.for(eventName, function (eName, eCB) {
                        if (_z.isFunction(eCB)) {
                            _z(elm).on(eName, eCB);
                        } else if (_z.isObject(eCB)) {
                            _z.for(eCB, function (eSelector, eCB_) {
                                if (_z.isFunction(eCB_)) {
                                    _z(elm).on(eName, eSelector, eCB_);
                                }
                            });
                        }
                    });
                    return this;
                }

                if (!eventName && !qselector) {
                    return this;
                }

                if (arguments.length === 2 && _z.isFunction(qselector)) {
                    callback = qselector;
                    qselector = false;
                }

                if (!_z.isFunction(callback)) {
                    return this;
                }

                // handle multi event
                if (_z.isString(eventName) && eventName.split(" ").length > 1) {
                    eventName = eventName.split(" ");
                }

                if (_z.isArray(eventName)) {
                    let oldArgs = _z.filter([eventName, qselector || "", callback || ""]).toArray();

                    _z.for(eventName, function (eKey, eName) {
                        oldArgs.shift();
                        oldArgs.unshift(eName);
                        _z(elm).on(...oldArgs);
                    });
                    return this;
                }

                alias = events.getAlias(eventName);
                let aliasQry = alias.length ? "." + alias.join(".") : "";
                eventName = events.getEventName(eventName);

                // .on("hover")
                if (eventName === "hover") {
                    eventName = "mouseenter" + aliasQry + " mouseleave" + aliasQry;
                    return _z(elm).on(...[eventName, qselector || "", callback || ""].filter(x => x));
                }

                _z.elementMap(elm, function (e) {
                    let elms = e;
                    if (!elms) {
                        return this;
                    }

                    let proxyCallback = function proxyCallback(event) {
                        if (events.lastEvent && events.lastEvent !== version) {
                            return;
                        }

                        if (events.lastEvent !== version) {
                            console.info("Event: ", events.lastEvent);
                        }

                        events.lastEvent = events.lastEvent === version ? version : event;
                        let eventName = events.getEventName(event.type);
                        if (qselector && event && event.target && _z(event.target).parents(qselector).addBack(qselector).length || !qselector) {
                            return callback.call(event.target, event);
                        }
                    };

                    events.register({
                        element: elms,
                        eventName: eventName,
                        qselector: qselector,
                        alias: alias,
                        proxyCallback: proxyCallback,
                        realcallback: callback,
                    });
                }, _z.trueFunction);

                return this;
            },

            // deattach an event
            un: function attachEvent(eventName, qselector, callback) {
                let elm = this;
                eventName = eventName || false;
                qselector = qselector || false;
                callback = callback || false;

                if (!eventName && !qselector && arguments.length < 1) {
                    return this;
                }

                // .un(callback)
                if (arguments.length === 1 && _z.isFunction(eventName)) {
                    callback = eventName;
                    qselector = false;
                    eventName = "*";
                }

                // .un(eventName, callback)
                if (arguments.length === 2) {
                    if (_z.isFunction(qselector) || (_z.isArray(qselector) && _z.isFunction(qselector[0]))) {
                        callback = qselector;
                        qselector = false;
                    }
                }

                // handle multi event
                if (_z.isString(eventName) && eventName.split(" ").length > 1) {
                    eventName = eventName.split(" ");
                }

                if (_z.isArray(eventName)) {
                    let oldArgs = _z.filter([eventName, qselector || "", callback || ""]).toArray();

                    _z.for(eventName, function (eKey, eName) {
                        oldArgs.shift();
                        oldArgs.unshift(eName);
                        _z(elm).un(...oldArgs);
                    });
                    return this;
                }

                let alias = events.getAlias(eventName);
                let aliasQry = alias.length ? "." + alias.join(".") : "";
                eventName = events.getEventName(eventName);

                // .un("hover")
                if (eventName === "hover") {
                    eventName = "mouseenter" + aliasQry + " mouseleave" + aliasQry;
                    return _z(elm).un(...[eventName, qselector || "", callback || ""].filter(x => x));
                }

                // hamdle multi callback
                if (callback && _z.isArray(callback)) {
                    let oldArgs = _z.filter([eventName + aliasQry, qselector || "", callback || ""]).toArray();

                    _z.for(callback, function (cKey, cName) {
                        oldArgs.pop();
                        oldArgs.push(cName);
                        _z(elm).un(...oldArgs);
                    });
                    return this;
                }

                _z.elementMap(elm, function (e) {
                    let needleData = false;

                    if (needleData === false) {
                        needleData = {};
                        e && (needleData['element'] = e);
                        eventName && (needleData['eventName'] = eventName);
                        qselector && (needleData['qselector'] = qselector);
                        callback && (needleData['realcallback'] = callback);
                        alias && (needleData['alias'] = alias);
                    }

                    try {
                        needleData && events.unRegister(needleData);
                    } catch (__error) {
                    }

                }, _z.trueFunction);

                return this;
            },

            // attach an event once
            // todo: check the arguments
            once: function once(eventName, qselector, callback) {
                let elm = this;

                if (!_z.isFunction(callback)) {
                    if (_z.isFunction(qselector)) {
                        callback = qselector;
                        qselector = false;
                    } else {
                        return elm;
                    }
                }

                let cb = function callBackProxy() {
                    elm.un(eventName, qselector, cb);
                    return callback.apply(this, arguments);
                };

                return elm.on(eventName, qselector, cb);
            },

            // trigger event
            callEvent: function callEvent(evt) {
                evt = evt || false;
                if (!evt) {
                    return this;
                }

                let alias = events.getAlias(evt);
                let aliasQry = alias.length ? "." + alias.join(".") : "";
                evt = events.getEventName(evt);

                events.lastEvent = version;

                return this.each(function (evtN, alias, elm) {
                    if (alias.length) {
                        let needleData = {};
                        this && (needleData['element'] = this);
                        evtN && (needleData['eventName'] = evtN);
                        alias && (needleData['alias'] = alias);
                        let _elmentWithNS = events.find(needleData);

                        if (_z.size(_elmentWithNS) === 0) {
                            return;
                        }

                        return _z.for(_elmentWithNS, function (_Index, _e) {
                            evtN = events.getEventName(!evtN ? _e['eventName'] : evtN);

                            elm.callEvent(evtN);
                        });
                    }

                    let _doc;
                    if (_z.hasVar(this, 'ownerDocument') && _z.hasVar(_doc = this.ownerDocument, 'createEvent') || _z.hasVar(_doc = document, 'createEvent')) {
                        let evt = _doc.createEvent('MouseEvents');
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
                    } else if (_z.hasVar(this, evtN)) {
                        this[evtN](); // IE Boss!

                    } else if (_z.hasVar(this, "on" + evtN)) {
                        this["on" + evtN](); // IE Boss!

                    }

                }, [evt, alias, this]);
            },

            // trigger keyboard event
            callKEvent: function callKEvent(evt, evtData) {
                evt = evt || false;
                evtData = evtData || false;

                if (!evt) {
                    return this;
                }

                let alias = events.getAlias(evt);
                let aliasQry = alias.length ? "." + alias.join(".") : "";
                evt = events.getEventName(evt);


                return this.each(function (evtN, evtD, alias, elm) {
                    if (alias.length) {
                        let needleData = {};
                        this && (needleData['element'] = this);
                        evtN && (needleData['eventName'] = evtN);
                        alias && (needleData['alias'] = alias);
                        let _elmentWithNS = events.find(needleData);

                        if (_z.size(_elmentWithNS) === 0) {
                            return;
                        }
                        return _z.for(_elmentWithNS, function (_Index, _e) {
                            evtN = events.getEventName(!evtN ? _e['eventName'] : evtN);

                            elm.callKEvent(evtN, evtD);
                        });
                    }

                    events.lastEvent = version;
                    if (_z.hasVar(document, 'createEvent')) {
                        let keyboardEvent = document.createEvent("KeyboardEvent");
                        let initMethod = typeof (keyboardEvent.initKeyboardEvent) !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

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
                        events.dispatch.apply(this, [keyboardEvent, {element: this, eventName: evtN, alias: alias}]);
                    } else if (_z.hasVar(this, evtN)) {
                        this[evtN](evtD, alias); // IE Boss!

                    } else if (_z.hasVar(this, "on" + evtN)) {
                        this["on" + evtN](evtD, alias); // IE Boss!

                    }
                }, [evt, evtData, alias, this]);
            },

            // on DOM change event
            domchange: function DOMChange(func) {
                if (!_z.isFunction(func)) {
                    throw new Error(func + " Is not function!!");
                }

                return this.on("DOMSubtreeModified", func);
            },

            // un DOM change event
            undomchange: function unBindDOMChange(func) {
                let arg = ["DOMSubtreeModified"];
                if (_z.isFunction(func)) {
                    arg.push(func);
                }

                return this.un(...arg);
            },
        })
            .prop();

// shortcuts functions
        _z.join(
            // on && un functions
            ..._z.for([
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
                        return arguments.length ? this.on(event, callback) : this.trigger(event);
                    },
                };
            }), {

                // mouse hover
                hover: function hover(enterCB, outCB) {
                    if (!arguments.length) {
                        return this.trigger("mouseenter mouseleave");
                    }

                    if (_z.isFunction(enterCB)) {
                        this.on("mouseenter", enterCB);
                    }

                    if (_z.isFunction(outCB)) {
                        this.on("mouseleave", outCB);
                    }

                    return this;
                },

                // form submit
                submit: function onSubmit(event) {
                    if (!arguments.length) {
                        return this.trigger("submit");
                    }

                    if (_z.isFunction(event)) {
                        let warpper = function submit(e) {
                            let res = event.call(this, ...arguments);
                            if (res === false) {
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
