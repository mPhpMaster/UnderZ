(
    function (window, document) {
        // DOM functions
        _z.join({
            // scroll To element
            scrollTo: function scrollToElement(elm/* , eIdx */) {
                if (!_z.isset(elm) && !_z.isset(this['underZ'], this['element'])) {
                    return false;
                }

                let topOfElement,
                    $return = false;

                // check if elm is Top
                if (_z.isNumber(elm)) {
                    topOfElement = elm;
                    elm = undefined;
                }

                let scroller = _z.isset(this['underZ'], this['element']) && !_z.isWindow(this)
                    ? this.filter($e => _z($e).isShow() && _z.isDOM($e)).element(0)
                    : window;

                if (_z.isset(elm) && !_z(elm).isDOMElement(true) && !_z.isNumber(elm)) {
                    return _z.isset(this['underZ'], this['element']) ? this : _z(scroller);
                }

                if (_z.isset(elm) && _z(elm).isDOMElement()) {
                    elm = _z(elm).filter($e => _z($e).isShow() && _z.isDOM($e));
                }

                if (_z.isset(scroller) && !_z(scroller).isDOMElement(true)) {
                    scroller = window;
                }

                try {
                    let scrollIntoView;

                    if (_z.isset(elm) && _z.isFunction((scrollIntoView = elm.prop('scrollIntoView')))) {
                        scrollIntoView.call(elm[0]);
                        return _z(elm[0]);
                    } else if (
                        scroller &&
                        (arguments.length === 0 || (!_z.isset(elm) && !_z.isNumber(topOfElement))) &&
                        _z.isDOM(scroller) &&
                        _z.isFunction((scrollIntoView = _z(scroller).prop('scrollIntoView')))
                    ) {
                        scrollIntoView.call(scroller);
                        return _z(scroller);
                    }

                    let $returnTester = _z.isset(elm) ? elm.rect('top') : 1;
                    topOfElement = topOfElement || $returnTester;
                    if (topOfElement === $returnTester) {
                        $return = _z(elm.element(0));
                    }

                    $returnTester = _z(scroller).rect('top');
                    topOfElement = topOfElement || $returnTester;
                    if (topOfElement === $returnTester) {
                        $return = _z(_z(scroller).element(0));
                    }

                    if (_z.isArray(topOfElement)) {
                        topOfElement = topOfElement[0];
                    }

                    if (_z.isNumber(topOfElement)) {
                        if (_z.isWindow(scroller)) {
                            scroller.scroll(0, topOfElement);
                            return $return || _z(scroller);
                        } else if (_z.isset(scroller['scrollTop']) && !elm) {
                            scroller['scrollTop'] = topOfElement || 0;
                            return $return || _z(scroller);
                        } else if (_z.isset(scroller['scrollTop'])) {
                            scroller['scrollTop'] = (
                                (topOfElement + (Number(_z(scroller).scrollTop()) || 0)) - (Number(_z(scroller).rect('top')) || 0)
                            ) || topOfElement;

                            return $return || _z(scroller);
                        }

                    } else {
                        console.error('(dom.scroll.js:83) Element not found', [scroller, elm, topOfElement]);
                    }
                } catch (e) {
                    throw e;
                }

                return this;
            },
        })
            .prop()
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
