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

var changeTabSidebar = function(){};

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
            container = jQuery(selector),
            elements = container.find('.js-carousel-element'),
            pageLinks = container.find('.js-carousel-link'),
            texts = container.find('.js-carousel-text'),
            leftLink = container.find('.js-left-slide'),
            rightLink = container.find('.js-right-slide'),
            currentElementNumber = 0,
            slideTimer;

        var currentElementNumber = 0;

        jQuery.easing.customWgEasing = function(x, t, b, c, d) {
            return (t === d) ? (b + c) : (c * (-Math.pow(2, -10 * t/d) + 1) + b);
        };

        function ChangeElement(newElementId) {

            pageLinks.eq(currentElementNumber).removeClass('active js-disabled');

            elements.stop(true, true);
            texts.stop(true, true);

            elements.eq(currentElementNumber).fadeOut(IMG_FADE_IN_DELAY);

            if (!$.browser.msie && !$.browser.version < 9) {
                texts.eq(currentElementNumber)
                    .fadeOut(TXT_FADE_IN_DELAY, function() {
                        texts.eq(newElementId)
                            .fadeIn(TXT_FADE_OUT_DELAY, function() {
                                texts.eq(newElementId).css('opacity', 1);
                            });
                    });
            }

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
            var $el = jQuery(element),
                $desc = $el.find('.js-carousel-description'),
                $title = $el.find('.b-carousel-text-title'),
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

        rightLink.bind('click', function(e) {
            e.preventDefault();
            Next();
            return false;
        });

        leftLink.bind('click', function(e) {
            Prev();
            return false;
        });

        pageLinks.each(function(i, v) {
            var number = i;
            var el = jQuery(v);
            jQuery(v).click(function(e) {
                e.preventDefault();
                if (!el.hasClass('js-disabled')) {
                    StepTo(number);
                }
            });
        });
    },

    ///////////////////////////////////////////////////////
    // tree navigation sidebar
    ///////////////////////////////////////////////////////

    TreeNavigationSidebar: function() {
        jQuery('.js-tree-category-collapsable').click(function(){
            var cat = jQuery(this).parent('li');
            if (cat.hasClass('open')){
                cat.removeClass('open');
                cat.children('ul').hide();
            }else{
                cat.addClass('open');
                cat.children('ul').show();
            }
            return false;
        });
        jQuery('.js-highlight-on-hover').hover(
            function(event){jQuery(this).addClass('hover');},
            function(event){jQuery(this).removeClass('hover');}
        );
    },

    ///////////////////////////////////////////////////////
    // CMS 2.0 tree navigation sidebar
    ///////////////////////////////////////////////////////

    CMS2TreeNavigationSidebar: function() {
        jQuery('.js-tree-category-collapsable').click(function(){
            var cat = jQuery(this).parent('div').parent('li');
            if (cat.hasClass('open')){
                cat.removeClass('open');
                cat.children('ul').hide();
            }else{
                cat.addClass('open');
                cat.children('ul').show();
            }
            return false;
        });
        jQuery('.js-highlight-on-hover').hover(
            function(event){jQuery(this).addClass('hover');},
            function(event){jQuery(this).removeClass('hover');}
        );
    },




    Expandable: function(selector, params) {

        var widget = jQuery(selector);
        var wnd = jQuery('.js-expand-window', widget);
        var content = wnd.children();

        var timer = undefined;
        var minimizedHeight = undefined;

        var TIMER_STEP = 10;
        var H_STEP = 5;
        var DELAY_BEFORE_OPEN = 200;

        var mouseOnWindow = false;
        var opened = false;

        var Show = function() {

            opened = true;
            var wndH = wnd.height();
            var contH = content.height();
            if ( wndH < contH) {
                wndH += H_STEP;
                if (wndH > contH){
                    wndH = contH;
                }
                wnd.height(wndH);
                if (params.direction === 'up') {
                    wnd.css({top: minimizedHeight - wndH});
                }
            }
            else {
                clearInterval(timer);
            }
        };
        var Hide = function() {
            var wndH = wnd.height();
            if ( wndH !== minimizedHeight) {
                wndH -= H_STEP;
                if (wndH < minimizedHeight){
                    wndH = minimizedHeight;
                }
                wnd.height(wndH);
                if (params.direction === 'up') {
                    wnd.css({top: minimizedHeight - wndH});
                }
            }
            else {
                opened = false;
                clearInterval(timer);
            }
        };

        var Open = function() {
            if (minimizedHeight === undefined) {
                minimizedHeight = wnd.height();
            }

            setTimeout(function (e) {
                           if (mouseOnWindow) {
                               clearInterval(timer);
                               timer = setInterval(Show, TIMER_STEP);
                           }
                       }, DELAY_BEFORE_OPEN);
        };

        var Close = function() {
            clearInterval(timer);
            timer = setInterval(Hide, TIMER_STEP);
        };

        widget.hover( function(e) {
                          mouseOnWindow = true;
                          Open();
                      },
                      function(e) {
                          mouseOnWindow = false;
                          Close();
                      });

        this.Close = function() {
            mouseOnWindow = false;
            clearInterval(timer);
            timer = setInterval(Hide, TIMER_STEP);
        };
    },

    ///////////////////////////////////////////////////////
    // formatters
    ///////////////////////////////////////////////////////

    FormProvinceLink: function(base_url, province_id, province_name, linkElement) {

        var href = base_url+'?province='+province_id;
        var classes = 'js-map-province-link';

        if (linkElement) {
            linkElement.attr('href', href);
            linkElement.toggleClass(classes, true);
            linkElement.data('province-id', province_id);
            linkElement.text(province_name);
        };

        var provincesHtml = '<a class="' + classes + '" '+
            'href="'+ href + '" ' + 'data-province-id="' + province_id + '">'+province_name+'</a>';

        return provincesHtml;
    },

    ///////////////////////////////////////////////////////
    // add functionality for wiki edit widget
    ///////////////////////////////////////////////////////

    WikiEditWidget: function(selector, params) {

        var widget = jQuery(selector);

        var editField = jQuery('.js-edit-field', widget);
        var previewField = jQuery('.js-preview-field', widget);
        var syntaxField = jQuery('.js-syntax-field', widget);

        var editButton = jQuery('.js-edit-button', widget);
        var previewButton = jQuery('.js-preview-button', widget);
        var syntaxButton = jQuery('.js-syntax-button', widget);

        var inputFields = jQuery('textarea, input', editField);

        var previewContent = jQuery('.js-preview-content', previewField);

        var ShowField = function(field_name) {
            editField.toggleClass('js-hidden', field_name!=='edit');
            previewField.toggleClass('js-hidden', field_name!=='preview');
            syntaxField.toggleClass('js-hidden', field_name!=='syntax');

            editButton.toggleClass('js-disabled disabled', field_name==='edit');
            previewButton.toggleClass('js-disabled disabled', field_name==='preview');
            syntaxButton.toggleClass('js-disabled disabled', field_name==='syntax');
        };

        ShowField('edit');

        editButton.click( function(e) {
            e.preventDefault();
            if (jQuery(this).hasClass('js-disabled') ) return;
            ShowField('edit');
        });

        previewButton.click(function(e) {
            e.preventDefault();
            if (jQuery(this).hasClass('js-disabled') ) return;

            wgsdk.waiting('open');
            jQuery.ajax({
                type: 'post',
                data: { text: inputFields.val() },
                url:  params.previewUrl,
                success: function(data) {
                    previewContent.html(data);
                    ShowField('preview');
                },
                error: function() {
                    wgsdk.error(translate('HL_COMMON_UNKNOWN_ERROR'));
                },
                complete: function() {
                    wgsdk.waiting('close');
                }
            });
        });

        syntaxButton.click(function(e) {
            e.preventDefault();
            if (jQuery(this).hasClass('js-disabled') ) return;
            ShowField('syntax');
        });

        this.Activate = function() {
            editButton.toggleClass('js-hidden', false);
            previewButton.toggleClass('js-hidden', false);
            syntaxButton.toggleClass('js-hidden', false);
        };

        this.Deactivate = function() {
            editButton.toggleClass('js-hidden', true);
            previewButton.toggleClass('js-hidden', true);
            syntaxButton.toggleClass('js-hidden', true);

            ShowField('edit');
        };

        if (params.activate) this.Activate();
        else this.Deactivate();
    },


    ///////////////////////////////////////////////////////
    // storage for all page specific variables
    ///////////////////////////////////////////////////////

    data: {
        },

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
    // jQuery(window).bind("hashchange", function (event) {
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
                    var matches = arg.match(/^([\w\d_-]+)$/);
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
            return jQuery.extend({}, this._hashValues);
        },

        getHashValuesFor: function(prefix) {
            var result = {};

            for (key in this._hashValues)    {
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
            if (replace) {
                var to_remove = new Array();
                for (key in this._hashValues) {
                    if (key.match(new RegExp("^"+prefix+"_(.+)"))) {
                        to_remove.push(key);
                    }
                }
                for (var i=0; i<to_remove.length; ++i) {
                    delete this._hashValues[to_remove[i]];
                }
            }

            for (key in values) {
                // TODO: support multiply values
                if (defaults[key] != values[key]) {
                    this._hashValues[prefix+"_"+key] = values[key];
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
            for (key in this._hashValues) {
                if (key.match(new RegExp("^"+prefix+"_(.+)")))
                    return false;
            }

            return true;
        }
    },

    ///////////////////////////////////////////////////////
    // itemList
    ///////////////////////////////////////////////////////

    itemList: function(params) {

        // clear cache
        amplify.store();

        // define methods

        this.SetParams =  function(newParams, force) {
            var currentParams = this.params;
            jQuery.each(newParams, function(key, value) {
                if (key == 'limit') { return true; } //do not process limit param

                if(currentParams.useHashFor_additional_params){
                    for (var i in currentParams.additional_params) {
                        if(key == i){
                            currentParams.additional_params[key] = value
                        }
                    }
                }

                if (value !== currentParams[key]) { currentParams[key] = value; }
            });
            if (!force) { this.changed = true; }
        };

        this._Render = function(data, item) {
            for(var field in data) {
                var selector = '.'+field;
                var element = jQuery(selector, item);
                if (jQuery.inArray(typeof data[field], ['string', 'number']) !== -1) {
                    var field = jQuery('<div/>').text(data[field]).html();
                    element.html(field);
                    element.addClass('js-rendered-template');
                }
            }
        };

        this._Draw = function() {
            var container = jQuery('#'+this.params.containerId);

            var scroll = jQuery('body').scrollTop();

            container.children().not('.js-template').not('.js-empty-template').remove();

            var index = 0;

            var count = 0;

            if (typeof this.params.OnPreDraw === 'function') {
                this.params.OnPreDraw(this.items);
            }

            for(var itemNumber in this.items) {

                count += 1;
                if (count > this.params.limit ) break;

                var itemData = this.items[itemNumber];

                var newItem = jQuery(this.params.template).clone()
                newItem.removeClass('js-template');

                if(this.params.onInsertCallback){
                    this.params.onInsertCallback(container, index, newItem)
                }else{
                    newItem.appendTo(container);
                    if (index % 2) {
                        newItem.addClass('even');
                    }
                    else {
                        newItem.addClass('odd');
                    }
                }

                this._Render(itemData, newItem);

                if (this.params.OnAddCallback) {
                    this.params.OnAddCallback(index, itemData, newItem, this);
                }
                newItem.removeClass('js-hidden');
                ++index;
            }

            jQuery('body').scrollTop(scroll);
        };

        this.WaitingDataStarted = function() {
            if (this.params.waitingIndicatorId) {
                jQuery('#'+this.params.waitingIndicatorId).removeClass('js-hidden');
            }
            jQuery('#'+this.params.containerId+' .js-rendered-template').css({'opacity': 0.3});
        };

        this.DataReceived = function() {
            if (this.params.waitingIndicatorId) {
                jQuery('#'+this.params.waitingIndicatorId).addClass('js-hidden');
            }
            jQuery('#'+this.params.containerId+' .js-rendered-template')/*.css({'opacity': null})*/;
        };

        this.SyncHash = function () {
            //TODO: remove last history record on resume if hash changed
            var params = this.params;


            var values = {
                offset: params.offset,
                limit: params.limit,
                search: params.search,
                order_by: params.order_by
            }

            if(this.params.useHashFor_additional_params){
                for (var i in this.params.additional_params) {
                    values[i] = this.params.additional_params[i];
                }
            }

            wot_hl.hash.setHashValuesFor(params.hashPrefix,
                                         values,
                                         true,
                                         this.defaults);
            wot_hl.hash.formHash();
        };

        this.Update = function() {

            var instance = this;

            ++instance.requestNumber;

            var container = jQuery('#'+this.params.containerId);

            this.WaitingDataStarted();

            this.changed = false;

            if (this.params.useHash) {
                this.SyncHash();
            }

            var data = {offset: this.params.offset,
                        limit: this.params.limit,
                        order_by: this.params.order_by,
                        search: this.params.search,
                        id: this.params.id};

            var additional_params = this.params.additional_params;
            for (var i in additional_params) {
                data[i] = additional_params[i];
            }

            if (this.ajaxObject) {
                this.ajaxObject.abort();
            }

            (function(localRequestNumber) {

                var cacheKey = 'itemList-' + instance.params.url + '-' + JSON.stringify(data);

                var OnSuccess = function(data) {
        
                    //error occured
                    if (!data || data.status === 'error') {
                        if (instance.params.OnErrorCallback) {
                            instance.params.OnErrorCallback(data);
                        }
                        instance.DataReceived();
                        return;
                    }
        
                    //sure, that we process last request, skip otherwise
                    if (instance.requestNumber === localRequestNumber) {
        
                        var params = instance.params;
        
                        params.offset = data.request_data.offset;
                        params.total_count = data.request_data.total_count;
                        params.filtered_count = data.request_data.filtered_count;
        
                        if (instance.params.useLocalStorage &&
                            window.localStorage &&
                            window.JSON) {
                            var settings = {offset: instance.params.offset,
                                            limit: instance.params.limit,
                                            order_by: instance.params.order_by,
                                            search: instance.params.search};
        
                            settings.additional_params = instance.params.additional_params;
        
                            localStorage[instance.params.id] = JSON.stringify(settings);
                        }
        
                        instance.items = data.request_data.items;
                        instance._Draw();
                        instance.DataReceived();
        
                        var pageNumber = Math.floor(params.offset / params.limit);
                        var pageCount = Math.floor(data.request_data.filtered_count / params.limit);
                        if (pageCount * params.limit < data.request_data.filtered_count) {
                            pageCount += 1;
                        }

                        if (pageNumber > pageCount) {
                            pageNumber = pageCount;
                        }
        
                        instance.pageCount = pageCount;
        
                        for (var index in instance.paginators) {
                            instance.paginators[index].Update(pageNumber, pageCount);
                        }

                        instance.MarkSorting();
                    }
                    instance.ajaxObject = null;
        
                    if (instance.params.OnUpdateCompleted) {
                        instance.params.OnUpdateCompleted(instance);
                    }

                    if (instance.params.useCache === true) {
                        amplify.store(cacheKey, data, {expires: instance.params.cachePeriod});
                    }
        
                    instance.params.OnChanged(instance);
                };
                
                var OnError = function() {
                    instance.DataReceived();
                    instance.ajaxObject = null;
                };

                if (instance.params.useCache === true) {
                    var cachedData = amplify.store(cacheKey);
                    if (typeof cachedData !== 'undefined') {
                        OnSuccess(cachedData);
                        return;
                    }
                }

                if (instance.params.Updater) {
                    instance.params.Updater(data, OnSuccess, OnError);
                } else {
                    instance.ajaxObject = jQuery.ajax({
                        url: instance.params.url,
                        type: 'get',
                        dataType: 'json',
                        data: data,
                        cache: instance.params.useCache,
                        success: OnSuccess,
                        error: OnError
                    });
                }

            })(this.requestNumber);

        };

        this.OnPageChanged = function(pageNumber) {

            var params = this.params;

            this.SetParams({offset: pageNumber * params.limit});

            if (this.changed) {
                this.Update();
            }
        };

        this.Search = function(filter) {
            if (this.params.search !== filter ||
                this.params.offset !== 0) {
                this.SetParams({search: filter,
                                offset: 0});
                this.Update();
            }
        };

        this.MarkSorting = function() {
            //set ordering classes
            jQuery('.'+this.params.id).removeClass('ordered desc asc');

            var order_field = this.params.order_by.replace(/^-/, '');
            var order_classes = 'ordered asc';
            if (this.params.order_by.length>1 && this.params.order_by.charAt(0) === '-') {
                order_classes = 'ordered desc';
            }
            var selector = '.'+this.params.id+'.'+order_field.replace(/\W/g, '');
            jQuery(selector).addClass(order_classes);
        };

        this.IsAscSorting = function() {
            return this.params.order_by.length && this.params.order_by.charAt(0) !== '-';
        };

        // sort list by order_by value (values: 'name' or '-name')
        this.Sort = function(order_by) {
            if (this.params.order_by !== order_by) {
                this.params.order_by = order_by;
                this.params.offset=0;
                this.Update();
            }

            this.MarkSorting();
        };

        //sort by order_by if list sorted by another field; invers sort order in other case
        this.ChangeSort = function(order_by) {
            var result_order = this.params.order_by;

            if (result_order !== order_by) {
                result_order = order_by;
            }
            else {
                if (result_order.charAt(0) === '-') {
                    result_order = result_order.replace(/^-/, '');
                }
                else {
                    result_order = '-'+result_order;
                }
            }
            this.Sort(result_order);
        };

        // DEPRECATED function
        // use Sort() and InverseSort()
        this.SortBy = function(name, direction) {

            var result_order = this.params.order_by;

            if (direction) {
                result_order = name;
                if (direction === 'desc') {
                    result_order = '-' + result_order;
                }
            }
            else {
                if (result_order !== name) {
                    result_order = name;
                }
                else {
                    if (result_order.charAt(0) !== '-') {
                        result_order = '-' + name;
                    }
                    else {
                        result_order = name;
                    }
                }
            }

            if (this.params.order_by !== result_order) {
                this.params.order_by = result_order;
                this.params.offset=0;
                this.Update();
            }

            this.MarkSorting();
        };

        this.GetItemData = function(index) {
            return jQuery.extend(true, {}, this.items[index]);
        };

        // construct object

        var container = $('#'+params.containerId);

        var templateObj = jQuery('.js-template', container);
        templateObj.addClass('js-hidden');

        var emptyTemplateObj = jQuery('.js-empty-template', container);
        if (emptyTemplateObj.length>0) {
            emptyTemplateObj.addClass('js-hidden');
        }
        else {
            emptyTemplateObj = undefined;
        }

        var useHash = params.hashPrefix ? true: false;

        this.params = {offset: 0,
                       limit: 10,
                       initUpdate: true,
                       order_by: 'default',
                       search: '',
                       total_count: 0,
                       filtered_count: 0,
                       additional_params: {},
                       id: 'item_list_default',
                       template: templateObj,
                       emptyTemplate: emptyTemplateObj,
                       waitingIndicatorId: null,
                       hashPrefix: '',
                       useHash: useHash,
                       useHashFor_additional_params: false,
                       useLocalStorage: false,
                       useCache: false,
                       cachePeriod: 30 * 60000, /* 30 minutes */
                       OnUpdateCompleted: function(instance) {},
                       OnChanged: function (instance) {},
                       OnPreDraw: function (items) {},
                       // list of attributes, which should be ignored
                       // on loading data from localStorage
                       ignoreOnRestore: []};

        this.requestNumber = 0;
        this.changed = false;
        this.pageCount = 0;
        jQuery.extend(true, this.params, params);
        this.defaults = { order_by: this.params.order_by,
                          offset: this.params.offset,
                          limit: this.params.limit,
                          search: this.params.search};

        if(this.params.useHashFor_additional_params){
            for (var i in this.params.additional_params) {
                this.defaults[i] = this.params.additional_params[i];
            }
        }

        var hashDefined = useHash ? !wot_hl.hash.IsNotDefined(this.params.hashPrefix): false;

        var hashData = useHash ? wot_hl.hash.getHashValuesFor(this.params.hashPrefix): {};

        this.params = jQuery.extend( {},
                                     this.params,
                                     hashData
                                   );

        if (this.params.useHashFor_additional_params){
            var hashData_additional = {}
            for (var i in this.params.additional_params) {
                if (hashData[i]){
                    var tmp_obj = {};
                    tmp_obj[i] = hashData[i]
                    $.extend(this.params.additional_params, tmp_obj)
                }
            }
        }

        //align offset to limit (make correct page order)
        this.params.offset -= this.params.offset % this.params.limit;

        this.paginators = [];

        if (this.params.paginatorIds) {

            var instance = this;

            for (var index in this.params.paginatorIds) {
                var callback = function (pageNumber) {
                    instance.OnPageChanged(pageNumber);
                };
                var paginator = new wot_hl.paginator(this.params.paginatorIds[index], -1, 1, callback);
                this.paginators.push(paginator);
            }
        }

        if (this.params.useLocalStorage) {
            if (window.localStorage && window.JSON) {
                if (this.params.id in localStorage &&
                    !hashDefined &&
                    localStorage[this.params.id]) {
                    var data = JSON.parse(localStorage[this.params.id]);
                    for (var i in this.params.ignoreOnRestore) {
                        delete data[this.params.ignoreOnRestore[i]];
                    }
                    this.SetParams(data, true);
                }
                else {
                    localStorage[this.params.id] = JSON.stringify(this.defaults);
                }
            }
        }
        if(this.params.initUpdate){
            this.Update();
        }
    },

    //////////////////////////////////////////////////////////////////////
    // paginator
    //////////////////////////////////////////////////////////////////////

    paginator: function(id, currentPage, pageCount, callback, params) {

        if (!params)
            params = {};

        this.Init = function() {
            var KB_LEFT = 37,
                KB_RIGHT = 39,
                instance = this;

            jQuery(document).keydown(function(e) {
                var disableHotkeys = false;
                if (e.ctrlKey && (e.which == KB_LEFT || e.which == KB_RIGHT)) {
                
                    jQuery(':input').not(':button').not(':checkbox').each(
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

            jQuery(document).keyup(function(e) {
                if (! e.ctrlKey) return;

                var disableHotkeys = false;
                
                jQuery(':input').not(':button').not(':checkbox').each(
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
                        jQuery('#'+instance.id+' .js-prev').click();
                        e.preventDefault();
                        break;
                    case KB_RIGHT: 
                        jQuery('#'+instance.id+' .js-next').click();
                        e.preventDefault();
                        break;
                }
            });
        };

        this.Bind = function(callback) {

            this.callback = callback;

            var paginator = jQuery('#'+this.id);

            var currentPage = this.currentPage;
            var pageCount = this.pageCount;

            var pages = jQuery('.js-page:not(.js-disabled)', paginator);
            var curPageIndex = pages.index(jQuery('.js-current', paginator));

            jQuery('.js-disabled', paginator).unbind('click').click(function(e) {
                e.preventDefault();
            });

            jQuery('.js-home:not(.js-disabled), .js-first:not(.js-disabled)', paginator).unbind('click').click( function(e) {
                e.preventDefault();
                callback(0);
            });
            jQuery('.js-next, .js-prev', paginator).unbind('click').click(function(e) {
                e.preventDefault();
            });
            if (pageCount > 0) {
                jQuery('.js-end:not(.js-disabled)', paginator).unbind('click').click( function(e) {
                    e.preventDefault();
                    var pageNumber = pageCount-1;
                    callback(pageNumber);
                });
            }
            if (currentPage >= 0) {
                jQuery('.js-next:not(.js-disabled)', paginator).click( function(e) {
                    e.preventDefault();
                    var pageNumber = currentPage+1;
                    callback(pageNumber);
                });
                jQuery('.js-prev:not(.js-disabled)', paginator).click( function(e) {
                    e.preventDefault();
                    var pageNumber = currentPage-1;
                    callback(pageNumber);
                });

                var pageLink = currentPage - curPageIndex;
                pages.each(function(index, page) {
                    var pageNumber = pageLink;
                    jQuery(page).unbind('click').click( function(e){
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

            var paginator = jQuery('#'+this.id);

            paginator.toggleClass('js-hidden', pageCount <= 1);

            var pages = jQuery('.js-page', paginator);
            var pagesLen = pages.length;

            var middlePage = Math.floor(pagesLen / 2); //doesn't do +1, since enumerate pages from 0

            jQuery('.js-next, .js-prev', paginator).unbind('click');

            if (this.currentPage < 0 || this.pageCount <= 1) {
                jQuery('.js-ellipsis-l', paginator).addClass('js-disabled disabled');
                jQuery('.js-ellipsis-r', paginator).addClass('js-disabled disabled');
                jQuery('.js-page', paginator).addClass('js-disabled disabled').removeClass('js-current current');
                jQuery('.js-home, .js-first', paginator).addClass('js-disabled disabled');
                jQuery('.js-end', paginator).addClass('js-disabled disabled');
                jQuery('.js-next', paginator).addClass('js-disabled disabled');
                jQuery('.js-prev', paginator).addClass('js-disabled disabled');
            }
            else {
                jQuery('.js-ellipsis-l', paginator).removeClass('js-disabled disabled');
                jQuery('.js-ellipsis-r', paginator).removeClass('js-disabled disabled');
                jQuery('.js-page', paginator).removeClass('js-disabled disabled js-current current');
                jQuery('.js-home, .js-first', paginator).removeClass('js-disabled disabled');
                jQuery('.js-end', paginator).removeClass('js-disabled disabled');
                jQuery('.js-next', paginator).removeClass('js-disabled disabled');
                jQuery('.js-prev', paginator).removeClass('js-disabled disabled');

                var enumerationEnd = pagesLen;
                var enumerationDelta = 0;

                if (currentPage === 0) {
                    jQuery('.js-home, .js-first', paginator).addClass('js-disabled disabled');
                    jQuery('.js-prev', paginator).addClass('js-disabled disabled');
                }

                if (currentPage === pageCount-1) {
                    jQuery('.js-end', paginator).addClass('js-disabled disabled');
                    jQuery('.js-next', paginator).addClass('js-disabled disabled');
                }

                if (pageCount <= pagesLen) {
                    jQuery('.js-ellipsis-l', paginator).addClass('js-disabled disabled');
                    jQuery('.js-ellipsis-r', paginator).addClass('js-disabled disabled');

                    enumerationEnd = pageCount;

                    for (var i=pageCount; i<pagesLen; ++i) {
                        pages.eq(i).addClass('js-disabled disabled');
                    }

                    pages.eq(currentPage).addClass('js-current current');
                }
                else {
                    if (currentPage <= middlePage) {
                        jQuery('.js-ellipsis-l', paginator).addClass('js-disabled disabled');

                        pages.eq(currentPage).addClass('js-current current');
                    }
                    else {
                        if (pageCount - currentPage <= middlePage) {
                            jQuery('.js-ellipsis-r', paginator).addClass('js-disabled disabled');
                            enumerationDelta = pageCount - pagesLen;
                            pages.eq(currentPage - enumerationDelta).addClass('js-current current');
                        }
                        else {

                            enumerationDelta = currentPage - middlePage;
                            pages.eq(middlePage).addClass('js-current current');
                        }
                    }
                }

                jQuery('.js-home', paginator).text(1);
                jQuery('.js-end', paginator).text(pageCount);

                for (var i=0; i<enumerationEnd; ++i) {
                    var pageNumber = enumerationDelta+i+1;
                    if (pageNumber === 1) {
                        jQuery('.js-home, .js-first', paginator).toggleClass('js-disabled disabled', true);
                        jQuery('.js-ellipsis-l', paginator).toggleClass('js-disabled disabled', true);
                    }
                    if (pageNumber > 1 && i===0 && !jQuery('.js-home, .js-first', paginator).hasClass('js-disabled')) {
                        jQuery('.js-page', paginator).first().toggleClass('js-disabled disabled', true);
                    }
                    if (pageNumber < pageCount && i === enumerationEnd-1 && !jQuery('.js-end', paginator).hasClass('js-disabled')) {
                        jQuery('.js-page', paginator).last().toggleClass('js-disabled disabled', true);
                    }
                    if (pageNumber === pageCount) {
                        jQuery('.js-ellipsis-r', paginator).toggleClass('js-disabled disabled', true);
                        jQuery('.js-end', paginator).toggleClass('js-disabled disabled', true);
                    }

                    pages.eq(i).text(enumerationDelta+i+1);
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

    BlockSelection: function(selector) {
        //prevent shift+click browser behaviour
        $(document).on('mousedown', selector,
            function (e) {
                e.preventDefault();

                // For IE
                if ($.browser.msie) {
                    this.onselectstart = function () { return false; };
                    var me = this;  // capture in a closure
                    window.setTimeout(function () { me.onselectstart = null; }, 0);
                }
            });
    },
    
    formatString: function (str, col) {
        col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

        return str.replace(/\{([^}]+)\}/gm, function () {
            return col[arguments[1]];
        });
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

        tabsItem.click(function () {

            if(anim == false) {
                anim = true;

                var tabLink = $(this);
                var linkIndex = $(this).parent().index();
                var tabsItemIndex = tabsItem.parent().eq(linkIndex);

                var tabId = $(this).parent().attr("id");
                var tabContent = $("#"+tabId+"-content");

                if( !tabsItemIndex.hasClass('js-tabs__active') && !tabsItemIndex.hasClass('js-tabs__disabled') ) {

                    tabsItemIndex.addClass('js-tabs__active').siblings().removeClass('js-tabs__active');

                    tabsWrap.find('.js-tabs-content__show').animate({opacity: 'hide'}, 300, 'myEasing', function() {
                        changeTabSidebar(tabLink);
                    }).queue(
                        function(next){
                            tabContent.addClass('js-tabs-content__show').siblings().removeClass('js-tabs-content__show');
                            tabContent.animate({opacity: 'show'}, 300, 'myEasing', function(){
                                tabContent.trigger('tabshow');
                                anim = false;
                            });
                            next();
                        });

                }
                else{
                    anim = false;
                }
            }

            return false;
        });

    },

    get_nickname_from_email: function (email){
        var position_AtSign = email.indexOf('@');
        var username = '';
        if (position_AtSign + 1){
            username = email.substr(0, position_AtSign);
        }
        return username;
    },

    // DEPRECATED, use wgsdk.clearer (from wgsdk.forms.js) instead
    activateClearer: function(inputSelector, clrSelector, clearCallback) {
        var instance = $(clrSelector)
        var input = $(inputSelector);

        if (!(input.length && instance.length)) {
            return;
        }

        function update() {
            if (input.val() !== '') {
                instance.css('display', 'block');
            }
            else {
                instance.css('display', 'none');
            }
        }

        input.keyup(update);

        instance.click(function(e) {
            instance.css('display', 'none');
            clearCallback(e)
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

jQuery(document).ready( function(){
    wot_hl.BlockSelection('.ui-widget-overlay');

    if ($('.js-tabs').length) {
        $('.js-tabs').each(function(){
            wot_hl.tabs($(this));
        });
    }

    jQuery('body').bind('authenticationoid:authentication-started', function(event){
        wgsdk.waiting('open');
    });
    jQuery('body').bind('authenticationoid:authentication-ended', function(event, data){
        if(data.status == 'error'){
            if(data.error){
                wgsdk.error(data.error);
            }else{
                wgsdk.error(gettext('Вход временно невозможен'));
            }
        }
        wgsdk.waiting('close');
    });
});


}
/*
     FILE ARCHIVED ON 06:48:54 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:24 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.216
  PetaboxLoader3.resolve: 938.804 (2)
  RedisCDXSource: 7.337
  esindex: 0.016
  CDXLines.iter: 25.695 (3)
  load_resource: 1126.474 (2)
  captures_list: 1810.449
  PetaboxLoader3.datanode: 1894.883 (5)
  exclusion.robots: 0.231
  LoadShardBlock: 1771.835 (3)
*/