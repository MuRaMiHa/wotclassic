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
     FILE ARCHIVED ON 06:49:07 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:21 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 157.692
  exclusion.robots: 0.212
  exclusion.robots.policy: 0.201
  RedisCDXSource: 2.07
  esindex: 0.012
  LoadShardBlock: 124.267 (3)
  PetaboxLoader3.datanode: 145.635 (5)
  CDXLines.iter: 26.361 (3)
  load_resource: 297.376 (2)
  PetaboxLoader3.resolve: 223.284 (2)
*/