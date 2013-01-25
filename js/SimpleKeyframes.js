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

        var unit = div.style[prop];
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

    ////////////////////////////////////////////////////////

    var Crono = Class.extend({
        init: function () {
            this._children = [];
            this.start();
        },
        add: function (crono) {
            if (({}).toString.call(crono) !== '[object Array]') {
                crono = [crono];
            }

            for (var i = 0, l = crono.length; i < l; ++i) {
                this._children.push(crono[i]);
            }
        },

        enterFrame: function () {
            var children = this._children;
            var len = children.length;

            if (this._stopped) {
                return;
            }

            while (len--) {
                children[len].enterFrame();
            }
        },

        start: function () {
            this._stopped = false;
        },
        stop: function () {
            this._stopped = true;
        }
    });

    /////////////////////////////////////////////////////////////////


    var Stage = Crono.extend({
        init: function () {
            this._super();
            this._stopped = true;
            this._reversing = false;
        },
        flow: function () {
            var children  = this._children,
                len       = children.length,
                reversing = this._reversing;

            if (this._stopped) {
                return;
            }

            while (len--) {
                children[len].enterFrame(reversing);
            }
        },
        timeForward: function () {
            this._reversing = false;
        },
        timeBackward: function () {
            this._reversing = true;
        },
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
        stop: function () {
            this._super();
            clearTimeout(this.frameTimer);
        }
    });

    /////////////////////////////////////////////////////////////////

    var Keyframes = Class.extend({
        init: function (frames) {
            this._frames = frames;
        },

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
         * @param {Crono} crono
         */
        setParent: function (crono) {
            this._parent = crono;
        },

        /**
         * @param {number} pos
         */
        getFrameAt: function (pos) {

            var keyframes = this._getKeyframes(pos),
                from  = keyframes.from,
                to = keyframes.to,
                ret = {},

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

            if (from && from.frame === pos) {
                if (from.onEnterFrame) {
                    from.onEnterFrame.call(this._parent);
                }
            }

            if (to && to.frame === pos) {
                if (to.onEnterFrame) {
                    to.onEnterFrame.call(this._parent);
                }
            }

            return ret;
        }
    });

    /////////////////////////////////////////////////////////////////
    
    var Movie = Crono.extend({
        init: function (el, keyframes) {
            this._super();

            this.el        = el;
            this._frame    = 0;
            this._index    = 0;

            keyframes = keyframes instanceof Keyframes ? Keyframes : new Keyframes(keyframes);
            keyframes.setParent(this);

            this._keyframes = keyframes;
        },
        enterFrame: function (reverse) {
            var t     = reverse ? this._frame-- : this._frame++,
                el    = this.el,
                props;

            (t < 0) && (this._frame = 0);
            props = this._keyframes.getFrameAt(t);

            for (var prop in props) {
                el.style[prop] = props[prop];
            }
        },
        gotoAndPlay: function (pos) {
            this.go(pos);
            this.start();
        },
        gotoAndStop: function (pos) {
            this.go(pos);
            this.stop();
        },
        go: function (pos) {
            this._frame = +pos;
        }
    });

    exports.Keyframes = Keyframes;
    exports.Crono = Crono;
    exports.Stage = Stage;
    exports.Movie = Movie;

}(window, window.document, window.Class, window));
