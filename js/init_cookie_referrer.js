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

(function($, URI) {
    var MILLISECONDS = 1000,
        SECONDS = 60,
        MINUTES = 30,
        ADD_REFERRER_LINK_SELECTOR = '.js-referer',
        REFERRER_COOKIE_NAME = 'ref_domain',
        NONE_LINK_PARAMETER = 'direct',
        TRIGGER_NAME = 'linkChanged',
        linkParameter = '';

    var referrer = document.referrer,
        notOverrideDomain = window.location.hostname,
        referrerHostName;

    referrerHostName = URI(referrer).hostname();

    if (referrerHostName !== undefined && referrerHostName.length && referrerHostName.indexOf(notOverrideDomain) === -1) {
        var cookieLifeTime = MINUTES * SECONDS * MILLISECONDS,
            currentTime = (new Date()).getTime(),
            expireTime = new Date(currentTime + cookieLifeTime);

        if (referrerHostName.length > 0) {
            $.cookie(REFERRER_COOKIE_NAME, referrerHostName, { expires: expireTime, path: '/' });
        }
    }

    if ($.cookie(REFERRER_COOKIE_NAME) !== undefined) {
        linkParameter = $.cookie(REFERRER_COOKIE_NAME);
    } else {
        linkParameter = NONE_LINK_PARAMETER;
    }

    updateHref = function(link) {
        var $link = $(link),
            href = $link.attr('href');
        $link.attr('href', href + linkParameter);
    };

    $.fn.updateLinkReferrer = function() {

        return this.each(function() {
            var $link = $(this);

            if ($link.data('referrerinitialized') !== true) {
                updateHref($link);
                $link.data('referrerinitialized', true);
            }

            $link.on(TRIGGER_NAME, function() {
                updateHref($link);
            });
        });
    };

    $(function() {
        $(ADD_REFERRER_LINK_SELECTOR).updateLinkReferrer();
    });

})(jQuery, URI);

}
/*
     FILE ARCHIVED ON 18:31:26 Nov 03, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:42 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 114.519
  exclusion.robots: 0.158
  exclusion.robots.policy: 0.145
  RedisCDXSource: 5.885
  esindex: 0.009
  LoadShardBlock: 84.8 (3)
  PetaboxLoader3.datanode: 47.191 (4)
  CDXLines.iter: 18.723 (3)
  PetaboxLoader3.resolve: 74.579 (2)
  load_resource: 57.741
*/