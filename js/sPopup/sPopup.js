(function(){

  var Overlay = function (item, options) {
    this.item = item;
    this.el = document.querySelector('.sPopup_overlay ');
    this.type;

    /*
      speed: 10,
      type: up,
      bg: '#ccc',
    */

    this.el.classList.add('open');

    this.setStartPosition();

  }

  Overlay.prototype.setStartPosition = function(){
    var startPos = getOffsetRect(this.item);
  }



  var data = document.querySelectorAll('article');
  var sPopupOverlay = document.querySelector('.sPopup_overlay');
  var sPopupContent = document.querySelector('.sPopup_content');
  var sPopupClose = document.querySelector('.sPopup_close');
  console.log(sPopupOverlay);
  var sPopupOverlayPosition = false;
  var startPos;
  sPopupOverlay.classList.add('closed');
  [].forEach.call(data, function(item, i){

    item.addEventListener('click', function (e) {
      var overlay = new Overlay(item, {
        speed: 10,
        type: 'up',
        bg: '#fff'
      })
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



    });

    // item.addEventListener('mouseover', function (e) {
    //   setStyle(sPopupOverlay, getOffsetRect(item));
    // });

    sPopupClose.addEventListener('click',function (e) {
      setTimeout(function () {
        sPopupOverlay.style.left = startPos.left;
        sPopupOverlay.style.top = startPos.top;
        sPopupOverlay.style.width = startPos.width;
        sPopupOverlay.style.height = startPos.height;
      }, 0)

      // console.log('sPopupOverlayPosition on close', sPopupOverlayPosition);
      // Velocity(sPopupOverlay, Object.assign(sPopupOverlayPosition, {
      //
      //   visibility: 'hidden'
      // }), 30, function(){
      //   sPopupOverlay.classList.remove('open');
      //   sPopupOverlay.classList.add('closed');
      //   sPopupContent.innerHTML = '';
      // });


    });



  });



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

})()
