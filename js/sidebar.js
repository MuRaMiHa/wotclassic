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

(function($, window, document, wot_hl, amplify, _, wgsdk, ComparisonManager, tooltipReset, IScroll, Modernizr, undefined) {

'use strict';

var SIDEBAR_BASE_HEIGHT = 157,
    ROW_HEIGHT = 21,
    ROW_PADDING_TOP = 9,
    ROW_PADDING_BOTTOM = 8,
    ROW_ADD_ME_HEIGHT = 38,
    NARROW_WINDOW_WIDTH = 720;

function ComparisonSidebar(settings) {

    this.settings = settings;
    this.$panel = $(this.settings.panelSelector);
    this.$playerSidebar = $('.' + this.settings.playerClass);
    this.$tankSidebar = $('.' + this.settings.tankClass);
    this.$playerHeader = this.$playerSidebar.find(this.settings.headerSelector);
    this.$tankHeader = this.$tankSidebar.find(this.settings.headerSelector);
    this.$playersCompareButton = this.$playerSidebar.find(this.settings.compareButtonSelector);
    this.$tanksCompareButton = this.$tankSidebar.find(this.settings.compareButtonSelector);
    this.panelOpenedClass = this.$panel.data('panelOpenedClass');
    this.compareOpenedClass = this.$panel.data('compareOpenedClass');
    this.htmlCropMobileClass = $('html').data('sidebarCropMobileClass');
    this.bodyCropMobileClass = $('body').data('sidebarCropMobileClass');
    this.isOldIE = ($.browser.msie && parseInt($.browser.version, 10) <= 8);

    this.isTanksSidebarEnabled = Boolean(this.$tankSidebar.length);
    
    this.authorizedUser = wgsdk.account_info().get_nickname();
    this.authorizedUserInComparison = '';
    
    this.isPlayerManuallyClosed = false;
    this.isTankManuallyClosed = false;
    this.isPlayerOpened = false;
    this.isTankOpened = false;
    this.isNarrowWindow = false;
    this.isScrollDestroyed = false;
    this.additionalNicknames = [];
    this.additionalTanks = [];

    this.scrollOptions = {
        mouseWheel: true,
        scrollbars: 'custom',
        resizeScrollbars: true,
        click: true,
        interactiveScrollbars: true
    };
    this.storageManager = new ComparisonManager();

    this.init();
}

ComparisonSidebar.prototype = {

    init: function() {
        var nicknames = _.without(_.uniq(this.storageManager.nicknames), ''),
            tanks = _.without(this.storageManager.tanks,'');

        this.checkWindowWidth();
        this.initScroll();
        
        if (this.isNarrowWindow) {
            this.toggleSidebarPosition();
        }
        
        _.each(nicknames, _.bind(function(nickname) {
            this.addPlayer(nickname, true);
        }, this));
        
        if (this.isTanksSidebarEnabled) {
            _.each(tanks, _.bind(function(tank) {
                this.addTank(tank, true);
            }, this));
            if (this.getTanksCount() !== 0) {
                this.closeSidebar(this.$tankSidebar, this.getTanksCount);
            }
        }

        this.bindDomHandlers();
        this.bindAmplifyHandlers();

        if (this.authorizedUser === '') {
            this.$playerSidebar.find('.js-authorized-player-block').hide();
        }

        if (this.getPlayersCount() !== 0) {
            this.closeSidebar(this.$playerSidebar, this.getPlayersCount);
        }
        
    },
    
    bindOverlayClosingClick: function() {
        $('.js-panel-overlay').on('click.sidebar', _.bind(function(e) {
            var currentSidebar, getCount;
            
            if ($(e.target).hasClass(this.panelOpenedClass)) {
                if (this.$playerSidebar.hasClass(this.compareOpenedClass)) {
                    currentSidebar = this.$playerSidebar;
                    getCount = this.getPlayersCount;
                } else {
                    currentSidebar = this.$tankSidebar;
                    getCount = this.getTanksCount;
                }
                this.closeSidebar(currentSidebar, getCount);
            };
            $('body').scrollTop(this.savedScrollTopPosition);
        }, this));
    },
    
    unbindOverlayClosingClick: function() {
        $(document).off('click.sidebar');
    },
    
    toRoman: function(num) {
        if (!+num) {
            return '';
        }
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                    "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                    "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;

        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        }
        return new Array(+digits.join("") + 1).join("M") + roman;
    },
    
    initScroll: function() {
        this.playerComparisonWrapper = new IScroll(this.settings.playerComparisonWrapper, this.scrollOptions);
        if (this.isTanksSidebarEnabled) {
            this.tankComparisonWrapper = new IScroll(this.settings.tankComparisonWrapper, this.scrollOptions);
        }
    },

    refreshScroll: function() {
        if (this.isScrollDestroyed) {
            this.initScroll();
            this.isScrollDestroyed = false;
        }
        this.playerComparisonWrapper.refresh();

        if (this.isTanksSidebarEnabled) {
            this.tankComparisonWrapper.refresh();
        }
    },

    checkWindowWidth: function() {
        this.isNarrowWindow = $(window).width() < NARROW_WINDOW_WIDTH;
    },

    getPlayersCount: function() {
        var cnt = this.additionalNicknames.length;
        if (this.authorizedUserInComparison !== '') {
            cnt++;
        }
        return cnt;
    },
    
    getTanksCount: function() {
        return this.additionalTanks.length;
    },
    
    _compareButtonCallback: function() {
        if ($(this).parent().hasClass('js-disabled')) {
            return false;
        }
        this.closeSidebar(this.$tankSidebar, this.getTanksCount);
    },
    
    bindDomHandlers: function() {
        _.bindAll(this, 'toggleSidebar', '_compareButtonCallback');
        this.$playerHeader.on('click', this.toggleSidebar);
        this.$playersCompareButton
            .on('click', this._compareButtonCallback)
            .on('click.ga', function() {
                wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_compareplayers'});
            });

        /* Delete all button */
        this.$playerSidebar.find('.js-sidebar-clear-button').on('click', _.bind(function() {
            wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_clear'});
            this.closeSidebar(this.$playerSidebar, this.getPlayersCount);
            setTimeout(_.bind(function() {
                _.each(this.additionalNicknames, function(nickname) {
                    amplify.publish('playerscomparison:player-removed', { nickname: nickname });
                });
                if (this.authorizedUserInComparison !== '') {
                    amplify.publish('playerscomparison:player-removed', { nickname: this.authorizedUserInComparison });
                }
            }, this), 300);
            return false;
        }, this));
        
        /* Add authorized user link */
        this.$playerSidebar.find('.js-add-me-link-container').on('click', _.bind(function(e) {
            e.preventDefault();

            if (this.getPlayersCount() < window.MAX_COMPARE_ACCOUNTS_NUMBER) {
                amplify.publish('playerscomparison:player-added', { nickname: this.authorizedUser });
            }
        }, this));

        if (this.isTanksSidebarEnabled) {
            this.$tankHeader.on('click', this.toggleSidebar);

            this.$tanksCompareButton
                .on('click', this._compareButtonCallback)
                .on('click.ga', function() {
                    wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_comparetanks'});
                });

            this.$tankSidebar.find('.js-sidebar-clear-button').on('click', _.bind(function() {
                wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_clear'});
                this.closeSidebar(this.$tankSidebar, this.getTanksCount);
                setTimeout(_.bind(function() {
                    _.each(this.additionalTanks, function(tank) {
                        amplify.publish('tankscomparison:tank-removed', { tank: tank });
                    });
                }, this), 300);
                return false;
            }, this));

        }

        
        $(window).on('resize.sidebar', _.bind(_.debounce(function() {
            this.checkWindowWidth();
            if (!this.isNarrowWindow) {
                this.refreshScroll();
            } else {
                this.toggleSidebarPosition();
            }
        }, 150), this));
    },

    toggleSidebarPosition: function () {
        if (this.isNarrowWindow) {
            if (!this.isScrollDestroyed) {
                this.playerComparisonWrapper.destroy();
                if (this.isTanksSidebarEnabled) {
                    this.tankComparisonWrapper.destroy();
                }
                this.isScrollDestroyed = true;
            }
            
            this.$playerSidebar
                .css({ 'left': '', 'top': '', 'margin': '0' })
                .css({ 'bottom': this.isPlayerOpened ? 0 : this.$playerHeader.height() - this.$playerSidebar.height() })
                .toggle(this.getPlayersCount() !== 0);

            if (this.isTanksSidebarEnabled) {
                this.$tankSidebar
                    .css({ 'left': '', 'top': '', 'margin': '0' })
                    .css({ 'bottom': this.isTankOpened ? 0 : this.$tankHeader.height() - this.$tankSidebar.height() })
                    .toggle(this.getTanksCount() !== 0);

                if (!this.$tankSidebar.hasClass(this.compareOpenedClass)) {
                    this.$panel.removeClass(this.panelOpenedClass);
                    $('html').removeClass(this.htmlCropMobileClass);
                    $('body').removeClass(this.bodyCropMobileClass);
                }
            }
            
        } else {
            this.$playerSidebar.css('bottom', '');

            if (this.isTanksSidebarEnabled) {
                this.$tankSidebar.css('bottom', '');
            }
        }
    },
    
    toggleSidebar: function(e) {
        var $currentSidebar = $(e.currentTarget).parents(this.settings.selector),
            isPlayersSidebar = $currentSidebar.hasClass(this.settings.playerClass),
            isOpened = isPlayersSidebar ? this.isPlayerOpened : this.isTankOpened,
            getCount = isPlayersSidebar ? this.getPlayersCount : this.getTanksCount,
            getSiblingsCount = isPlayersSidebar ? this.getTanksCount : this.getPlayersCount,
            isOtherOpened = $currentSidebar.siblings().hasClass(this.compareOpenedClass);

        wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_' + (isPlayersSidebar ? 'players' : 'tanks')});

        if (isOtherOpened) {
            if (isPlayersSidebar) {
                this.isPlayerManuallyClosed = false;
            } else {
                this.isTankManuallyClosed = false; 
            }
            this.closeSidebar($currentSidebar.siblings(), getSiblingsCount);
            this.openSidebar($currentSidebar, false);
            
            $('html').addClass(this.htmlCropMobileClass);
            $('body').addClass(this.bodyCropMobileClass);
            this.$panel.addClass(this.panelOpenedClass);
        } else {
            if (!isOpened) {
                if (isPlayersSidebar) {
                    this.isPlayerManuallyClosed = false;
                } else {
                    this.isTankManuallyClosed = false; 
                }
                this.openSidebar($currentSidebar, isOpened);
                
                $('html').addClass(this.htmlCropMobileClass);
                $('body').addClass(this.bodyCropMobileClass);
                this.$panel.addClass(this.panelOpenedClass);
            } else {
                if (isPlayersSidebar) {
                    this.isPlayerManuallyClosed = true;
                } else {
                    this.isTankManuallyClosed = true; 
                }
                this.closeSidebar($currentSidebar, getCount);
                this.$panel.removeClass(this.panelOpenedClass);

                $('html').removeClass(this.htmlCropMobileClass);
                $('body').removeClass(this.bodyCropMobileClass);
            }
        }
        
        if (!this.isNarrowWindow) {
            this.refreshScroll();
        }
    },

    openSidebar: function($currentSidebar, isOpened) {
        if (!isOpened) {
            $currentSidebar
                .stop(true)
                .show()
                .addClass(this.compareOpenedClass);
        }
        
        if ($currentSidebar.hasClass(this.settings.playerClass)) {
            this.isPlayerOpened = true;
        } else {
            this.isTankOpened = true;
        }
        if (this.isNarrowWindow) {
            this.savedScrollTopPosition = $('body').scrollTop();
            this.bindOverlayClosingClick();
        }
    },

    closeSidebar: function($currentSidebar, getCount) {
        $currentSidebar
            .stop(true)
            .removeClass(this.compareOpenedClass)
            .toggle(getCount.call(this) !== 0);
            
        if (this.isNarrowWindow) {
            if (getCount.call(this) !== 0) {
                $currentSidebar.toggle(true);
            } else {
                $currentSidebar.toggle(false);
            }
            this.$panel.removeClass(this.panelOpenedClass);
            $('body').removeClass(this.bodyCropMobileClass);
            $('html').removeClass(this.htmlCropMobileClass);
            $('body').scrollTop(this.savedScrollTopPosition);
            this.unbindOverlayClosingClick();
        }

        if ($currentSidebar.hasClass(this.settings.playerClass)) {
            this.isPlayerOpened = false;
        } else {
            this.isTankOpened = false;
        }
    },
    
    updatePlayerState: function(isImmidiate) {
        var nicknames = _.clone(this.additionalNicknames, true),
            sideBarHeight = SIDEBAR_BASE_HEIGHT,
            $playerSidebarMessage = this.$playerSidebar.find('.js-compare-message'),
            $addMeLink, $addMePlus, $addMeItem, disallowAdd;
    
        if (this.authorizedUserInComparison !== '') {
            nicknames.unshift(this.authorizedUserInComparison);
        }

        if (this.authorizedUser !== '') {
            sideBarHeight += ROW_ADD_ME_HEIGHT;
            disallowAdd = (this.getPlayersCount() >= window.MAX_COMPARE_ACCOUNTS_NUMBER);

            $addMeLink = this.$playerSidebar.find('.js-add-me-link');
            $addMePlus = this.$playerSidebar.find('.js-add-me-plus');
            $addMeItem = this.$playerSidebar.find('.js-authorized-player-block');
        }

        sideBarHeight += (this.additionalNicknames.length * (ROW_HEIGHT + ROW_PADDING_TOP + ROW_PADDING_BOTTOM));
        
        if (this.isNarrowWindow && !this.isPlayerOpened) {
            this.$playerSidebar.css({ 'bottom': this.$playerHeader.height() - this.$playerSidebar.height() });
        }

        this.$playerSidebar.find('.js-players-count').text(nicknames.length);
        this.$playersCompareButton
            .toggleClass('js-tooltip', (nicknames.length < 2))
            .prop('href', this.$playersCompareButton.data('url') + '#cmp_n=' + nicknames.join('-'))
            .parent()
                .toggle(nicknames.length > 1);

        $playerSidebarMessage.toggle(nicknames.length < 2);
        if (!this.isNarrowWindow) {
            this.playerComparisonWrapper.refresh();
        }
        
    },
    
    updateTankState: function(isImmidiate) {
        var tanks = _.clone(this.additionalTanks, true),
            sideBarHeight = SIDEBAR_BASE_HEIGHT,
            $tankSidebarMessage = this.$tankSidebar.find('.js-compare-message');

        sideBarHeight += (this.additionalTanks.length * (ROW_HEIGHT + ROW_PADDING_TOP + ROW_PADDING_BOTTOM));

        if (this.isNarrowWindow && !this.isTankOpened) {
            this.$tankSidebar.css({ 'bottom': this.$tankHeader.height() - this.$tankSidebar.height() });
        }

        this.$tankSidebar.find('.js-tanks-count').text(tanks.length);
        this.$tanksCompareButton
            .toggleClass('js-tooltip', (tanks.length < 2))
            .prop('href', this.$tanksCompareButton.data('url') + '#wot&w_m=cmp&w_vc=' + this.prepareTankCompareURL(tanks))
            .parent()
                .toggle(tanks.length > 1);
                
        $tankSidebarMessage.toggle(tanks.length < 2);
        if (!this.isNarrowWindow) {
            this.tankComparisonWrapper.refresh();
        }
    },
    
    prepareTankCompareURL: function(tanks) {
        return _.map(tanks, function(item) {
                var config = (item.isStock ? '' : item.config);

                return item.cd + '(' + config + ')';
            }).sort();
    },

    addPlayer: function(nickname, isInitialAdd) {
        var $template, $nickname, $tooltip, 
            addPlayerSpeed = 150;

        isInitialAdd = (isInitialAdd ? true : false);
            
        if (nickname === this.authorizedUser && this.authorizedUserInComparison === '') {
            /* Add authorized user */
            $template = this.$playerSidebar.find('.js-player-template').clone().removeClass('js-player-template');
            $nickname = $template.find('.js-nickname');
            $tooltip = $template.find('.js-nickname-tooltip');

            $nickname
                .text(nickname)
                .prop('href',  window.ACCOUNT_BY_NAME_URL.replace('-FAKE-ACCOUNT-', encodeURIComponent(nickname)))
                .prop('id', 'js-sidebar-nick-me-tooltip');

            $tooltip
                .text(nickname)
                .prop('id', 'js-sidebar-nick-me-tooltip_tooltip');
                     
            $template.find('.js-sidebar-remove-player').on('click', function() {
                wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_remove'});
                amplify.publish('playerscomparison:player-removed', { nickname: nickname });
                tooltipReset();
                return false;
            });

            this.$playerSidebar.find('.js-authorized-user-container').hide().html('').append($template.children()).stop(true, true).fadeIn(100);
            this.$playerSidebar.find('.js-add-me-link-container').stop(true, true).fadeOut(100);
            this.authorizedUserInComparison = nickname;
        } else if (!_.contains(this.additionalNicknames, nickname)) {
            /* Add any other user */

            this.additionalNicknames.push(nickname);

            $template = this.$playerSidebar.find('.js-player-template').clone().removeClass('js-player-template');
            $nickname = $template.find('.js-nickname');
            $tooltip = $template.find('.js-nickname-tooltip');

            $nickname
                .text(nickname)
                .prop('href', window.ACCOUNT_BY_NAME_URL.replace('-FAKE-ACCOUNT-', encodeURIComponent(nickname)))
                .prop('id', 'js-sidebar-nick-tooltip-' + nickname);

            $tooltip
                .text(nickname)
                .prop('id', 'js-sidebar-nick-tooltip-' + nickname + '_tooltip');
 
            $template.find('.js-sidebar-remove-player').on('click', function() {
                wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_remove'});
                amplify.publish('playerscomparison:player-removed', { nickname: nickname });
                tooltipReset();
                return false;
            });

            if (this.isNarrowWindow && !this.isOpened) {
                addPlayerSpeed = 0;
            }

            $template
                .appendTo(this.$playerSidebar.find('.js-players-list'))
                .css({
                    'height': 0, 
                    'opacity': 0, 
                    'padding-top': 0, 
                    'padding-bottom': 0
                })
                .show()
                .animate({
                        'height': ROW_HEIGHT, 
                        'opacity': 1, 
                        'padding-top': ROW_PADDING_TOP, 
                        'padding-bottom': ROW_PADDING_BOTTOM
                    }, 
                    addPlayerSpeed, 
                    'linear', 
                    _.bind(function() {
                        this.refreshScroll();
                    }, this)
                );
            
        }

        if (!this.isPlayerOpened && isInitialAdd) {
            this.updatePlayerState(true);
        } 

        if (!isInitialAdd) {
            this.updatePlayerState(!this.isPlayerOpened);
        }
        
        if (this.isTankOpened) {
            this.closeSidebar(this.$tankSidebar, this.getTanksCount);
        }
        
        if (!this.isPlayerManuallyClosed && !isInitialAdd) {
            if (!this.isPlayerOpened) {
                this.openSidebar(this.$playerSidebar);
                $('html').addClass(this.htmlCropMobileClass);
                $('body').addClass(this.bodyCropMobileClass);
                this.$panel.addClass(this.panelOpenedClass);
            } else {
                this.$playerSidebar.show();
            }
        }

        if (this.isPlayerManuallyClosed && !isInitialAdd) {
            this.$playerSidebar.show();
        }
    },
    
    removePlayer: function(nickname) {
        var $player, removePlayerSpeed = 150;

        if (nickname === this.authorizedUserInComparison) {
            /* Add authorized user */
            this.$playerSidebar.find('.js-authorized-user-container').stop(true, true).fadeOut(100);
            this.$playerSidebar.find('.js-add-me-link-container').stop(true, true).fadeIn(100);
            this.authorizedUserInComparison = '';
        } else if (_.contains(this.additionalNicknames, nickname)) {
            /* Add any other user */
            $player = this.$playerSidebar.find('.js-nickname').filter(function () { return $.text([this]) === nickname; }).parent('.js-player');

            if (this.isNarrowWindow && !this.isOpened) {
                removePlayerSpeed = 0;
            }

            $player.animate({ 'opacity': 0, 'height': 0, 'padding-top': 0, 'padding-bottom': 0 }, removePlayerSpeed, 'linear', _.bind(function() {
                $player.remove();
                this.refreshScroll();
            }, this));

            this.additionalNicknames = _.without(this.additionalNicknames, nickname);
        }
        if (this.getPlayersCount() === 0) {
            this.closeSidebar(this.$playerSidebar, this.getPlayersCount);
        }
        this.updatePlayerState();
    },

    bindAmplifyHandlers: function() {

        amplify.subscribe('playerscomparison:player-added', _.bind(function(data) {
            this.addPlayer(data.nickname);
        }, this));

        amplify.subscribe('playerscomparison:player-removed', _.bind(function(data) {
            this.removePlayer(data.nickname);
        }, this));
        
        if (this.isTanksSidebarEnabled) {
            amplify.subscribe('tankscomparison:tank-added', _.bind(function(data) {
                this.addTank(data.tank);
            }, this));

            amplify.subscribe('tankscomparison:tank-removed', _.bind(function(data) {
                this.removeTank(data.tank);
            }, this));
        }
        
    },
    
    addTank: function(tank, isInitialAdd) {
        var addTankSpeed = 150,
            configSelector, $template, $tank, $tooltip, tankShapeURL, 
            tankShapeURLExtension, tankDefaultShapeURLExtension, tankNationPrefix, 
            tankTypePrefix, tankTypePrefixPremiumPostfix, tankLinkPremiumClass,
            tankLevelPremiumClass;

        isInitialAdd = (isInitialAdd ? true : false);
        
        this.additionalTanks.push(tank);

        $template = this.$tankSidebar.find('.js-tank-template').clone().removeClass('js-tank-template');
        $template.prop('id', tank.cd + '-' + tank.config);
        configSelector = ((tank.isStock || !tank.config) ? '.js-stock-config' : '.js-custom-config');
        tankNationPrefix = $template.find('.js-tank-flag').data('nationClass');
        tankTypePrefix = $template.find('.js-tank-type').data('typeIconClass');
        tankTypePrefixPremiumPostfix = $template.find('.js-tank-type').data('typeIconClassPremiumPostfix');
        tankLinkPremiumClass = $template.find('.js-tankname').data('premiumClass');
        tankLevelPremiumClass = $template.find('.js-tank-level').data('premiumClass');
        
        $tank = $template.find('.js-tank');
        $tooltip = $template.find('.js-tank-tooltip');

        tankShapeURLExtension = (Modernizr.svgasimg ? 'svg': 'png');
        tankDefaultShapeURLExtension = (Modernizr.svgasimg ? 'resized': 'old_browser_resized');
        
        if (!tank.icon) {
            tankShapeURL = WG.vars.TANKOPEDIA_IMAGES_URL + '-FAKE-TANK-/-FAKE-TANK-_icon_resized.'.replace(/-FAKE-TANK-/g, encodeURIComponent(tank.tech_name.toLowerCase()))  + tankShapeURLExtension;
        } else {
            tankShapeURL = WG.vars.TANKOPEDIA_DEFAULT_IMAGES_URLS.icons[tank.type][tankDefaultShapeURLExtension];
        }

        $tank
            .find('.js-tank-shape')
                .prop({
                    'src': tankShapeURL,
                    'alt': tank.name
                });

        $tank
            .find('.js-tankname')
                .text(tank.name)
                .toggleClass(tankLinkPremiumClass, Boolean(tank.premium))
                .prop('href', window.TANK_BY_NAME_URL.replace('-FAKE-TANK-', encodeURIComponent(tank.tech_name)))
                .prop('id', 'js-sidebar-tank-tooltip-' + tank.cd + '-' + tank.config);

        $tank
            .find(configSelector)
                .show();

        $tank
            .find('.js-tank-flag')
                .addClass(tankNationPrefix + tank.nation)
                .text(tank.nation);
                
        $tank
            .find('.js-tank-type')
                .addClass(tankTypePrefix + tank.type.toLowerCase() + (tank.premium ? tankTypePrefixPremiumPostfix : ''))
                .text(tank.type);
                
        $tank
            .find('.js-tank-level')
                .toggleClass(tankLevelPremiumClass, Boolean(tank.premium))
                .text(this.toRoman(tank.level));

        $tooltip
            .addClass('js-tooltip-only-overflow')
            .text(tank.name)
            .prop('id', 'js-sidebar-tank-tooltip-' + tank.cd + '-' + tank.config + '_tooltip');

        $template.find('.js-sidebar-remove-tank').on('click', function(e) {
            wgsdk.ga({eventCategory: 'comparison_pool', eventAction: 'click', eventLabel: 'pool_remove'});
            amplify.publish('tankscomparison:tank-removed', { tank: tank });
            tooltipReset();
            e.preventDefault();
        });

        if (this.isNarrowWindow && !this.isOpened) {
            addTankSpeed = 0;
        }

        $template
            .appendTo(this.$tankSidebar.find('.js-tanks-list'))
            .css({
                'height': 0, 
                'opacity': 0, 
                'padding-top': 0, 
                'padding-bottom': 0
            })
            .show()
            .animate({
                    'height': ROW_HEIGHT, 
                    'opacity': 1, 
                    'padding-top': ROW_PADDING_TOP, 
                    'padding-bottom': ROW_PADDING_BOTTOM
                }, 
                addTankSpeed, 
                'linear', 
                _.bind(function() {
                    this.refreshScroll();
                }, this)
            );

        if (!this.isTankOpened && isInitialAdd) {
            this.updateTankState(true);
        }

        if (!isInitialAdd) {
            this.updateTankState(!this.isTankOpened);
        }
        
        if (this.isPlayerOpened) {
            this.closeSidebar(this.$playerSidebar, this.getPlayersCount);
        }
        
        if (!this.isTankManuallyClosed && !isInitialAdd) {
            if (!this.isTankOpened) {
                this.openSidebar(this.$tankSidebar);
                $('html').addClass(this.htmlCropMobileClass);
                $('body').addClass(this.bodyCropMobileClass);
                this.$panel.addClass(this.panelOpenedClass);
            } else {
                this.$tankSidebar.show();
            }
        }

        if (this.isTankManuallyClosed && !isInitialAdd) {
            this.$tankSidebar.show();
        }
    },
    
    removeTank: function(tank) {
        var $tank, removeTankSpeed = 150;

        $tank = this.$tankSidebar.find('.js-tank-wrapper').filter(function (item, value) { 
            return (value.id === tank.cd + '-' + tank.config); 
        });

        if (this.isNarrowWindow && !this.isOpened) {
            removeTankSpeed = 0;
        }

        $tank.animate({ 'opacity': 0, 'height': 0, 'padding-top': 0, 'padding-bottom': 0 }, removeTankSpeed, 'linear', _.bind(function() {
            $tank.remove();
            this.refreshScroll();
        }, this));

        this.additionalTanks = _.reject(this.additionalTanks, function(item) {
            return (item.cd + '-' + item.config === tank.cd + '-' + tank.config);
        });
        
        if (this.getTanksCount() === 0) {
            this.closeSidebar(this.$tankSidebar, this.getTanksCount);
        }
        this.updateTankState();
    }
};


function initPlayerComparisonSidebar(settings) {

    var defaultSettings = {
            'panelSelector': '.js-panel-overlay',
            'selector': '.js-comparison-sidebar',
            'playerClass': 'js-player-comparison-sidebar',
            'tankClass': 'js-tank-comparison-sidebar',
            'compareButtonSelector': '.js-sidebar-compare-button',
            'headerSelector': '.js-comparison-header',
            'playerComparisonWrapper': '.js-player-compare-list',
            'tankComparisonWrapper': '.js-tank-compare-list'
        },
        sidebar;

    settings = $.extend({}, defaultSettings, settings);
    
    sidebar = new ComparisonSidebar(settings);
}

window.initPlayerComparisonSidebar = initPlayerComparisonSidebar;
    
})(jQuery, window, document, wot_hl, amplify, _, wgsdk, ComparisonManager, tooltipReset, IScroll, Modernizr);


}
/*
     FILE ARCHIVED ON 06:49:04 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:25 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1179.845
  exclusion.robots: 0.095
  exclusion.robots.policy: 0.087
  RedisCDXSource: 8.693
  esindex: 0.01
  LoadShardBlock: 1142.916 (3)
  PetaboxLoader3.datanode: 120.428 (5)
  CDXLines.iter: 20.441 (3)
  load_resource: 242.989 (2)
  PetaboxLoader3.resolve: 184.427 (2)
*/