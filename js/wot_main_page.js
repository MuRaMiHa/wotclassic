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

$(document).ready(function(e) {

    wgsdk.expandable_window('#js-more-wrapper');
    wgsdk.expandable_window('#js-contr-wrapper');

    var searchPaths = {'clans': '/community/clans/fast_search/',
                       'accounts': '/community/accounts/fast_search/' };

    var searchForm = $('#js-menu-search-form');

    function InintSearchSwitcher(type) {
        var base = 'js-menu-search-'+type;
        var switcher = $('#'+base);
        var postUrl = searchPaths[type];
        $('#js-menu-search-switcher').change(function(e){
            searchForm.attr('action', postUrl);
            $('.js-menu-search-tooltip').toggleClass('js-hidden', true);
            $('.'+base+'-tooltip').toggleClass('js-hidden', false);
        });
    };

    InintSearchSwitcher('accounts');
    InintSearchSwitcher('clans');

    /* input[readonly] and Backspace in IE */
    function stopBackspace(windowEvent) {
        var code = windowEvent.keyCode;
        if(code==8) {
            //Backspace
            windowEvent.stopPropagation();
            windowEvent.preventDefault();
        }
    };
    $(document).on('keydown', 'input[readonly]', function(event) {
        stopBackspace(event);
    });

    var banners = $('.js-b4rs-left,.js-b4rs-right');
    function UpdateBannersVisibility(){
        if ($(window).width() < 1440){
            banners.hide();
        }else{
            banners.show();
        }
    };
    UpdateBannersVisibility();
    $(window).resize(UpdateBannersVisibility);
});

function ShowSpoiler(obj, id, hide_text, show_text){
    var spoiler_obj = $('#spoiler_'+id)
    var link_obj = $(obj);
    if( spoiler_obj.css('display') == 'none'){
        spoiler_obj.show();
        link_obj.text(hide_text);
    }else{
        spoiler_obj.hide();
        link_obj.text(show_text);
    }
}


}
/*
     FILE ARCHIVED ON 06:48:58 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:24 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 183.28
  exclusion.robots: 0.121
  exclusion.robots.policy: 0.112
  RedisCDXSource: 1.745
  esindex: 0.009
  LoadShardBlock: 156.513 (3)
  PetaboxLoader3.datanode: 69.501 (5)
  CDXLines.iter: 21.632 (3)
  PetaboxLoader3.resolve: 161.843 (4)
  load_resource: 139.649 (2)
*/