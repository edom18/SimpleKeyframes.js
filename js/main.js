(function (win, doc, exports) {

    'use strict';

    ////////////////////////////////////////////////////////////////

    var stage = new Stage();
    var elms = [].slice.call(doc.querySelectorAll('.movie'));

    var movie1 = new Movie(elms[0], [
        { frame: 10, properties: { '@transform': 'rotate(0deg)' }, on: function () { this.playFor(); } },
        { frame: 40, properties: { '@transform': 'rotate(90deg) scale(1)' } },
        { frame: 70, properties: { '@transform': 'rotate(90deg) scale(0.5)' } },
        { frame: 100, properties: { '@transform': 'rotate(90deg) scale(0.5) translate3d(0px, 0px, 0px)' } },
        { frame: 130, properties: { '@transform': 'rotate(90deg) scale(0.5) translate3d(100px, -20px, 0px)' }, on: function () { this.playBack(); } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    var movie2 = new Movie(elms[1], [
        { frame: 10, properties: { width: '+=50', height: 0 }, on: function () { this.playFor(); } },
        { frame: 140, properties: { width: '+=100', height: 100 }, on: function () { this.playBack(); } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    var movie3 = new Movie(elms[2], [
        { frame: 40, properties: { opacity: 0, top: '-=30' }, on: function () { this.playFor(); } },
        { frame: 80, properties: { opacity: 1, top: '+=70' }, on: function () { this.playBack(); } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    var movie4 = new Movie(elms[3], [
        { frame: 1, properties: { width: 100, height: 100 }, on: function () { this.stop(); } },
        { frame: 10, properties: { width: 120, height: 120 }, on: function () { this.stop(); } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    elms[3].addEventListener('mouseover', function (e) {
        movie4.playFor();
    }, false);
    elms[3].addEventListener('mouseout', function (e) {
        movie4.playBack();
    }, false);

    var movie5 = new Movie(elms[4], [
        { frame: 20, properties: { width: 100, height: 10 }, on: function () { this.playFor(); } },
        { frame: 50, properties: { width: 220, height: 10 } },
        { frame: 61, properties: { height: 10 } },
        { frame: 100, properties: { height: 100 }, on: function () { this.playBack(); } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });


    var movie6 = new Movie(elms[5], [
        { frame: 20, properties: { left: 20 }, on: function () { this.playFor(); } },
        { frame: 50, properties: { left: 400, top: 660 } },
        { frame: 100, properties: { top: 400 }, on: function () { this.playBack(); } }
    ], {
        defaults: {
            timingFunction: 'easeInOutQuint'
        }
    });

    stage.add([
        movie1,
        movie2, movie3, movie4,
        movie5, movie6
        //movie7, movie8,
        //movie9, movie10
    ]);

    window.addEventListener('load', function (e) {
        stage.run();
    }, false);

}(window, document, window));
