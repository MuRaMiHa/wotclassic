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

/* jshint -W065 */

if (!window.wgsdk) {
    alert('Please include the module "wgsdk"');
    var wgsdk = {};
}

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


wgsdk.mainMenu = (function ($, expandable_window) {
    "use strict";

    var obj = function (selector) {
        var main_menu = {},
            m = null;

        if ($(selector).length) {
            m = $(selector);
        }

        main_menu.update_padding = function () {
            if (!m) { return; }

            var itemsMenu = m.find(".js-portal-menu-item"),
                itemsMenuLast = m.find(".js-portal-menu-item:last"),
                numItemsMenu = itemsMenu.length,
                allItemsMenuWidth = 0,
                menuWidth = m.width(), /* максимальная ширина меню */
                itemsMenuInner = itemsMenu.find(".js-portal-menu-item-link-inner"),
                itemsMenuInnerLast = itemsMenuLast.find(".js-portal-menu-item-link-inner"),
                newWidthItemRound = 0,
                differenceWidth,
                curPaddingL,
                curPaddingR,
                newPaddingL,
                newPaddingR,
                allItemsMenuWidthControl = 0;

            itemsMenuLast.addClass("last");
            itemsMenuInner.each(function () {
                newWidthItemRound = $(this).width();
                $(this).css("width", newWidthItemRound);
            });

            itemsMenu.each(function () {
                allItemsMenuWidth = allItemsMenuWidth + $(this).width(); /* ширина всех li в сумме */
            });

            if (allItemsMenuWidth < menuWidth) {
                differenceWidth = Math.floor((menuWidth - allItemsMenuWidth) / numItemsMenu / 2);
                itemsMenuInner.each(function () {
                    curPaddingL = parseInt($(this).css("padding-left").replace("px", ""));
                    curPaddingR = parseInt($(this).css("padding-right").replace("px", ""));
                    newPaddingL = curPaddingL + differenceWidth;
                    newPaddingR = curPaddingR + differenceWidth;
                    $(this).css("padding-left", newPaddingL + "px").css("padding-right", newPaddingR + "px");
                });
                /* проверка остатка */
                itemsMenu.each(function () {
                    allItemsMenuWidthControl = allItemsMenuWidthControl + $(this).width();
                });
                curPaddingL = itemsMenuInnerLast.css("padding-left").replace("px", "");
                newPaddingL = parseInt(curPaddingL) + (menuWidth - allItemsMenuWidthControl);
                itemsMenuInnerLast.css("padding-left", newPaddingL + "px");
            }
            itemsMenu.css("visibility", "visible");
        };

        main_menu.activate_expand = function () {
            if (!m) { return; }
            m.find('.js-has_children').each(function () {
                expandable_window($(this));
            });
            expandable_window($('#js-region-wrapper'));
        };

        main_menu.update_padding();
        main_menu.activate_expand();

        return main_menu;
    };

    return obj;
}(jQuery, wgsdk.expandable_window));


jQuery(document).ready(function () {
    "use strict";
    wgsdk.mainMenu(".js-portal-menu");
});


}
/*
     FILE ARCHIVED ON 21:57:06 Oct 29, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:42 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 81.861
  exclusion.robots: 0.122
  exclusion.robots.policy: 0.111
  RedisCDXSource: 1.266
  esindex: 0.009
  LoadShardBlock: 54.625 (3)
  PetaboxLoader3.datanode: 66.811 (5)
  CDXLines.iter: 21.681 (3)
  load_resource: 97.661 (2)
  PetaboxLoader3.resolve: 61.803 (2)
*/