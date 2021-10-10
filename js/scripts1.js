var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

// Requirements:
//     * jQuery
//     * Underscore.js
//     * URI.js
(function(globalSettings, $, _, window) {
    var EventDispatcher = window.Application || undefined;
    if (!_.isObject(EventDispatcher) || !_.isFunction(EventDispatcher.on)) {
        EventDispatcher = $('body');
    }

    var settings = globalSettings.AuthenticationConfirmation,
        getUtcNow = function() {
            var d = new Date();
            return parseInt(d.valueOf() / 1000, 10);
        },
        getExpiresAt = function() {
            var expiresAt = parseInt($.cookie(settings.expiresAtCookie.name), 10);
            return isNaN(expiresAt) ? 0 : expiresAt;
        },
        setExpiresAt = function(expiresAt) {
            var expiresAtCookie = settings.expiresAtCookie;
            $.cookie(expiresAtCookie.name, expiresAt, {path: expiresAtCookie.path});
        },
        isRequired = function() {
            return getExpiresAt() < getUtcNow();
        },
        getRedirectUrl = function(returnUrl) {
            var uri = URI(window.location.href).path(settings.path).query({'next': returnUrl});
            return uri.toString();
        },
        events = {
            'ConfirmationRequired': 'wginternal:contrib:authenticationconfirmation-confirmation-required'
        },
        handlerConfirmationRequired = function(options) {
            var defaultOptions = {
                'returnUrl': '',
                'onConfirmationRequired': null,
                'onAlreadyConfirmed': null
            };
            options = $.extend({}, defaultOptions, options);

            if (isRequired()) {
                if (options.onConfirmationRequired) {
                    var url = getRedirectUrl(options.returnUrl);
                    options.onConfirmationRequired(url);
                } else {
                    window.location.href = getRedirectUrl(options.returnUrl);
                }
                return false;
            }

            if (options.onAlreadyConfirmed) {
                options.onAlreadyConfirmed();
            }
        };

    globalSettings.AuthenticationConfirmation.Events = events;


    if ($().jquery < '1.7') {
        EventDispatcher.bind(events.ConfirmationRequired, handlerConfirmationRequired);
    } else {
        EventDispatcher.on(events.ConfirmationRequired, handlerConfirmationRequired);
    }

    setExpiresAt(getUtcNow() + settings.secondsLeft);
})(window.Settings || {}, jQuery, _, window);


}
/*
     FILE ARCHIVED ON 21:58:42 Oct 29, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:48 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 170.008
  exclusion.robots: 0.152
  exclusion.robots.policy: 0.14
  RedisCDXSource: 1.507
  esindex: 0.009
  LoadShardBlock: 142.203 (3)
  PetaboxLoader3.datanode: 104.612 (5)
  CDXLines.iter: 23.03 (3)
  PetaboxLoader3.resolve: 208.074 (3)
  load_resource: 207.162 (2)
*/