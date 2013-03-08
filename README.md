xywh.js
=======

xywh.js implements the spatial media fragments dimension of the W3C Media Fragments URI specification as a polyfill. See http://www.w3.org/TR/media-frags/#naming-space for the full details.

Demo
====

See http://tomayac.github.com/xywh.js/demo.html

Demo
====

See http://tomayac.github.com/xywh.js/demo.html

Usage
=====

Simply include xywh_min.js in your application. The polyfill will run when the "load" event fires. Additionally, a function

    mediaFragments.apply()

is exposed, which can be used to apply media fragments of dynamically added media items.

Mark-up
=======

Mark up your media items like so:

    <img src="kitten.jpg#xywh=100,100,50,50"/>
    <img src="kitten.jpg#xywh=pixel:100,100,50,50"/>
    <img src="kitten.jpg#xywh=percent:25,25,50,50"/>

License
=======

xywh.js was created by Thomas Steiner (tomac@google.com) and is provided under the CC0 1.0 Universal (CC0 1.0) license.
