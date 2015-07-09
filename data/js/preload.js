(function() {
  'use strict';
  var preloadImages = [];
  var onLoad = function(url, index) {
    preloadImages[index].onload = undefined;
    self.port.emit('preloaded', url);
  };

  self.port.on('response-preload-image-list', function(imageList) {
    imageList.forEach(function(image, index) {
      preloadImages[index] = new Image();
      preloadImages[index].src = image.url;
      preloadImages[index].onload = onLoad.bind(undefined, image.url, index);
    });
  });

  if (preloadImages.length === 0) {
    self.port.emit('request-preload-image-list');
  }

}());
