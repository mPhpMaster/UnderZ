(
    function (window, document) {
        var
            // document - private var
            doc = window.document || this.document || document || this;

        _z.join({
            // check if element has class
            hasClass: function hasClass(elm, className) {
                if (arguments.length === 1 || (
                    !!!className && elm
                )) {
                    className = elm;
                    elm = this;
                }

                let newClassName = className.trim().split(' ');
                className = newClassName.length === 1 ? className : newClassName;

                if (_z.isArray(className) && className.length) {
                    var $return = true;
                    _z(className).each(function () {
                        if ($return === false) return;

                        $return = _z(elm).hasClass(this);
                    });

                    return $return;
                }

                className = _z.trim(className);
                if (!!!className) return false;

                // className = ' ' + className + ' ';

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length)
                    return false;
                else if (!_z.is_z(elm))
                    elm = _z(elm);


                if (elm.length || elm.length) {
                    var $return = false;
                    (
                        _z.is_z(elm) ? elm : _z(elm)
                    ).each(function () {
                        if ($return !== false) return;

                        if (_z.isDOM(this))
                            $return = this.classList.contains(className);// (' ' + this.className + ' ');

                    });

                    return $return;
                }

                return false;
            },

            // add class to element
            addClass: function addClass(elm, className) {
                if (arguments.length === 1 || (
                    !!!className && elm
                )) {
                    className = elm;
                    elm = this;
                }
                let newClassName = className.trim().split(' ');
                className = newClassName.length === 1 ? className : newClassName;

                if (_z.isArray(className) && className.length) {
                    _z(className).each(function () {
                        _z(elm).addClass(this);
                    });

                    return this;
                }

                className = _z.trim(className);
                if (!!!className) return this;

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length)
                    return this;
                else if (!_z.is_z(elm))
                    elm = _z(elm);

                if (elm.length || elm.length) {
                    (
                        _z.is_z(elm) ? elm : _z(elm)
                    ).each(function () {
                        if (_z.isDOM(this) && !_z(this).hasClass(className))
                            this.className = _z.trim(this.className + ' ' + className);
                    });
                    return this;
                }
                return this;
            },

            // remove class from element
            remClass: function removeClass(elm, className) {
                if (arguments.length === 1 || (
                    !!!className && elm
                )) {
                    className = elm;
                    elm = this;
                }

                let newClassName = className.trim().split(' ');
                className = newClassName.length === 1 ? className : newClassName;

                if (_z.isArray(className) && className.length) {
                    _z(className).each(function () {
                        _z(elm).removeClass(this);
                    });

                    return this;
                }

                className = _z.trim(className);
                if (!!!className)
                    return this;

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length)
                    return this;
                else if (!_z.is_z(elm))
                    elm = _z(elm);

                if (elm.length || elm.length) {
                    (
                        _z.is_z(elm) ? elm : _z(elm)
                    ).each(function () {
                        if (_z.isDOM(this)) {
                            var newClass = ' ' + this.className.replace(/[\t\r\n]/g, ' ') + ' ';
                            if (_z(this).hasClass(className)) {
                                while (newClass.indexOf(' ' + className + ' ') >= 0)
                                    newClass = newClass.replace(' ' + className + ' ', ' ');

                                this.className = newClass.replace(/^\s+|\s+$/g, '');
                            }
                        }
                    });
                    return this;
                }
                return this;
            },

            // toggle class from element
            toggleClass: function toggleClass(elm, className) {
                if (arguments.length === 1 || (
                    !!!className && elm
                )) {
                    className = elm;
                    elm = this;
                }

                if (!!!className || !!!elm)
                    return this;

                let newClassName = className.trim().split(' ');
                className = newClassName.length === 1 ? className : newClassName;

                if (!_z.isArray(className))
                    className = [className];

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length)
                    return this;
                else if (!_z.is_z(elm))
                    elm = _z(elm);

                if (elm.length || elm.length) {
                    (
                        _z.is_z(elm) ? elm : _z(elm)
                    ).each(function () {
                        var $elm = this;
                        _z(className).each(function () {
                            if (_z.isDOM($elm))
                                $elm.classList.toggle(this);
                            else if (_z($elm).hasClass(this))
                                _z($elm).removeClass(this);
                            else
                                _z($elm).addClass(this);
                        });
                    });
                    return this;
                }
                return this;
            },

            // toggle class from element
            classList: function classList(elm, unique) {
                if (arguments.length === 1 && !_z.isDOM(elm) && !_z.is_z(elm)) {
                    unique = elm;
                    elm = this;
                }
                elm = elm || this;
                unique = unique === false ? false : (
                    unique || true
                );
                var $classList = [];

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length)
                    return $classList;
                else if (!_z.is_z(elm))
                    elm = _z(elm);

                if (elm.length || elm.length) {
                    (
                        _z.is_z(elm) ? elm : _z(elm)
                    ).each(function () {
                        if (_z.isDOM(this))
                            $classList.add(..._z.toArray(this.classList || []));
                    });
                }
                return unique && $classList.unique() || $classList;
            },

            // css of element
            css: function css(elm, $var, $val) {
                if (_z.isset(elm)) {
                    if (_z.isDOM(elm)) elm = _z(elm);

                    if (!_z.is_z(elm)) {
                        if (_z.isset($var)) $val = $var;

                        $var = elm;
                        elm = this;
                    }
                } else elm = this;

                elm = (
                    _z.is_z(elm) ? elm :
                        (
                            (
                                _z.isDOM(elm) || _z.isArray(elm)
                            ) ? _z(elm) : false
                        )
                );
                if (elm === false) return this;

                // get style
                if ($var && !!!_z.isObject($var)) {
                    $var = _z.cssPropName($var);
                    // $var = _z.$underz.prepareCSS( _z($var) );
                    var $return = [];

                    _z.elementMap(elm, function (e) {
                        if (_z.isset($val)) {
                            if (e['style'])
                                e['style'][$var] = _z.isFunction($val) ? $val.apply(e, arguments) : $val;
                        } else
                            $return.push((
                                (
                                    compStyle(e, null) || e.currentStyle
                                )[$var] || ""
                            ));
                    });

                    return _z.isset($val) ? this : (
                        elm.length === 1 ? (
                            $return[0] || ""
                        ) : $return
                    );
                } else if ($var && _z.isObject($var)) {
                    _z.elementMap(elm, function (e, k) {
                        _z.for($var, function ($k, $v) {
                            _z(e).css($k, $v);
                        });
                    });
                    return this;
                }

                var $return = [];
                if (elm.length > 1) {
                    elm.each(function () {
                        $return.add(..._z.toArray(_z(this).css()));
                    });
                    return $return;
                }

                var $var = $var || false;
                var sheets = doc.styleSheets, o = [];
                if (sheets.length > 0)
                    for (var i = 0, _sl = sheets.length; i < _sl; i++) {
                        var rules = sheets[i].rules || sheets[i].cssRules;
                        if (rules.length > 0)
                            for (var r = 0, _rl = rules.length; r < _rl; r++) {
                                _z.elementMap(elm, function (e, k) {
                                    o[k] || (
                                        o[k] = {}
                                    );
                                    if (elmFunc.matches(e, rules[r].selectorText)) {
                                        var pcss1 = elmFunc.prepareCSS(rules[r].style) || {},
                                            pcss2 = _z(e).attr('style');
                                        pcss2 = pcss2 ? (elmFunc.prepareCSS(pcss2) || {}) : {};

                                        o[k] = _z.extend(o[k], pcss2, pcss1);
                                    }
                                }, trueFunction);
                            }
                    }

                if ($var) {
                    _z.elementMap(elm, function (e, k) {
                        if (o.length) {
                            o[k] || (
                                o[k] = {}
                            );

                            if (o[k] && (
                                $var in o[k]
                            ))
                                o[k] = o[k][$var];
                            else
                                o[k] = "";
                        } else
                            o[k] = {};
                    });
                }

                return elm.length === 1 ? o[0] : o;
            },
        })
            .alias({removeClass: "remClass"})
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
