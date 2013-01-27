/**
 * This script give simple keyframe system.
 * @version 0.0.1
 * @author Kazuya Hiruma
 * @email edo.m18@gmail.com
 * @blog http://css-eblog.com/
 * @github https://github.com/edom18/SimpleKeyframes.js
 */
(function (win, doc, Class, exports, undefined) {

    'use strict';

    var easing = {
        linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeInCubic: function (t, b, c, d) {
            return c * Math.pow (t / d, 3) + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c * (Math.pow (t / d - 1, 3) + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow (t, 3) + b;
            }
            return c / 2 * (Math.pow (t - 2, 3) + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            return c * Math.pow (t / d, 4) + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * (Math.pow (t / d-1, 4) - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow (t, 4) + b;
            }
            return -c / 2 * (Math.pow (t-2, 4) - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            return c * Math.pow (t / d, 5) + b;
        },
        easeOutQuint: function (t, b, c, d) {
            return c * (Math.pow (t / d-1, 5) + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow (t, 5) + b;
            }
            return c / 2 * (Math.pow (t - 2, 5) + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return c * (1 - Math.cos(t / d * (Math.PI / 2))) + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return c / 2 * (1 - Math.cos(Math.PI * t / d)) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * (1 - Math.sqrt(1 - t * t)) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInQuad: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    };

    function nopp (argument) { /* noop. */ }

    var unitTypes = {};

    function getUnitType (prop) {
        if (unitTypes[prop] !== undefined) {
            return unitTypes[prop];
        }

        var div = doc.createElement('div');

        if (!prop in div.style) {
            return null;
        }

        div.style[prop] = 0;

        var unit = '' + div.style[prop];
        unit = unit.slice(1);
        unitTypes[prop] = unit;

        return unit;
    }

    function getUnitTypeAll(props) {
        var ret = {};

        for (var prop in props) {
            ret[prop] = props[prop] + getUnitType(prop);
        }

        return ret;
    }

    function each (arr, func, context) {
        if (Array.prototype.forEach) {
            arr.forEach(func, context);
        }
        else {
            for (var i = 0, l = arr.length; i < l; ++i) {
                func.call(context || arr, arr[i]);
            }
        }
    }

    function isFunction (arg) {
        return ({}).toString.call(arg) === '[object Function]';
    }

    /**
     * EvtEmit class.
     * @constructor
     * @example
     * var targetObj = {};
     * EvtEmit.attach(targetObj);
     * //attach event
     * targetObj.bind('update', function (data) {
     *         alert('update!');
     * });
     * //dispatch event
     * targetObj.trigger('update', data);
     */
    var EvtEmit = Class.extend({
        trigger: function  (type, optData) {

            var handlers,
                handleArr,
                l,
                func;

            if (!type) {
                return false;
            }

            handlers = this.handlers || (this.handlers = {});
            handleArr = handlers[type] || [];
            l = handleArr.length;

            while(l--) {
                (func = handleArr[l]) &&
                func[0].call(func[1] || this, optData);
            }
        },
        bind: function (type, func, context) {
            var handlers = this.handlers || (this.handlers = {});

            if (!type) {
                return false;
            }

            (handlers[type] || (handlers[type] = [])).push([func, context]);
        },

        one: function (type, func, context) {

            var self = this;

            function _func () {
                self.off(type, _func);
                func.apply(context, arguments);
                context = null;
                self  = null;
                _func = null;
            }

            this.on(type, _func, context);
        },

        unbind: function (type, func) {
    
            var handlers,
                handleArr,
                i;

            if (!type) {
                return false;
            }

            handlers  = this.handlers || (this.handlers = {});
            handleArr = handlers[type] || [];
            i = handleArr.length;

            if (!func) {
                this.handlers[type] = [];
            }
            else {
                while (i--) {
                    handleArr[i][0] === func && handleArr.splice(i, 1);
                }
            }
        }
    });


    /////////////////////////////////////////////////////////////////////
    
    //Shortcut.
    EvtEmit.fn = EvtEmit.prototype;
    EvtEmit.fn.fire = EvtEmit.fn.trigger;
    EvtEmit.fn.on = EvtEmit.fn.bind;
    EvtEmit.prototype.off = EvtEmit.fn.unbind;

    /* ------------------------------------------------
        Defined class method.
    --------------------------------------------------- */
    EvtEmit.attach = (function() {

        var re = new RegExp('Object|Array|Date|Arguments', 'i');

        /**
         * util functions
         */
        function detectType(o) {
            return Object.prototype.toString.call(o).replace(/^\[object (.+)\]$/, '$1');
        }

        function makeArray(args, sp) {
            if (!sp) {
                sp = 0;
            }

            return Array.prototype.slice.call(args, sp);
        }

        function _cloneObject(o, type) {

            var newList = [],
                i, e;

            if(!type) {
                type = detectType(o);
            }
            if (type == 'Array') {
                for (i = 0; e = o[i];  i++) {
                  newList.push(_cloneObject(e));
                }

                return newList;
            }
            else if (type == 'Object' || type == 'Arguments') {

              return _extendObject({}, o, true);
            }
            else if (type == 'Date') {

              return new Date(o.toString());
            }
            else {

              return o;
            }
        }

        function _extendObject(parent, obj, deepCopy) {

            var val, type;

            for (var key in obj) {
                val = obj[key];
                type = detectType(val);

                parent[key] = (deepCopy && re.test(type)) ? _cloneObject(val, type) : val;
            }

            return parent;
        }

        return function(target) {
            _extendObject(target, new EvtEmit, true);
        };
    })();

    ////////////////////////////////////////////////////////

    var Crono = EvtEmit.extend({
        init: function () {
            this._children  = [];
            this._frame     = 0;
            this._lastFrame = 0;
            this._reversing = false;
            this.play();
        },

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PRIVATE METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /**
         * Return last frame number.
         * @return {number}
         */
        _getLastFrame: function () {
            var children = this._children,
                len = children.length,
                ret = 0,
                max = Math.max;

            while (len--) {
                ret = max(ret, children[len].getLastFrame());
            }

            return ret;
        },
        

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PUBLIC METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        each: function (func, context) {
            each(this._children, func, context || this);
        },
        /**
         * Add child. This takes Crono class.
         * @param {Crono} crono
         */
        add: function (crono) {
            if (({}).toString.call(crono) !== '[object Array]') {
                crono = [crono];
            }

            for (var i = 0, l = crono.length; i < l; ++i) {
                this._children.push(crono[i]);
            }

            this._lastFrame = this._getLastFrame();
        },

        /**
         * Switch the time flow to forward.
         * If _reversing is false, time to move forward.
         */
        timeForward: function () {
            this._reversing = false;
            this.each(function (child) {
                child.timeForward();
            });
        },

        /**
         * Switch the time flow to backward.
         * If _reversing is true, time to move backward.
         */
        timeBackward: function () {
            this._reversing = true;
            this.each(function (child) {
                child.timeBackward();
            });
        },

        /**
         * noop
         */
        getLastFrame: nopp,

        /**
         * Every frame it is invoked.
         */
        enterFrame: function (reverse, isTerminal) {
            var children = this._children;
            var len = children.length;

            if (this._stopped) {
                return;
            }

            while (len--) {
                children[len].enterFrame(reverse, isTerminal);
            }
        },

        /**
         * Switch stop flag to `false`
         * If this flag is false, enterFrame method will work.
         */
        play: function () {
            this._stopped = false;
        },

        playFor: function () {
            this.timeForward();
            this.play();
        },
        playBack: function () {
            this.timeBackward();
            this.play();
        },

        /**
         * Switch stop flag to `true`
         * If this flag is true, enterFrame method will skip progress.
         */
        stop: function () {
            this._stopped = true;
        }
    });

    /////////////////////////////////////////////////////////////////

    var Stage = Crono.extend({
        init: function () {
            this._super();
            this._stopped = true;
        },

        /**
         * Every frame it will be called.
         */
        flow: function () {
            var children  = this._children,
                len       = children.length,
                reversing = this._reversing,
                lastFrame = this._lastFrame,
                endFlg    = false,
                t;

            if (this._stopped) {
                return;
            }

            t = reversing ? --this._frame : ++this._frame;

            if (t < 0) {
                this._frame = t = 0;
            }
            else if (t === lastFrame) {
                this.trigger('animationend');
            }
            else if (t > lastFrame) {
                this._frame = t = lastFrame;
                endFlg = true;
            }

            while (len--) {
                children[len].enterFrame(endFlg);
            }
        },

        /**
         * Start the time.
         */
        run: function () {
            var self = this;

            this._stopped = false;

            (function loop() {
                if (self._stopped) {
                    return;
                }
                self.flow();
                self.frameTimer = setTimeout(loop, 32);
            }());
        },

        /**
         * Stop the time.
         */
        stop: function () {
            this._super();
            clearTimeout(this.frameTimer);
        }
    });

    /////////////////////////////////////////////////////////////////

    var Keyframes = EvtEmit.extend({
        init: function (frames) {

            if (({}).toString.call(frames) !== '[object Array]') {
                frames = [frames];
            }

            this._frames = frames;
            this._optimize();
        },

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PRIVATE METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /**
         * @param {number} pos
         */
        _getKeyframes: function (pos) {

            var frames = this._frames,
                len = frames.length,
                from, to;

            while (len--) {
                if (frames[len].frame <= pos) {
                    from = frames[len + 0];
                    to   = frames[len + 1];
                    break;
                }
            }

            return {
                from: from,
                to: to
            };
        },
        
        /**
         * Optimize data.
         */
        _optimize: function () {

            var frameItem = null,
                frames = this._frames,
                keyframeActions = {};

            this.each(function (frame) {
                if (frame && isFunction(frame.on)) {
                    keyframeActions[frame.frame] = frame.on;
                }
            }, this);

            this._keyframeActions = keyframeActions;

            if ((frameItem = frames[frames.length - 1])) {
                this._lastFrame = frameItem.frame;
            }
        },

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PUBLIC METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        each: function (func) {
            each(this._frames, func, this);
        },
        /**
         * @param {Crono} crono
         */
        setParent: function (crono) {
            this._parent = crono;
        },

        getLastFrame: function () {
            return this._lastFrame || 0;
        },

        /**
         * @param {number} pos
         */
        getFrameAt: function (pos) {

            var keyframeActions = this._keyframeActions,
                keyframes = this._getKeyframes(pos),
                lastFrame = this._lastFrame,
                from = keyframes.from,
                to   = keyframes.to,
                ret  = {},

                fromProp,
                toProp;

            if (!from) {
                return;
            }

            if (!to) {
                ret = getUnitTypeAll(from.properties);
            }
            else {

                fromProp = from.properties;
                toProp   = to.properties;

                var f = 0,
                    b = 0,
                    c = 0,
                    d = to.frame - from.frame,
                    easeFunc = easing[from.timingFunction || 'easeInOutCubic'],
                    val = 0,
                    unit = '';

                if (!easeFunc) {
                    throw new Error('Argument of timingFunction is not exist.');
                }

                var fromFrame = from.frame,
                    flg = false;

                for (var prop in fromProp) {
                    flg = (fromProp[prop] && toProp[prop]);
                    if (flg === 0 || flg) {
                        b = fromProp[prop];
                        f = toProp[prop];
                        c = f - b;
                        val = easeFunc(pos - fromFrame, b, c, d);
                        ret[prop] = val;
                    }
                }

                ret = getUnitTypeAll(ret);
            }

            if (keyframeActions[pos]) {
                keyframeActions[pos].call(this._parent);
            }

            if (lastFrame <= pos) {
                this.trigger('frameend', {
                    lastFrame: lastFrame
                });
            }

            return ret;
        }
    });

    /////////////////////////////////////////////////////////////////
    
    var Movie = Crono.extend({
        init: function (el, keyframes) {
            this._super();

            this.el     = el;
            this._index = 0;

            this.setKeyframes(keyframes);
        },

        /**
         * @return {number}
         */
        getLastFrame: function () {
            return this._keyframes.getLastFrame();
        },

        /**
         * @param {boolean} reverse
         */
        enterFrame: function (isTerminal) {

            this._super(isTerminal);

            if (this._stopped) {
                return;
            }

            var t  = this._frame,
                el = this.el,
                keyframes = this._keyframes,
                props;

            if (this._reversing) {
                --t;
            }
            else {
                if (!isTerminal || this._lastFrame > t) {
                    ++t;
                }
            }

            if (t < 0) {
                this._frame = t = 0;
            }

            this._frame = t;

            if (!el) {
                return;
            }

            props = keyframes.getFrameAt(t);

            for (var prop in props) {
                el.style[prop] = props[prop];
            }
        },

        /**
         * Go frame to position and play.
         * @param {number} pos
         */
        gotoAndPlay: function (pos) {
            this.go(pos);
            this.play();
        },

        /**
         * Go frame to position and stop.
         * @param {number} pos
         */
        gotoAndStop: function (pos) {
            this.go(pos);
            this.stop();
        },

        /**
         * Go frame to position.
         * @param {number} pos
         */
        go: function (pos) {
            this._frame = +pos;
        },

        /**
         * Set keyframes.
         * @param {Keyframes} keyframes
         */
        setKeyframes: function (keyframes) {
            var _keyframes = null;

            _keyframes = keyframes instanceof Keyframes ? keyframes : new Keyframes(keyframes);
            _keyframes.setParent(this);
            _keyframes.on('update', this._onUpdate, this);

            this._keyframes = _keyframes;
            this._lastFrame = this.getLastFrame();
        },
        

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PRIVATE METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        _onUpdate: function (data) {
            //this.stop();
            //this._frame = data.lastFrame;
        }
    });

    exports.Keyframes = Keyframes;
    exports.Crono = Crono;
    exports.Stage = Stage;
    exports.Movie = Movie;

}(window, window.document, window.Class, window));
