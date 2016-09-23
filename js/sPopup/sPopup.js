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
        openClass: 'open',
        closedClass: 'closed',
        expandedClassOfContentBase: 'sPopup__content-expanded',
        speed: 1, /// Number
        type: 'up', /// String
        background: '#fff', /// String
        gutter: 0, /// Number || Array
        overlayBackgroud: 'transparent', /// String
        overlayTransition: 'ease',
        transition: 'ease',
        contentMaxWidth: false
    }

    this.options = defaults; /// if initializiation with single argument

    // Create options by extending defaults with the passed in second argument
    if (options && typeof options === "object") {
        this.options = extendDefaults(defaults, options);
    }


    this.skeletonSelectors = {
        baseElement: '.sPopup',
        overlayElement: '.sPopup_overlay',
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

  /********************************* INIT METHOD START ********************************/
  sPopup.prototype.init = function () {
    /// Add class to body for styles
    document.body.classList.add('sPopup_attached');

    /// Initialize basic skeleton op popup and insert that in end of the body
    var skeleton = '<div class="sPopup closed"> <div class="sPopup_container"> <div class="sPopup_header"> <div class="sPopup_close">x</div> </div> <div class="sPopup_content"></div> <div class="sPopup_footer"></div> </div> </div> <div class="sPopup_overlay"></div>';
    document.body.insertAdjacentHTML('beforeEnd', skeleton);

    /// Define HTML elements using skeletonSelectors object with selectors
    this.selectorElement =  document.querySelectorAll( this.selector );
    this.baseElement = document.querySelector( this.skeletonSelectors.baseElement );
    this.overlayElement = document.querySelector( this.skeletonSelectors.overlayElement );
    this.contentElement = document.querySelector( this.skeletonSelectors.contentElement );
    this.containerElement   = document.querySelector( this.skeletonSelectors.containerElement );
    this.headerElement   = document.querySelector( this.skeletonSelectors.headerElement );
    this.footerElement   = document.querySelector( this.skeletonSelectors.footerElement );
    this.closeElement   = document.querySelector( this.skeletonSelectors.closeElement );


    /// Initial Position of container with popup
    this.initPosition = false;

    /// Set activeElement by default
    this.activeElement = false;

    /********************** INITIALIZATION ACTIONS ***********************************/

    /// Set content background from options
    this.containerElement.style.background = this.options.background;
    /// Set overlay background from options
    this.overlayElement.style.background = this.options.overlayBackgroud;
    this.overlayElement.style.transition = this.options.speed + 's all ' + this.options.overlayTransition;




    /// Initalize click event on the close button
    this.closeElement.addEventListener('click', this.close.bind(this, this.activeElement));



    /// Some actions, if in options user will determine contentMaxWidth option
    if(this.options.contentMaxWidth) {
      this.baseElement.classList.add('sPopup_not_fullwidth');
      var hasPercent = this.options.contentMaxWidth.indexOf('%') >= 0;
      var finalMaxW = hasPercent ? this.options.contentMaxWidth : this.options.contentMaxWidth + 'px';
      this.contentElement.style.maxWidth = finalMaxW;
    }



    /// global switches
    this.isClosed = true;
    this.isOpen = false;

    /// context memoization
    var _this = this;

    /// register click event on all elements passed as selector parametr
    [].slice.call(this.selectorElement).forEach(function (item, i) {

        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            /// open popup method
            _this.open(item);
        });

    });


  }
  /********************************* INIT METHOD END ********************************/

  sPopup.prototype.open = function(item) {
    console.log(this.isClosed);
      /// If current state of popup is closed
      if (this.isClosed) {
          /// we will make a clone of clicked item and append it into contentElement
          this.contentElement.appendChild(item.cloneNode(true));

          /// set item as active element
          this.activeElement = item;
          console.log(this.activeElement);
          /// remove all transitions from baseElement
          this.baseElement.style.transition = 'none';
          /// init start animation start-position - left,top,width,height of clicked element
          var startPos = getOffsetRect(item);
          console.log(startPos);
          /// memoization of animation start-position for next usage in close animation
          this.initPosition = startPos; // save position of element, from where we clicked
          /// append animation start-position
          setStyle(this.baseElement, startPos);

          /// basic memoization
          var _this = this;

          /// timeout for chaning
          setTimeout(function() { //// ZERO timeout START

              /// reset animation transition from NONE to transition from user options
              _this.baseElement.style.transition = _this.speed + 's ' + _this.transition + ' all';
              /// test base reset overlay opacity
              _this.overlayElement.style.opacity = 1;

              /** CROSS BROWSER calc for fullwidth && fullheight */

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


              /// Calculation of final expanded popup width && height, depended on options parametrs, like gutter
              var newWidth = scrollWidth - (Array.isArray(_this.options.gutter) ? _this.options.gutter[0] : _this.options.gutter) * 2 + 'px';
              var newHeight = scrollHeight - (Array.isArray(_this.options.gutter) ? _this.options.gutter[1] : _this.options.gutter) * 2 + 'px';
              /// Apply new parametrs
              _this.baseElement.style.width = newWidth;
              _this.baseElement.style.height = newHeight;

              /**
               * make gutter
               */

              if (Array.isArray(_this.options.gutter)) {

                  var gutterLeft = _this.options.gutter[0],
                      gutterTop = _this.options.gutter[1];

                  _this.baseElement.style.left = gutterLeft + 'px';
                  _this.baseElement.style.top = gutterTop + 'px';
              } else {

                  _this.baseElement.style.left = _this.options.gutter + 'px';
                  _this.baseElement.style.top = _this.options.gutter + 'px';

              }


          }, 0); //// ZERO timeout FINISH

          /// If popup just expanded - toggle corresponding classes
          this.baseElement.classList.remove('closed');
          this.baseElement.classList.add('open');
          this.contentElement.classList.add(this.options.expandedClassOfContentBase);

          function postOpenEvent() {
            _this.isClosed = false;
            _this.isOpen = true;
            _this.baseElement.removeEventListener(transitionEND(), postOpenEvent);
          }
          /// onTransitionend toggle corresponding global flags
          this.baseElement.addEventListener(transitionEND(), postOpenEvent);

      }



  }


  sPopup.prototype.close = function(item) {
      console.log(this.isOpen);
      console.log('item in close func is: ', item);
      /// If current state of popup is opened
      if (this.isOpen) {
          /// append for baseElement styles memoized in initPosition of previous (open-event)
          setStyle(this.baseElement, this.initPosition);
          /// base memoization
          var _this = this;


          function postCloseEvent() {
              /// remove all transitions from baseElement
              _this.baseElement.style.transition = 'none';
              /// toggle corresponding classes

              _this.baseElement.classList.remove('open');
              _this.baseElement.classList.add('closed');
                _this.contentElement.classList.remove(_this.options.expandedClassOfContentBase);

              /// when popup finally is closed - remove html from that && toggle corresponding global flags
              if (_this.baseElement.classList.contains('closed')) {
                  _this.contentElement.innerHTML = '';
                  _this.isClosed = true;
                  _this.isOpen = false;
              }
              _this.baseElement.removeEventListener(transitionEND(), postCloseEvent);

            }
            /// onTransitionend
            this.baseElement.addEventListener(transitionEND(), postCloseEvent);


      }

  }

 // Private Methods





function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
        }
    }
    return source;
}

function transitionEND() {
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
        width: elem.offsetWidth + 'px',
        height: elem.offsetHeight + 'px'
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
