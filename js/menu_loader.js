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

    "use strict";

    window.WG = window.WG || {};
    WG.vars = WG.vars || {};

    var accountInfo = wgsdk.account_info(),
        isUserLoggedIn = is_auth_user(),
        $fallbackTemplate = $('#js-common-menu-fallback'),
        commonMenuLoginUrl = $('.js-auth-openid-link').attr('href');

    $('.js-language-list-add-ga-events').on('click', function() {
        dataLayer.push({'event': 'GAevent', 'eventCategory': 'Language', 'eventAction': 'All'});
    });

    if (!isUserLoggedIn) {
        if (WG.vars.COMMON_MENU_ENABLED) {
            removeCommonMenuCookies();
        }
        wgsdk.ajax_info.show_login_link();
    } else {
        wgsdk.ajax_info.show_my_profile_link();
        wgsdk.ajax_info.show_bonus_link();
        wgsdk.ajax_info.show_payment_link();

        var updateMenuFromCookie = function(accountInfo) {
            var path = window.location.pathname;
            if (wgsdk.vars.KR_ENABLED && wgsdk.vars.KR_AGREEMENTS_ENABLED) {
                if (isUserLoggedIn && !accountInfo.is_kr_agreement_accepted()) {
                    if (path !== wgsdk.vars.KR_AGREEMENT_URL && (!wgsdk.vars.AVAILABLE_WITHOUT_AGREEMENTS)) {
                        wgsdk.ajax_info.set_ua_redirect_url(path);
                        window.location.href = wgsdk.vars.KR_AGREEMENT_URL;
                    }
                }
            }
            wgsdk.ajax_info.show_my_profile_link(accountInfo.get_nickname(), accountInfo.get_spa_id());
            wgsdk.ajax_info.show_payment_link(accountInfo.get_loginname());

            wgsdk.ajax_info.show_game_ban(accountInfo.get_game_ban());
            wgsdk.ajax_info.show_clan_ban(accountInfo.get_clan_ban());

            if (WG.vars.COMMON_MENU_ENABLED) {
                $.cookie(WG.vars.COMMON_MENU_COOKIE_PREFIX + 'user_id', wgsdk.account_info().get_spa_id(), {path: WG.vars.COMMON_MENU_COOKIE_PATH});
                $.cookie(WG.vars.COMMON_MENU_COOKIE_PREFIX + 'user_name', wgsdk.account_info().get_nickname(), {path: WG.vars.COMMON_MENU_COOKIE_PATH});
                if (window.WG && WG.CommonMenu) {
                    updateCommonMenu();
                }
            }
            $(document).ready(function(){
                wgsdk.ajax_info.show_clan(accountInfo.get_clan_id(), accountInfo.get_clan_tag(), accountInfo.get_clan_color());
            });
        };
        
        accountInfo.queue(updateMenuFromCookie);
    }

    function updateCommonMenu() {
        var registrationUrl = $('.js-registration_url').find('a').attr('href'),
            commonMenuParameters = {
                login_url: commonMenuLoginUrl,
                registration_url: registrationUrl,
                logout_url: '#',
                user_id: $.cookie(WG.vars.COMMON_MENU_COOKIE_PREFIX + 'user_id'),
                user_name: $.cookie(WG.vars.COMMON_MENU_COOKIE_PREFIX + 'user_name')
            };

        WG.CommonMenu.on('login', function(e) {
            e.preventDefault();
            $('.js-auth-openid-link').get(0).click();
        });
        WG.CommonMenu.on('logout', function(e) {
            e.preventDefault();
            removeCommonMenuCookies();
            $('.js-auth-logout-link').get(0).click();
        });
        setTimeout(function() {
            WG.CommonMenu.update(commonMenuParameters);
        }, 0);
    }

    function removeCommonMenuCookies() {
        $.removeCookie(WG.vars.COMMON_MENU_COOKIE_PREFIX + 'user_name', {path: WG.vars.COMMON_MENU_COOKIE_PATH});
        $.removeCookie(WG.vars.COMMON_MENU_COOKIE_PREFIX + 'user_id', {path: WG.vars.COMMON_MENU_COOKIE_PATH});
    }

    $(document).ready(function() {
        wgsdk.ajax_info.show_language_selector(get_lang(), accountInfo.is_staff());
        if (WG.vars.COMMON_MENU_ENABLED && window.WG && WG.CommonMenu) {
            updateCommonMenu();
        } else if (WG.vars.COMMON_MENU_ENABLED && !(window.WG && WG.CommonMenu)) {
            setTimeout(function() {
                if (!window.WG || !WG.CommonMenu) {
                    if ($fallbackTemplate.length) {
                        $fallbackTemplate.addClass($fallbackTemplate.data('visibleClass'));
                    }
                    $('#common_menu').remove();
                } else {
                    updateCommonMenu();
                }
            }, WG.vars.COMMON_MENU_LOADER_TIMEOUT || 3000);
        }

        if (!isUserLoggedIn && wgsdk.vars.CLANWARS_SECOND_GLOBALMAP_INTERGATION_ENABLED) {
            $('.js-portal-menu-clans-index-link').show();
        }

    });

})(jQuery);

}
/*
     FILE ARCHIVED ON 06:49:08 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:26 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.337
  PetaboxLoader3.resolve: 392.341 (3)
  RedisCDXSource: 5.834
  esindex: 0.015
  CDXLines.iter: 23.856 (3)
  load_resource: 415.325 (2)
  captures_list: 233.907
  PetaboxLoader3.datanode: 215.009 (5)
  exclusion.robots: 0.353
  LoadShardBlock: 198.916 (3)
*/