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
        var $dropDownTabs = dropDownBlock.element('dropdown').block('nav__dropdown');
        var dropDownTabsBlock = $dropDownTabs.data('p.block');

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
                var block = $elem.data('p.block');
                return block.element('menu').length;
            },
            show: function($elem) {
                var block = $elem.data('p.block');
                block.addModifier('active');
                block.element('item').attr('aria-expanded','true');
            },
            hide: function($elem) {
                var block = $elem.data('p.block');
                block.removeModifier('active');
                block.element('item').attr('aria-expanded','false');
            },
            toggle: function($elem) {
                if ($elem.data('p.block').hasModifier('active')) {
                    api.hide($elem);
                } else {
                    api.show($elem);
                }
            },
            resetAllBindings: function() {
                $('html').off('click touchstart', api.resetDropDown);
                $dropDownTabs.off('click', dropDownTabsBlock.elementSelector('item') + ":first", clickDropDown);
                $dropDownTabs.off('mouseenter', api.resetActiveStates);
                $dropDownTabs.off('click', dropDownTabsBlock.elementSelector('item') + ":first", clickOffScreen);
                api.resetActiveStates();
            },
            resetActiveStates: function() {
                $dropDownTabs.each(function() {
                    // remove aria attribute, focus state, and active class
                    if (api.hasDropdownMenu($(this).parent())) {
                        dropDownTabsBlock.element('item').attr('aria-expanded','false').blur();
                        $(this).removeClass('nav__dropdown--active');
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
            $dropDownTabs.on('click', dropDownTabsBlock.elementSelector('item') + ":first", clickDropDown);

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
            $dropDownTabs.on('click', dropDownTabsBlock.elementSelector('item') + ":first", clickOffScreen);
        }

        function clickOffScreen(e) {
            if (api.hasDropdownMenu($(this).parent())) {
                api.toggle($(this).parent());
                e.preventDefault(); // Stop top level links from being followed
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
