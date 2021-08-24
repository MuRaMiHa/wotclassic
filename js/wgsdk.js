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

wgsdk.step = (function ($) {
    var obj = function (stepWrap) {

        var content = stepWrap.find('.js-step'),
            contentItem = content.find('.js-step-item'),
            contentItemLast = contentItem.last(),
            contentItemLength = contentItem.length,
            allItemsWidth = 0;

        contentItem.each(function () {
            allItemsWidth = allItemsWidth + $(this).width();
        });

        var indent = Math.floor((content.width() - allItemsWidth) / (contentItemLength - 1)) + 'px';
        contentItem.last().addClass('js-last');

        contentItem.each(function () {
            if (!$(this).hasClass('js-last')) {
                $(this).css('padding-right', indent);
                $(this).children('.js-step-arrow').show().css({
                    'width': indent
                });
            }
        });
    };
    return obj;
}(jQuery));

wgsdk.thousands = (function ($) {

    var obj = function(number, reduce, startFrom) {
        "use strict";

        var result,
            i = 0;

        if (reduce && startFrom <= number) {
            var suffix = '';

            if (number > 1000000) {
                number /= 1000000;
                suffix = ' M';
            }
            if (number > 1000) {
                number /= 1000;
                suffix = ' K';
            }
            result = number;
            if (suffix) {
                result = number.toFixed(2) + suffix;
            }
            return result;
        }

        var dotted = '';
        number = number.toString();
        var dotPosition = number.search(/\./);
        if (dotPosition > -1) {
            dotted = get_format('DECIMAL_SEPARATOR') || '.';
            dotted += number.substr(dotPosition + 1);
            number = number.substr(0, dotPosition);
        }

        result = '';

        var sign = '';
        if (number.substr(0, 1) === '-') {
            number = number.substr(1);
            sign = '-';
        }

        var len = number.length;
        for (i = 0; i < len; ++i) {

            if (i !== 0 && (len - i) !== 0 && (len - i) % 3 === 0) {
                result += wgsdk.vars.THOUSAND_SEPARATOR;
            }
            result += number.charAt(i);
        }
        return sign + result + dotted;
    };
    return obj;
}(jQuery));


wgsdk.roman = function(num) {
    var digits, key, roman, i;

    if (!Number(num)) {
        return '';
    }

    digits = String(Number(num)).split('');
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
           "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
           "","I","II","III","IV","V","VI","VII","VIII","IX"];
    roman = '';
    i = 3;

    while (i--) {
        roman = (key[Number(digits.pop()) + (i * 10)] || '') + roman;
    }

    return Array(+digits.join('') + 1).join('M') + roman;
};

wgsdk.uniqueid = (function () {
    /* UUID rfc4122 */

    var obj = function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
           var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
           return v.toString(16);
        });
    };
    return obj;
}());


wgsdk.base64 = (function () {
    /* http://javascript.ru/php/base64_encode */

    var obj = {
        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "",
                chr1, chr2, chr3, enc1, enc2, enc3, enc4,
                i = 0;

            input = wgsdk.base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = wgsdk.base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "", n;

            for (n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    };
    return obj;
}());

wgsdk.auth_confirm = function(next_url){
    if(wgsdk.vars.AUTH_CONFIRMATION_URL){
        var url = wgsdk.vars.AUTH_CONFIRMATION_URL+"?next="+escape(next_url);
        document.location = url;
    }else{
        wgsdk.forms.auth({
            success: function() {
                document.location = next_url;
            }
        });
    }
};

wgsdk.set_focus = (function ($, document) {
    "use strict";
    // Set focus on correct field in selector content
    var obj = function (selector) {
        var block,
            focusedInsideBlock,
            focus_element,
            sub_selectors = ['input:visible',
                             'textarea:visible',
                             '.js-confirm-button:visible',
                             '.js-cancel-button:visible'],
            query;

        // Prevent focus being changed if user has already focused on any element inside the block obtained by selector.
        // document.activeElement property is supported by IE6+, FF3+, Safari 4+, Opera 9+, Chrome 9+
        // http://stackoverflow.com/questions/5318415/which-browsers-support-document-activeelement
        if (document.activeElement) {
            block = $(selector);
            try {
                focusedInsideBlock = block.has(document.activeElement).length > 0;
                if (focusedInsideBlock) {
                    return;
                }
            } catch (e) {
                // this code may crash inside the $ (on the input[type="file"]):
                // >>> Permission denied to access property 'nodeType'
            }
        }

        focus_element = $(selector).find('.js-focus-element');
        if (focus_element.length) {
            focus_element[0].focus();
        } else {
            query = $(sub_selectors.join(", "), selector).not('.js-disable-autofocus');
            if (query.length) {
                query.eq(0).focus();
            }
        }
    };

    return obj;
}(jQuery, document));


wgsdk.expandable_window = (function ($, document, set_focus, uniqueid) {
    "use strict";

    var obj = function (selector_or_object) {
        var instance = {},
            opened = false,
            eventTriggered = false,
            widget,
            unique_class,
            selector,
            KEY_IS_ACTIVATED = 'expandable_window_is_activated',
            expandableWndItem,
            ON_MENU_WND_SHOW_EVENT = 'on_menu_wnd_show_event';

        if (typeof selector_or_object === 'string') {
            widget = $(selector_or_object);
            selector = selector_or_object;
        } else {
            widget = selector_or_object;
        }

        if (!widget.length) {
            return;
        }

        if (widget.data(KEY_IS_ACTIVATED)) {
            return null;
        }

        if (typeof selector_or_object !== 'string') {
            unique_class = uniqueid();
            selector = '.' + unique_class;
            widget.addClass(unique_class);
        }

        expandableWndItem = $('.js-expand-wnd-item', widget);

        instance.Show = function () {
            var expandableWnd = $('.js-expand-wnd', widget);
            expandableWnd.toggleClass('js-hidden', false);
            widget.toggleClass('opened', true);
            set_focus(expandableWnd);
            opened = true;

            eventTriggered = true;
            $(document).trigger(ON_MENU_WND_SHOW_EVENT);

            expandableWnd.css("width", expandableWnd.width()).css("min-width", expandableWnd.width()).css("max-width", expandableWnd.width());
        };

        instance.Hide = function () {
            $('.js-expand-wnd', widget).toggleClass('js-hidden', true);
            widget.toggleClass('opened', false);
            opened = false;
            $('.js-expand-wnd-item', widget).removeClass("hover");
        };

        expandableWndItem.hover(function () {
            expandableWndItem.removeClass("hover");
        });

        $(document).delegate('body', 'click', function () {
            instance.Hide();
        });

        $(document).delegate(selector + ' .js-expand-wnd', "click", function (e) {
            e.stopPropagation();
        });

        $(document).delegate(selector + ' .js-visible-wnd', "click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (opened) {
                instance.Hide();
            } else {
                instance.Show();
            }
        });

        $(document).bind(ON_MENU_WND_SHOW_EVENT, function () {
            if (eventTriggered) {
                eventTriggered = false;
            } else {
                instance.Hide();
            }
        });

        $(document).bind('dialogopen', function () {
            eventTriggered = false;
            instance.Hide();
        });

        widget.data(KEY_IS_ACTIVATED, 1);
        return instance;
    };
    return obj;
}(jQuery, document, wgsdk.set_focus, wgsdk.uniqueid));

/* Google analytics */
wgsdk.ga = function(trackEvent) {
    var dataLayer = (window.dataLayer || []),
        defaultTrackEvent = {
            event: 'GAevent'
        };

    dataLayer.push($.extend({}, defaultTrackEvent, trackEvent));

    if (!window.dataLayer) {
        window.dataLayer = dataLayer;
    }
};

wgsdk.ajax_info = (function ($) {
    var instance = {};

    instance.fadeIn_speed = 'slow';

    instance.show_login_link = function () {
        if (wgsdk.vars.REGISTRATION_URL) {
            $('.js-registration_url a')
                .attr('href',  wgsdk.vars.REGISTRATION_URL.replace('<lang>', get_lang()))
                .trigger('linkChanged');
            $('.js-registration_url').show();
        }
        $('#js-auth-wrapper').show();
    };

    instance.show_bonus_link = function () {
        $('.js-bonus').show();
    };

    instance.show_language_selector = function() {
        var $currentRegion = $('.js-current-region'),
            $regionLink = $('.js-change-region'),
            currentRegionName = $.trim($currentRegion.data('regionName')),
            currentLanguageText;

        if (wgsdk.vars.CN_ENABLED) {
            $regionLink.add('.js-mobile-current-region').text(currentRegionName);
        } else {
            currentLanguageText = $.trim($currentRegion.text());
            $regionLink.add('.js-mobile-current-region').text(currentRegionName + ' (' + currentLanguageText + ')');
            $regionLink.addClass($regionLink.data('langClassPrefix') + window.get_lang());
        }
    };

    instance.set_ua_redirect_url = function (url) {
        var date = new Date();
        date.setTime(date.getTime() + 600000);
        $.cookie(wgsdk.vars.KR_UA_REDIRECT_URL_COOKIE_NAME, url, {
            expires: date,
            path: '/'
        });
    };

    instance.show_payment_link = function (loginname) {
        if (!$('#js-pay-link').length) {
            return;
        }

        loginname = loginname || '';
        var LOGINNAME_KEY = '<loginname>',
            default_url = $('#js-pay-link a').attr('href');

        if (default_url.indexOf(LOGINNAME_KEY) == -1) {
            $('#js-pay-link').show();
        } else if (loginname) {
            $('#js-pay-link a').prop('href', default_url.replace(LOGINNAME_KEY, loginname));
            $('#js-pay-link').show();
        }
    };
    
    instance.show_my_profile_link = function (nickname, spa_id) {
        $('#js-auth-wrapper-nickname').show();
        wgsdk.expandable_window('#js-auth-wrapper-nickname');
        nickname && $(".js-my_profile_nickname").html(nickname);

        if (nickname && spa_id) {
            if (!$(".js-my_profile_link").length) {
                return;
            }
            var link = $(".js-my_profile_link").data('full_link').replace(wgsdk.vars.SPA_ID_KEY, spa_id);
            var link = link.replace(wgsdk.vars.NICKNAME_KEY, nickname);
            $(".js-my_profile_link").attr('href', link);
        }
    };

    instance.show_notifications = function (unread_count, all_count) {
        if (!$("#js-notifications-wrapper").length) {
            return;
        }
        if (unread_count) {
            if (!$("#notifications-alert-link").hasClass('b-top-links__message-new')) {
                $("#notifications-alert-link").addClass('b-top-links__message-new');
            }
            $('.js-counter_unread_messages').html(unread_count).fadeIn(instance.fadeIn_speed);
        } else {
            if ($("#notifications-alert-link").hasClass('b-top-links__message-new')) {
                $("#notifications-alert-link").removeClass('b-top-links__message-new');
            }
            $('.js-counter_unread_messages').hide();
        }

        if (all_count) {
            $(".js-last_messages").show();
            $(".js-no_messages").hide();
        } else {
            $(".js-last_messages").hide();
            $(".js-no_messages").show();
        }

        if (unread_count == undefined && all_count == undefined) {
            $(".js-last_messages").show();
            $(".js-no_messages").hide();
        }

        $("#js-notifications-wrapper").show();
    };

    instance.show_clan = function (clanId, clanTag, clanColor) {
        var $portalMenuClanLinkContainer = $('.js-portal-menu-clan-link'),
            $portalMenuRecruitstationLinkContainer = $('.js-portal-menu-recruitstation-link'),
            $topMenuClanlink = $('#js-sdk_top_right_menu .js-clan-link'),
            $clanTag = $('<span>', {
                'class': 'nav-detail_clantag',
            }),
            clanUrl;


        $('.js-portal-menu-clans-index-link').hide();
        if (clanId && clanTag) {
            clanUrl = wgsdk.vars.WGCC_FE_CLAN_URL.replace('clan_id', clanId);
            if (wgsdk.vars.CLANWARS_SECOND_GLOBALMAP_INTERGATION_ENABLED && $portalMenuClanLinkContainer.length > 0) {
                $portalMenuClanLinkContainer.find('a').attr('href', clanUrl);
                $clanTag.css({'color' : clanColor}).text(' ['+clanTag+']');
                $portalMenuClanLinkContainer.find('.js-portal-menu-link-text').prepend($clanTag);
                $portalMenuClanLinkContainer.show();
                $portalMenuRecruitstationLinkContainer.hide();
            }

            if (!$topMenuClanlink.length) {
                return;
            }
            $topMenuClanlink.attr('href', clanUrl);
            $topMenuClanlink.show();
            $('#js-sdk_top_right_menu .js-clans-index-link').hide();
        } else {
            $portalMenuRecruitstationLinkContainer.show();
        }
    };
    
    instance.show_ban = function (ban, container, target) {
        var ban_msg;

        if (!ban) {
            return;
        }

        if (ban.expiry_time) {
            $(container + ' .js-with-expiry_time').show();
            ban_msg = $(container).html();
            ban_msg = ban_msg.replace(new RegExp(wgsdk.vars.TIME_KEY, "g"), ban.expiry_time);
        } else {
            $(container + ' .js-without-expiry_time').show();
            ban_msg = $(container).html();
        }

        $(target).each(function () {
            var obj = $(this);
            obj.html(ban_msg);
            obj.removeClass('b-sidebar-widget-empty');
            if (!obj.hasClass('js-hidden')) {
               obj.show();
            }
        });

        wotUpdateDateTimeFields(target);
    };

    instance.show_game_ban = function (ban) {
        instance.show_ban(ban, '#account_game_ban_info_container', '.js-account_game_ban_info_msg')
    };

    instance.show_clan_ban = function (ban) {
        instance.show_ban(ban, '#account_clan_ban_info_container', '.js-account_clan_ban_info_msg')
    };

    return instance;
}(jQuery));

wgsdk.preventGhostClick = (function (document) {
    
    var THRESHOLD = 25,
        TIMEOUT = 3000,
        coordinates = [];

    function preventGhostClick(e) {
        var x, y;

        for (var i = 0, max = coordinates.length; i < max; i++) {
            x = coordinates[i][0];
            y = coordinates[i][1];

            if (Math.abs(e.clientX - x) < THRESHOLD && Math.abs(e.clientY - y) < THRESHOLD) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        }
    }

    function resetCoordinates() {
        coordinates = [];
    }

    function popCoordinates() {
        coordinates.splice(0, 1);
    }

    function registerCoordinates(e) {
        var touch, event = e.gesture;
        
        if (!event) {
            event = e;
        }
        
        if (event.pointers.length - event.changedPointers.length <= 0) {
            touch = event.changedPointers[0];
            coordinates.push([touch.clientX, touch.clientY]);

            setTimeout(popCoordinates, TIMEOUT);
        }
    }

    if (typeof window.addEventListener !== 'undefined') {
        document.addEventListener('click', preventGhostClick, true);
    } else if (typeof window.attachEvent !== 'undefined') {
        document.attachEvent('click', preventGhostClick);
    }
    
    return function($el) {
        $el.on('panend', registerCoordinates);
        $el.on('panstart', resetCoordinates);
    };
})(document);


}
/*
     FILE ARCHIVED ON 06:48:33 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:18 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.123
  load_resource: 186.589 (2)
  CDXLines.iter: 24.064 (3)
  esindex: 0.008
  PetaboxLoader3.resolve: 98.351 (2)
  captures_list: 125.789
  PetaboxLoader3.datanode: 151.788 (5)
  LoadShardBlock: 92.607 (3)
  exclusion.robots: 0.132
  RedisCDXSource: 6.483
*/