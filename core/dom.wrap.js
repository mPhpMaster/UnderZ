(
    function (window, document) {
        // Wrap DOM functions
        _z.join({
            // wrap element
            wrap: function wrap($elm) {
                if (!_z.isset($elm) || !($elm = _z($elm)).isDOMElement() || !this.length) {
                    return this;
                }

                _z.elementMap(this, function (e) {
                    try {
                        _z(e).before($elm);
                        _z($elm).append(e);
                    } catch (er) {
                    }
                });

                return this;
            },

            // unwrap element
            unwrap: function unwrap() {
                _z.elementMap(this, function (e) {
                    try {
                        let parent = _z(e).parent();
                        if (!parent.is("body")) {
                            parent.before(parent.children());
                            parent.remove();
                        }
                    } catch (er) {
                    }
                });

                return this;
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
