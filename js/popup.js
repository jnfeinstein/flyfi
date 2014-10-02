$(function() {
  var $input = $('input#enabled');

  function setupChannel() {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.command == 'reply:enabled') {
          $input.prop('checked', request.enabled);
        }
      }
    );
  }

  function requestEnabled() {
    chrome.runtime.sendMessage({command: "request:enabled"});
  }

  function setupInput() {
    $input.change(function() {
      chrome.runtime.sendMessage({command: "change:enabled", enabled: $input.prop("checked")});
    });
  }

  setupInput();
  setupChannel();
  requestEnabled();
});