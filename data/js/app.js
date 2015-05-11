(function() {
  'use strict';

  function getSplash(imageUrl) {
    var newTabBox = document.getElementById('newtab-scrollbox');
    if (newTabBox) {
      newTabBox.style.backgroundRepeat = 'no-repeat';
      newTabBox.style.backgroundSize = 'cover';
      newTabBox.style.backgroundPosition = 'center center';
      newTabBox.style.backgroundImage = 'url(' + imageUrl + ')';
    } else {
      // XXX: We could not get newTabBox for first tab after Firefox start-up.
      // So we always failed to show splash for the first tab.
      console.error('no newTabBox');
    }
  }

  window.setTimeout(function() {
    getSplash(self.options.imageUrl);
  });
}());
