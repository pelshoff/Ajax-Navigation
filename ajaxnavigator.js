(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.AjaxNavigator = (function() {

    function AjaxNavigator(replacementSelectors) {
      this.replacementSelectors = replacementSelectors;
      this.replaceContent = __bind(this.replaceContent, this);
      this.navigateCallback = __bind(this.navigateCallback, this);
      this.popstateHandler = __bind(this.popstateHandler, this);
      this.clickHandler = __bind(this.clickHandler, this);
      this.registerEventHandlers = __bind(this.registerEventHandlers, this);
      this.navigate = __bind(this.navigate, this);
      this.popped = (__indexOf.call(window.history, 'state') >= 0);
      this.initialURL = location.href;
      this.registerEventHandlers();
    }

    AjaxNavigator.prototype.navigate = function(url) {
      $(this).trigger('unload');
      return $.ajax({
        url: url,
        method: 'get',
        success: this.navigateCallback
      });
    };

    AjaxNavigator.prototype.registerEventHandlers = function() {
      $(window).on('popstate', this.popstateHandler);
      return $(document).on('click', 'a[href^="/"]', this.clickHandler);
    };

    AjaxNavigator.prototype.clickHandler = function(event) {
      var url;
      url = event.target.href;
      history.pushState({
        url: url
      }, '', url);
      this.navigate(url);
      return event.preventDefault();
    };

    AjaxNavigator.prototype.popstateHandler = function(event) {
      var initialPop, state;
      initialPop = !this.popped && location.href === this.initialURL;
      this.popped = true;
      if (initialPop) return;
      state = event.originalEvent.state;
      return this.navigate(state.url || location.href);
    };

    AjaxNavigator.prototype.navigateCallback = function(responseText) {
      var $response;
      this.replaceTitle(responseText);
      $response = $(responseText);
      this.replaceContent($response);
      return $(this).trigger('load');
    };

    AjaxNavigator.prototype.replaceTitle = function(responseText) {
      var matches;
      matches = responseText.match(/<title>(.*?)<\/title>/);
      if (matches[1]) return document.title = matches[1];
    };

    AjaxNavigator.prototype.replaceContent = function(response) {
      var _this = this;
      return _.each(this.replacementSelectors, function(selector) {
        var element, newContent;
        newContent = response.find(selector);
        element = $(selector);
        return element.fadeOut('fast', function() {
          return element.empty().append(newContent.children()).fadeIn('fast');
        });
      });
    };

    return AjaxNavigator;

  })();

}).call(this);
