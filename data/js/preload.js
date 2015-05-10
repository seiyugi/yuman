(function() {
  'use strict';
  var preloadImages = [];

  self.port.on('response-image-list', function(imageList) {
    imageList.forEach(function(image, index) {
      preloadImages[index] = new Image();
      preloadImages[index].src = image.url;
    });
  });
  if (preloadImages.length === 0) {
    self.port.emit('request-image-list');
  }

}());
