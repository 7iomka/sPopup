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
        openClass: 'sPopup--open',
        closedClass: 'sPopup--closed',
        expandedClassOfContentBase: 'sPopup__content-expanded',
        duration: 1, /// Number
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
    this.duration = this.options.duration;
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
    var skeleton = '<div class="sPopup '+ this.options.closedClass +'"> <div class="sPopup_container"> <div class="sPopup_header"> <div class="sPopup_close">x</div> </div> <div class="sPopup_content"></div> <div class="sPopup_footer"></div> </div> </div> <div class="sPopup_overlay"></div>';
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

    //<<<<<<<<<<<<<<<<<<<ТУТ СОХРАНЯЕТСЯ АКТИВНЫЙ ЭЛЕМЕНТ ПО ОТКРЫТИЮ ОКНА>>>>>>>>>>>>>>>>>>>>>>>>>>>
    /// Set activeElement by default
    this.activeElement = false;

    /********************** INITIALIZATION ACTIONS ***********************************/

    /// Set content background from options
    this.containerElement.style.background = this.options.background;
    /// Set overlay background from options
    this.overlayElement.style.background = this.options.overlayBackgroud;
    this.overlayElement.style.transition = this.options.duration + 's all ' + this.options.overlayTransition;


  //<<<<<<<<<<<<<<<<<<<СЮДА МНЕ НАДО ПРОКИНУТЬ ИМЕННО ОБНОВЛЁННЫЙ АКТИВНЫЙ ЭЛЕМЕНТ>>>>>>>>>>>>>>>>>>>>>>>>>>>
    /// Initalize click event on the close button
    this.closeElement.addEventListener('click', this.close.bind(this, this.activeElement));







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

      /// If current state of popup is closed
      if (this.isClosed) {
          /// we will make a clone of clicked item and append it into contentElement
          this.contentElement.appendChild(item.cloneNode(true));

          /// set item as active element
          this.activeElement = item;
          /// remove all transitions from baseElement
          this.baseElement.style.transition = 'none';
          /// init start animation start-position - left,top,width,height of clicked element
          var startPos = getOffsetRect(item);
          /// memoization of animation start-position for next usage in close animation
          this.initPosition = startPos; // save position of element, from where we clicked
          /// append animation start-position
          setStyle(this.baseElement, startPos);

          /// basic memoization
          var _this = this;

          /// make async without 0 timeout
          setImmediate(function() {

              /// reset animation transition from NONE to transition from user options
              // _this.baseElement.style.transition = _this.duration + 's ' + _this.transition + ' all';
              /// test base reset overlay opacity
              _this.overlayElement.style.opacity = 1;

              _this.baseElement.style = "";

              /// If popup just expanded - toggle corresponding classes
              _this.baseElement.classList.add(_this.options.openClass);
              _this.baseElement.classList.remove(_this.options.closedClass);

              _this.contentElement.classList.add(_this.options.expandedClassOfContentBase);

          }); //// setImmediate FINISH



          function postOpenEvent() {
            _this.isClosed = false;
            _this.isOpen = true;


            _this.baseElement.removeEventListener(transitionEND(), postOpenEvent);
          }
          /// onTransitionend toggle corresponding global flags
          this.baseElement.addEventListener(transitionEND(), postOpenEvent);

      }



  }


  sPopup.prototype.close = function(item, e) {
      /// If current state of popup is opened
      if (this.isOpen) {
            //<<<<<<<<<<<<<<<<<<<ВЫВЕДЕТ FALSE - НЕ ОБНОВИЛСЯ >>>>>>>>>>>>>>>>>>>>>>>>>>>
          console.log(item);
          /// append for baseElement styles memoized in initPosition of previous (open-event)
          setStyle(this.baseElement, this.initPosition);
          /// base memoization
          var _this = this;


          function postCloseEvent() {


              setImmediate(function() {
                /// remove all transitions from baseElement
                _this.baseElement.style.transition = 'none';
              });

              /// make async without 0 timeout
              setImmediate(function() {
                /// toggle corresponding classes
                _this.baseElement.classList.add(_this.options.closedClass);
                _this.baseElement.classList.remove(_this.options.openClass);

                  // _this.contentElement.classList.remove(_this.options.expandedClassOfContentBase);

                /// when popup finally is closed - remove html from that && toggle corresponding global flags
                if (_this.baseElement.classList.contains(_this.options.closedClass)) {
                    _this.contentElement.innerHTML = '';
                    _this.isClosed = true;
                    _this.isOpen = false;
                    setImmediate(function() {
                      getComputedStyle( item )[ transition ];
                      _this.baseElement.style.transition = '';
                    });
                }
                _this.baseElement.removeEventListener(transitionEND(), postCloseEvent);

              });



            }
            /// onTransitionend
            this.baseElement.addEventListener(transitionEND(), postCloseEvent);


      }

  }





})()
