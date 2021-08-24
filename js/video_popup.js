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

    var VIDEO_LINK_SELECTOR = '.js-video-popup',
        VIDEO_POPUP_WIDTH = 850,
        VIDEO_POPUP_HEIGHT = 480; /* 16:9 */

    $(function() {

        $(VIDEO_LINK_SELECTOR).on('click', function(e) {
            e.preventDefault();
        
            $.fancybox({
                'type' : 'iframe',
                'href' : this.href.replace(new RegExp('watch\\?v=', 'i'), 'embed/') + '?rel=0&autoplay=1&wmode=opaque',
                'overlayShow' : true,
                'width' : VIDEO_POPUP_WIDTH,
                'height' : VIDEO_POPUP_HEIGHT
            });
        }); 
    });

})(jQuery);

}
/*
     FILE ARCHIVED ON 06:49:00 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:22 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 125.862 (5)
  captures_list: 152.797
  CDXLines.iter: 25.826 (3)
  RedisCDXSource: 4.498
  exclusion.robots: 0.239
  load_resource: 233.234 (2)
  esindex: 0.016
  LoadShardBlock: 118.401 (3)
  PetaboxLoader3.resolve: 175.599 (2)
  exclusion.robots.policy: 0.224
*/