// Always export a function which takes jQuery as an argument
// This ensures each module is testable
module.exports = function($) {
    /**
     * Drop down menu component.
     *
     * @param  jQuery node $dropDown
     *
     * @return object
     */

    // Dependencies
    var agentDetection = require('../utils/agent-detection')($);
    var viewportDetection = require('../utils/viewport-detection')($);
    var respond = require('../utils/respond');

    return function($tabs) {
        // Setup tabs block
        var tabBlock = $tabs.block('nav').data('p.block');
        var $tabItems = tabBlock.element('item').block('nav__item');

        // Setup Breakpoints if specified
        var tabStackedBreakpoints = tabBlock.getAttr('data-tabs-stacked');
        var tabStackedBreakpointsArray = tabStackedBreakpoints ? tabStackedBreakpoints.split(",") : null;

        // Our returned programmatic API
        var api = {
            init: function() {
                init();
            },
            show: function($elem, shouldScrollTo) {
                var block = $elem.data('p.block');
                var contentId = $elem.attr('href');

                api.resetTabs();
                block.addModifier('active');

                api.resetContent();
                api.showContent(contentId);

                if(tabStackedBreakpointsArray) {
                    if ($.inArray(viewportDetection.getViewportSize(), tabStackedBreakpointsArray) > -1) {
                        $(contentId).insertAfter($elem);
                        if(shouldScrollTo) {
                            $('body, html').stop().animate({ scrollTop: $elem.offset().top }, 300);
                        }
                    } else {
                        $('.tabbed-content__section-wrap').append($(contentId));
                        if(shouldScrollTo) {
                            $('body, html').stop().animate({ scrollTop: $elem.offset().top - 20 }, 300);
                        }
                    }
                }
            },
            resetTabs: function() {
                $tabItems.each(function(e) {
                    var block = $(this).data('p.block');
                    block.removeModifier('active');
                });
            },
            showContent: function(contentId) {
                $(contentId).addClass('tabbed-content__section--active');
            },
            resetContent: function() {
                $tabs.find('.tabbed-content__section').removeClass('tabbed-content__section--active');
            },
            resetLocationHash: function(href) {
                // remove location hash from url to avoid the :target css taking effect
                if (window.history && window.history.pushState) {
                    history.replaceState(null, null, href);
                } else {
                    window.location.hash = href;
                }
            },
            handleLocationHashChange: function() {
                var location = window.location.hash;

                $tabItems.each(function() {
                    if($(this).attr('href') === location) {
                        if(tabStackedBreakpointsArray) {
                            if ($.inArray(viewportDetection.getViewportSize(), tabStackedBreakpointsArray) > -1) {
                                api.show($(this), true);
                            } else {
                                api.show($(this), false);
                            }
                        }
                        api.resetLocationHash($(this).attr('href'));
                    }
                })
            }
        }

        function init() {
            // Default state of tabs based on provided breakpoints
            if(tabStackedBreakpointsArray) {
                if ($.inArray(viewportDetection.getViewportSize(), tabStackedBreakpointsArray) > -1) {
                    $tabs.addClass('nav--tabs--stacked');
                } else {
                    $tabs.removeClass('nav--tabs--stacked');
                }
            }

            // If there is a location hash in the url e.g. #ingredients and it matches the href of a tab, show it by default
            if (window.location.hash) {
                api.handleLocationHashChange();
            } else {
                // show first content section by default if no location hash in url
                api.show($tabItems.first(), false);
            }

            // update tabbed content when location hash changes (usually because a link to the anchor was clicked)
            $(window).on('hashchange', function() {
                api.handleLocationHashChange();
            });

            // bind click and keydown event listener
            // valid keycodes are [1, 13] - mouseclick and enter key
            $tabItems.on('click keydown', function(e) {
                if ([1, 13].indexOf(e.which) > -1) {
                    if(tabStackedBreakpointsArray) {
                        if ($.inArray(viewportDetection.getViewportSize(), tabStackedBreakpointsArray) > -1) {
                            api.show($(this), true);
                        } else {
                            api.show($(this), false);
                        }
                    }
                    api.resetLocationHash($(this).attr('href'));
                    e.preventDefault();
                }
            });

            // set up aria attributes
            $tabs.find('.nav').attr('role', 'tablist');
            $tabs.find('.nav__item').attr('role', 'tab');

            $tabItems.each(function() {
                var tabTarget = $(this).attr('href').substring(1, $(this).attr('href').length);
                $(this).attr('aria-controls', tabTarget);
                $(this).attr('id', 'controls-' + tabTarget);
            });

            $tabs.find('.tabbed-content__section').each(function() {
                $(this).attr('role', 'tabpanel');
                $(this).attr('aria-labelledby', 'controls-' + $(this).attr('id'));
            });
        }

        // Default initialise of tabbed content
        api.init();

        // Check if we have responsive stacked tabs
        if (tabStackedBreakpointsArray) {
            // Setup respond object to react to breakpoints
            var responder = respond($, viewportDetection, agentDetection);
            responder.respondOnBreakpoints(api.init, tabStackedBreakpointsArray);
        }

        return api;
    }
}
