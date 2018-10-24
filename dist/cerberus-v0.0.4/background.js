/**
 * Disable Content Security Policy
 * (This allows us to stablish connections to servers other than WhatsApp)
 */

console.log('Disablinng Content-Security-Policy');

var onHeadersReceived = function(details) {
  for (var i = 0; i < details.responseHeaders.length; i++) {
    if (
      'content-security-policy' ===
      details.responseHeaders[i].name.toLowerCase()
    ) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders,
  };
};

var filter = {
  urls: ['*://*.whatsapp.com/*'],
  types: ['main_frame', 'sub_frame'],
};

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, [
  'blocking',
  'responseHeaders',
]);

chrome.webNavigation.onCompleted.addListener(() => {
  console.log('Removing Service Workers');
  chrome.browsingData.remove({}, {"serviceWorkers": true}, function () {});
});

chrome.webNavigation.onBeforeNavigate.addListener(() => {
  console.log('Removing Service Workers');
  chrome.browsingData.remove({}, {"serviceWorkers": true}, function () {});
});
