(
    function (window, document) {
// serialize data options
        _z.join({
            // global serialize settings
            serializeSetting: {
                // do not serialize these
                not: [
                    '[type="file"]',
                    '[type="reset"]',
                    '[type="submit"]',
                    '[type="button"]',
                    ':disabled',
                    '[readonly]',
                    '[type="checkbox"]:not(:checked)',
                    '[type="radio"]:not(:checked)',
                ],
            },

        })
            .core();

// serialize data
        _z.join({
            // serialize Json
            // serializeJson: function serializeJson(elm) {
            //
            // },

            // serialize array
            serializeArray: function serializeArray(elm) {
                var field, length, $return = [];
                elm = _z.is_z(this) ? this : _z(elm);

                _z.elementMap(elm, function (e) {
                    try {
                        if (!e['elements']) return;

                        $currentGroup = _z(e.elements);
                        if (_z.serializeSetting && _z.size(_z.serializeSetting))
                            _z.for(_z.serializeSetting, function (ssk, ssv) {
                                if ($currentGroup[ssk])
                                    $currentGroup = $currentGroup[ssk](ssv);
                            });

                        $currentGroup.for(function (IK, input) {
                            if ((
                                input = _z(input)
                            ) && input.prop('name')) {
                                var _IVal = input.val();
                                _IVal = _z.isArray(_IVal) ? _IVal : [_IVal];
                                _z.for(_IVal, (_IValK, _IValV) => {
                                    $return.push({name: input.prop('name'), value: _IValV});
                                });
                            }
                        });

                    } catch (err) {
                    }
                }, (f) => _z(f).is('form'));

                return $return;
            },

            // serialize string
            serialize: function serialize(elm) {
                var field, length, $return = [];
                elm = _z.is_z(this) ? this : _z(elm);

                _z.elementMap(elm, function (e) {
                    try {
                        if (!e['elements']) return;

                        $currentGroup = _z(e.elements);
                        if (_z.serializeSetting && _z.size(_z.serializeSetting))
                            _z.for(_z.serializeSetting, function (ssk, ssv) {
                                if ($currentGroup[ssk])
                                    $currentGroup = $currentGroup[ssk](ssv);
                            });

                        $currentGroup.for(function (IK, input) {
                            if ((
                                input = _z(input)
                            ) && input.prop('name')) {
                                var _IVal = input.val();
                                _IVal = _z.isArray(_IVal) ? _IVal : [_IVal];
                                _z.for(_IVal, (_IValK, _IValV) => {
                                    $return.push(encodeURIComponent(input.prop('name'))
                                        + "="
                                        + encodeURIComponent(_IValV));
                                });
                            }
                        });

                    } catch (err) {
                    }
                }, (f) => _z(f).is('form'));

                return $return.join("&").replace(/%20/g, "+");
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
