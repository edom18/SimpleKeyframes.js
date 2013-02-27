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

* play
* stop
* playFor
* playBack
* gotoAndPlay
* gotoAndStop
* go
* timeForward
* timeBackward

##Syntax

###Movie class
<pre><code class="javascript">var movie = new Movie(Element, keyframes, options);
</code></pre>

####Element

Must be specific an element.

####keyframes

Keyframes objects as Object literal.

####options

Options. If you give `defaults` property, this is used default property.  
It has a few arguments.

* 1, autoDispose
    * If auto dispose is true, movie will be disposed in end frame.
* 2, autoDestroy
    * If auto destroy is true, movie will be disposed and removed element in end frame.
* 3, timingFunction
    * timingFunction is easing name will be used entire timing function as easing.

##Sample code snipet

<pre><code class="javascript">var stage = new Stage();
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

If you want to use CSS3 properties with prefix, you need to add `@` before property name. Code is like this:
<pre><code class="javascript">{ frame: 0,  properties: { left: 0, top: '5%', '@transfrom': 'translate3d(0px, 50px, 0px) rotate(30deg)' } }
</code></pre>
