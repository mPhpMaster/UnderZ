(
    function (window, document) {
        const gVar = window && window.gVar || {};

        _z.join({
            // get default display css value
            defaultDisplayStyle: function defaultDisplayStyle(tag) {
                tag = tag || this.element(0).tagName || false;
                if (!tag) {
                    return '';
                }

                gVar["defaultDisplayStyleLog"] = gVar["defaultDisplayStyleLog"] || {};
                tag = String(tag).replace(/^\s+|\s+$/g, '');

                if (_z.isset(gVar["defaultDisplayStyleLog"][tag])) {
                    return gVar["defaultDisplayStyleLog"][tag];
                }

                let iframe = document.createElement('iframe');
                iframe.setAttribute('frameborder', 0);
                iframe.setAttribute('width', 0);
                iframe.setAttribute('height', 0);
                document.documentElement.appendChild(iframe);

                let doc = (iframe.contentWindow || iframe.contentDocument).document;

                // IE support
                doc.write();
                doc.close();

                let testEl = doc.createElement(tag);
                doc.documentElement.appendChild(testEl);
                let display = (_z.compStyle(testEl, null) || testEl.currentStyle || {display: null}).display;
                iframe.parentNode.removeChild(iframe);

                gVar["defaultDisplayStyleLog"][tag] = display;
                return display;
            },

            // hide element
            hide: function hide(elm) {
                elm = elm || this;

                if (!_z.isDOM(elm) && !elm.length && !elm.length) {
                    return false;
                }

                if (elm.length || elm.length) {
                    _z(elm).each(function () {
                        if (_z.isDOM(this)) {
                            this.style.display = 'none';
                        }
                    });
                }

                return this;
            },

            // show element
            show: function show(elm, displayStyle) {
                displayStyle = _z.getSet(displayStyle, _z.is_z(elm) ? false : elm);
                elm = (_z.is_z(elm) ? elm : this) || false;

                if (!_z.isDOM(elm) && !elm.length && !elm.length) {
                    return false;
                }

                if (elm.length || elm.length) {
                    elm = elm.length ? elm : _z(elm);
                    elm.each(function () {
                        if (_z.isDOM(this)) {
                            this.style.display = displayStyle || elm.defaultDisplayStyle();
                        }
                    });
                }

                return this;
            },

            // toggle show/hide
            toggle: function toggle(elm, displayStyle) {
                displayStyle = _z.getSet(displayStyle, (_z.is_z(elm) ? 'toggle' : elm) || 'toggle');
                elm = (_z.is_z(elm) ? elm : this) || false;

                if (!_z.isDOM(elm) && !elm.length && !elm.length) {
                    return this;
                }

                if (elm.length || elm.length) {
                    _z(elm).each(function () {
                        if (_z.isDOM(this)) {
                            let display;
                            if (displayStyle === 'toggle') {
                                display = (_z.compStyle(this, null) || this.currentStyle || {display: null}).display === 'none' ?
                                    (_z(this).defaultDisplayStyle() || '') : 'none';
                            } else {
                                display = displayStyle || (_z(this).defaultDisplayStyle() || '');
                            }

                            this.style.display = display;
                        }
                    });
                }

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
