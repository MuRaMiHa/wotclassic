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

$(function() {
    $('.js-widget-placeholder').each(function() {
        var placeholder = $(this);
        $.ajax({
                url: '/layout/widget/' + placeholder.text() + '/',
                type: 'GET',
                dataType: 'html',
                success: function(data) { placeholder.after(data); placeholder.remove() }
            })
     })
 })



}
/*
     FILE ARCHIVED ON 06:49:05 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:24 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 163.767 (3)
  esindex: 0.016
  exclusion.robots.policy: 0.219
  cdx.remote: 0.119
  PetaboxLoader3.resolve: 122.122
  captures_list: 310.203
  exclusion.robots: 0.234
  load_resource: 195.617 (2)
  CDXLines.iter: 29.531 (3)
  PetaboxLoader3.datanode: 198.399 (5)
*/