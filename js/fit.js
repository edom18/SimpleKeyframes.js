(function (win, doc, exports) {

    'use strict';

    /**
     * @param {Element} el
     * @param {Object} position
     */
    function Fitter(el, position) {

        this.el = el;
        this.position = position || {x: 0, y: 0};
        this.rect = el.getBoundingClientRect();

        win.addEventListener('scroll', this.onScroll.bind(this), false);
    }
    Fitter.fn = Fitter.prototype;

    Fitter.fn.onScroll = function () {
        var top = document.body.scrollTop;

        if (this._disabled) {
            return;
        }

        if (this.position.y <= top) {
            this.el.classList.add('fixed');
        }
        else {
            this.el.classList.remove('fixed');
        }
    };

    exports.Fitter = Fitter;
}(window, document, window));
