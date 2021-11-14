(
    function (window, document) {
        const __selection = function __selection(mod) {
            mod = mod || 0;
            let retFalse = [
                () => !(_z.cookie.get('selection') != 'on'),
                () => {
                },
            ];

            this.each(function () {
                if (typeof this.onselectstart != 'undefined') {
                    this.onselectstart = retFalse[mod] || mod[0];
                } else if (typeof this.style.MozUserSelect != 'undefined') {
                    this.style.MozUserSelect = 'none';
                } else {
                    this.onmousedown = retFalse[mod] || mod[0];
                }
            });

            return this;
        };

        _z.join({ // selection enabled/disabled
            selection: function selection(mod) {
                if (!("cookie" in _z)) {
                    return this;
                }

                mod = mod || 0;
                this.each(function () {
                    __selection.call(_z(this).parents(), mod);
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
