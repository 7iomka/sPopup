(function(){
/**
 * @author 7iomka <7iomka@gmail.com>
 * Plugin sPopup - clean js plugin for turn your content into fullscreen
 * @param  {(string)} selector - one selector or multiple selector, separated with comma
 * @param  {Object} options - user params as settings
 */
  this.sPopup = function(selector, options) {

    this.selector = selector;
    this.selectorElement  =  document.querySelectorAll( this.selector );
    this.items = [].slice.call(this.selectorElement);

    // extend plugin options with prototype options property
    this.options = extend( {}, this.options );
    // extend plugin options with user custom settings
    extend( this.options, options );



    var basePrefix = 'sPopup';
    // Css-classes of basic structure
    this.skeletonClassList = {
        baseClass: basePrefix,
        overlayClass: basePrefix + '_overlay',
        containerClass: basePrefix + '_container',
        headerClass: basePrefix + '_header',
        contentClass: basePrefix + '_content',
        footerClass: basePrefix + '_footer',
        closeClass: basePrefix + '_close',
    };

    this.stateClassList = {
       attached: basePrefix + '_attached',
       openClass: basePrefix + '--open',
       closedClass: basePrefix + '--closed',
       expandedClassOfContentBase: basePrefix + '__content--expanded',
       noInnerOffsetClass: basePrefix + '_content--noInnerOffset',
    };



    this._init();


}


  // Public Methods
  sPopup.prototype.options = {

      duration: 1, // Number
      type: 'up', // String
      background: '#fff', // String
      gutter: 0, // Number || Array
      overlayBackgroud: 'transparent', // String
      overlayTransition: 'ease',
      transition: 'ease',
      contentMaxWidth: false,
      /** methods **/
      onInit : function(instance) { return false; },
      onResize : function(instance) { return false; },
      onBeforeOpenItem : function(instance, item) { return false; },
      onOpenItem : function(instance, item) { return false; },
      onAfterOpenItem : function(instance, item) { return false; },
      onBeforeCloseItem: function(instance, item) { return false; },
      onCloseItem : function(instance, item) { return false; },
      onAfterCloseItem : function(instance, item) { return false; },
  }



  /********************************* INIT METHOD START ********************************/
  sPopup.prototype._init = function () {

    // callback
		this.options.onInit(this);

    // Initialize basic skeleton op popup and insert that in end of the body & append attached class
    var skeleton = '\
        <div class="' + this.skeletonClassList.baseClass + ' ' + this.stateClassList.closedClass + '"> \
            <div class="' + this.skeletonClassList.containerClass + '"> \
                    <div class="' + this.skeletonClassList.headerClass + '"> \
                               <div class="' + this.skeletonClassList.closeClass + '">x</div> \
                    </div> \
                    <div class="' + this.skeletonClassList.contentClass + '"></div> \
                    <div class="' + this.skeletonClassList.footerClass + '"></div> \
            </div> \
        </div>\
        <div class="' + this.skeletonClassList.overlayClass + '"></div>';

    document.body.insertAdjacentHTML('beforeEnd', skeleton);
    document.body.classList.add(this.stateClassList.attached);


/****** initialize Skeleton HTMLElement-s list ****/

    this.baseElement      = document.querySelector( '.' + this.skeletonClassList.baseClass );
    this.overlayElement   = document.querySelector( '.' + this.skeletonClassList.overlayClass );
    this.contentElement   = this.baseElement.querySelector( '.' + this.skeletonClassList.contentClass );
    this.containerElement = this.baseElement.querySelector( '.' + this.skeletonClassList.containerClass );
    this.headerElement    = this.baseElement.querySelector( '.' + this.skeletonClassList.headerClass );
    this.footerElement    = this.baseElement.querySelector( '.' + this.skeletonClassList.footerClass );
    this.closeElement     = this.baseElement.querySelector( '.' + this.skeletonClassList.closeClass );

/************** ****************** *************/

/************** initialize switches *************/

    // Initial Position of container with popup
    this.initPosition = false;

    // Set activeElement by default
    this.activeElement = false;

    // Default state of sPopup
    this.isClosed = true;
    this.isOpen = false;

/************** ****************** *************/


/***** Other settings depended by options *****/
    console.table(this);
    // Set content background from options
    this.containerElement.style.background = this.options.background;
    // Set overlay background from options
    this.overlayElement.style.background = this.options.overlayBackgroud;
    this.overlayElement.style.transition = '';



    // init/bind events
    this._initEvents();


  }
  /********************************* INIT METHOD END ********************************/


  sPopup.prototype._initEvents = function () {

    var self = this,
		  	clickEvent = (document.ontouchstart !== null ? 'click' : 'touchstart');

        // register click event on all elements passed as selector parametr
    		this.items.forEach(function(item) {

    			var touchend = function(e) {
    					e.preventDefault();
              e.stopPropagation();
    					self._openItem(e, item);
    					item.removeEventListener('touchend', touchend);
    				},
    				touchmove = function(e) {
    					item.removeEventListener('touchend', touchend);
    				},
    				manageTouch = function() {
    					item.addEventListener('touchend', touchend);
    					item.addEventListener('touchmove', touchmove);
    				};

    			item.addEventListener(clickEvent, function(e) {
    				if(clickEvent === 'click') {
    					e.preventDefault();
    					self._openItem(e, item);
    				}
    				else {
    					manageTouch();
    				}
    			});
    		});


        // Initalize click event on the close button
        this.closeElement.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          self._closeItem(e);
        });

        // Initalize resize evenet with callback from options
        window.addEventListener('resize', throttle(function(e) {
          // callback
          self.options.onResize(self);
        }, 10));

  }



  sPopup.prototype._openItem = function(e, item) {
    // basic memoization
    var self = this;
      // If current state of popup is closed
      if (this.isClosed) {
          // onBeforeOpenItem callback
          this.options.onBeforeOpenItem(this, item);

          // we will make a clone of clicked item and append it into contentElement
          this.contentElement.appendChild(item.cloneNode(true));

          // set item as active element
          this.activeElement = item;
          // remove all transitions from baseElement
          this.baseElement.style.transition = 'none';
          // init start animation start-position - left,top,width,height of clicked element

          var startPos = getOffsetRect(item, self);


          // memoization of animation start-position for next usage in close animation
          this.initPosition = startPos; // save position of element, from where we clicked
          // append animation start-position
          setStyle(this.baseElement, startPos);



          // make async without 0 timeout
          setImmediate(function() {

              // reset animation transition from NONE to transition from user options
              // self.baseElement.style.transition = self.duration + 's ' + self.transition + ' all';
              // test base reset overlay opacity
              self.overlayElement.style.opacity = 1;

              self.baseElement.style = "";

              // If popup just expanded - toggle corresponding classes
              self.baseElement.classList.add(self.stateClassList.openClass);
              self.baseElement.classList.remove(self.stateClassList.closedClass);

              // Swich className in scope to remove the inner indentation
              if(hasBorderBox(item)) {
                self.contentElement.classList.add(self.stateClassList.noInnerOffsetClass);
              }
              // Finally add class symbolizing which indicating the expanding end
              self.contentElement.classList.add(self.stateClassList.expandedClassOfContentBase);

          }); /// setImmediate FINISH



          function postOpenEvent() {

            self.isClosed = false;
            self.isOpen = true;
            self.baseElement.removeEventListener(transitionEND(), postOpenEvent);
            // onAfterOpenItem callback
            self.options.onAfterOpenItem(self, item);

          }
          // onTransitionend toggle corresponding global flags
          this.baseElement.addEventListener(transitionEND(), postOpenEvent);

      }



  }


  sPopup.prototype._closeItem = function(e) {

      var item = this.activeElement;
      // If current state of popup is opened
      if (this.isOpen) {
          // onBeforeCloseItem callback
          this.options.onBeforeCloseItem(this, item);
          // append for baseElement styles memoized in initPosition of previous (open-event)
          setStyle(this.baseElement, this.initPosition);
          this.overlayElement.style.opacity = 0;

          // base memoization
          var self = this;


          function postCloseEvent() {

                // remove all transitions from baseElement
                self.baseElement.style.transition = 'none';

                if(hasBorderBox(item)) {
                  self.contentElement.classList.remove(self.stateClassList.noInnerOffsetClass);
                }
                // toggle corresponding classes
                self.baseElement.classList.add(self.stateClassList.closedClass);
                self.baseElement.classList.remove(self.stateClassList.openClass);
                self.contentElement.innerHTML = '';

                // when popup finally is closed - remove html from that && toggle corresponding global flags
                if (self.baseElement.classList.contains(self.stateClassList.closedClass)) {
                    self.isClosed = true;
                    self.isOpen = false;
                    // onAfterCloseItem callback
                    self.options.onAfterCloseItem(self, item);

                }
                self.baseElement.removeEventListener(transitionEND(), postCloseEvent);

          }
            // onTransitionend
            this.baseElement.addEventListener(transitionEND(), postCloseEvent);


      }

  }





})()
