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
    
    var REGION_HOLDER_SELECTOR = '.js-region-selector',
        CHANGE_REGION_SELECTOR = '.js-change-region',
        EVENT_NAMESPACE = '.regionselector';
        
    $(function() {

        var $changeRegion = $(CHANGE_REGION_SELECTOR),
            $regionHolder = $(REGION_HOLDER_SELECTOR),
            linkOpenedClass = $changeRegion.data('openedClass'),
            holderOpenedClass = $regionHolder.data('openedClass');

        $changeRegion.on('click' + EVENT_NAMESPACE, function(e) {
            e.preventDefault();

            $regionHolder.toggleClass(holderOpenedClass);
            $changeRegion.toggleClass(linkOpenedClass);

            if ($regionHolder.hasClass(holderOpenedClass)) {
                $('html,body').animate({
                    scrollTop: $(document).outerHeight() + 'px'
                });
            }
        });

    });
        
})(window.jQuery);

}
/*
     FILE ARCHIVED ON 21:58:41 Oct 29, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:48 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 147.272
  exclusion.robots: 0.135
  exclusion.robots.policy: 0.125
  RedisCDXSource: 3.102
  esindex: 0.013
  LoadShardBlock: 118.427 (3)
  PetaboxLoader3.datanode: 132.866 (5)
  CDXLines.iter: 23.045 (3)
  load_resource: 220.62 (2)
  PetaboxLoader3.resolve: 146.671 (2)
*/