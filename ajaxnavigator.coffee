#
# Ajax navigation drop-in; just load it and go!
# @author Pim Elshoff <pim@pelshoff.com>
#
class window.AjaxNavigator
    constructor: (@replacementSelectors) ->
        this.popped = ('state' in window.history)
        this.initialURL = location.href
        this.registerEventHandlers()

    navigate: (url) =>
        $(this).trigger 'unload'
        $.ajax
            url: url
            method: 'get'
            success: this.navigateCallback

    # 'private'

    registerEventHandlers: =>
        # popstateHandler for browser history navigation
        $(window).on 'popstate', this.popstateHandler
        # register anchors to local pages for the whole document and for each replacementSelector
        $(document).on 'click', 'a[href^="/"]', this.clickHandler

    clickHandler: (event) =>
        url = event.target.href
        history.pushState (url: url), '', url
        this.navigate url
        event.preventDefault()

    popstateHandler: (event) =>
        initialPop = !this.popped && location.href == this.initialURL
        this.popped = true
        if (initialPop)
            return
        state = event.originalEvent.state
        this.navigate state.url || location.href

    navigateCallback: (responseText) =>
        this.replaceTitle responseText
        $response = $ responseText
        this.replaceContent $response
        $(this).trigger 'load'

    replaceTitle: (responseText) ->
        matches = responseText.match /<title>(.*?)<\/title>/
        if (matches[1])
            document.title = matches[1]

    replaceContent: (response) =>
        _.each @replacementSelectors, (selector) =>
            newContent = response.find selector
            element = $ selector
            element.fadeOut 'fast', =>
                element.empty().append(newContent.children()).fadeIn 'fast'