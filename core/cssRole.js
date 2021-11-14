(
    function (window, document) {
        _z.join({
            // add css role in head
            cssRole: function cssRole(c) {
                if (!_z.isset(_z.cssRole['styleSheet'])) {
                    _z.cssRole['styleSheet'] = document.createElement('style');
                    document.head.appendChild(_z.cssRole['styleSheet']);
                }
                if (arguments.length === 0) return this;

                var styleSheet = _z.cssRole['styleSheet']['sheet'];

                c = _z.isArray(c) ? c : [c];
                _z.for(c, (_IDc, _Vc) => {
                    _Vc && styleSheet.insertRule(_Vc, 0);
                });

                return this;
            },

            cssPropName: function cssPropNameFix(prop, toJS) {
                return (toJS || false)
                    ? prop.replace(/([A-Z])/g, "-$1").toLowerCase()
                    : prop.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, (all, fst) => fst.toUpperCase()) || "";
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
