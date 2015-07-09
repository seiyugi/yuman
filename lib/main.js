var self = require("sdk/self");
var tabs = require("sdk/tabs");
var simpleStorage = require("sdk/simple-storage");
var Request = require("sdk/request").Request;

var TIMEOUT = 43200000; // half day
var DEFAULT_IMAGES = [
  {
    url: self.data.url('./images/P1430258.jpg')
  },
  {
    url: self.data.url('./images/P1430368.jpg')
  },
  {
    url: self.data.url('./images/P1430464.jpg')
  },
  {
    url: self.data.url('./images/P1430927.jpg')
  },
  {
    url: self.data.url('./images/star_trails-3.jpg')
  }
];

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
  return DEFAULT_IMAGES.concat(imageList || []);
};

var imageList = getImageList();
var preloaded = [];

// This only works for first tab creation
tabs.on('ready', function(tab) {
  var worker = tab.attach({
    contentScriptFile: self.data.url('js/preload.js')
  });

  worker.port.on('preloaded', function(url) {
    preloaded.push(url);
  });

  worker.port.on('request-preload-image-list', function() {
    var cacheMissed = getImageList().filter(function(image) {
      return preloaded.indexOf(image.url) < 0;
    });
    worker.port.emit('response-preload-image-list', cacheMissed);
  });
});

tabs.on('open', function(tab) {
  imageList = getImageList();

  if (tab.url === 'about:blank') {
    return;
  }

  var worker = tab.attach({
    contentScriptFile: self.data.url('js/app.js'),
    contentScriptOptions: {
      imageUrl: imageList[getRandomInt(0, imageList.length)].url
    }
  });
});


