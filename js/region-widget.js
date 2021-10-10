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

wgsdk.regionWidget = (function($,  region_widget_helper){
    var cookiePrefix = 'csw_';
    var partnerSystemParameterName = 'sid';

    var getTemplateCookie = function(template) {
        return region_widget_helper.getCookie(cookiePrefix+template);
    };

    var setTemplateCookie = function(template) {
        region_widget_helper.setCookie(
            cookiePrefix+template,
            true,
            {expires: 31536000,
             path: '/',
             domain: region_widget_helper.getDomainForCookie()}
        );
    };


    var templateHandler_popup = function(template, data) {
        setTemplateCookie(template);

        if (data.msg) {
            $('body').append('<div class="l-cluster-change" id="cluster-change-overlay"></div>');
            $('.l-cluster-change').html(data.msg).show();
            $('.b-cluster-change_content').center({vertical: true});
            $('html').addClass('b-cluster-change_scroll-lock');
            var $body = $(this.ie6 ? document.body : document);
            var $heightpage = $body.height() + 200;
            $('.b-cluster-change_bg').css({height: $heightpage});
        }
    };

    var templateHandler_top = function(template, data) {
        if (data.msg) {
            $(".b-header").append(data.msg);
            $('#top-widget-button-close').click(function(e){
                e.preventDefault();
                setTemplateCookie(template);
                $('#top-widget-wrapper').remove();
            })
        } else {
            setTemplateCookie(template);
        }
    };

    var templateHandler_registration = function(template, data) {
        if (data.msg) {
            $("#registration-region-widget").html(data.msg).show();
        }
    };

    var templateHandlers = {
        'popup': templateHandler_popup,
        'top': templateHandler_top,
        'registration': templateHandler_registration
    };

    return function(calling, url, template) {
        if (!(navigator.cookieEnabled && !getTemplateCookie(template) && url && template)) {
            return
        }

        var params = {
            'tpl': template,
            'calling': calling,
            'sid':  region_widget_helper.getParameterByName(partnerSystemParameterName)
        };

        var onData = function(data){
            try {
                templateHandlers[template.toLowerCase()](template.toLowerCase(), data);
            } catch(e) {}
            if (window[wgsdk.vars.CALLBACK_USER_ORIGIN_REGION] && $.cookie(wgsdk.vars.USER_ORIGIN_REGION_COOKIE_NAME)) {
                window[wgsdk.vars.CALLBACK_USER_ORIGIN_REGION]($.cookie(wgsdk.vars.USER_ORIGIN_REGION_COOKIE_NAME));
            }
        };

        $.getJSON(url+'?jsoncallback=?', params, onData);
    };
})($, wgsdk.region_widget_helper);


}
/*
     FILE ARCHIVED ON 18:31:27 Nov 03, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:44 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 112.485
  exclusion.robots: 0.083
  exclusion.robots.policy: 0.076
  RedisCDXSource: 1.661
  esindex: 0.007
  LoadShardBlock: 90.784 (3)
  PetaboxLoader3.datanode: 133.653 (5)
  CDXLines.iter: 17.3 (3)
  load_resource: 125.748 (2)
  PetaboxLoader3.resolve: 77.463 (2)
*/