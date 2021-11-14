(
    function (window, document) {
        // DOM functions
        _z.join({
            /**
             * get all indexed element
             *
             * @example indexed(e,['','input']) => "[name$=']'][name^='total[']input"
             * @example indexed(e,['input','']) => "input[name$=']'][name^='total[']"
             * @example indexed(e) => "[name$=']'][name^='total[']"
             */
            getAllIndexedElements: function cssSelectorReadIndexedElements(elm, adds, selType, returnAs) {
                if (!elm) elm = this;

                elm = elm || false;
                returnAs = (returnAs || 'elements').toLowerCase();
                adds = adds || [];
                selType = selType || 'name';
                let $return = [];

                try {
                    elm = _z.isString(elm) ? _z("[" + selType + "^='" + elm + "['][" + selType + "$=']']") : elm;
                    adds = _z.isArray(adds) ? adds : [adds, ''];

                    str = false;

                    elm = _z(elm);
                } catch (e) {
                    return elm.info.selector;
                }

                if (elm && elm.length) {
                    _z.elementMap(elm, function (e) {
                        if (e && e[selType]) {
                            let str = e[selType].replace(/\[\d*?\]/g, '[') || false;

                            if (str) {
                                $return.push(
                                    adds.slice(0, parseInt(adds.length / 2)) +
                                    "[" + selType + "$=']']" +
                                    "[" + selType + "^='" + str + "']" +
                                    adds.slice(parseInt(adds.length / 2)),
                                );
                            }
                        }
                    }, _z.trueFunction);
                }

                $return = $return.join(', ') || "";
                return $return !== '' ? (returnAs === 'string' ? $return : _z($return)) : elm.info.selector;
            },

            // get index element in elements list
            getIndexByName: function indexOfElement(elms, elm) {
                elm = elm ? _z(arguments.length === 1 && elms ? elms : elm) : false;
                elms = arguments.length === 1 || !arguments.length ? this : (elms ? _z(elms) : false);

                if (elm !== false) {
                    return _z.inArray(elm.element(0), elms.element());
                }

                let newElm = _z((elm !== false ? elm : elms).subArray(-1));

                if (newElm.length === 0) {
                    return false;
                }

                let _name = newElm.attr('name') || newElm.attr('id') || "";
                let _ex;
                _name = (_ex = /\[(\d+)\]/.exec(_name)) != null
                    ? _ex[1]
                    : false;
                return _name;
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
