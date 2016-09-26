// -----------------------------------------------------------------------------
// This file contains all helper functions for plugin
//




/**
 * Extend source object with properties of another object
 * @param  {Object} source
 * @param  {Object} properties
 * @return {Object}
 */
function extendDefaults(source, properties) {
   var property;
   for (property in properties) {
       if (properties.hasOwnProperty(property)) {
           source[property] = properties[property];
       }
   }
   return source;
}

/**
 * CrossBrowser transitionend event
 * @return {String} supported format of transitionend event
 */
function transitionEND() {
   var el = document.createElement("div");
   if (el.style.WebkitTransition) return "webkitTransitionEnd";
   if (el.style.OTransition) return "oTransitionEnd";
   return 'transitionend';
}

/**
 * Append styles from styleObject to element
 * @param {HTMLElement} elem
 * @param {Object} styleObject
 */
function setStyle(elem, styleObject) {
   for (var property in styleObject)
       elem.style[property] = styleObject[property];
}

/**
 * Get coordinates of elem
 * @param {HTMLElement} elem
 * @return {Object}
 */
function getOffsetRect(elem) {

   var box = elem.getBoundingClientRect();

   var body = document.body;
   var docElem = document.documentElement;

   var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
   var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

   var clientTop = docElem.clientTop || body.clientTop || 0;
   var clientLeft = docElem.clientLeft || body.clientLeft || 0;

   var top = box.top + scrollTop - clientTop;
   var left = box.left + scrollLeft - clientLeft;

   return {
       top: Math.round(top) + 'px',
       left: Math.round(left) + 'px',
       width: elem.offsetWidth + 'px',
       height: elem.offsetHeight + 'px'
   }
}

// var getScrollbarWidth = function() { var div, width = getScrollbarWidth.width; if (width === undefined) { div = document.createElement('div'); div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>'; div = div.firstChild; document.body.appendChild(div); width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth; document.body.removeChild(div); } return width; };

/**
 * setImmediate polifill CrossBrowser
 * @return {Function}
 */
(function(d,e){"use strict";if(d.setImmediate){return}var f=1;var g={};var h=false;var j=d.document;var k;function setImmediate(a){if(typeof a!=="function"){a=new Function(""+a)}var b=new Array(arguments.length-1);for(var i=0;i<b.length;i++){b[i]=arguments[i+1]}var c={callback:a,args:b};g[f]=c;k(f);return f++}function clearImmediate(a){delete g[a]}function run(a){var b=a.callback;var c=a.args;switch(c.length){case 0:b();break;case 1:b(c[0]);break;case 2:b(c[0],c[1]);break;case 3:b(c[0],c[1],c[2]);break;default:b.apply(e,c);break}}function runIfPresent(a){if(h){setTimeout(runIfPresent,0,a)}else{var b=g[a];if(b){h=true;try{run(b)}finally{clearImmediate(a);h=false}}}}function installNextTickImplementation(){k=function(a){process.nextTick(function(){runIfPresent(a)})}}function canUsePostMessage(){if(d.postMessage&&!d.importScripts){var a=true;var b=d.onmessage;d.onmessage=function(){a=false};d.postMessage("","*");d.onmessage=b;return a}}function installPostMessageImplementation(){var b="setImmediate$"+Math.random()+"$";var c=function(a){if(a.source===d&&typeof a.data==="string"&&a.data.indexOf(b)===0){runIfPresent(+a.data.slice(b.length))}};if(d.addEventListener){d.addEventListener("message",c,false)}else{d.attachEvent("onmessage",c)}k=function(a){d.postMessage(b+a,"*")}}function installMessageChannelImplementation(){var c=new MessageChannel();c.port1.onmessage=function(a){var b=a.data;runIfPresent(b)};k=function(a){c.port2.postMessage(a)}}function installReadyStateChangeImplementation(){var c=j.documentElement;k=function(a){var b=j.createElement("script");b.onreadystatechange=function(){runIfPresent(a);b.onreadystatechange=null;c.removeChild(b);b=null};c.appendChild(b)}}function installSetTimeoutImplementation(){k=function(a){setTimeout(runIfPresent,0,a)}}var l=Object.getPrototypeOf&&Object.getPrototypeOf(d);l=l&&l.setTimeout?l:d;if({}.toString.call(d.process)==="[object process]"){installNextTickImplementation()}else if(canUsePostMessage()){installPostMessageImplementation()}else if(d.MessageChannel){installMessageChannelImplementation()}else if(j&&"onreadystatechange"in j.createElement("script")){installReadyStateChangeImplementation()}else{installSetTimeoutImplementation()}l.setImmediate=setImmediate;l.clearImmediate=clearImmediate}(typeof self==="undefined"?typeof global==="undefined"?this:global:self));


var transition =
        "webkitTransition" in document.body.style ? (transitionend = "webkitTransitionEnd") && "webkitTransition" :
        "mozTransition" in document.body.style ? "mozTransition" :
        "transition" in document.body.style ? "transition" :
        false;
