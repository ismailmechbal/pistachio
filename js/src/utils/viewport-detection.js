/**
 * Returns the viewport size e.g. "sm", "md".
 *
 * @param  jQuery $
 *
 * @return object
 */
module.exports = function($) {
    var api = {
        getViewportSize: function() {
            var bodyPseudoBeforeElement = window.getComputedStyle(document.querySelector('body'), '::before');
            return bodyPseudoBeforeElement.getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
        }
    }

    return api;
}
