var self = require("sdk/self");
var tabs = require("sdk/tabs");

var appScript = self.data.url('js/app.js');
var Request = require("sdk/request").Request;
var latestIMGRequest = Request({
  url: 'http://www.splashbase.co/api/v1/images/latest',
  onComplete: function (response) {
    var result = response.json;
    tabs.on('open', function(tab) {
      var worker = tab.attach({
        contentScriptFile: self.data.url('js/app.js'),
        contentScriptOptions: {
          result: result
        }
      });
    });
  }
});

latestIMGRequest.get();
