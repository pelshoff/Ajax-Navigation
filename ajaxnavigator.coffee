#
# Ajax navigation drop-in; just load it and go!
# @author Pim Elshoff <pim@pelshoff.com>
#


class window.AjaxNavigator
    constructor: (@replacementSelectors) ->
        @popped = 'state' in window.history
        @initialURL = location.href
        @registerEventHandlers()

    navigate: (url) =>
        ($ @).trigger 'unload'
        $.get url, @navigateCallback

    registerEventHandlers: =>
        ($ window).on 'popstate', @popstateHandler
        ($ document).on 'click', 'a[href^="/"]', @clickHandler

    clickHandler: (e) =>
        url = e.target.href
        history.pushState {url}, '', url
        @navigate url
        e.preventDefault()

    popstateHandler: (e) =>
        return if not @popped and location.href is @initialURL
        @navigate e.originalEvent.state.url or location.href

    navigateCallback: (res) =>
        @replaceTitle res
        @replaceContent $ res
        ($ @).trigger 'load'

    replaceTitle: (res) ->
        document.title = (res.match /<title>(.*?)<\/title>/)[1] ? document.title

    replaceContent: (res) =>
        ($ @replacementSelectors).each (sel) ->
            $tmp = ($ sel)
            ($ sel).fadeOut(200).html($tmp.children()).fadeIn(200)
