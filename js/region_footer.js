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
        CLOSE_REGION_SELECTOR = '.js-close-region',
        EVENT_NAMESPACE = '.regionselector';
        
    $(function() {

        var $changeRegion = $(CHANGE_REGION_SELECTOR),
            $regionHolder = $(REGION_HOLDER_SELECTOR),
            $closeRegionBtn = $(CLOSE_REGION_SELECTOR),
            linkOpenedClass = $changeRegion.data('openedClass'),
            holderOpenedClass = $regionHolder.data('openedClass');

        $changeRegion.on('click' + EVENT_NAMESPACE, function(e) {
            e.preventDefault();

            if ($regionHolder.hasClass(holderOpenedClass)) {
                closeRegion();
            } else {
                $(document).on('click' + EVENT_NAMESPACE, documentOnClickHandler);
                $regionHolder.addClass(holderOpenedClass);
                $changeRegion.addClass(linkOpenedClass);
            }
        });

        $closeRegionBtn.on('click' + EVENT_NAMESPACE, function(e) {
            e.preventDefault();
            closeRegion();
        });

        function closeRegion() {
            $regionHolder.removeClass(holderOpenedClass);
            $changeRegion.removeClass(linkOpenedClass);
            $(document).off('click' + EVENT_NAMESPACE);
        }

        function documentOnClickHandler(e) {
            var target = e.target,
                isRegionBoxChild = Boolean($(target).closest(REGION_HOLDER_SELECTOR).length),
                isChangeRegionBtn = (target === $changeRegion.get(0));

            if (!isRegionBoxChild && !isChangeRegionBtn) {
                closeRegion();
            }
        }

    });
        
})(window.jQuery);

}
/*
     FILE ARCHIVED ON 06:49:46 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:31 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 410.368
  exclusion.robots: 0.127
  exclusion.robots.policy: 0.117
  RedisCDXSource: 16.871
  esindex: 0.012
  LoadShardBlock: 365.748 (3)
  PetaboxLoader3.datanode: 407.733 (5)
  CDXLines.iter: 24.724 (3)
  load_resource: 315.484 (2)
  PetaboxLoader3.resolve: 217.61 (2)
*/