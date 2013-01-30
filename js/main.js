(function (win, doc, exports) {

    'use strict';

    ////////////////////////////////////////////////////////////////

    var stage = new Stage();
    var elms = [].slice.call(doc.querySelectorAll('.movie'));

    var movie1 = new Movie(elms[0], [
        { frame: 30, properties: { '-webkit-transform': 'scaleY(0)' } },
        { frame: 50, properties: { '-webkit-transform': 'scaleY(1)' } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    var movie2 = new Movie(elms[1], [
        { frame: 32, properties: { '-webkit-transform': 'scaleY(0)' } },
        { frame: 50, properties: { '-webkit-transform': 'scaleY(1)' } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    var movie3 = new Movie(elms[2], [
        { frame: 34, properties: { '-webkit-transform': 'scaleY(0)' } },
        { frame: 50, properties: { '-webkit-transform': 'scaleY(1)' } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

    var secound = new Movie(doc.querySelector('.secound'), [
        { frame: 55, properties: { left: 300, top: -150, '-webkit-transform': 'rotate(0deg)' } },
        { frame: 80, properties: { left: 450, top: 50, width: 50, height: 50, '-webkit-transform': 'rotate(360deg)' } },
        { frame: 95, properties: { width: 300, height: 50 } },
        { frame: 110, properties: { height: 300 } }
    ], {
        defaults: {
            timingFunction: 'easeInOutExpo'
        }
    });

    var movie4 = new Movie(elms[3], [
        { frame: 115, properties: { opacity: 0 } },
        { frame: 130, properties: { opacity: 1 } }
    ], {
        defaults: {
            timingFunction: 'easeInOutCubic'
        }
    });

//    var movie5 = new Movie(elms[4], [
//        { frame: 135, properties: { width: 220, height: 10 } },
//        { frame: 145, properties: { height: 50 }, on: function () { this.stop(); } }
//    ], {
//        defaults: {
//            timingFunction: 'easeInOutCubic'
//        }
//    });


    var movie6 = new Movie(elms[5], [
        { frame: 133, properties: { '-webkit-transform': 'scale(0)' } },
        { frame: 140, properties: { '-webkit-transform': 'scale(1)' } }
    ], {
        defaults: {
            timingFunction: 'easeInOutQuint'
        }
    });

    stage.add([
        movie1, movie2, movie3, movie4,
        //movie5,
        movie6, secound
    ]);

    doc.querySelector('.btnPlayBack').addEventListener('click', function (e) {
        stage.timeBackward();
    }, false);

    var flg = false;
    var starged = false;
    doc.querySelector('input').addEventListener('click', function (e) {
        if (!starged) {
            starged = true;
            stage.run();
        }

        (flg = !flg) ? stage.timeForward() : stage.timeBackward();
    }, false);

//    window.addEventListener('load', function (e) {
//        stage.run();
//    }, false);

}(window, document, window));
