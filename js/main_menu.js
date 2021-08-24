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

(function($, amplify, ResolutionManager) {

'use strict';

var STATE_UNKNOWN = 0,
    STATE_HIDDEN = 1,
    STATE_SHOWN = 2,
    STATE_TOP = 3,
    DIRECTION_UNKNOWN = 0,
    DIRECTION_TOP = 1,
    DIRECTION_BOTTOM = 2,
    SUBMENU_STATE_HIDDEN = 0,
    SUBMENU_STATE_SHOWN = 1;

$(function() {
    var currentState = STATE_UNKNOWN,
        submenuState = SUBMENU_STATE_HIDDEN,
        $menuWrapper = $('.js-mainmenu-wrapper'),
        $commonMenuHolder = $('.js-commonmenu-holder'),
        $commonMenuLink = $('.js-mobile-commonmenu-link'),
        $htmlBodyNodes = $('html, body'),
        commonMenuOpenedClass = $commonMenuHolder.data('mobileOpenedClass'),
        mobileMenuOpenedClass = $menuWrapper.data('mobileMenuOpenedClass'),
        scrollBottomClass = $menuWrapper.data('scrollBottomClass'),
        scrollBottomInitialClass = $menuWrapper.data('scrollBottomInitialClass'),
        scrollTopClass = $menuWrapper.data('scrollTopClass'),
        scrollTopInitialClass = $menuWrapper.data('scrollTopInitialClass'),
        mobileCropClass = $htmlBodyNodes.data('mobileMenuCropClass'),
        oldScrollTop = $(window).scrollTop(),
        oldState = STATE_UNKNOWN,
        oldDirection = DIRECTION_UNKNOWN;

    function toggleMobileCropClass() {
        var isMenuOpened = $menuWrapper.hasClass(mobileMenuOpenedClass),
            isMobileResolution = (ResolutionManager.getCurrentState() !== ResolutionManager.RESOLUTION_DESKTOP);

        if (isMobileResolution && isMenuOpened) {
            $htmlBodyNodes.addClass(mobileCropClass);
        } else {
            $htmlBodyNodes.removeClass(mobileCropClass);
        }
    };

    amplify.subscribe('resolution:statechanged', function() {
        toggleMobileCropClass();
    });

    function closeCommonMenu() {
        $commonMenuHolder.removeClass(commonMenuOpenedClass);
        $commonMenuLink
            .addClass($commonMenuLink.data('mobileOpenClass'))
            .removeClass($commonMenuLink.data('mobileCloseClass'));

        toggleMobileCropClass();
    }

    $commonMenuLink.on('click', function(e) {
        e.preventDefault();

        if ($commonMenuHolder.hasClass(commonMenuOpenedClass)) {
            closeCommonMenu();
        } else {
            $commonMenuHolder.addClass(commonMenuOpenedClass);
            $(this)
                .removeClass($(this).data('mobileOpenClass'))
                .addClass($(this).data('mobileCloseClass'));
        }
    });

    $('.js-mobile-mainmenu-link').on('click', function(e) {
        e.preventDefault();

        closeCommonMenu();
        $menuWrapper.addClass(mobileMenuOpenedClass);

        toggleMobileCropClass();
    });

    $('.js-mobile-mainmenu-close-link, .js-mainmenu-wrapper').on('click', function(e) {
        if (e.target === e.currentTarget) {
            e.preventDefault();

            $menuWrapper.removeClass(mobileMenuOpenedClass);

            toggleMobileCropClass();
        }
    });

    function closeMainSubMenus($currentItem) {
        $('.js-mainmenu-item').each(function() {
            var $item = $(this);

            if ($currentItem === undefined || ($currentItem !== undefined && !$item.is($currentItem))) {
                $item.removeClass($item.data('openedClass'));
            }
        });
    }

    /* Submenus */
    $('.js-mainmenu-arrow').on('click.mainmenu', function(e) {
        var $menuItem = $(this).parents('.js-mainmenu-item');

        e.preventDefault();

        closeMainSubMenus($menuItem);
        $menuItem.toggleClass($menuItem.data('openedClass'));

        if ($menuItem.hasClass($menuItem.data('openedClass'))) {
            $('body').off('.mainsubmenuclick').on('click.mainmenu', function(e) {
                if ($(e.target).parents('.js-mainmenu-wrapper').length === 0) {
                    submenuState = SUBMENU_STATE_HIDDEN;
                    closeMainSubMenus();
                    $('body').off('.mainsubmenuclick');
                }
            });
            submenuState = SUBMENU_STATE_SHOWN;
        } else {
            $('body').off('.mainsubmenuclick');
            submenuState = SUBMENU_STATE_HIDDEN;
        }
    });

    $('.js-region-submenu-link').on('click.mainmenu', function(e) {
        var $menuItem = $(this).parents('.js-region-submenu-item');

        e.preventDefault();

        $('.js-region-submenu-item').each(function() {
            var $item = $(this);

            if (!$item.is($menuItem)) {
                $item.removeClass($item.data('openedClass'));
            }
        });

        $menuItem.toggleClass($menuItem.data('openedClass'));
    });

    $(window).on('scroll.mainmenu', function() {
        var scrollTop = $(window).scrollTop(),
            cmHeight = $commonMenuHolder.height(),
            totalHeight = cmHeight + $menuWrapper.height(),
            direction;

        /* If admin toolbar is present - do nothing */
        if (window.isDraftActualVersion !== undefined) {
            return;
        }

        if (scrollTop < oldScrollTop) {
            direction = DIRECTION_TOP;
        } else if (scrollTop > oldScrollTop || oldDirection === DIRECTION_UNKNOWN) {
            direction = DIRECTION_BOTTOM;
        }

        if (currentState !== STATE_TOP && scrollTop < cmHeight) {

            $menuWrapper
                .removeClass(scrollBottomClass)
                .removeClass(scrollBottomInitialClass)
                .removeClass(scrollTopClass)
                .removeClass(scrollTopInitialClass);

            oldState = currentState;
            currentState = STATE_TOP;

        } else if (currentState !== STATE_HIDDEN
                   && direction === DIRECTION_BOTTOM
                   && scrollTop > totalHeight
                   && submenuState !== SUBMENU_STATE_SHOWN) {

            $menuWrapper
                .addClass((oldState !== STATE_HIDDEN ? scrollBottomInitialClass : scrollBottomClass))
                .removeClass(scrollTopInitialClass)
                .removeClass(scrollTopClass);

            oldState = currentState;
            currentState = STATE_HIDDEN;
            amplify.publish('mainmenu:hidefixed');

        } else if (currentState !== STATE_SHOWN &&
                   (
                    (direction === DIRECTION_TOP && oldDirection === DIRECTION_TOP && scrollTop > totalHeight)
                    ||
                    (submenuState === SUBMENU_STATE_SHOWN && scrollTop >= cmHeight)
                   )
                  ) {

            $menuWrapper
                .addClass((submenuState === SUBMENU_STATE_SHOWN ? scrollTopInitialClass : scrollTopClass))
                .removeClass(scrollBottomInitialClass)
                .removeClass(scrollBottomClass);

            oldState = currentState;
            currentState = STATE_SHOWN;
            amplify.publish('mainmenu:showfixed');

        }

        oldScrollTop = scrollTop;
        oldDirection = direction;
    });

});

})(jQuery, amplify, ResolutionManager);


}
/*
     FILE ARCHIVED ON 06:48:36 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:22 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 89.686
  exclusion.robots: 0.153
  exclusion.robots.policy: 0.143
  RedisCDXSource: 2.147
  esindex: 0.01
  LoadShardBlock: 57.868 (3)
  PetaboxLoader3.datanode: 76.732 (5)
  CDXLines.iter: 25.884 (3)
  load_resource: 172.31 (2)
  PetaboxLoader3.resolve: 104.34 (2)
*/