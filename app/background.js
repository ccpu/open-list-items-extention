chrome.browserAction.onClicked.addListener(function (tab) {
  if (tab) chrome.tabs.sendMessage(tab.id, {}, function (response) {});
});

chrome.runtime.onMessage.addListener(function (request) {
  var timer = 0;
  for (let i = 0; i < request.length; i++) {
    var link = request[i];
    (function (url) {
      setTimeout(function () {
        chrome.tabs.create({ url: url, active: false });
      }, timer);
    })(link);
    timer += 200;
  }
  chrome.tabs.g;
});
