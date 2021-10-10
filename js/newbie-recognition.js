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

(function($) {

    'use strict';

    var newbieLifetimeCookieValue = $.cookie(NEWBIE_LIFETIME_COOKIE_NAME),
        currentTimestamp = new Date().getTime(),
        firstVisit;

    if (newbieLifetimeCookieValue === undefined) {
        newbieLifetimeCookieValue = currentTimestamp;

        $.cookie(NEWBIE_SESSION_COOKIE_NAME, currentTimestamp, {path: '/'});
    } else {
        firstVisit = newbieLifetimeCookieValue.split('-')[0];
        newbieLifetimeCookieValue = firstVisit + '-' + currentTimestamp;
    }

    $.cookie(NEWBIE_LIFETIME_COOKIE_NAME, newbieLifetimeCookieValue, {
        path: '/',
        expires: NEWBIE_LIFETIME_COOKIE_EXPIRATION_PERIOD
    });

})(jQuery);

}
/*
     FILE ARCHIVED ON 18:31:26 Nov 03, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:44 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  esindex: 0.03
  CDXLines.iter: 42.306 (3)
  load_resource: 294.378 (2)
  exclusion.robots: 0.418
  exclusion.robots.policy: 0.39
  captures_list: 246.444
  PetaboxLoader3.resolve: 118.274 (2)
  RedisCDXSource: 14.762
  PetaboxLoader3.datanode: 245.548 (5)
  LoadShardBlock: 181.335 (3)
*/