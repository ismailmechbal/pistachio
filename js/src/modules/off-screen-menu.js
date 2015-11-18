// Always export a function which takes jQuery as an argument
// This ensures each module is testable
module.exports = function($) {
    /**
     * Off screen menu component.
     * Sets up JavaScript enhahcement for browsers that don't support the CSS only method:
     *
     * 1) Android stock browser (all versions)
     * 2) iOS safari < 5
     *
     * @param  jQuery node $offScreen
     *
     * @return object
     */
    return function($offScreen) {
        // Setup
        var $offScreenTriggerLabel = $offScreen;
        var $offScreenMenu = $('.off-screen-menu:first');
        var $offScreenPageWrapper = $('.page-wrapper:first');
        var $offScreenHeader = $('.off-screen-header:first');

        // Our returned programmtic API
        var api = {
            initOffScreenAndroidStock: function() {
                initOffScreenAndroidStock();
            },
            initOffScreenIos: function() {
                initOffScreenIos();
            },
            androidJsSupport: function() {
                if (detectAndroidStockBrowser()) {
                    return true;
                }
            },
            iOSJsSupport: function() {
                if (iOSversion() < 5) {
                    return true;
                }
            }
        }

        function initOffScreenAndroidStock() {
            // Android stock browser requires a new class added
            $offScreenTriggerLabel.on('click', function(e) {
                e.preventDefault();
                $(this).toggleClass('off-screen--active');
                $offScreenMenu.toggleClass('off-screen--active');
                $offScreenPageWrapper.toggleClass('off-screen--active');
                $offScreenHeader.toggleClass('off-screen--active');
            });
        }

        function initOffScreenIos() {
            // even though :checked is not working in ios < 5 via css,
            // as soon as we bind to click function it does work!
            // So we remove the checked state from checkbox to avoid
            // both :checked and .off-screen--active styles being applied
            $offScreenTriggerLabel.on('click', function(e) {
                $('#off-screen-trigger').removeAttr('checked');
                $(this).toggleClass('off-screen--active');
                $offScreenMenu.toggleClass('off-screen--active');
                $offScreenPageWrapper.toggleClass('off-screen--active');
                $offScreenHeader.toggleClass('off-screen--active');
            });
        }

        function iOSversion() {
            if (/iP(hone|od touch|ad)/.test(navigator.platform)) {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return parseInt(v[1], 10);
            }
        }

        function detectAndroidStockBrowser() {
            var nua = navigator.userAgent;
            var isAndroid = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
            return isAndroid;
        }

        // Initialise off screen menu js for browsers that don't support the CSS only method
        if (api.androidJsSupport()) {
            api.initOffScreenAndroidStock();
        }

        if (api.iOSJsSupport()) {
            api.initOffScreenIos();
        }

        return api;
    }
}
