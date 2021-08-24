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

function is_auth_user() {
    /* used in CMS content for tracking */
    var IS_AUTH_COOKIE_NAME = 'hlauth';
    var is_auth = $.cookie(IS_AUTH_COOKIE_NAME);
    return is_auth;
}

function get_lang() {
    return wgsdk.vars.CURRENT_REQUEST_LANGUAGE ||
           $.cookie(wgsdk.vars.LANG_COOKIE_NAME) ||
           wgsdk.vars.DEFAULT_LANGUAGE;
}


wgsdk.account_info = (function ($, base64) {
    var obj = function() {
        var data_from_cookie = null,
            cookie_name = wgsdk.vars.ACCOUNT_INFO_COOKIE_NAME,
            data = $.cookie(cookie_name),
            instance = {},
            no_check_ajax_info_cookie_name = wgsdk.vars.NO_CHECK_AJAX_INFO_COOKIE_NAME;

        if (data) {
            data = data.replace(/\\"/g, "unique_tmp_str");
            data = data.replace(/"/g, "");
            data = data.replace(/unique_tmp_str/g, "\"");
            data = base64.decode(data);
            data_from_cookie = $.parseJSON(data);
        }

        instance.has_data = function () {
            if (data_from_cookie) {
                return true;
            }
            return false;
        };

        instance.queue = function(callback) {
            if (instance.has_data()) {
                callback(instance);
            } else {
                instance.update_cookie_from_server(callback);
            }
        };

        instance.get_by_key = function (key, default_value) {
            default_value = typeof default_value !== 'undefined' ? default_value : '';
            if (!data_from_cookie || !data_from_cookie[key]) {
                return default_value;
            }
            return data_from_cookie[key];
        };
        instance.get_loginname = function () {
            return instance.get_by_key('loginname');
        };
        instance.get_clan_id = function () {
            return instance.get_by_key('clan_id');
        };
        instance.get_clan_tag = function () {
            return instance.get_by_key('clan_tag');
        };
        instance.get_clan_leader_id = function () {
            return instance.get_by_key('clan_leader_id', null);
        };
        instance.get_clan_color = function () {
            return instance.get_by_key('clan_color', null);
        };
        instance.is_premium_active = function () {
            return instance.get_by_key('is_premium_active', false);
        };
        instance.get_battles_count = function () {
            return instance.get_by_key('battles_count', 0);
        };
        instance.get_spa_id = function () {
            return instance.get_by_key('spa_id') || 0;
        };
        instance.get_nickname = function () {
            return instance.get_by_key('nickname');
        };
        instance.is_staff = function () {
            return instance.get_by_key('is_staff', 0);
        };
        instance.get_game_ban = function () {
            return instance.get_by_key('game_ban');
        };
        instance.get_clan_ban = function () {
            return instance.get_by_key('clan_ban');
        };
        instance.get_unread_notification_count = function () {
            return instance.get_by_key('unread_notifications_count', 0);
        };
        instance.get_all_notification_count = function () {
            return instance.get_by_key('all_notifications_count', 0);
        };
        instance.is_kr_agreement_accepted = function() {
            return instance.get_by_key('is_kr_agreement_accepted', 0);
        };
        instance.set_extra_cookie_lifetime = function () {
            var date = new Date(),
                cookie_value = $.cookie(cookie_name),
                timeout;

            timeout = (wgsdk.vars.ACCOUNT_INFO_COOKIE_EXTRA_TIMEOUT_RATE
                       * wgsdk.vars.ACCOUNT_INFO_COOKIE_TIMEOUT_SECONDS * 1000);

            date.setTime(date.getTime() + timeout);

            $.removeCookie(cookie_name);
            
            if (cookie_value !== undefined) {
                var old_raw_value = $.cookie.raw;
                $.cookie.raw = true;
                $.cookie(cookie_name, cookie_value, {
                    expires: date,
                    path: '/',
                    domain: wgsdk.vars.ACCOUNT_INFO_COOKIE_DOMAIN
                });
                $.cookie.raw = old_raw_value;
            }
        };

        instance.set_no_check_ajax_info = function () {
            var date = new Date();
            timeout = (wgsdk.vars.ACCOUNT_INFO_COOKIE_EXTRA_TIMEOUT_RATE
                    * wgsdk.vars.ACCOUNT_INFO_COOKIE_TIMEOUT_SECONDS * 1000);

            date.setTime(date.getTime() + timeout);
            $.cookie(no_check_ajax_info_cookie_name, '1', {
                expires: date,
                path: '/',
                domain: wgsdk.vars.ACCOUNT_INFO_COOKIE_DOMAIN
            });
        };

        instance.get_no_check_ajax_info = function () {
            return $.cookie(no_check_ajax_info_cookie_name);
        };

        instance.update_cookie_from_server = function (callback) {
            if (wgsdk.vars.AJAX_ACCOUNT_INFO_REQUEST) {
                var intervalId = setInterval(function () {
                    if (!wgsdk.vars.AJAX_ACCOUNT_INFO_REQUEST) {
                        var account_info = wgsdk.account_info();
                        clearInterval(intervalId);
                        callback && callback(wgsdk.account_info());
                    }
                }, 300);
                return;
            }

            if (instance.get_no_check_ajax_info()) {
                return;
            }

            var start = new Date();
            wgsdk.vars.AJAX_ACCOUNT_INFO_REQUEST = $.ajax({
                url: wgsdk.vars.ACCOUNT_AJAX_INFO_URL,
                cache: false,
                type: "GET",
                data: {'referrer': '' + document.location.pathname},
                success: function () {
                    var end = new Date();

                    if (end.getTime() - start.getTime() > wgsdk.vars.GETTING_ACCOUNT_INFO_COOKIE_CRITICAL_TIME_MS) {
                        instance.set_extra_cookie_lifetime();
                    }
                    var account_info = wgsdk.account_info();
                    wgsdk.vars.AJAX_ACCOUNT_INFO_REQUEST = null;
                    callback && callback(account_info);
                },
                error: function(){
                    instance.set_no_check_ajax_info();
                }
            });
        };

        return instance;

    };
    return obj;
}(jQuery, wgsdk.base64));

}
/*
     FILE ARCHIVED ON 06:48:40 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:20 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 392.259
  exclusion.robots: 0.192
  exclusion.robots.policy: 0.179
  RedisCDXSource: 2.008
  esindex: 0.014
  LoadShardBlock: 362.568 (3)
  PetaboxLoader3.datanode: 99.338 (5)
  CDXLines.iter: 23.509 (3)
  PetaboxLoader3.resolve: 379.21 (4)
  load_resource: 131.797 (2)
*/