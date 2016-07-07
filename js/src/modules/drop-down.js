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

    return function($dropDown) {
        var dropDownBlock = $dropDown.block('nav').data('p.block');
        var $dropDownTabs = dropDownBlock.element('dropdown__item').block('nav__dropdown');

        var dropDownOffScreenBreakpoints = dropDownBlock.getAttr('data-dropdown-offscreen');
        var dropDownOffScreenArray = dropDownOffScreenBreakpoints ? dropDownOffScreenBreakpoints.split(",") : null;

        // Our returned programmatic API
        var api = {
            init: function() {
                init();
            },
            initDropDown: function() {
                initDropDown();
            },
            initOffScreen: function() {
                initOffScreen();
            },
            hasDropdownMenu: function($elem) {
                return $($elem).find('.nav__dropdown__menu').length;
            },
            show: function($elem) {
                $elem.addClass('nav__dropdown--active');
                $elem.find('.nav__dropdown__item').attr('aria-expanded','true');
            },
            hide: function($elem) {
                $elem.removeClass('nav__dropdown--active');
                $elem.find('.nav__dropdown__item').attr('aria-expanded','false');
            },
            toggle: function($elem) {
                if ($elem.hasClass('nav__dropdown--active')) {
                    api.hide($elem);
                } else {
                    api.show($elem);
                }
            },
            resetAllBindings: function() {
                $('html').off('click touchstart', api.resetActiveStates);
                $dropDownTabs.off('click', clickDropDown);
                $dropDownTabs.off('mouseenter', api.resetActiveStates);
                $dropDownTabs.off('click', clickOffScreen);
                api.resetActiveStates();
            },
            resetActiveStates: function() {
                $('html').find('.nav__dropdown__item').each(function() {
                    // remove aria attribute, focus state, and active class
                    if (api.hasDropdownMenu($(this).parent())) {
                        $(this).parent().find('.nav__item, .nav__dropdown__item').attr('aria-expanded','false').blur();
                        $(this).parent().removeClass('nav__dropdown--active');
                    }
                });
            }
        }

        function init() {
            // When drop-down has optional off screen menu data attribute, handle differently
            if(dropDownOffScreenArray) {
                if ($.inArray(viewportDetection.getViewportSize(), dropDownOffScreenArray) > -1) {
                    api.resetAllBindings();
                    api.initOffScreen();
                } else {
                    api.resetAllBindings();
                    api.initDropDown();
                }
            } else {
                api.initDropDown();
            }
        }

        function initDropDown() {
            // Allow a click anywhere on page to close any open dropdowns
            $('html').on('click touchstart', api.resetActiveStates);

            // bind click event to individual dropdown tabs
            $dropDownTabs.on('click', clickDropDown);

            // handle mouseenter (hover) event to close any drop down menus previously opened by touch or keyboard
            $dropDownTabs.on('mouseenter', api.resetActiveStates);
        }

        function clickDropDown(e) {
            // only show dropdown menu if menu is present, otherwise, follow link normally
            if (api.hasDropdownMenu($(this).parent())) {
                api.resetActiveStates();
                api.show($(this).parent());
                e.preventDefault(); // Stop top level links from being followed
                e.stopPropagation(); // Stop a click on the dropdown menu propagating up the DOM so it's not registered as a click on the page
            }
        }

        function initOffScreen() {
            // bind click event to individual dropdown tabs
            $dropDownTabs.on('click', clickOffScreen);
        }

        function clickOffScreen(e) {
            if (api.hasDropdownMenu($(this).parent())) {
                $('html').off(); // Remove dropdown menu functionality which closes all open menus when html is clicked
                api.toggle($(this).parent());
                e.preventDefault(); // Stop top level links from being followed
                e.stopPropagation(); // Stop a click on the dropdown menu propagating up the DOM so it's not registered as a click on the page
            }
        }

        if (dropDownOffScreenArray) {
            // Setup respond object to react to breakpoints
            var responder = respond($, viewportDetection, agentDetection);
            responder.respondOnBreakpoints(api.init, dropDownOffScreenArray);
        }

        api.init();

        return api;
    }
}
