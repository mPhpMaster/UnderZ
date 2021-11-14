(
    function (window, document) {
// DOM functions
        _z.join({
            // todo:animate element
            animate: function animate(params, speed, options) {
                var elm = this;
                speed = _z.isNumber(speed) ? speed : _z.trim((
                    speed || "normal"
                )).toLocaleLowerCase();
                speed = _z.isString(speed) && speed.toLowerCase() === "slow" ? 800 : speed;
                speed = _z.isString(speed) && speed.toLowerCase() === "fast" ? 200 : speed;
                speed = _z.isString(speed) ? 500 : speed;

                var _speed = " " + Number((
                    speed / 1000
                ).toFixed(2)) + "s";

                var transition = {};
                var oldTransition = {};
                var transition2 = {};

                // todo: this is test
                function pxToEm(px, element) {
                    element = element === null || element === undefined ? doc.documentElement : element;
                    var temporaryElement = doc.createElement('div');
                    temporaryElement.style.setProperty('position', 'absolute', 'important');
                    temporaryElement.style.setProperty('visibility', 'hidden', 'important');
                    temporaryElement.style.setProperty('font-size', '1em', 'important');
                    element.appendChild(temporaryElement);
                    var baseFontSize = parseFloat(getComputedStyle(temporaryElement).fontSize);
                    temporaryElement.parentNode.removeChild(temporaryElement);
                    return px / baseFontSize;
                }

                Object.keys(params).forEach((key) => {
                    var cssPN = _z.cssPropName(key, true);
                    var cssVal;
                    transition2[cssPN] = params[key];

                    var _MathType = transition2[cssPN].indexOf("+=") !== -1 ? "+" : (
                        transition2[cssPN].indexOf("-=") !== -1 ? "-" : false
                    );

                    if (_MathType !== false) {
                        var v_ = transition2[cssPN].replaceArray(["+=", "-="], "");
                        var valIPx = _z.trim(v_.match(/\d+/g).map(Number)[0] || 0);
                        var OvalIPx = (
                            compStyle(_z(elm)[0])[cssPN] || _z(elm).css(cssPN) || "0px"
                        );
                        var OUnit = _z.trim(OvalIPx.match(/\d+/g).map(Number)[0]);
                        OUnit = OvalIPx.replace(OUnit, "") || "px";
                        OvalIPx = OvalIPx.match(/\d+/g).map(Number)[0] || 0;
                        transition2[cssPN] = "" + (
                            _MathType === "+" ? (
                                Number(OvalIPx) + Number(valIPx)
                            ) : (
                                Number(OvalIPx) - Number(valIPx)
                            )
                        ) + "px";
                    }

                    if (cssVal = _z(elm).css(cssPN))
                        _z(elm).css(cssPN, cssVal);
                });

                // var _trans = Object.keys( transition2 ).join(_speed+" linear,") + _speed + " linear";
                var _trans = "all" + _speed + " linear";

                if (_z.eff !== false) {
                    _z.for([
                        "-webkit-transition",
                        "-moz-transition",
                        "-ms-transition",
                        "-o-transition",
                        "transition",
                    ], function (oPK, oPV) {
                        var cssPN = _z.cssPropName(oPV, true);
                        oldTransition[cssPN] = _z(elm).css(cssPN);
                        transition[cssPN] = _trans;
                    });
                    _z(elm).css(transition);
                }

                // start
                setTimeout(() => _z(elm).css(transition2), 1);


                // when finish
                _z(elm).once(_z.getTransitionEventName(0), function () {
                    var _keys = Object.keys(transition2);
                    for (var i = 0, l = _keys.length; i < l; i++) {
                        var key = _keys[i];
                        if (transition2[key] != _z(elm).css(key)) {
                            return false;
                        }
                    }

                    setTimeout(() => _z(elm).css(oldTransition), 1);
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
