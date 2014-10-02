$(function() {

  var alarmName = "flyfiAlarm";
  var eventType = "NOTIFICATIONOVERLAY";

  var enabled = false;
  var currentState = null;

  var states = {
    disconnected: {
      icon: {'19': "img/icon19-red.png", '38': "img/icon38-red.png"},
      title: "FlyFi is disconnected",
      alert: "FlyFi is disconnected"
    },
    warning: {
      icon: {'19': "img/icon19-yellow.png", '38': "img/icon38-yellow.png"},
      title: "FlyFi will disconnect soon",
      alert: "FlyFi will disconnect soon"
    },
    connected: {
      icon: {'19': "img/icon19-green.png", '38': "img/icon38-green.png"},
      title: "FlyFi is connected",
      alert: "FlyFi is connected"
    },
    unknown: {
      icon: {'19': "img/icon19-gray.png", '38': "img/icon38-gray.png"},
      title: "FlyFi is in an unknown state",
      alert: "FlyFi is in an unknown state"
    }
  };

  function checkFlyfiStatus() {
    $.ajax({
      type : 'POST',
      url : 'http://www.flyfi.com/ajax/notification.do',
      dataType : 'json',
      data : {actionkey: "WEB_HOME_PAGE"},
      cache : false
    }).done(function(data) {
      if (data != null) {
        var e = _.findWhere(data, {eventType: eventType});
        if (e) {
          setState(e.notificationCode);
        }
      }
    }).fail(function() {
      setBrowser(states.unknown, false);
    });
  }

  function setState(notificationCode) {
    switch (notificationCode) {
      case "INTERNET_LOSS_OF_COVERAGE":
        return setBrowser(states.disconnected, true);
      case 1:
        return setBrowser(states.warning, true);
      case 2:
        return setBrowser(states.connected, true);
      default:
        return setBrowser(states.unknown, true, notificationCode);
    }
  };

  function setBrowser(state, showAlert, notificationCode) {
    if (!currentState || currentState != state) {
      chrome.browserAction.setIcon({path: state.icon});
      chrome.browserAction.setTitle({title: state.title});

      if (showAlert) {
        var alertText = state.alert;
        if (notificationCode) {
          alertText += " : " + notificationCode;
        }
        alert(alertText);
      }
      currentState = state;
    }
  }

  function setEnabled(val) {
    if (enabled != val) {
      if (val) {
        checkFlyfiStatus();
        startAlarm();
      } else {
        stopAlarm()
        setBrowser(states.unknown, false);
      }
    }
    enabled = val;
    chrome.storage.sync.set({"enabled": val});
  }

  function setupAlarm() {
    chrome.alarms.onAlarm.addListener(function(alarm) {
      if (alarm.name == alarmName) {
        checkFlyfiStatus();
      }
    });
  }

  function startAlarm() {
    chrome.alarms.create(alarmName, {periodInMinutes: 1});
  }

  function stopAlarm() {
    chrome.alarms.clear(alarmName);
  }

  function setupChannel() {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.command == 'change:enabled') {
          setEnabled(request.enabled);
        } else if (request.command == 'request:enabled') {
          chrome.runtime.sendMessage({command: "reply:enabled", enabled: enabled});
        }
      }
    );
  }

  setupChannel();
  setupAlarm();
  chrome.storage.sync.get("enabled", function(val) {
    setEnabled(val.enabled);
  });
});