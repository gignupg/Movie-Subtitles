chrome.runtime.onMessage.addListener(function (request) {
  if (request.link) {
    chrome.tabs.create({
      active: true,
      url: request.link,
    });
  }
});
