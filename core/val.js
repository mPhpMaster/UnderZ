(
    function (window, document) {
        _z.join({
            // get element/elements value(val) as number
            numval: function elementValueToNumber() {
                var $return = [];
                _z.elementMap(this, function (e) {
                    try {
                        $return.push(Number(e.value) || 0);
                    } catch (err) {
                    }
                });

                return this.length > 1 ? $return : $return[0];
            },

            // set element/elements value(val) if value = (IFVal)
            valIF: function elementValue(IFVal, val) {
                _z.elementMap(this, function (e) {
                    try {
                        if (_z.isFunction(IFVal)) {
                            if (IFVal(e.value, e)) {
                                e.value = val;
                            }
                        } else if (e.value == IFVal) {
                            e.value = val;
                        }

                    } catch (err) {
                    }
                });

                return this;
            },

            // sum all vallues
            sum: function sumValues(elm) {
                elm = elm || this;
                elm = _z.isDOM(elm) || _z.isArray(elm) || _z.is_z(elm)
                    ? _z(elm)
                    : (_z.isArray(elm) ? elm : false);

                if (!elm) {
                    elm = this;
                }
                if (!elm.length) {
                    return 0;
                }

                var $return = 0;
                _z.elementMap(elm, function (e) {
                    if (_z.isDOM(e)) {
                        $return += Number(e.value) || 0;
                    } else if (_z.isArray(e)) {
                        e.filter((x) => {
                            $return += Number(x.value) || 0;
                        });
                    } else if (_z.isNumber(e) || _z.isString(e)) {
                        $return += Number(e) || 0;
                    }

                }, () => true);

                return Number($return) || 0;
            },
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
