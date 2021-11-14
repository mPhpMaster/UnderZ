(
    function (window, document) {
        _z.join({
            // check if element has an attribute
            hasAttr: function hasAttr(elm, attrName) {
                var args = _z.argsFix(arguments, this, undefined);
                arguments = args("arguments");
                elm = args.call();
                attrName = args.call();

                if (_z.isArray(attrName) && attrName.length) {
                    var $return = true;
                    _z(attrName).each(function () {
                        if ($return === false) return;

                        $return = _z(elm).hasAttr(this);
                    });

                    return $return;
                }

                attrName = _z.trim(attrName);
                if (!!!attrName) return false;

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length) return false;
                else if (!_z.is_z(elm)) elm = _z(elm);

                if (elm.length || elm.length) {
                    var $return = false;
                    (
                        _z.is_z(elm) ? elm : _z(elm)
                    ).each(function () {
                        if ($return !== false) return;

                        if (_z.isDOM(this)) $return = this.hasAttribute(attrName);
                    });

                    return $return;
                }

                return false;
            },

            // remove attribute from element
            remAttr: function removeAttr(elm, attrName) {
                if (arguments.length === 1 || (
                    !!!attrName && elm
                )) {
                    attrName = elm;
                    elm = this;
                }

                if (_z.isArray(attrName) && attrName.length) {
                    _z(attrName).each(function () {
                        _z(elm).removeAttr(this);
                    });

                    return this;
                }

                attrName = _z.trim(attrName);
                if (!!!attrName || (
                    !_z.isDOM(elm) && !_z.is_z(elm) && !elm.length
                ))
                    return this;

                if (!_z.is_z(elm)) elm = _z(elm);

                if (elm.length || elm.length) {
                    (
                        elm
                    ).each(function () {
                        if (_z.isDOM(this)) this.removeAttribute(attrName);
                    });

                    return this;
                }

                return this;
            },

            // set & get attribute of an element
            attr: function attr(elm, attrName, attrValue) {
                var tunning = _z.argsFix(arguments, this, undefined);
                arguments = tunning("arguments");
                elm = tunning.call();
                attrName = tunning.call();
                attrValue = tunning.call();

                var attrValueExist = _z.isset(attrValue);
                // todo: if attrName is null
                attrName = _z.trim.call(attrName);
                _z.isset(attrValue) && !_z.isFunction(attrValue) && (
                    attrValue = _z.trim.call(attrValue)
                );

                if (!!!attrName) return false;

                if (!_z.isDOM(elm) && !_z.is_z(elm) && !elm.length) return false;

                if (!_z.is_z(elm)) elm = _z(elm);

                if (elm.length || elm.length) {
                    var $return = [];
                    _z.elementMap(elm, function (e) {
                        var $value = undefined;
                        if (_z.isFunction(attrValue)) {
                            var eValue = e.getAttribute(attrName);
                            $value = _z.isset($value = attrValue.call(e, attrName, eValue)) ? $value : eValue;
                        } else $value = attrValue;

                        if ( // checkbox || radio
                            e['tagName'] && _z.toLowerCase(e['tagName']) == 'input' &&
                            e['type'] &&
                            (
                                e['type'] == 'checkbox' || e['type'] == 'radio'
                            ) &&
                            _z.toLowerCase(attrName) == 'checked' && _z.isset($value)
                        )
                            e['checked'] = (
                                $value !== false && $value !== _z.trim.call(false)
                            ) ? $value = 'checked' : '';

                        if (_z.toLowerCase(attrName) == 'checked' && (
                            $value === false || $value === _z.trim.call(false)
                        ))
                            e.removeAttribute('checked');
                        else
                            $return.push(
                                (
                                    _z.isset($value) ? e.setAttribute(attrName, $value) : e.getAttribute(
                                        attrName)
                                ) || "",
                            );
                    });

                    return (
                        attrValueExist ? this : (
                            $return.length === 1 ? (
                                $return[0] || ""
                            ) : $return
                        )
                    );
                }

                return attrValueExist ? this : "";
            },

            // get all attributes
            attrs: function getAllElementAttributes() {
                var idxOF = "",
                    deleteAttr = -1,
                    returnAttr = -1,
                    obj = {},
                    thisElement = this;

                if (arguments.length === 2 || arguments.length === 3) {
                    if (
                        (
                            arguments[0] && (
                                _z.isTypes("string", arguments[0]) || _z.isTypes(true, arguments[0])
                            ) || true
                        ) &&
                        (
                            arguments[1] && (
                                _z.isTypes("string", arguments[1]) || _z.isTypes(true, arguments[1])
                            ) || true
                        )
                    ) {
                        deleteAttr = (
                            arguments[0] === true
                            || _z.toLowerCase(arguments[0]) == 'delete'
                            || _z.toLowerCase(arguments[1]) == 'delete'
                        );
                        returnAttr = (
                            arguments[1] === true
                            || _z.toLowerCase(arguments[0]) == 'return'
                            || _z.toLowerCase(arguments[1]) == 'return'
                        );
                    }
                    var _arguments = [];
                    _arguments = (
                        arguments[0] !== true && _z.toLowerCase(arguments[0]) != 'return' && _z.toLowerCase(
                            arguments[0]) != 'delete'
                    ) ? [...arguments] : subArray(1, [...arguments]);

                    if (!!!(
                        arguments[1]
                        !== true
                        && _z.toLowerCase(arguments[1])
                        != 'return'
                        && _z.toLowerCase(arguments[1])
                        != 'delete'
                    ))
                        _arguments = subArray(1, _arguments);

                    arguments = _arguments;
                }

                if (arguments.length === 1 && (
                    _z.isDOM(arguments[0]) || _z.is_z(arguments[0])
                )) {
                    thisElement = arguments[0];
                    arguments = [];
                } else thisElement = this;

                // search for attributes
                if (arguments.length === 1) {
                    if (arguments[0] && (
                        _z.isTypes("string", arguments[0]) || _z.isArray(arguments[0])
                    ))
                        idxOF = _z.toLowerCase(arguments[0]);

                    arguments = [];
                }

                if (arguments.length === 0) {
                    if (_z.size(thisElement) === 0) return null;

                    var pushIt = _z.size(thisElement) > 1;
                    obj = pushIt ? [] : {};

                    if (idxOF && _z.isArray(idxOF) && idxOF.length > 1) {
                        var $__return = {};
                        foreach(idxOF, function (__k, __v) {
                            var $__val = _z(thisElement).attrs(deleteAttr, returnAttr, __v);
                            $__return = _z.extend($__return, $__val);
                        });

                        return $__return;
                    }

                    _z(thisElement).each(function () {
                        var $elm = this;
                        var subObj = {};
                        _z.each(_z.toArray($elm.attributes), function () {
                            if (idxOF !== "") {
                                if (_z.isString(idxOF) && this.name.indexOf(idxOF) === -1)
                                    return;
                                else if (_z.isArray(idxOF) && idxOF.length === 1 && _z.toLowerCase(this.name) !== _z.toLowerCase(
                                    idxOF[0]))
                                    return;
                            }

                            if (this.specified) {
                                if (deleteAttr === true)
                                    $elm.removeAttribute(this.name);

                                if (
                                    (
                                        returnAttr === true && deleteAttr === true
                                    ) ||
                                    (
                                        returnAttr === true && deleteAttr === false
                                    ) ||
                                    (
                                        returnAttr === -1 && deleteAttr === -1
                                    )
                                ) {
                                    if (pushIt) subObj[this.name] = this.value;
                                    else obj[this.name] = this.value;
                                } else if (
                                    (
                                        returnAttr === false && deleteAttr === false
                                    ) ||
                                    (
                                        returnAttr === false && deleteAttr === true
                                    )
                                )
                                    obj = obj;
                            }
                        });

                        if (pushIt) {
                            subObj = [$elm, subObj];
                            obj.push(subObj);
                        }
                    });

                }

                return obj;
            },

        })
            .alias({removeAttr: "remAttr"})
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
