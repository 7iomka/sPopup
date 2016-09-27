// -----------------------------------------------------------------------------
// This file contains all helper functions for plugin
//




/**
 * Extend source object with properties of another object
 * @param  {Object} source
 * @param  {Object} properties
 * @return {Object}
 */
function extend(source, properties) {
   var property;
   for (property in properties) {
       if (properties.hasOwnProperty(property)) {
           source[property] = properties[property];
       }
   }
   return source;
}

/**
 * Allow to call any function fn no earlier until after a delay
 * @param  {Function} fn
 * @param  {Number}   delay
 * @return {Function}
 */
function throttle(fn, delay) {
  var allowSample = true;

  return function(e) {
    if (allowSample) {
      allowSample = false;
      setTimeout(function() { allowSample = true; }, delay);
      fn(e);
    }
  };
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

function notNull(attr) {
  return attr !== "0px";
}

function getNumVal(val) {
  var valArr = val.split('px');
  return parseFloat(valArr[0]);
}


/**
 * If elem has style property prop CrossBrowser - get this
 * @param  {HTMLElement}  elem
 * @param  {string}  prop
 * @return {Boolean||String} false if not has style
 */
function getStyleIfExist(elem, prop) {

  var elStyle = getComputedStyle(elem, null),
        prefixes = ['webkit', 'Webkit', 'Moz', 'moz', 'Ms', 'ms', 'O', 'o', ''],
        len = prefixes.length,
        property = prop[0].toUpperCase() + prop.substr(1),
        supportedVariant = [];

    for(var i = 0; i < len; i++) {
      if(prefixes[i] == '') property = property.toLowerCase();
      if(elStyle[prefixes[i] + property] != undefined){
        supportedVariant.push(elStyle[prefixes[i] + property]);
      }
    }

    return supportedVariant.length ? (supportedVariant.length > 1 ? supportedVariant[supportedVariant.length-1] : supportedVariant[0] ) : false;

  }


/**
 * Get coordinates of elem
 * @param {HTMLElement} elem
 * @return {Object}
 */
function getOffsetRect(elem, context) {

   var box = elem.getBoundingClientRect();
   var style = getComputedStyle(elem);

   var body = document.body;
   var docElem = document.documentElement;

   var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
   var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

   var clientTop = docElem.clientTop || body.clientTop || 0;
   var clientLeft = docElem.clientLeft || body.clientLeft || 0;

   var elWidth = elem.offsetWidth;
   var elHeight = elem.offsetHeight;
   var elTop = box.top + scrollTop - clientTop;
   var elLeft = box.left + scrollLeft - clientLeft;

   console.table(style);
    if(style.boxSizing === "border-box") {
      context.isBorderBox = true;
      if(notNull(style.paddingLeft)) {
        elWidth -= 2 * getNumVal(style.paddingLeft);
        elLeft  += getNumVal(style.paddingLeft);
      };
      if(notNull(style.paddingTop)) {
        elHeight -= 2 * getNumVal(style.paddingTop);
        elTop += getNumVal(style.paddingTop);
      }
    }
    console.log(elWidth);
    console.log(elHeight);



   return {
       top: Math.round(elTop) + 'px',
       left: Math.round(elLeft) + 'px',
       width: elWidth + 'px',
       height: elHeight + 'px'
   }
}


/**
 * Test if item contains in styles box-sizing:border-box
 * @param  {HTMLElement}  item
 * @return {Boolean}
 */
function hasBorderBox(item) {
    return getStyleIfExist(item, "box-sizing") === "border-box";
}



// var getScrollbarWidth = function() { var div, width = getScrollbarWidth.width; if (width === undefined) { div = document.createElement('div'); div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>'; div = div.firstChild; document.body.appendChild(div); width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth; document.body.removeChild(div); } return width; };

/**
 * setImmediate polifill CrossBrowser
 * @return {Function}
 */
(function(d,e){"use strict";if(d.setImmediate){return}var f=1;var g={};var h=false;var j=d.document;var k;function setImmediate(a){if(typeof a!=="function"){a=new Function(""+a)}var b=new Array(arguments.length-1);for(var i=0;i<b.length;i++){b[i]=arguments[i+1]}var c={callback:a,args:b};g[f]=c;k(f);return f++}function clearImmediate(a){delete g[a]}function run(a){var b=a.callback;var c=a.args;switch(c.length){case 0:b();break;case 1:b(c[0]);break;case 2:b(c[0],c[1]);break;case 3:b(c[0],c[1],c[2]);break;default:b.apply(e,c);break}}function runIfPresent(a){if(h){setTimeout(runIfPresent,0,a)}else{var b=g[a];if(b){h=true;try{run(b)}finally{clearImmediate(a);h=false}}}}function installNextTickImplementation(){k=function(a){process.nextTick(function(){runIfPresent(a)})}}function canUsePostMessage(){if(d.postMessage&&!d.importScripts){var a=true;var b=d.onmessage;d.onmessage=function(){a=false};d.postMessage("","*");d.onmessage=b;return a}}function installPostMessageImplementation(){var b="setImmediate$"+Math.random()+"$";var c=function(a){if(a.source===d&&typeof a.data==="string"&&a.data.indexOf(b)===0){runIfPresent(+a.data.slice(b.length))}};if(d.addEventListener){d.addEventListener("message",c,false)}else{d.attachEvent("onmessage",c)}k=function(a){d.postMessage(b+a,"*")}}function installMessageChannelImplementation(){var c=new MessageChannel();c.port1.onmessage=function(a){var b=a.data;runIfPresent(b)};k=function(a){c.port2.postMessage(a)}}function installReadyStateChangeImplementation(){var c=j.documentElement;k=function(a){var b=j.createElement("script");b.onreadystatechange=function(){runIfPresent(a);b.onreadystatechange=null;c.removeChild(b);b=null};c.appendChild(b)}}function installSetTimeoutImplementation(){k=function(a){setTimeout(runIfPresent,0,a)}}var l=Object.getPrototypeOf&&Object.getPrototypeOf(d);l=l&&l.setTimeout?l:d;if({}.toString.call(d.process)==="[object process]"){installNextTickImplementation()}else if(canUsePostMessage()){installPostMessageImplementation()}else if(d.MessageChannel){installMessageChannelImplementation()}else if(j&&"onreadystatechange"in j.createElement("script")){installReadyStateChangeImplementation()}else{installSetTimeoutImplementation()}l.setImmediate=setImmediate;l.clearImmediate=clearImmediate}(typeof self==="undefined"?typeof global==="undefined"?this:global:self));

var supportedTransition = transitionEND();
var transition =
        "webkitTransition" in document.body.style ? (supportedTransition = "webkitTransitionEnd") && "webkitTransition" :
        "mozTransition" in document.body.style ? "mozTransition" :
        "transition" in document.body.style ? "transition" :
        false;
