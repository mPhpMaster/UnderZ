(
    function (window, document) {
        /**
         * todo: slde is week
         * @type {any}
         */
        const slideQueue = {
            running: false,
            queue: [],

            init() {
                if (slideQueue.running) return;

                slideQueue.run();
            },

            add($method, $arguments) {
                const methodInfo = {
                    "name": $method && $method.name || $method,
                    "method": $method,
                    "arguments": $arguments,
                };
                slideQueue.queue.push(methodInfo);

                return slideQueue;
            },

            next() {
                let methodInfo = slideQueue.queue.shift();

                slideQueue.run();
                return methodInfo;
            },

            run() {
                if (slideQueue.queue.length) {
                    slideQueue.running = true;

                    let nextMethodInfo = slideQueue.queue.slice(0, 1);
                    nextMethodInfo = nextMethodInfo && nextMethodInfo.length ? nextMethodInfo.shift() : nextMethodInfo;

                    setTimeout(() => nextMethodInfo.method(...nextMethodInfo.arguments), 16);
                } else {
                    slideQueue.running = false;
                }
            },

        };

        const slideUps = {
            add(target, duration = 1000) {
                slideQueue.add(slideUps.start, [target, duration]);
            },

            start(target, duration = 1000) {
                target.style.transitionProperty = 'height, margin, padding';
                target.style.transitionDuration = duration + 'ms';
                target.style.boxSizing = 'border-box';
                target.style.height = target.offsetHeight + 'px';
                target.offsetHeight;
                target.style.overflow = 'hidden';
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;

                setTimeout(() => {
                    target.style.display = 'none';
                    target.style.removeProperty('height');
                    target.style.removeProperty('padding-top');
                    target.style.removeProperty('padding-bottom');
                    target.style.removeProperty('margin-top');
                    target.style.removeProperty('margin-bottom');
                    target.style.removeProperty('overflow');
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');

                    slideQueue.next();
                }, duration + 1);

                return slideUps;
            }
        };

        const slideDowns = {
            toggle(target, duration = 1000) {
                slideQueue.add(slideDowns.start, [target, duration]);
            },

            start(target, duration = 1000) {
                target.style.removeProperty('display');
                let display = compStyle(target).display;
                if (display === 'none') {
                    display = 'block';
                }

                target.style.display = display;
                let height = target.offsetHeight;
                target.style.overflow = 'hidden';
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                target.offsetHeight;
                target.style.boxSizing = 'border-box';
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + 'ms';
                target.style.height = height + 'px';
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');

                setTimeout(() => {
                    target.style.removeProperty('height');
                    target.style.removeProperty('overflow');
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');

                    slideQueue.next();
                }, duration + 1);

                return slideDowns;
            }
        };

        // const slideToggle = ($e, duration = 1000) => {
        //     const toggle = (e, d) => {
        //         if( _z( e ).isHidden() || compStyle( e ).display === 'none' ) {
        //             slideDowns.toggle( e, d );
        //         } else {
        //             slideUps.toggle( e, d );
        //         }
        //         slideQueue.next();
        //     };
        //
        //     slideQueue.add( toggle, [ $e, duration ] );
        //     slideQueue.init();
        // };

        const props$ = {

            // region: slides
            slideUp: function slideUp($elm, duration = 1000, callback) {
                var args = _z.argsFix(arguments, this, undefined);
                arguments = args("arguments");
                $elm = args.call();
                duration = args.call();
                callback = args.call();

                callback = callback || false;
                callback = _z.isFunction(duration) ? duration : callback;
                duration = duration || 1000;
                duration = _z.isNumber(callback) ? callback : duration;
                callback = !_z.isFunction(callback) ? false : callback;
                $elm = _z.is_z($elm) ? $elm : $elm && _z($elm);

                if (!$elm || !$elm.isDOMElement() || !this.length) {
                    return this;
                }

                if (_z.eff === false) {
                    $elm.hide();
                } else {
                    _z.elementMap($elm, function (e) {
                        try {
                            slideUps.toggle(e, duration);
                        } catch (er) {
                        }
                    });
                }

                slideQueue.init();
                return this;
            },

            slideDown: function slideDown($elm, duration = 1000, callback) {
                var args = _z.argsFix(arguments, this, undefined);
                arguments = args("arguments");
                $elm = args.call();
                duration = args.call();
                callback = args.call();

                callback = callback || false;
                callback = _z.isFunction(duration) ? duration : callback;
                duration = duration || 1000;
                duration = _z.isNumber(callback) ? callback : duration;
                callback = !_z.isFunction(callback) ? false : callback;
                $elm = _z.is_z($elm) ? $elm : $elm && _z($elm);

                if (!$elm || !$elm.isDOMElement() || !this.length) {
                    return this;
                }

                if (_z.eff === false) {
                    $elm.show();
                } else {
                    _z.elementMap($elm, function (e) {
                        try {
                            slideDowns.toggle(e, duration);
                        } catch (er) {
                        }
                    });
                }

                slideQueue.init();
                return this;
            },
            // endregion: slides
            // slide: function slide($elm, duration = 1000, callback) {
            //     slideToggle( this.element( 0 ), $elm || duration );
            //     return this;
            // },

        };

        return _z.join(props$).prop();
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
