(
    function (window, document) {
// timer
        var interval = function interval() {
            $this = (
                this && this.window === this
            ) ? interval : (
                this instanceof interval
            ) ? this : interval;

            if (arguments.length === 1 && arguments[0] instanceof interval)
                return arguments[0];

            return new (
                $this.init.bind($this)
            )(...arguments);
        };
// hold timer
        interval.hold = false;
// timer default interval = 1 second
        interval.interval = 1000;
// timer inestanss
        interval.instances = [];
// stop all timers
        interval.stopAll = function stopAll() {
            for (var i = 0, iL = this.instances.length; i < iL; i++) {
                this.instances[i].stop();
            }
            return this;
        };
// start all timers
        interval.startAll = function startAll() {
            for (var i = 0, iL = this.instances.length; i < iL; i++) {
                this.instances[i].start();
            }
            return this;
        };
// remove all timers
        interval.removeAll = function removeAll(keepData) {
            // do not delete data
            keepData = keepData || false;
            for (var i = 0, iL = this.instances.length; i < iL; i++) {
                this.instances[i].remove(keepData);
            }
            return this;
        };

// _z.interval timer prototype
        interval.timer = interval.prototype = {
// timer version
            version: "0.0.1",
// timer id
            id: 0,
// timer interval
            interval: 0,
// timer isrunning
            isRunning: false,
// timer for one execution
            isOnce: false,
// timer for one execution is runned
            executionCount: 0,
// assign time
            stamp: 0,
// timer callback
            callback: _z.falseFunction,

            constructor: interval,

// create new instance _z()
            init: function timer(fn, iv) {
                // run once
                if (this.stamp !== 0) return false;

                fn = fn || _z.falseFunction;
                iv = iv || interval.interval;

                // register timer interval
                this.interval = (
                    _z.isNumber(fn) && fn
                ) || (
                    _z.isNumber(iv) && iv
                ) || interval.interval;
                // register timer callback
                this.callback = (
                    _z.isFunction(iv) && iv
                ) || (
                    _z.isFunction(fn) && fn
                ) || _z.falseFunction;

                // register timer created time
                this.stamp = _z.time();

                // register this instance
                interval.instances.push(this);
                return this;
            },

// run callback
            execFunction: function execFunction(force) {
                if (this.stamp === undefined) return false;

                // do not check timer class status
                force = force || false;

                // check timer class status
                if (interval.hold !== false && force === false) {
                    this.isRunning = false;
                    return this;
                }

                // if its timer once
                if (this.isOnce === true)
                    this.stop();
                else
                    this.isRunning = true;


                this.executionCount++;
                // execute function
                return this.callback.call(this);
            },

// check if this timer can start
            isReady: function isReady() {
                if (this.stamp === undefined) return false;

                return (
// timer system not on hold
                    interval.hold === false &&
                    // no already running
                    this.isRunning === false &&
                    // if its once ? not run yet
                    (
                        (
                            this.isOnce === true && this.executionCount < 1
                        ) || this.isOnce === false
                    )
                );
            },

// set interval timer - must restart the timer
// s = new interval
// run = run timer after interval set ? true||false
            setInterval: function setInterval(s, run/*undefined*/) {
                s = _z.toNum(s);
                run = run || undefined;
                var restart = false;

                // is it already running ? stop
                if (restart = (this.isRunning !== false))
                    this.stop();

                // change interval
                this.interval = s;

                // was it running ? run it
                if (restart || run !== false)
                    this.start(true);

                return this;
            },

// start timer once
            once: function once(status) {
                status = arguments.length ? !!status : null;
                if (status === null) return this.isOnce;

// change timer typer
                this.isOnce = !!status;

                return this;
            },

// start timer
            start: function start(froce) {
                froce = froce || false;
                if (this.stamp === undefined) return false;

                // is it already running ?
                if (this.isRunning === false) {
                    // if its timer once
                    if (this.isOnce === true && (
                        this.executionCount > 0 && froce === false
                    )) return this;

                    // create interval & register id & change status
                    this.isRunning = !!(
                        this.id = setInterval(this.execFunction.bind(this), this.interval)
                    );
                }

                return this;
            },

// stop timer
            stop: function stop() {
                if (this.stamp === undefined) return false;

                if (this.id && this.id !== 0) {
                    // stop interval
                    clearInterval(this.id);
                    // update status
                    this.isRunning = false;
                    // remove interval id
                    this.id = 0;
                }

                return this;
            },

// delete timer
            remove: function remove(keepData) {
                if (this.stamp === undefined) return false;

                // do not delete data
                keepData = keepData || false;
                var thisIndex = interval.instances.indexOf(this);
                if (thisIndex !== -1) {
                    // if timer running stop it
                    if (this.isRunning) return this.stop().remove(keepData);
                    // remove it
                    interval.instances.remove(thisIndex);
                } else
                    return false;

                // delete data
                if (keepData !== true)
                    _z.for(this, (k, v) => this[k] = undefined);

                return true;
            },
        };
        interval.timer.init.prototype = interval.timer;

// timer system
        _z.join({
            timer: interval,
        })
            .core()
            .window();

// queue by element
        var queue = function queue(elm, func, doNotRun) {
            doNotRun = doNotRun || false;
            var e = _z.is_z(elm) ? elm[0] : elm;

            var qI;
            func = func instanceof _z.timer ? func : func;

            if ((
                qI = queue.qElm.inArray(e)
            ) === -1) {
                qI = queue.qElm.push(e) - 1;
            }

            queue.q[qI] = queue.q[qI] || [];
            queue.q[qI].push(func);

            // queue length
            var qLength = () => _z.queue.q.filter((fqi, fqa) => {
                return _z.size(fqi.filter((_fqi, _fqa) => {
                    if (!_fqi || !_fqi.stamp || !_z.isset(_fqi.stamp)) return false;

                    return !(
                        _fqi.executionCount > 0 && !_fqi.isRunning && !_fqi.isReady()
                    );
                })) > 0;
            }).length;

            // queue handler
            if (!_z.isset(queue.qT)) {
                queue.qT = (
                    new _z.timer(function runQueue() {
                        _z.for(queue.qElm, function (qei, qe) {
                            if (_z.isset(queue.q[qei]) && _z.isArray(queue.q[qei]) && queue.q[qei].length > 0) {
                                if (
                                    !_z.isset(queue.q[qei][0].stamp) ||
                                    (
                                        queue.q[qei][0].executionCount > 0
                                        && !queue.q[qei][0].isRunning
                                        && !queue.q[qei][0].isReady()
                                    ) ||
                                    (
                                        queue.q[qei][0].isReady() && queue.q[qei][0].executionCount !== 0
                                    )
                                ) {
                                    queue.q[qei].shift();
                                }

                                if (_z.isset(queue.q[qei][0]))
                                    queue.q[qei][0].isReady() && queue.q[qei][0].start();
                            }
                        });

                        if (qLength() === 0) {
                            queue.q = [];
                            queue.qElm = [];
                            queue.qT.stop();
                        }
                    }, 100)
                );
            }

            // run queue handler
            if (qLength() > 0 && queue.qT.isReady() && doNotRun === false) {
                queue.qT.start();
            }

            return queue.qT;
        };
        queue.q = [];
        queue.qElm = [];
        queue.qT = undefined;

        _z.join({
            queue: queue,
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
