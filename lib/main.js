var self = require("sdk/self");
var tabs = require("sdk/tabs");
var simpleStorage = require("sdk/simple-storage");
var Request = require("sdk/request").Request;

var TIMEOUT = 43200000; // half day

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var isImageListStaled = function() {
  var now = new Date().getTime();
  if (simpleStorage.storage.imageListTimestamp) {
    return (now - simpleStorage.storage.imageListTimestamp > TIMEOUT);
  } else {
    return true;
  }
};

var getImageList = function() {
  var imageList = simpleStorage.storage.latestImageList;
  if (!imageList || isImageListStaled()) {
    Request({
      url: 'http://www.splashbase.co/api/v1/images/latest',
      onComplete: function (response) {
        if (response && response.json && response.json.images) {
          simpleStorage.storage.latestImageList = response.json.images;
          simpleStorage.storage.imageListTimestamp = new Date().getTime();
        }
      }
    }).get();
  }
  return imageList || JSON.parse(self.data.load('./default_image_list.json')).images;
};

var imageList = getImageList();

// This only works for first tab creation
tabs.on('ready', function(tab) {
  var worker = tab.attach({
    contentScriptFile: self.data.url('js/preload.js')
  });
  worker.port.on('request-image-list', function() {
    worker.port.emit('response-image-list', getImageList());
  });
});

tabs.on('open', function(tab) {
  imageList = getImageList();

  var worker = tab.attach({
    contentScriptFile: self.data.url('js/app.js'),
    contentScriptOptions: {
      imageUrl: imageList[getRandomInt(0, imageList.length)].url
    }
  });
});


