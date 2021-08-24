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

/*jshint unused:false*/
var BrowserDetection = (function($, navigator) {
    'use strict';
    var IOS_REGEXP = /(i(pod|phone|pad)+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i;

    var matched, browser = {};

    $.uaMatch = function(ua) {
        var match, browserMatch, webkitMatch, mobileMatch, chromeMatch,
            androidStandartBrowserMatch, windowsPhoneDesktopMatch, macMatch, iosMatch;
        
        ua = ua.toLowerCase();

        /* define a regexp to detect browser, its version and additional information */
        match = /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(chromium) ((\d+)?[\w\.]+)/.exec(ua) ||
            /(yabrowser)\/((\d+)?[\w\.]+)/.exec(ua) ||
            /(kindle)\/((\d+)?[\w\.]+)/.exec(ua) ||
            ua.indexOf('compatible') < 0 && /(firefox)\/((\d+)?[\w\.-]+)/.exec(ua) ||
            /(iemobile)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            /(trident)\/.+rv[^\w]+([\w\.]+)/.exec(ua) ||
            /(android)[\/\s-]?([\w\.]+)/.exec(ua) ||
            /version\/((\d+)?[\w\.]+).+?(mobile)\/\w+\s(safari)/.exec(ua) ||
            /version\/((\d+)?[\w\.]+).+?(safari)/.exec(ua) ||
            /version\/.+?\/\w+\s(safari)/.exec(ua) ||
            /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(mozilla)\/((\d+)?[\w\.]+).+gecko/.exec(ua);  /* catch all gecko like browsers */

        webkitMatch = /webkit/.exec(ua);
        mobileMatch = /mobile/.exec(ua);
        windowsPhoneDesktopMatch = /wpdesktop/.exec(ua);
        chromeMatch =  /(chrome)[ \/]([\w.]+)/.exec(ua);
        androidStandartBrowserMatch = /(android)[\/\s-]?([\w\.]+).*?version\/([\w\.]+).+?(mobile)*\s+(safari)/.exec(ua);
        iosMatch = IOS_REGEXP.exec(ua);

        if (match === null) {
            return {};
        }
        
        browserMatch = {
            browser: match[1] || '',
            version: match[2] || '0',
            mobile: mobileMatch !== null ? true : false,
            webkit: webkitMatch !== null ? true : false,
            ios: (iosMatch !== null && iosMatch[0] !== undefined)
        };

        if (match[1] === 'android') {

            if (chromeMatch !== null && chromeMatch[1] === 'chrome') {
                browserMatch.browser = chromeMatch[1];
                browserMatch.version = chromeMatch[2];
            } else {
                if (androidStandartBrowserMatch !== null) {
                    browserMatch.browser = androidStandartBrowserMatch[5];
                    browserMatch.version = androidStandartBrowserMatch[3];
                }
            }

            browserMatch.android = true;
            browserMatch.osVersion = match[2];

        } else if (match[4] === 'safari') {

            browserMatch.browser = match[4];
            browserMatch.version = match[1];

        } else if (match[3] === 'safari') {

            browserMatch.browser = match[3];
            browserMatch.version = match[1];
            
        } else if (browserMatch.browser === 'kindle') {

            browserMatch.mobile = true;

        } else if (match[1] === 'trident') {

            /* Check Windows Phone desktop emulation mode */
            if (windowsPhoneDesktopMatch !== null) {

                browserMatch.browser = 'iemobile';
                browserMatch.mobile = true;

            } else {

                browserMatch.browser = 'msie';

            }

        }

        return browserMatch;
    };

    matched = $.uaMatch(navigator.userAgent);
    
    browser = $.extend({}, matched);
    
    if (matched.browser && matched.browser !== '') {
        browser[matched.browser] = true;
    }

    if (matched.android) {
        browser.android = true;
        browser.mobile = true;
    }

    browser.mac = window.navigator && window.navigator.platform && window.navigator.platform.toLowerCase().indexOf('mac') !== -1;

    $.browser = browser;

    if (browser.msie) {
        $('html').addClass('browser-ie');
    }

    return browser;

})($, navigator);

}
/*
     FILE ARCHIVED ON 06:48:12 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:19 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 82.982
  exclusion.robots: 0.175
  exclusion.robots.policy: 0.156
  RedisCDXSource: 1.076
  esindex: 0.012
  LoadShardBlock: 52.706 (3)
  PetaboxLoader3.datanode: 1131.001 (5)
  CDXLines.iter: 25.802 (3)
  load_resource: 1206.888 (2)
  PetaboxLoader3.resolve: 110.387 (2)
*/