(function(){

  var data = document.querySelectorAll('article');
  var sPopupOverlay = document.querySelector('.sPopup_overlay');
  var sPopupContent = document.querySelector('.sPopup_content');
  var sPopupClose = document.querySelector('.sPopup_close');
  console.log(sPopupOverlay);
  var sPopupOverlayPosition = false;
  sPopupOverlay.classList.add('closed');
  [].forEach.call(data, function(item, i){

    item.addEventListener('click', function (e) {
      // setStyle(sPopupOverlay, getOffsetRect(item));


      if(!sPopupOverlayPosition){
        Velocity(sPopupOverlay, {
          width: '0',
          left: '0',
          top: '0',
          height: '100%',
          width: '100%'
        });
      }
      else{
        console.log(sPopupOverlayPosition.width);
        Velocity(sPopupOverlay, {
          width: sPopupOverlayPosition.width,
          left: sPopupOverlayPosition.left,
          top: sPopupOverlayPosition.top,
          height: sPopupOverlayPosition.top

        }, 30, function(){
              Velocity(sPopupOverlay, {
                width: '100%',
                height: 'auto',
                left: 0,
                top: 0
              });

        });
      }
      sPopupOverlayPosition = getOffsetRect(e.target);

      sPopupContent.appendChild(item.cloneNode(true));
      // console.log(window);
      sPopupOverlay.classList.remove('closed');
      sPopupOverlay.classList.add('open');



    });

    item.addEventListener('mouseover', function (e) {
      setStyle(sPopupOverlay, getOffsetRect(item));
    });

    sPopupClose.addEventListener('click',function (e) {
      // console.log('sPopupOverlayPosition on close', sPopupOverlayPosition);
      Velocity(sPopupOverlay, Object.assign(sPopupOverlayPosition, {

        visibility: 'hidden'
      }), 30, function(){
        sPopupOverlay.classList.remove('open');
        sPopupOverlay.classList.add('closed');
        sPopupContent.innerHTML = '';
      });


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
