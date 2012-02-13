(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.AjaxNavigator = (function() {

    function AjaxNavigator(replacementSelectors) {
      this.replacementSelectors = replacementSelectors;
      this.navigateCallback = __bind(this.navigateCallback, this);
      this.popstateHandler = __bind(this.popstateHandler, this);
      this.clickHandler = __bind(this.clickHandler, this);
      this.registerEventHandlers = __bind(this.registerEventHandlers, this);
      this.navigate = __bind(this.navigate, this);
      this.popped = __indexOf.call(window.history, 'state') >= 0;
      this.initialURL = location.href;
      this.registerEventHandlers();
    }

    AjaxNavigator.prototype.navigate = function(url) {
      ($(this)).trigger('unload');
      return $.get(url, this.navigateCallback);
    };

    AjaxNavigator.prototype.registerEventHandlers = function() {
      ($(window)).on('popstate', this.popstateHandler);
      return ($(document)).on('click', 'a[href^="/"]', this.clickHandler);
    };

    AjaxNavigator.prototype.clickHandler = function(e) {
      var url;
      url = e.target.href;
      history.pushState({
        url: url
      }, '', url);
      this.navigate(url);
      return e.preventDefault();
    };

    AjaxNavigator.prototype.popstateHandler = function(e) {
      if (!this.popped && location.href === this.initialURL) return;
      this.popped = true;
      return this.navigate(e.originalEvent.state.url || location.href);
    };

    AjaxNavigator.prototype.navigateCallback = function(res) {
      this.replaceTitle(res);
      this.replaceContent($(res));
      return ($(this)).trigger('load');
    };

    AjaxNavigator.prototype.replaceTitle = function(res) {
      var _ref;
      return document.title = (_ref = (res.match(/<title>(.*?)<\/title>/))[1]) != null ? _ref : document.title;
    };

    AjaxNavigator.prototype.replaceContent = function(res) {
      var sel, _i, _len, _ref, _results;
      _ref = this.replacementSelectors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sel = _ref[_i];
        _results.push((function(sel) {
          return ($(sel)).fadeOut(200, function(e) {
            return ($(this)).html(res.find(sel).children()).fadeIn(200);
          });
        })(sel));
      }
      return _results;
    };

    return AjaxNavigator;

  })();

}).call(this);
