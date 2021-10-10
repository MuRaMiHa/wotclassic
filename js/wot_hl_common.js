var wot_hl = {

    ///////////////////////////////////////////////////////
    // storage for all page specific variables
    ///////////////////////////////////////////////////////

    InitCarousel: function(selector) {
        var IMG_FADE_IN_DELAY = 400,
            IMG_FADE_OUT_DELAY = 1500,
            TXT_FADE_IN_DELAY = 200,
            TXT_FADE_OUT_DELAY = 1000,
            TXT_SLIDE_UP_SPEED = 400,
            TXT_SLIDE_UP_DELAY = 200,
            TXT_SLIDE_DOWN_SPEED = 200,
            container = $(selector),
            elements = container.find('.js-carousel-element'),
            pageLinks = container.find('.js-carousel-link'),
            texts = container.find('.js-carousel-text'),
            leftLink = container.find('.js-left-slide'),
            rightLink = container.find('.js-right-slide'),
            currentElementNumber = 0,
            slideTimer;

        $.easing.customWgEasing = function(x, t, b, c, d) {
            return (t === d) ? (b + c) : (c * (-Math.pow(2, -10 * t/d) + 1) + b);
        };

        function ChangeElement(newElementId) {

            pageLinks.eq(currentElementNumber).removeClass('active js-disabled');

            elements.stop(true, true);
            texts.stop(true, true);

            elements.eq(currentElementNumber).fadeOut(IMG_FADE_IN_DELAY);

            texts.eq(currentElementNumber)
                .fadeOut(TXT_FADE_IN_DELAY, function() {
                    texts.eq(newElementId)
                        .fadeIn(TXT_FADE_OUT_DELAY, function() {
                            texts.eq(newElementId).css('opacity', 1);
                        });
                });

            elements.eq(newElementId).fadeIn(IMG_FADE_OUT_DELAY);
            pageLinks.eq(newElementId).addClass('active js-disabled');

            currentElementNumber = newElementId;
        }

        function StepTo(elementId) {
            if (elementId == currentElementNumber) return;

            ChangeElement(elementId);
        }

        function Prev() {
            ChangeElement( ((currentElementNumber - 1) % elements.length) );
        }

        function Next() {
            ChangeElement( ((currentElementNumber + 1) % elements.length) );
        }

        texts.each(function(i, element) {
            var $el = $(element),
                $desc = $el.find('.js-carousel-description'),
                bottomPadding = parseInt($el.css('padding-bottom'), 10),
                bottom = -parseInt($desc.height() + bottomPadding, 10);

            $el.css('bottom', bottom + 'px');

            if (-bottom !== bottomPadding) {
                $el
                    .on('mouseenter', function() {
                        clearTimeout(slideTimer);
                        slideTimer = setTimeout(function() {
                            $el.stop().animate({'bottom': 0}, TXT_SLIDE_UP_SPEED, 'customWgEasing');
                        }, TXT_SLIDE_UP_DELAY);
                    })
                    .on('mouseleave', function() {
                        clearTimeout(slideTimer);
                        $el.stop().animate({'bottom': bottom}, TXT_SLIDE_DOWN_SPEED);
                    });
            }
        });

        // hide non active elements
        elements.filter(':not(:first)').hide();

        rightLink.on('click', function(e) {
            e.preventDefault();
            Next();
            return false;
        });

        leftLink.on('click', function(e) {
            Prev();
            return false;
        });

        pageLinks.each(function(i, v) {
            var number = i,
                $el = $(v);

            $el.click(function(e) {
                e.preventDefault();
                if (!$el.hasClass('js-disabled')) {
                    StepTo(number);
                }
            });
        });
    },

    ///////////////////////////////////////////////////////
    // CMS 2.0 tree navigation sidebar
    ///////////////////////////////////////////////////////

    CMS2TreeNavigationSidebar: function() {
        $('.js-tree-category-collapsable').click(function(){
            var cat = $(this).parent('div').parent('li');
            if (cat.hasClass('open')){
                cat.removeClass('open');
                cat.children('ul').hide();
            }else{
                cat.addClass('open');
                cat.children('ul').show();
            }
            return false;
        });
        $('.js-highlight-on-hover').hover(
            function(event){$(this).addClass('hover');},
            function(event){$(this).removeClass('hover');}
        );
    },

    ///////////////////////////////////////////////////////
    // storage for all page specific variables
    ///////////////////////////////////////////////////////

    data: {},

    ///////////////////////////////////////////////////////
    // location.hash - ajax deeplinking support
    //
    // usage exemple:
    //
    // wot_hl.hash.init(function(event, hashManager) {
    //     var x = hashManager.getHashValuesFor("xxx");
    //     var newX = { "aaa": x['xxx'],
    //              "z": "k",
    //              "p":  true};
    //     hashManager.setHashValuesFor("xxx", newX, true);
    // })
    //
    // $(window).on("hashchange", function (event) {
    //     wot_hl.hash.handleEvent(event)
    // });
    ///////////////////////////////////////////////////////

    hash: {
        _salt: 'wot',
        _hashValues: {},
        _insideModification : 0,
        _callback  : undefined,
        _lastHash : "",

        _getHash: function () {
            /* use location.href instead of location.hash (FF automatically unescapes location.hash) */
            var hashSrc = location.href,
                idx = hashSrc.indexOf('#'),
                result = {},
                args, i;

            hashSrc = (idx !== -1) ? hashSrc.substring(idx + 1) : '';
            args = hashSrc.split('&');

            for (i = 0; i < args.length; ++i) {
                var arg = args[i];
                var matches = arg.match(/^([\w\d_\-]+)=(.*)/);
                if (matches) {
                    try {
                        result[matches[1]] = decodeURIComponent(matches[2]);
                    } catch (e) {
                        /* Trying to fix not escaped "%" (for example "%C3%A6%%25333") */
                        try {
                            result[matches[1]] = decodeURIComponent(matches[2].replace(/%([^0-9a-f].)/ig, '%25$1'));
                        } catch (e) {
                            result[matches[1]] = matches[2];
                        }
                    }
                }
                else {
                    matches = arg.match(/^([\w\d_-]+)$/);
                    if (matches) {
                        result[matches[1]] = true;
                    }
                }
            }
            if (this._salt in result) {
                delete result[this._salt];
            }
            return result;
        },

        updateFromHash: function () {
            this._hashValues = this._getHash();
        },

        formHash:  function () {

            //check if hash was shanged
            var changed = false;
            var oldHash = this._getHash();

            for (var oldKey in oldHash) {
                if (!(oldKey in this._hashValues) ||
                    oldHash[oldKey] != this._hashValues[oldKey]) {
                    changed = true;
                    break;
                }
            }

            for (var key in this._hashValues) {
                if (!(key in oldHash)) {
                    changed = true;
                    break;
                }
            }

            if (!changed) {
                return;
            }

            var newHash = this._salt+'&';
            for (key in this._hashValues) {
                if (this._hashValues[key] === true) {
                    newHash += key + "&";
                }
                else {
                    // TODO: support multiply values
                    newHash += key + "=" + encodeURIComponent(this._hashValues[key]) + "&";
                }
            }

            if (newHash[newHash.length - 1] == '&') {
                newHash = newHash.substring(0, newHash.length - 1);
            }

            if (location.hash != newHash) {
                this._insideModification += 1;
                this._lastHash = newHash;
                location.hash = newHash;
            }

            setTimeout( function (arg) {
                var hash = arg;

                return function (){
                    hash._insideModification -= 1;
                };
            }(this), 250); //additional restriction for processing events
        },

        getHash: function(prefix) {
            return $.extend({}, this._hashValues);
        },

        getHashValuesFor: function(prefix) {
            var result = {};

            for (var key in this._hashValues)    {
                var matches = key.match(new RegExp("^"+prefix+"_(.+)"), "");
                if (matches) {
                    //do not process limit param
                    if (matches[1] !== 'limit') {
                        result[matches[1]] = this._hashValues[key];
                    }
                }
            }
            return result;
        },

        setHashValuesFor: function(prefix, values, replace, defaults) {
            var toRemove = [], key, i;

            if (replace) {
                for (key in this._hashValues) {
                    if (key.match(new RegExp("^"+prefix+"_(.+)"))) {
                        toRemove.push(key);
                    }
                }
                for (i = 0; i < toRemove.length; ++i) {
                    delete this._hashValues[toRemove[i]];
                }
            }

            for (key in values) {
                // TODO: support multiply values
                if (defaults[key] != values[key]) {
                    this._hashValues[prefix + '_' + key] = values[key];
                }
            }
        },

        init: function(settings) {
            // setting of salt in hash string
            if (settings && settings.salt){
                this._salt = settings.salt;
            }
            this.updateFromHash();
        },

        registerCallback: function(hashChangeEventCallback) {
            this._callback = hashChangeEventCallback;
        },

        handleEvent: function(event) {

            if (this._insideModification != 0 ||
                this._lastHash == location.hash) {
                return;
            }

            this.updateFromHash();

            this._callback(event, this);

            this.formHash();
        },

        IsNotDefined: function(prefix) {
            for (var key in this._hashValues) {
                if (key.match(new RegExp("^"+prefix+"_(.+)")))
                    return false;
            }

            return true;
        }
    },

    //////////////////////////////////////////////////////////////////////
    // paginator
    //////////////////////////////////////////////////////////////////////

    paginator: function(id, currentPage, pageCount, callback, params) {

        if (!params) {
            params = {};
        }

        this.Init = function() {
            var KB_LEFT = 37,
                KB_RIGHT = 39,
                instance = this;

            $(document).keydown(function(e) {
                var disableHotkeys = false;
                if (e.ctrlKey && (e.which == KB_LEFT || e.which == KB_RIGHT)) {

                    $(':input').not(':button').not(':checkbox').each(
                        function(i, el) {
                            if (el === document.activeElement){
                                disableHotkeys = true;
                            }
                        }
                    );

                    if (params.disableHotkeys || disableHotkeys)
                         return;

                    e.preventDefault();
                }
            });

            $(document).keyup(function(e) {
                if (!e.ctrlKey) {
                    return;
                }

                var disableHotkeys = false;

                $(':input').not(':button').not(':checkbox').each(
                    function(i, el) {
                        if (el === document.activeElement){
                            disableHotkeys = true;
                        }
                    }
                );

                if (params.disableHotkeys || disableHotkeys)
                     return;

                switch(e.which) {
                    case KB_LEFT:
                        $('#'+instance.id+' .js-prev').click();
                        e.preventDefault();
                        break;
                    case KB_RIGHT:
                        $('#'+instance.id+' .js-next').click();
                        e.preventDefault();
                        break;
                }
            });
        };

        this.Bind = function(callback) {

            this.callback = callback;

            var paginator = $('#' + this.id);

            var currentPage = this.currentPage;
            var pageCount = this.pageCount;

            var pages = $('.js-page:not(.js-disabled)', paginator);
            var curPageIndex = pages.index($('.js-current', paginator));

            $('.js-disabled', paginator).off('click').click(function(e) {
                e.preventDefault();
            });

            $('.js-home:not(.js-disabled), .js-first:not(.js-disabled)', paginator).off('click').click( function(e) {
                e.preventDefault();
                callback(0);
            });
            $('.js-next, .js-prev', paginator).off('click').click(function(e) {
                e.preventDefault();
            });
            if (pageCount > 0) {
                $('.js-end:not(.js-disabled)', paginator).off('click').click(function(e) {
                    e.preventDefault();
                    var pageNumber = pageCount - 1;
                    callback(pageNumber);
                });
            }
            if (currentPage >= 0) {
                $('.js-next:not(.js-disabled)', paginator).click(function(e) {
                    e.preventDefault();
                    var pageNumber = currentPage + 1;
                    callback(pageNumber);
                });
                $('.js-prev:not(.js-disabled)', paginator).click(function(e) {
                    e.preventDefault();
                    var pageNumber = currentPage - 1;
                    callback(pageNumber);
                });

                var pageLink = currentPage - curPageIndex;
                pages.each(function(index, page) {
                    var pageNumber = pageLink;
                    $(page).off('click').click(function(e) {
                        e.preventDefault();
                        callback(pageNumber);
                    });
                    ++pageLink;
                });
            }
        };

        this.Update = function(currentPage, pageCount) {

            this.currentPage = currentPage;
            this.pageCount = pageCount;

            var paginator = $('#' + this.id);

            paginator.toggleClass('js-hidden', pageCount <= 1);

            var pages = $('.js-page', paginator);
            var pagesLen = pages.length;

            var middlePage = Math.floor(pagesLen / 2); //doesn't do +1, since enumerate pages from 0

            $('.js-next, .js-prev', paginator).off('click');

            if (this.currentPage < 0 || this.pageCount <= 1) {
                $('.js-ellipsis-l', paginator).addClass('js-disabled disabled');
                $('.js-ellipsis-r', paginator).addClass('js-disabled disabled');
                $('.js-page', paginator).addClass('js-disabled disabled').removeClass('js-current current');
                $('.js-home, .js-first', paginator).addClass('js-disabled disabled');
                $('.js-end', paginator).addClass('js-disabled disabled');
                $('.js-next', paginator).addClass('js-disabled disabled');
                $('.js-prev', paginator).addClass('js-disabled disabled');
            }
            else {
                $('.js-ellipsis-l', paginator).removeClass('js-disabled disabled');
                $('.js-ellipsis-r', paginator).removeClass('js-disabled disabled');
                $('.js-page', paginator).removeClass('js-disabled disabled js-current current');
                $('.js-home, .js-first', paginator).removeClass('js-disabled disabled');
                $('.js-end', paginator).removeClass('js-disabled disabled');
                $('.js-next', paginator).removeClass('js-disabled disabled');
                $('.js-prev', paginator).removeClass('js-disabled disabled');

                var enumerationEnd = pagesLen;
                var enumerationDelta = 0;

                if (currentPage === 0) {
                    $('.js-home, .js-first', paginator).addClass('js-disabled disabled');
                    $('.js-prev', paginator).addClass('js-disabled disabled');
                }

                if (currentPage === pageCount - 1) {
                    $('.js-end', paginator).addClass('js-disabled disabled');
                    $('.js-next', paginator).addClass('js-disabled disabled');
                }

                if (pageCount <= pagesLen) {
                    $('.js-ellipsis-l', paginator).addClass('js-disabled disabled');
                    $('.js-ellipsis-r', paginator).addClass('js-disabled disabled');

                    enumerationEnd = pageCount;

                    for (var i = pageCount; i < pagesLen; ++i) {
                        pages.eq(i).addClass('js-disabled disabled');
                    }

                    pages.eq(currentPage).addClass('js-current current');
                }
                else {
                    if (currentPage <= middlePage) {
                        $('.js-ellipsis-l', paginator).addClass('js-disabled disabled');

                        pages.eq(currentPage).addClass('js-current current');
                    }
                    else {
                        if (pageCount - currentPage <= middlePage) {
                            $('.js-ellipsis-r', paginator).addClass('js-disabled disabled');
                            enumerationDelta = pageCount - pagesLen;
                            pages.eq(currentPage - enumerationDelta).addClass('js-current current');
                        }
                        else {

                            enumerationDelta = currentPage - middlePage;
                            pages.eq(middlePage).addClass('js-current current');
                        }
                    }
                }

                $('.js-home', paginator).text(1);
                $('.js-end', paginator).text(pageCount);

                for (var i = 0; i < enumerationEnd; ++i) {
                    var pageNumber = enumerationDelta + i + 1;
                    if (pageNumber === 1) {
                        $('.js-home, .js-first', paginator).addClass('js-disabled disabled');
                        $('.js-ellipsis-l', paginator).addClass('js-disabled disabled');
                    }
                    if (pageNumber > 1 && i === 0 && !$('.js-home, .js-first', paginator).hasClass('js-disabled')) {
                        $('.js-page', paginator).first().addClass('js-disabled disabled');
                    }
                    if (pageNumber < pageCount && i === enumerationEnd - 1 && !$('.js-end', paginator).hasClass('js-disabled')) {
                        $('.js-page', paginator).last().addClass('js-disabled disabled');
                    }
                    if (pageNumber === pageCount) {
                        $('.js-ellipsis-r', paginator).addClass('js-disabled disabled');
                        $('.js-end', paginator).addClass('js-disabled disabled');
                    }

                    pages.eq(i).text(enumerationDelta + i + 1);
                }

                this.Bind(this.callback);
            }
        };

        this.id = id;
        this.currentPage = currentPage;
        this.pageCount = pageCount;

        this.Init();

        this.Bind(callback);
        this.Update(currentPage, pageCount);
    },

    tabs: function( tabsWrap ) {

        $.easing.myEasing = function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        };

        var tabsItem = tabsWrap.find('.js-tabs-item');
        var tabsContent = tabsWrap.find('.js-tabs-content');
        var anim = false;

        tabsContent.hide();

        var activeTab = tabsItem.first().parent();
        var activeTabContent = $("#"+activeTab.attr("id")+"-content");
        activeTab.addClass('js-tabs__active');
        activeTabContent.addClass('js-tabs-content__show').show();

        activeTabContent.trigger('tabshow');

        tabsItem.click(function() {

            if (anim == false) {
                anim = true;

                var linkIndex = $(this).parent().index();
                var tabsItemIndex = tabsItem.parent().eq(linkIndex);

                var tabId = $(this).parent().attr("id");
                var tabContent = $("#"+tabId+"-content");

                if (!tabsItemIndex.hasClass('js-tabs__active') && !tabsItemIndex.hasClass('js-tabs__disabled')) {

                    tabsItemIndex.addClass('js-tabs__active').siblings().removeClass('js-tabs__active');

                    tabsWrap
                        .find('.js-tabs-content__show')
                        .animate({opacity: 'hide'}, 300, 'myEasing')
                        .queue(function(next) {
                            tabContent.addClass('js-tabs-content__show').siblings().removeClass('js-tabs-content__show');
                            tabContent.animate({opacity: 'show'}, 300, 'myEasing', function() {
                                tabContent.trigger('tabshow');
                                anim = false;
                            });
                            next();
                        });

                } else {
                    anim = false;
                }
            }

            return false;
        });

    },

    isElementInViewport: function(el) {
        var rect;

        if (el instanceof jQuery) {
            el = el.get(0);
        }

        rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

};

$(function() {
    if ($('.js-tabs').length) {
        $('.js-tabs').each(function() {
            wot_hl.tabs($(this));
        });
    }

    $('body')
        .on('authenticationoid:authentication-started', function(event) {
            if (window.WG.CommonMenu) {
                window.WG.CommonMenu.hideTooltip();
                window.WG.CommonMenu.showLoginSpinner();
            } else {
                $('.js-common-menu-fallback-loader').show();
            }
        })
        .on('authenticationoid:authentication-ended', function(event, data) {
            if (window.WG.CommonMenu) {
                if (data.status === 'error') {
                    window.WG.CommonMenu.showTooltip('login_error_retry');
                }
                window.WG.CommonMenu.hideLoginSpinner();
            } else {
                if (data.status === 'error') {
                    $('.js-common-menu-fallback-error').show();
                    setTimeout(function() {
                        $('.js-common-menu-fallback-error').hide();
                    }, 5000);
                }
                $('.js-common-menu-fallback-loader').hide();
            }
        });
});
