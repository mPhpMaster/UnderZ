(
    function (window, document) {
        // DOM functions
        _z.join({
            // element scrollTop
            scrollTop: function scrollTop(element) {
                element = _z.getSet(element, this);
                let $return = [];

                _z.elementMap(element, function (e) {
                    let w = _z.isWindow(e) ? e :
                        (e.nodeType === 9 ? (e.defaultView || e.parentWindow) : false);

                    $return.push((
                        w ? ('pageYOffset' in w ? w['pageYOffset'] : w.document.documentElement['scrollTop']) : e['scrollTop']
                    ) || 0);

                }, x => _z.isDOM(x) || _z.isWindow(x) || x.nodeType === 9);

                return element.length === 1 ? $return[0] : $return;
            },

            // element scrollLeft
            scrollLeft: function scrollLeft(element) {
                element = _z.getSet(element, this);
                let $return = [];

                _z.elementMap(element, function (e) {
                    let w = _z.isWindow(e) ? e :
                        (e.nodeType === 9 ? (e.defaultView || e.parentWindow) : false);

                    $return.push((
                        w ? ('pageXOffset' in w ? w['pageXOffset'] : w.document.documentElement['scrollLeft']) : e['scrollLeft']
                    ) || 0);

                }, x => _z.isDOM(x) || _z.isWindow(x) || x.nodeType === 9);

                return this.length === 1 ? $return[0] : $return;
            },

        })
            .prop();

        _z.join({

            // element rect (top/left/height/width)
            rect: function elementRect(scrolls) {
                scrolls = _z.isset(scrolls) ? scrolls : true;
                let elm = this,
                    $return = [],
                    returnKey = _z.isBoolean(scrolls) ? false : scrolls;
                scrolls = _z.isBoolean(scrolls) ? scrolls : true;

                _z.elementMap(elm, function (e) {
                    let tResult = {};

                    if (_z.isWindow(e)) {
                        let height = e.innerHeight ||
                                e.document.documentElement.clientHeight ||
                                e.document.body.clientHeight || 0,

                            width = e.innerWidth ||
                                e.document.documentElement.clientWidth ||
                                e.document.body.clientWidth || 0;

                        tResult = {
                            top: e.document.documentElement["client" + 'Top'] | 0,
                            right: e.document.documentElement["client" + 'Width'] | 0,
                            left: e.document.documentElement["client" + 'Left'] | 0,
                            bottom: e.document.documentElement["client" + 'Height'] | 0,

                            outerHeight: height,
                            outerHeightWP: height,
                            innerHeight: height,
                            height: height,

                            outerWidth: width,
                            outerWidthWP: width,
                            innerWidth: width,
                            width: width,
                        };
                    }// document
                    else if (e.nodeType === 9) {
                        let height = Math.max(
                                e.body["scroll" + 'Height'], e.documentElement["scroll" + 'Height'],
                                e.body["offset" + 'Height'], e.documentElement["offset" + 'Height'],
                                e.documentElement["client" + 'Height'],
                            ),
                            width = Math.max(
                                e.body["scroll" + 'Width'], e.documentElement["scroll" + 'Width'],
                                e.body["offset" + 'Width'], e.documentElement["offset" + 'Width'],
                                e.documentElement["client" + 'Width'],
                            );

                        tResult = {
                            top: Math.max(
                                e.body["scroll" + 'Top'], e.documentElement["scroll" + 'Top'],
                                e.body["offset" + 'Top'], e.documentElement["offset" + 'Top'],
                                e.documentElement["client" + 'Top'],
                            ) | 0,
                            right: Math.max(
                                e.body["scroll" + 'Width'], e.documentElement["scroll" + 'Width'],
                                e.body["offset" + 'Width'], e.documentElement["offset" + 'Width'],
                                e.documentElement["client" + 'Width'],
                            ) | 0,
                            left: Math.max(
                                e.body["scroll" + 'Left'], e.documentElement["scroll" + 'Left'],
                                e.body["offset" + 'Left'], e.documentElement["offset" + 'Left'],
                                e.documentElement["client" + 'Left'],
                            ) | 0,
                            bottom: Math.max(
                                e.body["scroll" + 'Height'], e.documentElement["scroll" + 'Height'],
                                e.body["offset" + 'Height'], e.documentElement["offset" + 'Height'],
                                e.documentElement["client" + 'Height'],
                            ) | 0,

                            outerHeight: height,
                            outerHeightWP: height,
                            innerHeight: height,
                            height: height,

                            outerWidth: width,
                            outerWidthWP: width,
                            innerWidth: width,
                            width: width,
                        };
                    } else {
                        let rect = (
                            e['getBoundingClientRect']
                        ) ? e.getBoundingClientRect() : {
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        };
                        let style = _z.compStyle(e) || e.currentStyle;
                        tResult = {
                            top: (rect.top || 0) + (scrolls ? (document.body.scrollTop || 0) : 0),
                            right: (rect.right || 0),
                            left: (rect.left || 0) + (scrolls ? (document.body.scrollLeft || 0) : 0),
                            bottom: (rect.bottom || 0),
                            // height of element
                            height: parseInt(style.height),

                            // outer
                            // the height of an element (includes padding and border).
                            outerHeight: e.offsetHeight,

                            // outer
                            // the height of an element (includes padding, border and margin).
                            outerHeightWP: (
                                e.offsetHeight +
                                parseInt(style.marginTop) +
                                parseInt(style.marginBottom)
                            ),

                            // inner
                            // the height of an element (includes padding).
                            innerHeight: e.clientHeight || e.scrollHeight,

                            width: parseInt(style.width),

                            // the width of an element (includes padding and border).
                            outerWidth: e.offsetWidth,

                            // the width of an element (includes padding, border and margin).
                            outerWidthWP: (
                                e.offsetWidth +
                                parseInt(style.marginLeft) +
                                parseInt(style.marginRight)
                            ),

                            innerWidth: e.clientWidth || e.scrollWidth,
                        };
                    }

                    if (returnKey !== false && _z.isset(tResult[returnKey])) {
                        tResult = tResult[returnKey];
                    }

                    $return.push(tResult);

                }, x => _z.isDOM(x) || _z.isWindow(x) || x.nodeType === 9);

                return this.length === 1 ? $return[0] : $return;
            },

            // offset
            offset: function offset() {
                let rect = this.rect.call(this);
                return {
                    top: +(rect['top'] || 0),
                    left: +(rect['left'] || 0),
                };
            },

            // element position (top/left)
            position: function position() {
                let elm = this,
                    $return = [];

                _z.elementMap(elm, function (e) {
                    if (e['offsetLeft'] && e['offsetLeft']) {
                        $return.push({
                            top: +(e['offsetTop'] || 0),
                            left: +(e['offsetLeft'] || 0),
                        });
                    }
                });

                return this.length === 1 ? $return[0] : $return;
            },

            // offsetParent of element ( closest visable parent)
            offsetParent: function offsetParent() {
                let elm = this,
                    $return = [];
                _z.elementMap(elm, e => $return.push(e['offsetParent'] || e));

                return this.length === 1 ? $return[0] : $return;
            },

        })
            .prop();

        _z.join(
            // rect functions
            ..._z.for("top left outerHeight outerHeightWP innerHeight height outerWidth outerWidthWP innerWidth width".split(
                ' '), (k, v) => {
                return {
                    [v]: function (WP) {
                        let rect = this.rect.call(this/* , [ ...arguments ].splice(1)  */);
                        if ((_z.toLowerCase(v) === 'outerheight' || _z.toLowerCase(v) === 'outerwidth') && WP && _z.isBoolean(WP)) {
                            v += 'WP';
                        }

                        rect = rect && rect[v] || 0;

                        return _z.isArray(rect) ? rect : +(rect || 0);
                    },
                };
            })
        )
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
