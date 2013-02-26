#SimpleyKeyframes.js

This script gives Simple keyframes system.  
All you need to prefer to normally layout HTML with CSS.
Then, you set up SimpleyKeyframes.

This script is based on `Class.js`.

##Classes

Crono

Stage

Movie

Keyframes

##Methods

* playFor
* playBack
* gotoAndPlay
* gotoAndStop
* go
* timeForward
* timeBackward


##Sample

<pre><code class="javascript">
var stage = new Stage();
var movie = new Movie(document.getElementById('hoge'), {
    { frame: 0,  properties: { left: 0, top: '5%', '@transfrom': 'translate3d(0px, 50px, 0px) rotate(30deg)' } },
    { frame: 10, properties: { left: 0, top: '10%', '@transfrom': 'translate3d(100px, 50px, 0px) rotate(80deg)' }, on: function () { this.stop(); } },
    { frame: 10, timinigFunction: 'linear', properties: { left: 0, top: '10%', '@transfrom': 'translate3d(100px, 50px, 0px) rotate(80deg)' } }
}, {
    defaults: {
        autoDestroy: true,
        autoDispose: true,
        timingFunction: 'linear'
    }
});
</code></pre>
