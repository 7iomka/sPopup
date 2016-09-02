(function(){
/**
 * @author 7iomka <7iomka@gmail.com>
 * Plugin sPopup - clean js plugin for turn your content into fullscreen
 * @param  {(string)} selector - one selector or multiple selector, separated with comma
 * @param  {Object} options - user params as settings
 */
  this.sPopup = function (selector, options) {
    this.selector = selector;
    var defaults = {
        openClass: '.open',
        closedClass: '.closed',
        speed: 10,
        type: 'up',
        background: '#fff'
    }
    // Create options by extending defaults with the passed in arguments
    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[1]);
    }


    this.skeletonSelectors = {
      overlayElement: '.sPopup_overlay',
      containerElement: '.sPopup_container',
      headerElement: '.sPopup_header',
      footerElement: '.sPopup_footer',
      contentElement: '.sPopup_content',
      closeElement : '.sPopup_close'
    }




    /**
     * HTML elements of sceleton
     */
    // this.selectorElement =  document.querySelectorAll( this.selector );
    // this.overlayElement = document.querySelector( this.skeletonSelectors.overlayElement );
    // this.contentElement = document.querySelector( this.skeletonSelectors.contentElement );
    // this.containerElement   = document.querySelector( this.skeletonSelectors.containerElement );
    // this.headerElement   = document.querySelector( this.skeletonSelectors.headerElement );
    // this.footerElement   = document.querySelector( this.skeletonSelectors.footerElement );
    // this.closeElement   = document.querySelector( this.skeletonSelectors.closeElement );



    this.speed = this.options.speed || this.defaults.speed;
    this.type = this.options.type || this.defaults.type;
    this.background = this.options.background || this.defaults.background;
    this.init();

  }

    // Public Methods

  sPopup.prototype.init = function () {

    var skeleton = '<div class="sPopup_overlay closed"> <div class="sPopup_container"> <div class="sPopup_header"> <div class="sPopup_close">x</div> </div> <div class="sPopup_content"></div> <div class="sPopup_footer"></div> </div> </div>';
    document.body.insertAdjacentHTML('beforeEnd', skeleton);

    this.selectorElement =  document.querySelectorAll( this.selector );
    this.overlayElement = document.querySelector( this.skeletonSelectors.overlayElement );
    this.contentElement = document.querySelector( this.skeletonSelectors.contentElement );

    this.containerElement   = document.querySelector( this.skeletonSelectors.containerElement );
    this.headerElement   = document.querySelector( this.skeletonSelectors.headerElement );
    this.footerElement   = document.querySelector( this.skeletonSelectors.footerElement );
    this.closeElement   = document.querySelector( this.skeletonSelectors.closeElement );

    this.initPosition = false;
    this.transitionEnd = transitionSelect();
    this.isClosed = true;
    var _this = this;

    [].forEach.call(this.selectorElement, function (item, i) {
      /**
       * for each element of selector add a listenner click
       */

      item.addEventListener('click', function (e) {
        _this.open(item);

      });

    });

  }


  sPopup.prototype.open = function(item){
    if(this.isClosed){
      this.contentElement.appendChild(item.cloneNode(true));
      initializeEvents.call(this);
      this.overlayElement.style.transition = 'none';
      var startPos = getOffsetRect(item);
      this.initPosition = startPos; // save position of element, from where we clicked
      setStyle(this.overlayElement, startPos);
      var _this = this;
      setTimeout(function () {
         _this.overlayElement.style.transition = '1s ease';
         _this.overlayElement.style.left = '0px';
         _this.overlayElement.style.top = '0px';
         _this.overlayElement.style.width = '100%';
      }, 0);

       this.overlayElement.classList.remove('closed');
       this.overlayElement.classList.add('open');
       this.isClosed = false;
    }


  }


  sPopup.prototype.close = function(){
    setStyle(this.overlayElement, this.initPosition);
    this.overlayElement.classList.remove('open');
    this.overlayElement.classList.add('closed');
    var _this = this;
    this.overlayElement.addEventListener(this.transitionEnd, function() {
       if(_this.overlayElement.classList.contains('closed')) {
         _this.contentElement.innerHTML = '';
         _this.isClosed = true;
       }
     });


  }


 // Private Methods



  function initializeEvents(){
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
  //
  //
  //
  // var data = document.querySelectorAll('article');
  // var sPopupOverlay = document.querySelector('.sPopup_overlay');
  // var sPopupContent = document.querySelector('.sPopup_content');
  // var sPopupClose = document.querySelector('.sPopup_close');
  // console.log(sPopupOverlay);
  // var sPopupOverlayPosition = false;
  // var startPos;
  // sPopupOverlay.classList.add('closed');

  // [].forEach.call(data, function(item, i){
  //
  //   item.addEventListener('click', function (e) {
  //     var overlay = new sPopup(item, {
  //       speed: 10,
  //       type: 'up',
  //       bg: '#fff'
  //     })
      // sPopupContent.innerHTML = '';
      // startPos = getOffsetRect(item);
      //
      // sPopupOverlay.style.transition = 'none';
      // setStyle(sPopupOverlay, startPos);
      //
      //  setTimeout(function () {
      //    sPopupOverlay.style.transition = '1s ease';
      //    sPopupOverlay.style.left = '0px';
      //    sPopupOverlay.style.width = '100%';
      //  }, 0)





      // setStyle(sPopupOverlay, getOffsetRect(item));


      // if(!sPopupOverlayPosition){
      //   Velocity(sPopupOverlay, {
      //     left: '0',
      //     top: '0',
      //     height: '100%',
      //     width: '100%'
      //   });
      // }
      // else{
      //   setStyle(sPopupOverlay, getOffsetRect(item));
      //   console.log(sPopupOverlayPosition.width);
      //   Velocity(sPopupOverlay, {
      //     width: sPopupOverlayPosition.width,
      //     left: sPopupOverlayPosition.left,
      //     top: sPopupOverlayPosition.top,
      //     height: sPopupOverlayPosition.top
      //
      //   }, 30, function(){
      //         Velocity(sPopupOverlay, {
      //           width: '100%',
      //           height: 'auto',
      //           left: 0,
      //           top: 0
      //         });
      //
      //   });
      // }
      // sPopupOverlayPosition = getOffsetRect(e.target);
      //
      // sPopupContent.appendChild(item.cloneNode(true));
      // // console.log(window);
      // sPopupOverlay.classList.remove('closed');
      // sPopupOverlay.classList.add('open');



    //});

    // item.addEventListener('mouseover', function (e) {
    //   setStyle(sPopupOverlay, getOffsetRect(item));
    // });

  //   sPopupClose.addEventListener('click',function (e) {
  //     setTimeout(function () {
  //       sPopupOverlay.style.left = startPos.left;
  //       sPopupOverlay.style.top = startPos.top;
  //       sPopupOverlay.style.width = startPos.width;
  //       sPopupOverlay.style.height = startPos.height;
  //     }, 0)
  //
  //     // console.log('sPopupOverlayPosition on close', sPopupOverlayPosition);
  //     // Velocity(sPopupOverlay, Object.assign(sPopupOverlayPosition, {
  //     //
  //     //   visibility: 'hidden'
  //     // }), 30, function(){
  //     //   sPopupOverlay.classList.remove('open');
  //     //   sPopupOverlay.classList.add('closed');
  //     //   sPopupContent.innerHTML = '';
  //     // });
  //
  //
  //   });
  //
  //
  //
  // });



  function setStyle( obj, styleObject ){
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

      var top  = box.top +  scrollTop - clientTop
      var left = box.left + scrollLeft - clientLeft

      return {
        top: Math.round(top) +'px',
        left: Math.round(left)+'px',
        width: box.width+'px',
        height: box.height +'px'
       }
  }


//First-time initialization render


})()
