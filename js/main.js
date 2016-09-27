var startedPopup = new sPopup('.mockup-grid__item', {

  duration: 10.8,
  type: 'up',
  background: '#ffe',
  // gutter: [25, 40],
  overlayBackgroud: 'rgba(27, 27, 27, 0.96)',
  // transition: 'cubic-bezier(1.000, -0.530, 0.405, 1.425)',
  // contentMaxWidth: '50%',
  overlayTransition: 'ease',
  onBeforeOpenItem: function (instance, item) {
    alert('Open start');
  },
  onAfterOpenItem: function (instance, item) {
    alert('Open end');
  },
  onBeforeCloseItem: function (instance, item) {
    alert('Close start');
  },
  onAfterCloseItem: function (instance, item) {
    alert('Close end');
  },
});
