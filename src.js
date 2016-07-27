(function (global, document) {
  "use strict";

  var jsonUrls = {
    'buyer': 'https://www.digitalmarketplace.service.gov.uk/_status',
    'supplier': 'https://www.digitalmarketplace.service.gov.uk/suppliers/_status'
  };

  var getJSON = function () {
    this.done = false;
  };
  getJSON.prototype.start = function (jsonUrl) {
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", jsonUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        self.onDone(xhr.responseText);  
      }
    });
    xhr.send();
  };
  getJSON.prototype.onDone = function(callback) {
    this.done = function (json) {
      callback(json);
    };
  };
  getStatusColour = function (state) {
    var colours = {
      "live": "#00823B",
      "unmerged": "white"
    };

    return colours[state];
  };

  var getApp = function () {
    return 'buyer';
  };

  var addPopup = function (message) {
    var css = [
      "#bookmarklet-popup {" +
      "  text-align: center;" +
      "  width: 100%;" +
      "  position: absolute;" +
      "  left: 0;" +
      "  top: " + (global.scrollY + 20) + "px;" +
      "  z-index: 1000;" +
      "}" +
      "" +
      "#bookmarklet-popup div {" +
      "  background-color: ",
      ";" +
      "  color: white;" +
      "  margin: 0 auto;" +
      "  padding: 20px 20px 20px 50%;" +
      "  text-align: left;" +
      "  width: 20em;" +
      "  font-family: Helvetica, Arial, sans-serif;" +
      "  font-size: 36px;" +
      "  font-weight: bold;" +
      "}"
    ];
    var html = ["<div><p>","</p></div>"];

    var styleTag = document.createElement("style");
    var popupTag = document.createElement("div");

    styleTag.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(styleTag);
    popupTag.id = "bookmarklet-popup";
    popupTag.innerHTML = html.join(message);
    document.body.append(popupTag);
  };

  var getLiveRelease = function (json, app) {
    var json = JSON.parse(text);

    return parseInt(json.version.replace('release-', ''), 10);
  };

  var getPullRequestTag = function () {
    var state = document.querySelectorAll('.state'),
        tag;

    if (state[0].className.indexOf('state-merged') !== -1) {
      tag = document.querySelectorAll('h1.gh-header-title .gh-header-number')[0];
      return parseInt(tag.textContent.substring(1), 10);
    }
    return false;
  };

  var JSONRequest = getJSON().start(jsonUrls[app]);

  JSONRequest.onDone(function (text) {
    var liveRelease = getLiveRelease(text, app);
    var pullRequestTag = getPullRequestTag();
    var state = (liveRelease < pullRequestTag) ? 'unmerged' : 'live';
    
    var css = css.join(getStatusColour(state));
    var message;

    addPopup(message);
  });

})(window, document);
