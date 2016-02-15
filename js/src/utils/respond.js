/**
 * Listens to the resize event and responds as required with a provided callback
 * Optionally accepts target breakpoints and only calls the callback if the breakpoint switches between these and breakpoints not targeted
 *
 * @param  jQuery $
 * @param  viewportDetection viewportDetection
 *
 * @return object
 */
module.exports = function($, viewportDetection, agentDetection) {

    var oldBreakpoint = viewportDetection.getViewportSize();

    var api = {
        respondOnBreakpoints: function(callback, targetBreakpoints) {
            // Because Safari iOS < 6 throws erroneous resize events all the time
            if (! agentDetection.iOSversion() || agentDetection.iOSversion() > 6) {
                $(window).resize(function() {
                    var newBreakpoint = viewportDetection.getViewportSize(),
                        newBreakpointTargeted = $.inArray(newBreakpoint, targetBreakpoints) !== -1,
                        oldBreakpointTargeted = $.inArray(oldBreakpoint, targetBreakpoints) !== -1,
                        targetBreakpointChange = (newBreakpointTargeted && ! oldBreakpointTargeted) || (! newBreakpointTargeted && oldBreakpointTargeted);

                    if ((typeof targetBreakpoints === 'undefined' || targetBreakpointChange) && (newBreakpoint !== oldBreakpoint)) {
                        callback();
                    }

                    oldBreakpoint = newBreakpoint;
                });
            }
        }
    }

    return api;
}
