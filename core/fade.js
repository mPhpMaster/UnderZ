(
    function (window, document) {
        // opacity default values
        const fadeOpacityValue = {In: 0, Out: 1};
        const gVar = window && window.gVar || {};

        const elmFunc = {
            // fade element/s
            fade: function fadeElement($q, speed, callback) {
                let elm = this,
                    opacity = false;
                $q = $q || 'In';

                if ($q === 'To') {
                    if (_z.isNumber(callback)) {
                        opacity = callback > 1 ? 1 : (
                            callback < 0 ? 0 : callback
                        );
                        callback = false;
                    }

                    if (arguments.length === 4 && _z.isFunction(arguments[3])) callback = arguments[3];

                    if (_z.isNumber(opacity)) $q = elm.css('opacity') > opacity ? "Out" : "In";
                }

                if (_z.eff === false) {
                    if ($q === 'In') {
                        elm.show();
                    } else {
                        elm.hide();
                    }
                    return this;
                }

                if (opacity === false)
                    elm.css('opacity', fadeOpacityValue[$q]);

                let tick = function () {
                    // check if other fade on this element
                    if ((
                        _z.size(gVar['fade']) &&
                        gVar['fade']['tick'] !== tick &&
                        gVar['fade']['elm'] === tick.elm
                    ) || _z.eff === false
                    ) return false;

                    let fstElement = tick.elm.element(0);

                    tick.opacity = tick.q === 'In' ?
                        (
                            +(
                                tick.opacity
                            ) + (
                                tick.lastVal
                            )
                        ) :
                        (
                            +(
                                tick.opacity
                            ) - (
                                tick.lastVal
                            )
                        );
                    tick.elm.css('opacity', tick.opacity);
                    tick.last = +new Date();

                    let doFade = tick.fadeTo !== false ?
                        (
                            (
                                tick.q === 'In' && +(
                                    _z(fstElement).css('opacity')
                                ) < tick.fadeTo
                            ) ||
                            (
                                tick.q === 'Out' && +(
                                    _z(fstElement).css('opacity')
                                ) > tick.fadeTo
                            )
                        )
                        :
                        (
                            (
                                tick.q === 'In' && +(
                                    _z(fstElement).css('opacity')
                                ) < 1
                            ) ||
                            (
                                tick.q === 'Out' && +(
                                    _z(fstElement).css('opacity')
                                ) > 0
                            )
                        );

                    if (
                        _z.eff !== false && gVar['fadeStatus'] !== false &&
                        doFade
                    ) {
                        setTimeout(function () {
                            (
                                gVar['fade'].aftimeOut = (
                                    window.requestAnimationFrame && requestAnimationFrame(tick)
                                )
                            ) ||
                            (
                                gVar['fade'].timeOut = setTimeout(tick, tick.speed)
                            )
                        }, 16);
                    } else {
                        if (tick.fadeTo === false)
                            elm.css('opacity', +!fadeOpacityValue[tick.q]);
                        gVar['fade'] = {};

                        if (tick.q === 'Out' && tick.fadeTo === false) tick.elm.hide();

                        if (_z.isFunction(tick.callback))
                            tick.callback.call(elm, elm);
                    }
                };

                tick.q = $q;
                tick.last = +new Date();
                tick.elm = elm;
                tick.speed = parseInt(speed) || 1000;
                tick.lastVal = (
                    (
                        1 / (
                            (
                                tick.speed / 700
                            ) || 1
                        )
                    ) / 10
                ) || 0.25;
                tick.opacity = opacity === false ? fadeOpacityValue[$q] : Number(elm.css('opacity'));
                tick.fadeTo = opacity !== false ? opacity : false;
                tick.callback = _z.isFunction(callback) ? callback : false;

                // check if other fade on this element
                if (_z.eff === false || gVar['fadeStatus'] === false || (
                    _z.isset(gVar['fade']) && _z.size(gVar['fade']) &&
                    gVar['fade']['tick'] !== tick &&
                    gVar['fade']['elm'] === tick.elm
                )
                ) {
                    if (gVar['fade']['aftimeOut'])
                        cancelAnimationFrame(gVar['fade']['aftimeOut']);
                    else if (gVar['fade']['timeOut'])
                        clearTimeout(gVar['fade']['timeOut']);
                }

                gVar['fade'] = gVar['fade'] || {};
                gVar['fade']['tick'] = tick;
                gVar['fade']['elm'] = tick.elm;

                if ($q === 'In' && opacity === false) elm.show();

                tick();
                return this;
            },
        };

        const props$ = {
            // fade element/s in/out
            fadeIn: function fadeIn(speed, callback) {
                callback = _z.isFunction(speed) ? speed : (
                    callback || false
                );
                speed = _z.isNumber(callback) ? callback : (
                    speed || 1000
                );
                callback = !_z.isFunction(callback) ? false : callback;

                return elmFunc.fade.apply(this, ['In', speed, callback]);
            },
            // fade element/s in/out
            fadeOut: function fadeOut(speed, callback) {
                callback = _z.isFunction(speed) ? speed : (
                    callback || false
                );
                speed = _z.isNumber(callback) ? callback : (
                    speed || 1000
                );
                callback = !_z.isFunction(callback) ? false : callback;

                return elmFunc.fade.apply(this, ['Out', speed, callback]);
            },
            // fade element/s to
            fadeTo: function fadeTo(speed, opacity, callback) {
                callback = _z.isFunction(callback) ? callback : (
                    callback || false
                );
                speed = _z.isNumber(speed) ? speed : (
                    speed || 1000
                );
                opacity = _z.isNumber(opacity) ? (
                    (
                        opacity >= 0 || opacity <= 1
                    ) ? opacity : 1
                ) : 1;

                return elmFunc.fade.apply(this, ['To', speed, opacity, callback]);
            },
        };

        return _z.$.extend(props$);
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
