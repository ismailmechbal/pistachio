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
                            $('body').stop().animate({ scrollTop: $elem.offset().top }, 200);
                        }
                    } else {
                        $('.tabbed-content__section-wrap').append($(contentId));
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
                var location = window.location.hash;

                $tabItems.each(function() {
                    if($(this).attr('href') === location) {
                        api.show($(this), true);

                        // remove location hash from url to avoid the :target css taking effect
                        if (window.history && window.history.pushState) {
                            history.replaceState("", document.title, window.location.pathname);
                        } else {
                            window.location.hash = '';
                        }
                    }
                })
            } else {
                // show first content section by default if no location hash in url
                api.show($tabItems.first(), false);
            }

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

            // bind click and keydown event listener
            // valid keycodes are [1, 13] - mouseclick and enter key
            $tabItems.on('click keydown', function(e) {
                if ([1, 13].indexOf(e.which) > -1) {
                    var anchor = $(this).attr('href');

                    api.show($(this), true);
                    e.preventDefault();
                }
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
