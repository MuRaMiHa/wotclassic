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

// Tabindex dialog.
( function ($) {
    $( document ).ready( function () {
        var focusSelector = '.b-cancel > a, :input';
        var ignoreSelector = 'a, .ui-corner-all';

        $(document).on('dialogopen', '.ui-dialog', function(elem) {
            // ensure indexes in dialog won't overlap with indexes on current page (if any)
            var tabIndex = 1000;

            $(focusSelector + ',' + ignoreSelector, this).each( function(){
                $(this).attr('tabindex', '-1');
            });

            $(focusSelector, this).each( function(){
                if ( $(this).attr('type') == 'hidden' )
                    return;
                $(this).attr('tabindex', '' + (++tabIndex));
            });
        });

        $(document).on('dialogclose', '.ui-dialog', function(elem) {
            $(focusSelector, this).each( function(){
                $(this).attr('tabindex', '');
            });
        });
    });

    $.extend($.ui.dialog.prototype, {
        _createButtons: function() {
            var self = this,
                hasButtons = false,
                buttons = this.options.buttons,
                uiDialogButtonPane = $('<div></div>')
                    .addClass(
                        'ui-dialog-buttonpane ' +
                        'ui-widget-content ' +
                        'ui-helper-clearfix'
                    ),
                uiButtonSet = $( "<div></div>" )
                    .addClass( "ui-dialog-buttonset" )
                    .appendTo( uiDialogButtonPane );

            // if we already have a button pane, remove it
            this.uiDialogButtonPane.remove();
            this.uiButtonSet.empty();

            if (typeof buttons === 'object' && buttons !== null) {
                $.each(buttons, function() {
                    return !(hasButtons = true);
                });
            }
            if (hasButtons) {
                var is_cancel_button = function(props){
                    if(!('class' in props)){
                        return false;
                    }
                    return (props['class'].indexOf('b-cancel') + 1) ||
                           (props['class'].indexOf('b-button-cancel') + 1);
                };
                $.each(buttons, function(name, props) {
                    props = $.isFunction( props ) ?
                        { click: props, text: name } :
                        props;

                    var button = $('<input type="button"/>').click(function() {
                        props.click.apply(self.element[0], arguments);
                    });
                    // can't use .attr( props, true ) with $ 1.3.2.
                    $.each( props, function( key, value ) {
                        if ( key === "click" ) {
                            return;
                        }
                        if ( key === 'text') {
                            button.val( value );
                            return;
                        }
                        if ( key in button ) {
                            button[ key ]( value );
                        } else {
                            button.attr( key, value );
                        }
                    });

                    var button_wrapper = '';
                    if (is_cancel_button(props)){
                        button_wrapper = $('<div class="b-cancel"></div>');
                        button_wrapper.append(button);
                    }else{
                        var button_wrapper_html = '';
                        button_wrapper_html += '<span class="old-small-button">';
                        button_wrapper_html += '<span class="old-small-button_text">';
                        button_wrapper_html += '</span>';
                        button_wrapper_html += '</span>';
                        button_wrapper = $(button_wrapper_html);
                        button_wrapper.find('.old-small-button_text').append(button);
                    }
                    button_wrapper.appendTo(uiButtonSet);
                });
                uiDialogButtonPane.appendTo(self.uiDialog);
            }
        }
    });
})($);

wgsdk.dialog = (function($){
    var obj = function(id, params) {
        var selector = id;
        if (!selector || selector.length === 0) return;
        if (selector.charAt(0) !== '#') selector = '#' + id;
        else id = id.substr(1);

        var isAutoOpen = false;

        params = params || {};

        var OnClose = null;
        if( params['close'] ){
            OnClose = params['close'];
        }
        var OnDragStart = null;
        if( params['dragStart'] ){
            OnDragStart = params['dragStart'];
        }
        params['close'] = function(e, ui){
            if(typeof(OnClose)==='function'){
                OnClose(e,ui);
            }
            $('.js-combobox-dropdown').trigger('combobox-hidden', 'body');
        };
        params['dragStart'] = function(e, ui){
            if(typeof(OnDragStart)==='function'){
                OnDragStart(e,ui);
            }
            $('.js-combobox-dropdown').trigger('combobox-hidden', 'body');
        }


        var ext_data = params.ext_data || {};
        var type = params.type || 'get';

        if (!params.dialogClass) {
            params.dialogClass = '';
        }

        if (!params.buttons) {
            params.dialogClass += ' no-jquery-buttons';
        }

        var repeat = function (refreshed) {
            refreshed = refreshed || false;

            if (isAutoOpen)
                wgsdk.waiting('open');

            $.ajax({
                'type': type,
                'url': params.url,
                'dataType': 'html',
                'data': ext_data,
                'success': function(data, textStatus, request){
                    if (!wgsdk._validateInsertData(selector, data, repeat, request))
                        return;

                    var dialog = $(selector);

                    var title = $('.js-dialog-title', dialog);
                    if (title.length > 0) dialog.dialog('option', 'title', title.text());

                    if (refreshed) return;

                    $(selector).dialog(params);

                    if (isAutoOpen){
                        dialog.dialog('open');
                        dialog.dialog('option', 'width', dialog.parent('.ui-dialog').width() );
                        if (window.wotUpdateDateTimeFields) wotUpdateDateTimeFields();
                    }

                    //add callback on cancel buttons
                    $('.js-cancel-button', dialog).click(function(e) {
                        dialog.dialog('close');
                        e.preventDefault();
                    });

                    if (params.OnContentReceived) {
                        params.OnContentReceived(dialog);
                    }
                },

                'error': function(request){
                    wgsdk.error(translate('DIALOG_CAN_NOT_RECEIVE_DATA'), repeat, request);
                },

                'complete': function(){
                    if (isAutoOpen || refreshed)
                        wgsdk.waiting('close', {force: true});
                }
            });
        };

        if ($(selector).length == 0)
            $('<div id="' + id + '"></div>').appendTo('body');

        if (typeof(params) == 'string') {
            if (params == 'destroy') {
                $(selector).dialog('destroy');
                $(selector).remove();
            } else if (params == 'refresh') {
                $('.ui-dialog-titlebar-refresh', $(selector).parent()).click();
            } else {
                return $(selector).dialog(params);
            }

            return null;
        }

        // Ajax dialog
        if (typeof(params) == 'object' && typeof(params.url) == 'string') {
            if (params.autoOpen == null)
                params.autoOpen = true;

            isAutoOpen = params.autoOpen;
            params.autoOpen = null;

            $(selector).dialog(params);

            if (params.refresh != null && typeof(params.refresh) == 'boolean' && params.refresh) {
                if ($('.ui-dialog-titlebar .ui-dialog-titlebar-refresh', $(selector).parent()).length == 0) {
                    $('.ui-dialog-titlebar', $(selector).parent()).append('<a href="#" class="ui-dialog-titlebar-refresh ui-corner-all" role="button"><span class="ui-icon ui-icon-refresh">close</span></a>');

                    $('.ui-dialog-titlebar-refresh', $(selector).parent()).mouseenter(function(elem){
                        $(this).addClass('ui-state-hover');
                    });

                    $('.ui-dialog-titlebar-refresh', $(selector).parent()).mouseleave(function(){
                        $(this).removeClass('ui-state-hover');
                    });

                    $('.ui-dialog-titlebar-refresh', $(selector).parent()).click(function(){
                        repeat(true);
                        return false;
                    });
                }
            }

            if (params.height == null)
                params.height = 'auto';

            if (params.width == null)
                params.width = 'auto';

            if ($(selector).dialog('isOpen')) return;

            // Cache implement
            if ($(selector).html() != '' && params.cache != null && params.cache) {
                if (isAutoOpen) {
                    $(selector).dialog('open');
                    $(selector).dialog('option', 'width', $(selector).width());
                    if (window.wotUpdateDateTimeFields) wotUpdateDateTimeFields();
                }
            } else{
                repeat();
            }
        } else {
            var dialog = $(selector).dialog(params);

            var title = $('.js-dialog-title', dialog);
            if (title.length > 0) dialog.dialog('option', 'title', title.text());
        }

        if (params.title != null && typeof(params.title) == 'boolean') {
            if (!params.title){
                $('.ui-dialog-titlebar', $(selector).parent()).css('display', 'none');
            }
            params.title = '';
        }
    };
    return obj;
})($)

wgsdk._messageBoxDialogCounter = 0;
wgsdk.message_box = (function($){
    var obj = function(title, text, buttons, params) {
        params = params || {};

        var id = 'js-message-box-dialog-' + wgsdk._messageBoxDialogCounter;
        var selector = '#' + id;

        title = title || '';

        ++wgsdk._messageBoxDialogCounter;

        var html = '<p style="padding-top:10px; padding-bottom:10px;">' + text + '</p>';
        if (params.warning){
            // html = '<div class="b-form-message-warning"><div class="wrapper"><p>' + text + '</p></div></div>';
            html = '<div class="b-message-warning">' + text + '</div>';
        }
        else {
            if (params.simple){
                html = '<h4>' + text + '</h4>';
            } else {
                html = '<div class="b-message-info">' + text + '</div>';
            }
        }

        var dialog_params = {
            'autoOpen': true,
            'resizable': false,
            'minWidth': 450,
            'minHeight': 'auto',
            'modal': true,
            'dialogClass': 'js-message-box',
            'buttons': []
        };

        if (title) dialog_params.title = title;
        if (typeof(params.autoOpen)) dialog_params.autoOpen = params.autoOpen;

        if (buttons.confirm) {
            dialog_params.buttons.push({
                text: typeof(buttons.confirm) === 'string' ? buttons.confirm : buttons.confirm.text,
                'class': (buttons.confirm['class'] ? buttons.confirm['class'] : 'b-button-confirm'),
                click: function(e){
                    if (buttons.confirm.click) buttons.confirm.click(e);
                    e.preventDefault();
                    $(selector).dialog('close');
                }
            });
        }
        if (buttons.cancel) {
            dialog_params.buttons.push({
                text: typeof(buttons.cancel) === 'string' ? buttons.cancel : buttons.cancel.text,
                'class': (buttons.cancel['class'] ? buttons.cancel['class'] : 'b-button-cancel') ,
                click: function(e){
                    if (buttons.cancel.click) buttons.cancel.click(e);
                    e.preventDefault();
                    $(selector).dialog('close');
                }
            });
        }

        $('<div id="' + id + '"></div>').appendTo('body');
        $(selector).html(html);
        wgsdk.dialog(id, dialog_params);
        return id;
    }
    return obj;
})($)


wgsdk._errorDialogCounter = 0;
wgsdk.error = (function($){
    var obj = function(text, repeat, request, params) {
        var id = 'error-dialog-' + wgsdk._errorDialogCounter;
        var selector = '#' + id;
        var title = translate('DIALOG_ERROR');

        if (params && params.title) {
            title = params.title;
        }

        if (typeof(repeat) == 'object') {
            request = repeat.request;
            repeat  = repeat.repeat;
        }

        try {
            if (wgsdk.dev && request) {
                text += ((request.statusText != null) ? request.statusText : 'ERROR') + ' (' + request.status + ')';
            }
        }
        catch(er) {
            request = null;
        }

        ++wgsdk._errorDialogCounter;

        var html = '<div class="old-message-error">' + text + '</div>';

        if ($(selector).length == 0) {
            $('<div id="' + id + '"></div>').appendTo('body');

            var buttons = [];

            buttons.push({
                'text': translate('DIALOG_CLOSE_BUTTON'),
                'class': 'b-button-confirm',
                'click': function() {
                    $(this).dialog("destroy");
                    $(selector).remove();
                }
            });

            if (wgsdk.dev && request) {
                buttons.push({
                    'text': translate('DIALOG_INFORMATION_BUTTON'),
                    'class': 'b-button-info',
                    'click': function(e){
                        wgsdk.dev._debugErrorHandler(request);
                        return false;
                    }
                });
            }

            if (repeat != null) {
                buttons.push({
                    text: translate('DIALOG_REPEATE_BUTTON'),
                    'class': 'b-button-repeat',
                    click: function(e){
                        repeat();
                        $(this).dialog("destroy");
                        $(selector).remove();
                    }

                });
            }

            wgsdk.dialog(id, {
                'autoOpen': false,
                'title': title,
                'resizable': false,
                'modal': true,
                'minWidth': 400,
                'dialogClass': 'alert',
                'minHeight': 'auto',
                'buttons': buttons
            });
        }

        $(selector).html(html);
        wgsdk.dialog(id, 'open');
        if (window.wotUpdateDateTimeFields) wotUpdateDateTimeFields();
    };
    return obj
})($)


wgsdk._waitingDialogCounter = 0;
wgsdk._waitingDialogLockStartTime = 0;
wgsdk.waiting = (function($){
    var obj = function(mode, params) {
        var id = 'wait-dialog';
        var selector = '#' + id;

        var MINIMUM_LOCK_DELAY = 750; //to prevent flashing

        if (params == null)
            params = {};

        var lock_window = $(selector);
        if (lock_window.length == 0) {
            lock_window = $('<div id="' + id + '">').appendTo('body');
            lock_window.html('<div class="old-waiting"></div>');

            wgsdk.dialog(id, {
                modal: true,
                autoOpen: false,
                title: false,
                width: 'auto',
                height: 'auto',
                resizable: false,
                minHeight: 10,
                closeOnEscape: false,
                dialogClass: 'old-waiting-dialog'
            });
        }

        if (mode == 'close') {
            --wgsdk._waitingDialogCounter;

            if (wgsdk._waitingDialogCounter == 0) {
                var date = new Date();
                var curTime = date.getTime();
                var minCloseTime = wgsdk._waitingDialogLockStartTime + MINIMUM_LOCK_DELAY;

                if ( minCloseTime <= curTime || params.force) {
                    wgsdk.dialog(id, 'destroy');
                }
                else {
                    ++wgsdk._waitingDialogCounter;
                    window.setTimeout(function() { wgsdk.waiting('close'); }, minCloseTime - curTime);
                }
            }
            else {
                if (wgsdk._waitingDialogCounter < 0) {
                    wgsdk._waitingDialogCounter = 0;
                }
            }
            $('.registration_form input[type=text]:first').focus();
        }

        if (mode == 'open') {
            wgsdk.dialog(id, 'open');

            if (wgsdk._waitingDialogCounter === 0) {
                var date = new Date();
                wgsdk._waitingDialogLockStartTime = date.getTime();
                delete date;
            }
            ++wgsdk._waitingDialogCounter;
        }
    }
    return obj
})($)

wgsdk._validateInsertData = (function($){
    var obj = function(selector, data, repeat, request){
        var result = true;

        var s = $(selector);

        s.hide();
        s.html(data);

        if (data == '')
        {
            wgsdk.error(translate('DIALOG_EMPTY_SERVER_RESPONSE'), repeat);
            result = false;
        }
        else if ($('.js-dialog-content', s).length == 0)
        {
            s.html('');
            result = false;
            var responceType = request.getResponseHeader("content-type");
            var jsonResponce = responceType.indexOf('application/x-javascript') != -1 || responceType.indexOf('application/json') != -1;

            if (jsonResponce  && window.JSON) {
                var errorData = JSON.parse(data);
                if (errorData.status === 'error') {
                    wgsdk.error(errorData.error);
                }
                else {
                    wgsdk.error(translate('DIALOG_WRONG_SERVER_RESPONSE'), repeat, request);
                }
            }
            else {
                wgsdk.error(translate('DIALOG_WRONG_DATA_TYPE'), repeat, request);
            }
        }
        else
        {
            var content = $('.js-dialog-content', s).detach();

            if ( $('.ui-dialog-buttonpane', s).length > 0 ) {
                var buttons = $('.ui-dialog-buttonpane', s).detach();
                $('.ui-dialog-buttonpane', s.parent()).remove();
                s.parent().append(buttons);
            }

            s.html('');
            s.append(content);
        }

        s.show();
        return result;
    }
    return obj
})($)


}
/*
     FILE ARCHIVED ON 06:48:37 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:20 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.132
  PetaboxLoader3.resolve: 220.291 (4)
  RedisCDXSource: 0.679
  esindex: 0.01
  CDXLines.iter: 25.786 (3)
  load_resource: 317.747 (2)
  captures_list: 234.436
  PetaboxLoader3.datanode: 87.667 (5)
  exclusion.robots: 0.142
  LoadShardBlock: 205.169 (3)
*/