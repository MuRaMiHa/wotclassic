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

if (this.jQuery == undefined) {
    alert('Please include the module "jQuery"');
}

( function ($) {

    var formElementCounter = 0;
    // Simple combobox.
    function Combobox(elem, param) {
        if (param === undefined) {
            param = {};
        }

        var element = $(elem);
        var width  = element.outerWidth();
        var height = element.height();

        if (element.hasClass('js-control-clean')) {
            element
                .prev()
                .remove()
                .removeClass('js-control-clean')
            ;
        }
        var elementClasses = '';
        if (element.prop('className')) {
            elementClasses = element.prop('className');
        }

        var selectBoxId   = 'js-selectbox-' + (++formElementCounter);
        var dropdownBoxId = 'js-dropdown-' + formElementCounter;
        var arrowHtml     = '<span class="jspVerticalBar"><a class="jspArrow jspArrowDown"></a></span>';
        var dropdownHtml = ''
            + '<div id="'+ dropdownBoxId +'" class="js-combobox-dropdown ' +elementClasses+ '">'
            + '   <div class="js-combobox-dropdown-scroll">'
            + '       <div class="js-combobox-dropdown-content"></div>'
            + '   </div>'
            + '</div>';        
        var coreHtml = ''
            + '<div id="' + selectBoxId + '" class="js-combobox">'
            + '    <div class="js-combobox-selectbox" style="">'
            + '        <div class="js-selectbox-text">'
            + (element.hasClass('js-write-and-select')?
                            '<input type="text" class="js-selectbox-text-span">':
                            '<span class="js-selectbox-text-span"></span>')
            + '       </div>'
            +         arrowHtml
            + '   </div>'
            + '</div>';

        // Hide form element.
        element
            .addClass('js-control-clean')
            .blur()
            .css({ 'position' : 'absolute' })
            .css({ 'left' : -50000 })
        ;

        $( coreHtml ).insertBefore( element );
        $('body').append( dropdownHtml );

        var context   = $('#' + selectBoxId);
        context.bind('remove', function() {
            var selectBoxId = $(this).prop('id');
            var match = selectBoxId.match(/js-selectbox-(\d+)/);
            if(match){
                var dropdownBoxId = 'js-dropdown-'+match[1];
                $('#'+dropdownBoxId).remove();
            }
        });

        var selectbox = $(".js-combobox-selectbox", context);
        if (element.hasClass('js-combobox-fix')){
            var selectboxFix = $(selectbox).addClass('b-combobox-fix');
        }



        if($('input.js-selectbox-text-span', selectbox).length){
             var selectboxValue = $('input.js-selectbox-text-span', selectbox);
        }
        else{
            var selectboxText = $('.js-selectbox-text-span', selectbox);
        }
        var dropbox   = $("#" + dropdownBoxId);
        var dropbox_c = $(".js-combobox-dropdown-content",  dropbox);

        var onElementChange = function() {
            $('.js-dropbox-item', dropbox).removeClass('js-dropbox-item-selected');

            var value = element.val();
            var item = $('.js-dropbox-item[data-item-value="'+value+'"]', dropbox);

            if(selectboxValue){
                selectboxValue.val(item.text());
            }
            else{
                selectboxText.text(item.text());
            }
            item.addClass('js-dropbox-item-selected');

            return false;
        };

        element.change(onElementChange);
        element.bind('keypress keyup', function() {
            element.trigger('change');
        });

        var items     = [];
        var idx       = 0;

        var initScrollData = {
            'showArrows'             : true,
            'verticalDragMinHeight'  : 20,
            'horizontalDragMinWidth' : 7,
            'isScrollableH'          : false
        };

        $('option', element).each(function(){
            var self = $(this);
            items.push({
                'idx'     : idx++,
                'value'   : self.val(),
                'text'    : self.text(),
                'inner_text'    : self.prop('innerHTML'),
                'selected': self.prop('selected'),
                'object'  : self
            });
        });

        selectbox.css({
            'width'    : width + 15,
            // 'height': height, - from css file.
            'position' : 'relative',
            'overflow' : 'hidden'
        });

        var isOpened = false;
        var isOver   = false;

        var dropboxPosition = function (){
            var selectBoxExist = $('#' + selectBoxId);
            if (selectBoxExist && selectBoxExist.offset()) {
                var selectboxOffset = selectBoxExist.offset();
                var dropboxPositionTop = selectboxOffset.top + selectbox.outerHeight();
                var dropboxPositionLeft = selectboxOffset.left;
                
                dropbox.css({
                    'top': dropboxPositionTop,
                    'left': dropboxPositionLeft
                });
            }
        };

        $(window).resize(dropboxPosition);

        selectbox.click(function(e){

            dropboxPosition();

            e.preventDefault();
            e.stopPropagation();

            //element.trigger('focus');

            if (!isOpened){
                $(selectboxFix).removeClass('b-combobox-fix');
                $('.js-combobox-dropdown').trigger('combobox-hidden');
                dropbox.show();
                $(selectbox).addClass('js-combobox-active');
                $('.jspArrow', selectbox).addClass('js-arrow-active');

                // Initialize ScrollBar
                if (countVisible == MAX_ITEM_NOT_SCROLL){
                    $('.js-combobox-dropdown-scroll', dropbox).jScrollPane(initScrollData);
                    //$('.jspPane', dropbox).width($('.jspPane', dropbox).width() + 4);

                    var api = $('.js-combobox-dropdown-scroll', dropbox).data('jsp');
                    if (api) {
                        api.scrollToY( $('.js-dropbox-item-selected', dropbox).position().top, false, true);
                    }
                }

                $('.js-combobox-dropdown-scroll', dropbox).focus();
            } else {
                dropbox.hide();
                $(selectbox).removeClass('js-combobox-active');
                $(selectboxFix).addClass('b-combobox-fix');
                $('.jspArrow', selectbox).removeClass('js-arrow-active');
            }
            dropboxPosition();
            isOpened = !isOpened;
        });
        
        selectbox.mouseenter(function(){
            selectbox
                .addClass('js-combobox-over')
            ;
        });

        selectbox.mouseleave(function(){
            selectbox
                .removeClass('js-combobox-over')
            ;
        });
        
        var MAX_ITEM_NOT_SCROLL = 6;
        
        if (param.scrollVisibleItems){
            MAX_ITEM_NOT_SCROLL = param.scrollVisibleItems;
        }
        
        if (param.noScroll)
            MAX_ITEM_NOT_SCROLL = items.length;

        for (idx in items)
        {
            var item = items[idx];

            if (item.selected){
                if(selectboxValue){
                    selectboxValue.val(item.text);
                }
                else{
                    selectboxText.text(item.text);
                }

                dropbox_c.append('<div class="js-dropbox-item js-dropbox-item-selected" data-item-value="'+item.value+'"><div class="js-dropbox-item-content">' + item.inner_text + '</div></div>');
            }
            else {
                dropbox_c.append('<div class="js-dropbox-item" data-item-value="'+item.value+'"><div class="js-dropbox-item-content">' + item.inner_text + '</div></div>');
            }
        }

        var countVisible = items.length;

        if (items.length > MAX_ITEM_NOT_SCROLL){
            countVisible = MAX_ITEM_NOT_SCROLL;
        }

        var outerItems = $(".js-dropbox-item");
        if( outerItems && outerItems.length > 0 ){
            var outerItem = parseInt(outerItems.css("margin-top").replace("px",""));
        }
        if (items.length == 0){
            outerItem = 0;
        }
        dropbox.css({
            'width': width + 15,
            'height': ($('.js-dropbox-item', dropbox).height() + outerItem) * countVisible + outerItem,
            'display':'none',
            'position': 'absolute',
            'z-index': 10000
        });

        $('.js-combobox-dropdown-scroll' ,dropbox).css({
            'height': ($('.js-dropbox-item', dropbox).height() + outerItem) * countVisible + outerItem
        });

        $('.js-dropbox-item', dropbox).mouseenter(function(){
            $('.js-dropbox-item', dropbox).removeClass('js-dropbox-item-over');
            $(this).addClass('js-dropbox-item-over');
        });

        dropbox.mouseleave(function(){
            $('.js-dropbox-item', dropbox).removeClass('js-dropbox-item-over');
            isOver = false;
        });

        dropbox.mouseenter(function(){
            isOver = true;
        });
        
        $('.js-dropbox-item', dropbox).on('click', function(e, eventData) {
            dropbox.hide();
            isOpened = false;

            var self = $(this);
            if (selectboxValue) {
                selectboxValue.val(self.val());
            } else {
                selectboxText.text(self.text());
            }

            $('.js-dropbox-item', dropbox).removeClass('js-dropbox-item-selected');
            self.addClass('js-dropbox-item-selected');
            $(items[self.index()].object).prop('selected', true);
            if (!eventData || eventData.simulated !== true) {
                element.trigger('change');
            }
            $(selectbox).removeClass('js-combobox-active');
            $('.jspArrow', selectbox).removeClass('js-arrow-active');
            $(selectboxFix).addClass('b-combobox-fix');
        });

        $('.js-dropbox-item', dropbox).mouseenter(function() {
            $('.js-dropbox-item', dropbox).removeClass('js-dropbox-item-over');
            $(this).addClass('js-dropbox-item-over');
        });

        dropbox.bind('combobox-hidden', function(e){
            if (isOver)
                return;

            if (isOpened) {
                dropbox.hide();
                isOpened = false;
                $(selectbox).removeClass('js-combobox-active');
                $('.jspArrow', selectbox).removeClass('js-arrow-active');
                $(selectboxFix).addClass('b-combobox-fix');
            }
        });

        this.update = function() {
            var i, len;

            for (i = 0; i < items.length; i++) {
                if (items[i].object.prop('selected') === true) {
                    $('.js-dropbox-item:nth-child(' + (i + 1) +')', dropbox).trigger('click', {simulated: true});
                    return;
                }
            }
        };

        return this;
    };

    function Checkbox(elem, param)
    {

        var api        = this;
        var element    = $(elem);
        var checkBoxId = 'js-checkbox-' + ( ++formElementCounter );
        var coreHtml   = '<div id="' + checkBoxId + '" class="js-checkbox b-checkbox"><span class="js-checkbox-content"></span></div>';

        if (element.hasClass('js-control-clean'))
        {
            element
                .prev()
                .remove()
                .removeClass('js-control-clean')
            ;
        }

        // Hide form element.
        element
            .addClass('js-control-clean')
            .css({ 
                'position' : 'absolute',
                'left' : -10000
            })
            .bind('change', function(){
                api.update();
            })
        ;

        $(coreHtml).insertBefore(element);

        var checkbox = $('#' + checkBoxId);
        var name  = element.prop('id');
        var label = $('label[for="' + name + '"]');

        element
            .focus(function(){
                checkbox.addClass('focus');
            })
            .blur(function(){
                checkbox.removeClass('focus');
            })
        ;

        label.addClass('b-lable-checkbox');

        checkbox.bind('click', function(e){
            if (api.isDisabled) {
                return false;
            }

            api.isChecked = !api.isChecked;

            element
                .prop("checked", api.isChecked)
                .trigger('change')
            ;
        });

        var enterCheckbox = function(){
            if (api.isDisabled) {
                return false;
            }
        
            label
                .addClass('hover')
            ;

            checkbox
                .addClass('hover')
            ;
        };

        var leaveCheckbox = function(){
            label
                .removeClass('hover')
            ;

            checkbox
                .removeClass('hover')
            ;
        };

        var activeCheckbox = function(){
            if (api.isDisabled) {
                return false;
            }
        
            label
                .addClass('active')
            ;

            checkbox
                .addClass('active')
            ;
        };

        var noactiveCheckbox = function(){
            label
                .removeClass('active')
            ;

            checkbox
                .removeClass('active')
            ;
        };

        checkbox.mouseenter(enterCheckbox);
        checkbox.mouseleave(leaveCheckbox);

        label.mouseenter(enterCheckbox);
        label.mouseleave(leaveCheckbox);

        checkbox.mousedown(activeCheckbox);
        checkbox.mousedown(leaveCheckbox);
        checkbox.mouseup(noactiveCheckbox);
        checkbox.mouseup(enterCheckbox);

        label.mousedown(activeCheckbox);
        label.mousedown(leaveCheckbox);
        label.mouseup(noactiveCheckbox);
        label.mouseup(enterCheckbox);

        // Public API.
        this.element = element;
        this.type = 'checkbox';

        this.update = function(){
            api.isChecked = element.prop('checked');
            api.isDisabled = element.prop('disabled');

            checkbox.toggleClass('disabled', api.isDisabled);
            if (api.isChecked)
            {
                checkbox
                    .removeClass('js-checkbox-unchecked')
                    .addClass('checked')
                ;
               label.addClass('checked');
            }
            else
            {
                checkbox
                    .removeClass('checked')
                    .addClass('js-checkbox-unchecked')
                ;
                label.removeClass('checked');
            }
        };

        this.update();
        return this;
    }

    function Radio(elem, param)
    {
        var api      = this;
        var element  = $(elem);
        var radioId  = 'js-radio-' + ( ++formElementCounter );
        var coreHtml = '<div id=' + radioId + ' class="b-radio"><span></span></div>';

        if (element.hasClass('js-control-clean'))
        {
            element
                .prev()
                .remove()
                .removeClass('js-control-clean')
            ;
        }

        /* Hide form element. */
        element
            .addClass('js-control-clean')
            .css({ 'position' : 'absolute' })
            .css({ 'display' : 'none' })
            /* .css({ 'left' : -50000 })  Opera problem */
           .bind('change', function(){
                api.update();
                return false;
           })
        ;

        $( coreHtml ).insertBefore( element );
        
        var radio    = $('#' + radioId);
        var name     = element.prop('name');
        var label    = $('label[for="' + element.prop('id') + '"]');

        radio.addClass('js-radio-name-' + name);

        // Focus events.
        element
            .focus(function(){
                radio.addClass('hover');
            })
            .blur(function(){
                radio.removeClass('hover');
            })
        ;

        // Active events.
        element
            .mousedown(function(){
                radio.addClass('active');
            })
            .mouseup(function(){
                radio.removeClass('active');
            })
        ;

        // Mouse events.
        var elements = [radio, label];
        for (var id in elements)
            elements[id]
                .mouseenter(function(){
                    radio.addClass('hover');
                    label.addClass('hover');
                })
                .mouseleave(function(){
                    radio.removeClass('hover');
                    label.removeClass('hover');
                })
                .mousedown(function(){
                    radio.addClass('active');
                    label.addClass('active');
                    radio.removeClass('hover');
                    label.removeClass('hover');
                })
                .mouseup(function(){
                    radio.removeClass('active');
                    label.removeClass('active');
                    radio.addClass('hover');
                    label.addClass('hover');
                })
            ;
        

        label.addClass('b-label-radio').bind('click', function(e){
            //ATTENTION: this code appeared after WOTP-2367 had been fixed, 
            //           but after this labels behaviour was broken - construction <label><a></a></label> stopped working
            //           now it seems, that WOTP-2367 fixed in other way, so we can comment this code
            radio.trigger('click');
            e.preventDefault();
            return false;
        });

        radio.bind('click', function(e){
            if (api.isDisabled)
                return false;

            element
                .prop("checked", true)
                .trigger('change')
            ;
            return false;
        });

        // Public API.
        this.element = element;
        this.type = 'radio';

        this.update = function(){
            var inputs = $('input[name="' + name + '"]');
            inputs.each(function() {
                $(this).control('update_this_only');
            });
        };

        this.update_this_only = function(){
            api.isDisabled = element.prop('disabled');
            api.isChecked  = element.prop('checked');

            var hasClass = radio.hasClass('checked');

            if (api.isChecked) {
                if (!hasClass)
                    radio.addClass('checked');
                    label.addClass('checked');

            } else {
                if (hasClass)
                    radio.removeClass('checked');
                    label.removeClass('checked');
            }
        };

        this.disabled = function( is_disabled ){
            api.isDisabled = is_disabled;
        };

        var instance = this;

        // wait until full radio box initialization 
        setTimeout( function(e) {
            instance.update();
        }, 10);

        return this;
    }

    // Init all forms elements.
    $(document).ready( function () {
        var body = $('body');

        body.click(function(e){
            $('.js-combobox-dropdown').trigger('combobox-hidden', 'body');
        });

        $('select:not(.js-control-clean)', body).control('combobox');
        $('input:checkbox', body).control('checkbox');
        $('input:radio', body).control('radio');

        $(document).on('dialogopen', '.ui-dialog', function( elem ) {
            $('select:not(.js-control-clean)', this).control('combobox');
            $('input:checkbox', this).control('checkbox');

            return false;
        });
    });

    $.fn.control = function(method, param) {
        var ALLOWED_ELEMENTS = ['radio', 'checkbox', 'combobox'],
            $ret, invoker;

        invoker = function($elem, method, param) {
            var api = $elem.data('wg_control'), 
                apiMethod;

            if (api && $.inArray(method, ALLOWED_ELEMENTS) === -1) {
                if (typeof(method) == 'string'){
                    apiMethod = api[method];
                    if (apiMethod) {
                        apiMethod(param);
                    }
                }
            } else {
                if (typeof(method) === 'string') {
                    if (method === 'checkbox') {
                        api = new Checkbox($elem, param);
                        $elem.data('wg_control', api);
                    }
                    else if (method === 'radio') {
                        api = new Radio($elem, param);
                        $elem.data('wg_control', api);
                    }
                    else if (method === 'combobox') {
                        api = new Combobox($elem, param);
                        $elem.data('wg_control', api);
                    }
                }
            }
        };

        if (this.length == 1 && !method && !param) {
            return this.data('wg_control');
        } else {
            this.each( function() {
                var $elem = $(this);
                invoker($elem, method, param);
                $ret = $ret ? $ret.add($elem) : $elem;
            });
        }

        return $ret;
    };

    var def_attr = $.fn.attr;

    $.fn.attr = function(atribute, param){
        var ret = def_attr.apply(this, arguments);

        if ( param != undefined ) {
            var self = $(this);
            if (self.hasClass('js-control-clean'))
                self.control( 'update' );
        }

        return ret;
    };

    var def_prop = $.fn.prop;

    $.fn.prop = function(property, param){
        var ret = def_prop.apply(this, arguments);

        if ( param != undefined ) {
            var self = $(this);
            if (self.hasClass('js-control-clean'))
                self.control( 'update' );
        }

        return ret;
    };
    
})(jQuery);


}
/*
     FILE ARCHIVED ON 06:48:55 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:24 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 139.585
  exclusion.robots: 0.151
  exclusion.robots.policy: 0.14
  RedisCDXSource: 0.674
  esindex: 0.012
  LoadShardBlock: 109.971 (3)
  PetaboxLoader3.datanode: 85.025 (5)
  CDXLines.iter: 24.28 (3)
  PetaboxLoader3.resolve: 138.046 (3)
  load_resource: 131.648 (2)
*/