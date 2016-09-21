(function(){
/**
 * @author 7iomka <7iomka@gmail.com>
 * Plugin sPopup - clean js plugin for turn your content into fullscreen
 * @param  {(string)} selector - one selector or multiple selector, separated with comma
 * @param  {Object} options - user params as settings
 */
  this.sPopup = function(selector, options) {

    this.selector = selector;

    var defaults = {
        openClass: '.open',
        closedClass: '.closed',
        speed: 1, /// Number
        type: 'up', /// String
        background: '#fff', /// String
        gutter: 0, /// Number || Array
        overlayBackgroud: 'transparent', /// String
        transition: 'ease',
        contentMaxWidth: false
    }

    this.options = defaults; /// if initializiation with single argument

    // Create options by extending defaults with the passed in second argument
    if (options && typeof options === "object") {
        this.options = extendDefaults(defaults, options);
    }


    this.skeletonSelectors = {
        overlayElement: '.sPopup_overlay',
        innerOverlayElement: '.sPopup_innerOverlay',
        containerElement: '.sPopup_container',
        headerElement: '.sPopup_header',
        footerElement: '.sPopup_footer',
        contentElement: '.sPopup_content',
        closeElement: '.sPopup_close'
    }

    /// short equivavelents
    this.speed = this.options.speed;
    this.type = this.options.type;
    this.transition = this.options.transition;
    this.background = this.options.background;
    this.init();

}
    // Public Methods

  sPopup.prototype.init = function () {
    document.body.classList.add('sPopup_attached');
    var skeleton = '<div class="sPopup_overlay closed"> <div class="sPopup_container"> <div class="sPopup_header"> <div class="sPopup_close">x</div> </div> <div class="sPopup_content"></div> <div class="sPopup_footer"></div> </div> <div class="sPopup_innerOverlay"></div> </div>';
    document.body.insertAdjacentHTML('beforeEnd', skeleton);

    this.selectorElement =  document.querySelectorAll( this.selector );
    this.overlayElement = document.querySelector( this.skeletonSelectors.overlayElement );
    this.innerOverlayElement = document.querySelector( this.skeletonSelectors.innerOverlayElement );
    this.contentElement = document.querySelector( this.skeletonSelectors.contentElement );

    this.containerElement   = document.querySelector( this.skeletonSelectors.containerElement );
    this.headerElement   = document.querySelector( this.skeletonSelectors.headerElement );
    this.footerElement   = document.querySelector( this.skeletonSelectors.footerElement );
    this.closeElement   = document.querySelector( this.skeletonSelectors.closeElement );

    this.containerElement.style.background = this.options.background;
    this.innerOverlayElement.style.background = this.options.overlayBackgroud;


    /// Content Max Width if isset
    if(this.options.contentMaxWidth) {
      this.overlayElement.classList.add('sPopup_not_fullwidth');
      var hasPercent = this.options.contentMaxWidth.indexOf('%') >= 0;
      var finalMaxW = hasPercent ? this.options.contentMaxWidth : this.options.contentMaxWidth + 'px';
      this.contentElement.style.maxWidth = finalMaxW;
    }

    this.initPosition = false;
    this.transitionEnd = transitionSelect();
    this.isClosed = true;
    this.isOpen = false;
    var _this = this;

    [].forEach.call(this.selectorElement, function (item, i) {
      /**
       * for each element of selector add a listenner click
       */

      item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _this.open(item);

      });

    });


  }


  sPopup.prototype.open = function(item) {

      if (this.isClosed) {

          this.contentElement.appendChild(item.cloneNode(true));

          this.overlayElement.style.transition = 'none';
          var startPos = getOffsetRect(item);
          this.initPosition = startPos; // save position of element, from where we clicked
          setStyle(this.overlayElement, startPos);

          var _this = this;

          setTimeout(function() { //// ZERO timeout START

              _this.overlayElement.style.transition = _this.speed + 's ' + _this.transition + ' all';

              var scrollWidth = Math.max(
                  document.body.scrollWidth, document.documentElement.scrollWidth,
                  document.body.offsetWidth, document.documentElement.offsetWidth,
                  document.body.clientWidth, document.documentElement.clientWidth
              );

              var scrollHeight = Math.max(
                  document.body.scrollHeight, document.documentElement.scrollHeight,
                  document.body.offsetHeight, document.documentElement.offsetHeight,
                  document.body.clientHeight, document.documentElement.clientHeight
              );



              var newWidth = scrollWidth - (Array.isArray(_this.options.gutter) ? _this.options.gutter[0] : _this.options.gutter) * 2 + 'px';
              var newHeight = scrollHeight - (Array.isArray(_this.options.gutter) ? _this.options.gutter[1] : _this.options.gutter) * 2 + 'px';

              _this.overlayElement.style.width = newWidth;
              _this.overlayElement.style.height = newHeight;

              /**
               * make gutter
               */

              if (Array.isArray(_this.options.gutter)) {

                  var gutterLeft = _this.options.gutter[0],
                      gutterTop = _this.options.gutter[1];

                  _this.overlayElement.style.left = gutterLeft + 'px';
                  _this.overlayElement.style.top = gutterTop + 'px';
              } else {

                  _this.overlayElement.style.left = _this.options.gutter + 'px';
                  _this.overlayElement.style.top = _this.options.gutter + 'px';

              }


          }, 0); //// ZERO timeout FINISH

          this.overlayElement.classList.remove('closed');
          this.overlayElement.classList.add('open');

          this.overlayElement.addEventListener(this.transitionEnd, function(e) {

              _this.isClosed = false;
              _this.isOpen = true;

              initializeEvents.call(_this);
          });

      }



  }


  sPopup.prototype.close = function() {
  console.log(this.isOpen);
      if (this.isOpen) {

          setStyle(this.overlayElement, this.initPosition);
          this.overlayElement.classList.remove('open');
          this.overlayElement.classList.add('closed');
          var _this = this;
          this.overlayElement.addEventListener(this.transitionEnd, function() {
              if (_this.overlayElement.classList.contains('closed')) {
                  _this.contentElement.innerHTML = '';
                  _this.isClosed = true;
                  _this.isOpen = false;
              }
          });
      }

  }

 // Private Methods



  function initializeEvents() {
    this.closeElement.addEventListener('click', this.close.bind(this));
}

function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
        }
    }
    return source;
}

function transitionSelect() {
    var el = document.createElement("div");
    if (el.style.WebkitTransition) return "webkitTransitionEnd";
    if (el.style.OTransition) return "oTransitionEnd";
    return 'transitionend';
}


function setStyle(obj, styleObject) {
    var elem = obj;
    for (var property in styleObject)
        elem.style[property] = styleObject[property];
}


function getOffsetRect(elem) {

    var box = elem.getBoundingClientRect()

    var body = document.body
    var docElem = document.documentElement

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0

    var top = box.top + scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft

    return {
        top: Math.round(top) + 'px',
        left: Math.round(left) + 'px',
        width: box.width + 'px',
        height: box.height + 'px'
    }
}

var getScrollbarWidth = function() {
    var div, width = getScrollbarWidth.width;
    if (width === undefined) {
        div = document.createElement('div');
        div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
        div = div.firstChild;
        document.body.appendChild(div);
        width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    }
    return width;
};





})()
