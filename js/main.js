(function (win, doc, exports) {

    'use strict';

    var $body = $('#cartArea > .cartInner');
    var cockpit = doc.getElementById('cockpit');
    var cnt = 0;

    function createCard() {
        var num = ~~(Math.random() * 3) + 1;
        var cardHtml = $('#card' + num).html();
        return $(cardHtml);
    }

    $('.btnInCart').click(function () {
        if (++cnt > 3) {
            return;
        }
        $body.append(createCard);

        $('.icon')
            .addClass('added')
            .one('webkitAnimationEnd', function () {
                $(this).removeClass('added');
            });
    });

    $('.star').click(function () {
        var $this = $(this);

        $this.addClass('stared');
        setTimeout(function () {
            $this.find('> img').attr('src', 'img/ico_star.png');
        }, 500);
    });

    ////////////////////////////////////////////////////////////////

    var fitter = new Fitter(cockpit, {x: 0, y: 146});

    ////////////////////////////////////////////////////////////////

    var stage = new Stage();

    var menu = doc.querySelector('#menu');
    var menuTtl = doc.querySelector('#menu span');
    var menuList = doc.querySelector('#menu ul');
    var targetL = doc.querySelector('.targetL');
    var targetR = doc.querySelector('.targetR');
    var cartArea = doc.querySelector('#cartArea .cartInner');
    var ttlCart = doc.querySelector('.ttlCart');
    var ctrl = doc.querySelector('.ctrl');
    var arrL = doc.querySelector('.arrL');
    var arrR = doc.querySelector('.arrR');

    var movie8 = new Movie(ctrl, [
        { frame: 10, properties: { opacity: 0 } },
        { frame: 11, properties: { opacity: 1 } },
        { frame: 12, properties: { opacity: 0 } },
        { frame: 13, properties: { opacity: 1 } }
    ]);

    var movie9 = new Movie(arrL, [
        { timingFunction: 'linear', frame: 0, properties: { left: -19 } },
        { timingFunction: 'linear', frame: 140, properties: { left: -19 } },
        { timingFunction: 'linear', frame: 150, properties: { left: -24 } },
        { timingFunction: 'linear', frame: 160, properties: { left: -19 }, onEnterFrame: function () { this._frame = 0; this._index = 0; } }
    ]);

    var movie10 = new Movie(arrR, [
        { timingFunction: 'linear', frame:   0, properties: { right: -19 } },
        { timingFunction: 'linear', frame: 140, properties: { right: -19 } },
        { timingFunction: 'linear', frame: 150, properties: { right: -24 } },
        { timingFunction: 'linear', frame: 160, properties: { right: -19 }, onEnterFrame: function () { this._frame = 0; this._index = 0; } }
    ]);

    var movie1 = new Movie(menu, [
        { frame: 20, properties: { opacity: 0 } },
        { frame: 40, properties: { opacity: 1 } }
    ]);

    var movie2 = new Movie(menuTtl, [
        { frame: 27, properties: { left: 197.5, width: 0 } },
        { frame: 47, properties: { left: 0, width: 395 } }
    ]);

    var movie3 = new Movie(menuList, [
        { frame: 41, properties: { opacity: 0 } },
        { frame: 67, properties: { opacity: 1 } }
    ]);

    var movie4 = new Movie(targetL, [
        { frame: 45, properties: { top: 100, left: 100, opacity: 0 } },
        { frame: 48, properties: { top: 80, left: 100, opacity: 1 } },
        { frame: 60, properties: { left: -20 } }
    ]);

    var movie5 = new Movie(targetR, [
        { frame: 45, properties: { top: 100, right: 100, opacity: 0 } },
        { frame: 48, properties: { top: 80, right: 100, opacity: 1 } },
        { frame: 60, properties: { right: 18 } }
    ]);

    var movie7 = new Movie(ttlCart, [
        { frame: 61, properties: { opacity: 0 } },
        { frame: 62, properties: { opacity: 1 } },
        { frame: 63, properties: { opacity: 0 } },
        { frame: 64, properties: { opacity: 1 } }
    ]);

    var movie6 = new Movie(cartArea, [
        { frame: 70, properties: { opacity: 0 } },
        { frame: 79, properties: { opacity: 1 } }
    ]);

    stage.add([
        //movie2
        movie1, movie2, movie3, movie4,
        movie5, movie6, movie7, movie8,
        movie9, movie10
    ]);

    $(window).load(function () {
        stage.run();
    });

}(window, document, window));
