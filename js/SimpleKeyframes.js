/**
 * This script give simple keyframe system.
 * @version 0.0.3
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
        },
        easeInBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    };

    var prefixList = [
        '-webkit-', '-moz-', '-ms-'
    ];

    /*!
     * for a cache.
     */
    var unitTypes = {};

    function noop (argument) { /* noop. */ }

    /**
     * Get an unit type by prop.
     * @param {string} prop A CSS property.
     * @return {string} unit string.
     */
    function getUnitType (prop) {

        var div, unit;

        if (unitTypes[prop] !== undefined) {
            return unitTypes[prop];
        }

        div = doc.createElement('div');

        if (!prop in div.style) {
            return null;
        }

        div.style[prop] = 0;

        unit = '' + div.style[prop];
        unit = unit.slice(1);
        unitTypes[prop] = unit;

        div = null;

        return unit;
    }

    /**
     * Give an each method.
     * @param {Array} arr To use an each loop.
     * @param {Function} func A Callback function.
     * @param {Function?} context Will be called as context.
     */
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

    /**
     * Return true if arg is a function.
     * @param {*} arg
     * @return {boolean} Return true if arg is a function.
     */
    function isFunction (arg) {
        return ({}).toString.call(arg) === '[object Function]';
    }

    /**
     * Dispose class
     * @constructor
     */
    var Disposal = Class.extend({
        disposeInternal: noop,
        dispose: function (removeNode) {
            var el = this.el;

            if (removeNode && el) {
                el.parentNode.removeChild(el);
                this.el = null;
            }

            this.disposeInternal.apply(this, arguments);
        }
    });


    /**
     * PropertyValue class.
     * This class give property values.
     * @constructor
     * @param {Array} types.
     */
    function PropertyValue (types) {
        this._types = types;
        this._value = null;
        this._optimize();
    }
    PropertyValue.prototype = {
        constructor: PropertyValue,

        toString: function () {
            return this.stringify();
        },
        stringify: function (val) {
            var types = this._types,
                type  = null,
                values = [],
                cnt    = 0,
                ret    = '',
                isFilter = false;

            for (var i = 0, l = types.length; i < l; ++i) {
                type = types[i];

                for (var prop in type) {
                    values = type[prop];
                    isFilter = (typeof values[0] === 'string');

                    if (isFilter) {
                        ret += prop + '(' + values[0] + '=';
                    }
                    else if (prop !== '-') {
                        ret += prop + '(';
                    }

                    for (var j = isFilter ? 1 : 0, k = values.length; j < k; j += 3) {
                        ret += val ? val[cnt++] : values[j + 0]; //as number
                        ret += values[j + 1] || ''; // as unit
                        ret += values[j + 2] || ''; // as separator
                    }

                    ret += prop !== '-' ? ') ' : '';
                }
            }

            return ret;
        },

        /**
         * Optimize to list property value list.'
         */
        _optimize: function () {

            var ret = [],
                types = this._types,
                type = null,
                value = [];

            for (var i = 0, l = types.length; i < l; ++i) {
                type = types[i];

                for (var prop in type) {
                    value = type[prop];

                    for (var j = 0, k = value.length; j < k; ++j) {
                        if (typeof value[j] === 'number') {
                            ret.push(value[j]);
                        }
                    }
                }
            }

            type = null;
            types = null;

            this._value = ret;
        },
        getValues: function () {
            return this._value;
        },
        getTypes: function () {
            return this._types;
        }
    };

    /**
     * Property value parser class.
     * @constructor
     * @param {string} prop A property name.
     * @param {string} str A property value.
     */
    var ValueParser = Disposal.extend({
        init: function (el, prop, str) {
            this.el    = el;
            this._cur  = str;
            this._prop = prop;
            this._value = [];
            this._type  = '';
            this._types = [];
        },
        /** @override */
        disposeInternal: function () {
            this.el     = null;
            this._cur   = null;
            this._prop  = null;
            this._value = null;
            this._type  = null;
            this._types = null;
        },

        /**
         * As interface.
         */
        parse: function () {

            var type = {},
                curval = null,
                delta  = 0,
                reg = null,
                m   = null;

            //type of number
            if (typeof this._cur === 'number') {
                type['-'] = [this._cur, getUnitType(this._prop)];
                this._types.push(type);
            }

            //type of like number.
            else if (/^\d+$/.test(this._cur)) {
                type['-'] = [this._cur, getUnitType(this._prop)];
                this._types.push(type);
            }

            else if (/^\s*[-+]=(\d+)/.test(this._cur)) {
                if (!this.el) {
                    return null;
                }

                curval = win.getComputedStyle(this.el, '')[this._prop];

                if (curval) {
                    delta = +RegExp.$1;
                    curval = parseInt(curval, 10);
                    curval += (this._cur.indexOf('+=') > -1) ? delta : -delta;
                    type['-'] = [curval, getUnitType(this._prop)];
                    this._types.push(type);
                }
            }

            /*!
             * type of number with unit.
             * e.g. 5px | -5px | 5px 5px
             */
            else if (/[-\d]/.test(this._cur.charAt(0))) {
                type['-'] = this._parse();
                this._types.push(type);
            }

            /*!
             * type of this._curing.
             * e.g. rotate(90deg) | translate3d(1px, 2px, 3px) | scale(0) rotate(30deg)
             */
            else {
                this._parseWord();
            }

            return new PropertyValue(this._types);
        },

        /**
         * Parse a value as words.
         */
        _parseWord: function () {

            var type = {};

            //If context start as charactor, it is like string as type with '('.
            var reg = /\s*(\w+)\(/i;
            var m = reg.exec(this._cur);

            if (!(m && m[1])) {
                throw new Error('Parse error for property value.');
            }

            this._cur = this._cur.replace(reg, '');

            if (!this._cur) {
                throw new Error('Not fount end of context as ")" charactor.');
            }

            //parse for primitive.
            if (!/[-\d]/.test(this._cur.charAt(0))) {
                type[m[1]] = this._parseFilter();
            }
            else {
                type[m[1]] = this._parse();
            }

            this._types.push(type);

            reg = /\s*\)/i;
            this._cur = this._cur.replace(reg, '');

            if (this._cur) {
                this._parseWord();
            }
        },

        /**
         * Parse filer in ()
         * Like this: translate(5px, 5px, 3px);
         *
         * @return {Array.<string>}
         */
        _parseFilter: function () {
            var reg = /(\w+)=(\d+)(\w*)/i,
                m = reg.exec(this._cur);

            this._cur = this._cur.replace(reg, '');

            if (!/^\s*\)\s*$/.test(this._cur)) {
                throw new Error('Parse error as inner ().');
            }

            //filter name, filter number, filter unit
            return [m[1], +m[2], m[3]];
        },

        /**
         * Parse string.
         *
         * @return {Array}
         */
        _parse: function () {

            var ret = [],
                reg = null,
                m   = null;

            while (true) {
                reg = /^\s*(-?\d+)(\.?\d+)*([a-z%]*)([\s,])?/i;
                m = reg.exec(this._cur);

                if (!m || !m[0]) {
                    break;
                }

                if (m[2]) {
                    ret.push(+(m[1] + m[2]));
                }
                else {
                    ret.push(+m[1]);
                }

                ret.push(m[3] || '');

                if (m[4]) {
                    ret.push(this._separate || m[4]);
                    this._separate = this._separate || m[4];
                }

                this._cur = this._cur.replace(reg, '');
            }

            return ret;
        }
    });


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
    var EvtEmit = Disposal.extend({
        dispose: function (removeNode) {
            this._super(removeNode);
            this.off();
        },
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

            if (arguments.length === 0) {
                this.clear();
                return;
            }

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
        },

        clear: function () {
            var handlers  = this.handlers;

            for (var type in handlers) {
                handlers[type] = [];
            }
        }
    });


    /////////////////////////////////////////////////////////////////////
    
    //Shortcut.
    EvtEmit.fn = EvtEmit.prototype;
    EvtEmit.fn.fire = EvtEmit.fn.trigger;
    EvtEmit.fn.on   = EvtEmit.fn.bind;
    EvtEmit.fn.off  = EvtEmit.fn.unbind;

    ////////////////////////////////////////////////////////


    /**
     * A main animation object in a Stage.
     * @constructor
     * Disposal <- EvtEmit
     */
    var Crono = EvtEmit.extend({
        name: 'Crono',
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
                ret = this.getLastFrame(),
                max = Math.max;

            while (len--) {
                ret = max(ret, children[len].getLastFrame());
            }

            return ret;
        },
        

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PUBLIC METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /**
         * Remove child as argument.
         * @param {Crono} crono
         */
        remove: function (crono) {
            var children = this._children,
                len = children.length,
                ret = null;

            while (len--) {
                if (children[len] === crono) {
                    ret = children.splice(len, 1);
                    break;
                }
            }

            return ret;
        },

        /**
         * function of arguments invoke to takes each child.
         */
        each: function (func, context) {
            each(this._children, func, context || this);
        },

        /**
         * Set parent as this.
         * @param {Crono} crono
         */
        setParent: function (crono) {
            this._parent = crono;
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
                crono[i].setParent(this);
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
            this.play();

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
            this.play();

            this.each(function (child) {
                child.timeBackward();
            });
        },

        getLastFrame: function () {
            return this._lastFrame || 0;
        },

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


    /**
     * A stage object. It can has children of Crono class.
     * Disposal <- EvtEmit <- Crono
     */
    var Stage = Crono.extend({
        name: 'Stage',
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
                lastFrame = this._lastFrame,
                endFlg    = false,
                t;

            if (this._stopped) {
                return;
            }

            t = this._reversing ? --this._frame : ++this._frame;

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

            if (this._running) {
                return;
            }

            this._running = true;

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
            this._running = false;
        }
    });

    /////////////////////////////////////////////////////////////////

    /**
     * Keyframes class.
     * @constructor
     * Disposal <- EvtEmit
     */
    var Keyframes = EvtEmit.extend({
        name: 'Keyframes',
        isMSIEUnder8: (function () {
            var isMsie  = navigator.userAgent.indexOf('MSIE') > -1,
                version = /msie\s+([\.\d]+)/i.exec(navigator.userAgent);

            version = version ? +version[1] : null;

            return isMsie && (version <= 8);
        }()),
        init: function (el, frames, config) {

            config || (config = {});
            config.defaults || (config.defaults = {});

            if (({}).toString.call(frames) !== '[object Array]') {
                frames = [frames];
            }

            this.el = el;
            this._frames = frames;
            this._config = config;
            this._optimize();
        },

        dispose: function () {
            this._super();
            this._keyframeActions = null;
            this._frames = null;
        },

        /*! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            PRIVATE METHODS.
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        /**
         * @param {number} pos As frame position.
         */
        _getKeyframes: function (pos) {

            var frames = this._frames,
                len  = frames.length,
                from = null,
                to   = null;

            while (len--) {
                if (frames[len].frame === pos) {
                    from = frames[len];
                    break;
                }
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

        _checkFilter: function (prop) {
            var filterMap = {
                opacity: {
                    name: 'alpha',
                    magni: 100
                }
            };

            return filterMap[prop];
        },
        
        /**
         * Optimize data.
         */
        _optimize: function () {

            var frameItem = null,
                keyframeActions = {},
                frames = this._frames,
                config = this._config;

            this.each(function (frame) {

                if (!frame) {
                    return
                }

                var properties,
                    prop_ = '',
                    tmp  = [],
                    filterType = [],
                    ch   = '',
                    type1, type2, propType,
                    unit = '',
                    div  = null,
                    vp   = null;

                frame.easing = easing[frame.timingFunction || config.defaults.timingFunction || ''];

                if (isFunction(frame.on)) {
                    keyframeActions[frame.frame] = frame.on;
                }

                if ((properties = frame.properties)) {
                    frame.properties_ = {};

                    for (var prop in properties) {
                        prop_ = '';
                        div  = doc.createElement('div');
                        unit = '';

                        if (this.isMSIEUnder8 && (filterType = this._checkFilter(prop))) {
                            prop_ = 'filter';
                            if (filterType.magni) {
                                properties[prop] *= filterType.magni;
                            }
                            properties[prop] = filterType.name + '(' + prop + '=' + properties[prop] + ')'
                        }

                        if (!(prop in div.style)) {
                            //check prefix
                            if (prop.charAt(0) === '@') {
                                for (var i = 0, l = prefixList.length; i < l; ++i) {
                                    propType = prefixList[i] + prop.slice(1);
                                    tmp = /^(-)(\w+)-(\w)(\w+)$/.exec(propType);

                                    //e.g. webkitTransform
                                    type1 = tmp[2] + tmp[3].toUpperCase() + tmp[4];

                                    //e.g. WebkitTransform
                                    ch = tmp[2].slice(0, 1).toUpperCase();
                                    tmp[2] = tmp[2].slice(1);
                                    type2 = ch + tmp[2] + tmp[3].toUpperCase() + tmp[4];

                                    if (type1 in div.style) {
                                        prop_ = type1;
                                        break;
                                    }
                                    else if (type2 in div.style) {
                                        prop_ = type2;
                                        break;
                                    }
                                }

                                if (prop_ === '') {
                                    delete properties[prop];
                                    continue;
                                }
                            }
                            else {
                                //delete properties[prop];
                                //continue;
                            }
                        }

                        if (typeof properties[prop] === 'number') {
                            unit = getUnitType(prop);
                        }

                        div.style[prop_ || prop] = properties[prop] + (unit || '');

                        if (!div.style[prop_ || prop]) {
                            //delete properties[prop];
                            //continue;
                        }

                        vp = new ValueParser(this.el, (prop_ || prop), properties[prop]);
                        var tmp = vp.parse();
                        vp.dispose();

                        frame.properties_[prop_ || prop] = tmp;
                    }
                }
            }, this);

            this._keyframeActions = keyframeActions;

            if ((frameItem = frames[frames.length - 1])) {
                this._lastFrame = frameItem.frame;
            }
        },

        _makeProperties: function (properties) {
            var ret = {};

            for (var prop in properties) {
                ret[prop] = properties[prop].toString();
            }

            return ret;
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
         * @return {?Object}
         */
        getFrameAt: function (pos) {

            var keyframeActions = this._keyframeActions,
                lastFrame = this._lastFrame,
                keyframes = null,
                from = null,
                to   = null,
                ret  = {},

                easeFunc,
                fromProp,
                toProp,
                fromVal,
                toVal;

            keyframes = this._getKeyframes(pos);
            from = keyframes.from;
            to   = keyframes.to;

            if (!from) {
                return null;
            }

            easeFunc = from.easing;

            if (!to) {
                ret = this._makeProperties(from.properties_);
            }
            else if (!easeFunc) {
                ret = this._makeProperties(from.properties_);
            }
            else {
                fromProp = from.properties_;
                toProp   = to.properties_;

                var fromFrame = from.frame,
                    f = 0,
                    b = 0,
                    c = 0,
                    d = to.frame - fromFrame,
                    val = 0,
                    unit = '',
                    action = null,
                    flg = false,
                    tmp = [];

                for (var prop in fromProp) {

                    flg = (fromProp[prop] && toProp[prop]);

                    if (flg === 0 || flg) {
                        fromVal = fromProp[prop].getValues();
                        toVal   = toProp[prop].getValues();
                        tmp = [];

                        for (var i = 0, l = fromVal.length; i < l; ++i) {
                            b = fromVal[i];
                            f = toVal[i];
                            c = f - b;
                            tmp.push(easeFunc(pos - fromFrame, b, c, d));
                        }

                        ret[prop] = fromProp[prop].stringify(tmp);
                    }
                }
            }

            if ((action = keyframeActions[pos])) {
                action.call(this._parent);
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
    
    /**
     * Movie class.
     * @constructor
     * Disposal <- EvtEmit <- Crono
     */
    var Movie = Crono.extend({
        name: 'Movie',
        init: function (el, keyframes, config) {
            this._super();

            config || (config = {});

            if (typeof el === 'string') {
                this.el = doc.querySelector(el);
            }
            else {
                this.el = el;
            }

            this._index = 0;

            this._autoDestroy = config.autoDestroy;
            this._autoDispose = config.autoDispose;
            this.setKeyframes(keyframes, config);
        },

        dispose: function (removeNode) {
            this._super(removeNode);
            this.each(function (child) {
                child.dispose();
            });
            this._parent.remove(this);
            this._keyframes.dispose();
            this._keyframes = null;
        },

        /**
         * @return {number}
         */
        getLastFrame: function () {
            return this._keyframes.getLastFrame();
        },

        /**
        /**
         * @param {boolean} reverse
         */
        enterFrame: function (isTerminal) {

            this._super(isTerminal);

            var lastFrame = this._lastFrame;

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
            else if (!isTerminal || lastFrame > t) {
                ++t;
            }

            if (t < 0) {
                this._frame = t = 0;
            }

            this._frame = t;

            if (this._prevT === t) {
                return;
            }

            this._prevT = t;

            // Fire event as animation end if frame is last frame.
            if (t === lastFrame) {
                this.fire('animationend', {
                    frame: t,
                    flow: this._reversing ? 'backward' : 'forward'
                });
            }

            props = keyframes.getFrameAt(t);

            if (el) {
                for (var prop in props) {
                    el.style[prop] = props[prop];
                }
            }

            if (this._autoDestroy === true && t === lastFrame) {
                this.dispose(true);
                return;
            }

            if (this._autoDispose === true && t === lastFrame) {
                this.dispose();
                return;
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
            this._frame = +pos - 1;
        },

        /**
         * Set keyframes.
         * @param {Keyframes} keyframes
         */
        setKeyframes: function (keyframes, config) {
            var _keyframes = null;

            _keyframes = keyframes instanceof Keyframes ? keyframes : new Keyframes(this.el, keyframes, config);
            _keyframes.setParent(this);

            this._keyframes = _keyframes;
            this._lastFrame = this.getLastFrame();
        }
    });

    exports.Keyframes = Keyframes;
    exports.Crono = Crono;
    exports.Stage = Stage;
    exports.Movie = Movie;

}(window, window.document, window.Class, window));
