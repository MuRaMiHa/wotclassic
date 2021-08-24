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

(function ($, _, amplify) {
    'use strict';

    function ResolutionManager() {
        this.init();
    }

    ResolutionManager.prototype.RESOLUTION_MOBILE = 0;
    ResolutionManager.prototype.RESOLUTION_TABLET = 10;
    ResolutionManager.prototype.RESOLUTION_TABLET_WIDE = 20;
    ResolutionManager.prototype.RESOLUTION_DESKTOP = 30;

    ResolutionManager.prototype.init = function() {
        this.oldState = this.getCurrentState();
        $(window).on('resize.resolution', _.bind(_.debounce(this.resizeHandler, 100), this));
    };

    ResolutionManager.prototype.getCurrentState = function() {
        return Number($('.support').css('z-index'));
    };

    ResolutionManager.prototype.resizeHandler = function() {
        var currentState = this.getCurrentState();

        if (currentState !== this.oldState) {
            amplify.publish('resolution:statechanged', currentState);
            this.oldState = currentState;
        }
    };

    window.ResolutionManager = new ResolutionManager();

})(jQuery, _, amplify);


}
/*
     FILE ARCHIVED ON 06:48:35 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:19 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 86.764
  exclusion.robots: 0.08
  exclusion.robots.policy: 0.073
  RedisCDXSource: 6.099
  esindex: 0.009
  LoadShardBlock: 52.524 (3)
  PetaboxLoader3.datanode: 99.245 (5)
  CDXLines.iter: 25.81 (3)
  load_resource: 231.726 (2)
  PetaboxLoader3.resolve: 123.894 (2)
*/