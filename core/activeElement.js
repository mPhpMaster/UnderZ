(
    function (window, document) {
        _z.join({
            // get current active dom element as _z()
            activeElement: function activeElement() {
                try {
                    return _z(document.activeElement);
                } catch (err) {
                    return _z();
                }
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
