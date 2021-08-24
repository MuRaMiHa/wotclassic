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

wgsdk.showFormFieldError = (function($) {
    var obj = function(form_id) {
        $('input[type=password], input[type=text]', form_id).each(function(){
            var fieldset = $(this).parents('fieldset');
            if ($('.b-error-text', fieldset).length > 0){
                fieldset.removeClass('accept').addClass('decline');
                $('.b-decline', fieldset).css({'display': 'none'});
            }
        })
    };
    return obj;
})($);


wgsdk.InputLengthValidator = (function($){
    var obj = function (inputSelector, params) {
        params = params || {};
        var minValue = params.min;
        var maxValue = params.max;
        var required = params.required;
        var requiredErrorMsg = params.requiredErrorMsg || translate('FORMS_VALIDATION_EMPTY_FIELD_ERROR');
        var minLengthErrorMsg = params.minLengthErrorMsg || translate('FORMS_VALIDATION_MIN_LENGTH_ERROR');
        var maxLengthErrorMsg = params.maxLengthErrorMsg || translate('FORMS_VALIDATION_MAX_LENGTH_ERROR');

        minValue = minValue !== undefined ? minValue : -1;
        maxValue = maxValue !== undefined ? maxValue : $(inputSelector).attr('maxlength');

        return function(value) {
            var length = value.length;
            var empty = length == 0;

            if (required && empty) {
                return {'status': 'error',
                        'error': requiredErrorMsg};
            }

            if (!empty && length < minValue)
                return {'status': 'error',
                        'error': minLengthErrorMsg};

            if (maxValue && maxValue > 0) {
                if (length > maxValue)
                    return {'status': 'error',
                            'error': maxLengthErrorMsg};
            }

            return {'status': 'ok'};
        };
    }
    return obj;
})($)


wgsdk.InputWatcher = (function($) {

    var obj = function($selector, preprocessor, onChange, postprocessor, events) {
        var instance = this,
            defaultEvents = 'input.iw propertychange.iw change.iw forceCheck.iw';

        if (typeof(events) !== 'string' || events.length === 0) {
            events = defaultEvents;
        }
        
        this.oldValue = '';
        this.$selector = $selector;

        // public interfaces
        this.getValue = function() {
            return this.$selector.val();
        };
        this.setValue = function(value, apply) {
            if (typeof postprocessor === 'function') {
                value = postprocessor(value, apply, this.oldValue);
            }
            this.$selector.val(value);
            if (apply) {
                instance.oldValue = value;
            }
        };
        this.restoreValue = function() {
            this.setValue(instance.oldValue, false);
        };
        this.destroy = function() {
            this.$selector.off('.iw');
        };
        this.processChange = function(e) {
            var value = instance.getValue(), v;

            if (preprocessor) {
                v = preprocessor(value);
                if (v != value) {
                    instance.setValue(v, false);
                    value = instance.getValue();
                }
            }
            if (value != instance.oldValue || e.type === 'forceCheck') {
                if (onChange) {
                    onChange(value, instance.oldValue);
                }
                instance.oldValue = value;
            }
        };
        this.stopWatch = function() {
            this.$selector.off(events);
        };
        this.startWatch = function() {
            this.$selector.on(events, this.processChange);
        };

        this.startWatch();
    }

    return obj;
})($);


wgsdk.removeError = (function($){
    var obj = function(selector){
        var fieldset = $(selector).parents('fieldset');
        $('.b-error', fieldset).remove();
        $('.b-decline, .b-accept, .b-verification', fieldset).removeAttr('style');
    };
    return obj
})($)

wgsdk.AjaxFetcher = (function($){

    var obj = function (defAjaxSettings, requestStarted, requestFinished, delay){
        var instance = this;
        var curAjax;
        var curAjaxTimer;

        function onError(XMLHttpRequest, textStatus, errorThrown){
            requestFinished(null);
            instance.cleanRequest();
        }
        function onSuccess(data, textStatus, XMLHttpRequest){
            requestFinished(data);
            instance.cleanRequest();
        }

        this.sendRequest = function(data, instant){
            instance.cancelRequest();

            var settings = {    'dataType': 'json',
                                'success': onSuccess,
                                'error': onError};

            $.extend(true, settings, defAjaxSettings, {'data': data});

            function sendIt(){
                if(requestStarted)
                    requestStarted(settings);

                curAjax = $.ajax(settings);
            }
            if( !instant && delay && (delay > 0))
                curAjaxTimer = window.setTimeout(sendIt, delay);
            else
                sendIt();
        };

        this.cancelRequest = function(){
            if(curAjax || curAjaxTimer)
                onError();  //   cleanRequest is called from it
        };
        this.cleanRequest = function(){
            if(curAjaxTimer){
                window.clearTimeout(curAjaxTimer);
                curAjaxTimer = null;
            }

            if(curAjax){
                curAjax.abort();
                curAjax = null;
            }
        };
    }
    return obj;

})($)

wgsdk.NoAjaxFetcher = (function ($){
    var obj = function(getDataCallback, requestStarted, requestFinished){
        this.sendRequest = function(data, instant){
            requestFinished(getDataCallback(data));
        };

        this.cancelRequest = function(){
            requestFinished(null);
        };
    }
    return obj
})($)




wgsdk.forms = (function($){
    var obj = {

        auth: function(params) {
            var RELOGIN_FORM_URL = window.RELOGIN_FORM_URL ? window.RELOGIN_FORM_URL : "should be defined like global workspace";
            var submit_params = {
                success: function() {
                    // here we have guaranties from the server, that there will be no 600 error
                    // (since relogin has successed), so we can close dialog
                    params.success();
                    $('#js-relogin-form-wrapper').dialog('close');
                },
                iframeProxy: true
            };
            var ext_params = { source: RELOGIN_FORM_URL,
                            OnReady: function(dialog) {
                                $('.js-cancel-button', dialog).click(function(){
                                    if(params.OnCancel) {
                                        params.OnCancel();
                                    }
                                });
                            } };

            wgsdk.forms.submit_from_popup(false, '#js-relogin-form', '#js-relogin-form-wrapper', submit_params, ext_params);
        },

        auth_dialog: function() {
            var LOGIN_FORM_URL = window.LOGIN_FORM_URL ? window.LOGIN_FORM_URL : 'should be defined in global namespace';
            var submit_params = {
                success: function(data) {
                    if (data && data.redirect_to) {
                        location.href = data.redirect_to;
                    }
                    else {
                        setTimeout(function() {
                            location.reload();
                        }, 100);
                    }
                },
                error: function(data) {
                    if(data.enable_captcha){
                        window.wotCaptcha.Enable();
                        $('.fieldset_captcha').show();
                    }
                    wgsdk.waiting('close');
                },
                iframeProxy: true
            };
            var ext_params = {
                source: LOGIN_FORM_URL,
                stayOpened: true,
                OnSubmitCallback: function() {
                    wgsdk.waiting('open');
                }
            };

            wgsdk.forms.submit_from_popup(false, '#js-auth-popup-form', '#js-auth-popup-dialog', submit_params, ext_params);
        },

        post: function(params) {

            wgsdk.waiting('open');

            $.ajax({
                type: 'post',
                data: params.data || {},
                url:  params.url,
                dataType: 'json',
                success: function(data, status, request) {
                    if (!data) {
                        wgsdk.error(translate('FORMS_UNKNOWN_ERROR'));
                        return;
                    }

                    if (data.error_code == 600) {
                        wgsdk.forms.auth({ success: function() {wgsdk.forms.post(params); } });
                        return;
                    }

                    if (data.status == 'redirect') {
                        if (data.redirect_url) {
                            location.href = data.redirect_url;
                        }
                        return;
                    }

                    if (data.error) {
                        wgsdk.error(data.error);
                        return;
                    }

                    if (params.success_replace) {
                        $(params.success_replace.hide, selector).hide();
                        $(params.success_replace.show, selector).show();
                    }
                    if (params.success_add_text) {
                        wgsdk.forms.add_text_to_element(params.success_add_text.selector, params.success_add_text.params);
                    }

                    if (params.success) params.success(data, status, request);
                },
                error:  params.error || function(request, text, errorThrown) {
                    if (wgsdk.dev != null) {
                        wgsdk.dev.ajax_default_error_handler(request, text, errorThrown);
                    } else {
                        wgsdk.error(translate('FORMS_UNKNOWN_ERROR'));
                        return;
                    }
                },
                complete: function() {
                    wgsdk.waiting('close');
                    if (params.complete) params.complete();
                    wotUpdateDateTimeFields();
                }
            });
        },

        hide_errors: function (form_selector) {
            $(form_selector).removeClass('b-error-on-form');
            $('.b-message-error-text', form_selector).empty();

            $('.b-error-on-form-field', form_selector).removeClass('b-error-on-form-field');
            $('.b-error-text', form_selector).empty();
        },

        clear_inputs: function(form_selector) {
            $('input[type="password"]', form_selector).val('');
            $('input[type="text"]', form_selector).val('');
        },

        get_next_iframe_number: function(){
            if (!wgsdk.forms.__iframe_number) {
                wgsdk.forms.__iframe_number = 0;
            }
            return ++wgsdk.forms.__iframe_number;
        },

        submit: function(selector, params) {
            params = params || {};
            params.after_error = 'after_error' in params ? params.after_error : 'focus';
            var form = $(selector);

            var MAX_PROCESSING_TIME = 10;
            if (window.PENDING_OPERATION_JAVASCRIPT_TIMEOUT) {
                MAX_PROCESSING_TIME = window.PENDING_OPERATION_JAVASCRIPT_TIMEOUT;
            }

            var processingStartTime = undefined;

            var onFormErrorHandler = params.onFormError || wgsdk.forms.submit_onFormError;
            var onFormError = function(error_message) {
                onFormErrorHandler(form, error_message);
            };

            var onFieldErrorHandler = params.onFieldError || wgsdk.forms.submit_onFieldError;
            var onFieldError = function(element_id, error_message) {
                onFieldErrorHandler(element_id, form, error_message);
            };

            function set_focus(wrapper){
                window.setTimeout(function(e){
                    wgsdk.set_focus(wrapper);
                }, 1000);
            }

            var processing = false;

            var OnSuccess = function(data, status, request) {
                processing = false;

                wgsdk.forms.hide_errors(form);
                if (!data) {
                    wgsdk.error(translate('FORMS_UNKNOWN_ERROR'));
                    return;
                }

                if (data.status === 'ok') {
                    if (params.success) params.success(data, status, request);

                    if (params.success_replace) {
                        $(params.success_replace.hide, selector).hide();
                        $(params.success_replace.show, selector).show();
                    }

                    if (params.success_add_text) {
                        if (params.success_add_text.params.from_server) {
                            params.success_add_text.params.text = data.log_message;
                        }

                        wgsdk.forms.add_text_to_element(params.success_add_text.selector,
                                                    params.success_add_text.params);
                    }

                    if (data.success_url) location.href=data.success_url;
                    if (params.success_url) location.href=params.success_url;

                    return;
                }

                if (data.status === 'warning') {
                    if (params.warning) params.warning(data, status, request);
                    return;
                }

                if (data.status === 'processing') {

                    var date = new Date();
                    if (processingStartTime === undefined) {
                        processingStartTime = date.getTime();
                    }

                    if (date.getTime() - processingStartTime < MAX_PROCESSING_TIME * 1000) {

                        processing = true;

                        setTimeout(function() {
                            $.ajax({
                                type: 'get',
                                url:  data.status_url,
                                dataType: 'json',
                                success: OnSuccess,
                                error: OnError,
                                complete: OnComplete,
                                cache: false
                            });
                        }, 1000);

                        return;
                    }

                    if ('onTimeout' in params) {
                        params.onTimeout(form);
                    }

                    if ('stop_url' in data && data['stop_url']) {
                        // stop processing
                        $.ajax({ type: 'post',
                                    url:  data.stop_url,
                                    dataType: 'json'
                                    });
                    }

                    // form error data
                    data.status = 'error';
                    data.error = translate('FORMS_TIMEOUT');
                }

                if (data.status === 'redirect') {
                    if (data.redirect_url) {
                        location.href = data.redirect_url;
                    }
                    return;
                }

                if (data.status == 'error')
                {
                    if (data.error_type == 'admin_error'){
                        alert(data.errors['__all__']);
                    }

                    if (window.wotCaptcha) {
                        wotCaptcha.Reload();
                    }

                    if (data.error_code == 600) {
                        wgsdk.forms.auth({ success: function() {form.submit();},
                                        OnCancel: function() {
                                            onFormError(translate('FORMS_AUTH_NOT_CONFIRMED'));
                                        }
                                    });
                        return;
                    }

                    if (data.error_code == 413) {
                        data.error = translate('FORMS_ERROR_413');
                        if (data.data.size_limit) {
                            var limit = data.data.size_limit;
                            var size = '' + limit + ' b';
                            if (limit > 1024) {
                                limit = limit / 1024;
                                size = limit.toFixed(2) + ' Kb';
                            }
                            if (limit > 1024) {
                                limit = limit / 1024;
                                size = limit.toFixed(2) + ' Mb';
                            }
                            data.error = translate('FORMS_ERROR_413_WITH_LIMIT').replace('%(size)i', size);
                        }
                    }

                    if (data.errors && data.errors.__all__ && data.errors.__all__.length > 0)
                        onFormError(data.errors.__all__[0]);
                    if (data.error && data.error.length > 0)
                        onFormError(data.error);

                    if (data.errors)
                        for (var field in data.errors)
                            if (field != '__all__' && data.errors[field] && data.errors[field].length > 0) {
                                var prefix = data.form_prefix? data.form_prefix + "-" : "";
                                onFieldError('id_'+prefix+field, data.errors[field][0]);
                            }
                }
                else
                {
                    onFormError(translate('FORMS_UNKNOWN_ERROR'));
                }

                if (params.error_replace) {
                    $(params.error_replace.hide, selector).hide();
                    $(params.error_replace.show, selector).show();
                }

                if (params.success_add_text && params.success_add_text.params.from_server) {
                    wgsdk.forms.add_text_to_element(params.success_add_text.selector,
                                                {clear: true});
                }

                if (params.error) params.error(data);

                if (params.after_error == 'focus') set_focus(form);

            };

            var OnError = function(request, text, errorThrown) {
                wgsdk.forms.hide_errors(form);
                onFormError(translate('FORMS_SERVER_UNAVAILABLE'));

                if (window.wotCaptcha) {
                    wotCaptcha.Reload();
                }

                if (params.error) params.error();

                if (window.ajax_default_error_handler != null){
                    window.ajax_default_error_handler(request, text, errorThrown);
                }

                if (params.after_error == 'focus') set_focus(form);
            };

            var OnComplete = function() {
                if (!processing) {
                    wgsdk.waiting('close');
                    wotUpdateDateTimeFields();
                }
            };

            wgsdk.waiting('open');

            var target = form.attr('target');
            if (target) {
                var iframe_number = wgsdk.forms.get_next_iframe_number();
                var iframe_id = target+'-'+iframe_number;
                var iframe = $('<iframe id="'+iframe_id+'" name="'+iframe_id+'" style="display:none;"></iframe>');
                iframe.appendTo($('body'));

                form.attr('target', iframe_id);

                if (params.action) {
                    form.attr('action', params.action);
                }

                function ProcessIframeAnswer(dataString, params) {
                    params = params || {};

                    var data = undefined;
                    var status = 'success';
                    var request = {
                        status: 200,
                        statusText: 'iframe fake status'
                    };
                    try {
                        var text = dataString;
                        if (!text) return;
                        data = JSON.parse(text);
                    }
                    catch(err) {
                        status = 'error';
                        request.status = 404;
                        OnError(request, status, translate('FORMS_WRONG_SERVER_ANSWER'));
                        OnComplete();
                    }
                    if (data) {
                        OnSuccess(data, status, request);
                        OnComplete();
                    }

                    if (params.OnComplete) params.OnComplete();

                    iframe.remove();
                }

                if (params.iframeProxy) {
                    var IFRAME_PROXY = window.IFRAME_PROXY ? window.IFRAME_PROXY : "should be defined in global workspace";
                    var proxy = new Porthole.WindowProxy(IFRAME_PROXY, iframe_id);
                    Porthole.proxies[proxy.proxyIFrameName] = proxy;

                    var EventListener = undefined;

                    EventListener = function(messageEvent) {
                        ProcessIframeAnswer(messageEvent.data,
                                            {OnComplete: function(){
                                                proxy.removeEventListener(EventListener);
                                                delete Porthole.proxies[iframe_id];
                                            } } );
                    };
                    proxy.addEventListener(EventListener);
                }
                else {

                    iframe.load(function(e){
                        var dataString = '';
                        if($('#json_data', iframe.contents()).length){
                            dataString = $('#json_data', iframe.contents()).text();
                        }else{
                            dataString = $('body', iframe.contents()).text();
                        }
                        ProcessIframeAnswer(dataString);
                    });
                }

                return false;
            }
            else {
                var ext_data = params.ext_data || [];

                if (typeof ext_data === 'function') {
                    ext_data = ext_data(selector, params);
                }

                var data = form.serializeArray();

                $.ajax({ type: 'post',
                        url:  params.action || form.attr('action'),
                        data: data.concat(ext_data),
                        dataType: 'json',
                        success: OnSuccess,
                        error: OnError,
                        complete: OnComplete
                    });
                return true;
            }
        },

        submit_onFormError: function(form, error_message) {
            var block = $('.b-message-error', form);
            if (!block.length) {
                block = $('<div class="b-message-error b-message-error__none" />').prependTo(form);
            }

            var text = $('.b-message-error-text', block);
            if (!text.length) {
                text = $('<div class="b-message-error-text" />').prependTo(block);
            }

            text.html(error_message);
            block.parents('form').addClass('b-error-on-form');
        },

        submit_onFieldError: function(element_id, form, error_message) {
            var field = $('#' + element_id, form);
            if (!field.length) {
                wgsdk.forms.submit_onFormError(form, element_id + ': ' + error_message);
                return;
            }

            //trying to find elements for display error message
            var block = false;
            var owner = field.parent();
            for (var i = 0; i < 2; ++i) {
                block = $('.b-error', owner);
                if (block.length > 0) break;

                owner = owner.parent();
            }

            if (!block.length) {
                block = $('<div class="b-error" />');
                var tinymce_object = field.parent().find('#'+element_id+'_parent');
                // If error for WYSIWYG TinyMCE editor field - display error under editor field
                if( tinymce_object.length){
                    tinymce_object.after(block);
                }else{
                    field.after(block);
                }
            }

            var arrow = $('.arrow', block);
            if (!arrow.length) {
                arrow = $('<div class="arrow png"><!-- --></div>').appendTo(block);
            }

            var text = $('.b-error-text', block);
            if (!text.length) {
                text = $('<div class="b-error-text" />').appendTo(block);
            }

            text.html(error_message);
            block.parents('fieldset').addClass('b-error-on-form-field');
        },

        /*
            selector,
            params:
                text,
                clear, | boolean
        */
        add_text_to_element: function(selector, params) {
            var element = $(selector);
            if (params.clear && params.clear==true)  element.html('');
            if (params.text) element.html((element.html() != "" ? element.html() + '<br />' : '') + params.text);
        },


        // initialized dialogs on all popup_selector-s
        // wrap submit function - open modal popup with form to wich connected wgsdk.forms.submit
        // add some wrappers to submit callbacks (success, error)
        // get all parameters which are available in submit
        // ext parameters:
        // - OnOpenCallback = function (popup_selector, form_selector, submit_params, ext_params)
        // - OnCloseCallback = function (popup_selector, form_selector, submit_params, ext_params)
        // - source - selector or url of the popup
        submit_from_popup: function(popup_selector, form_selector, dialog_id, submit_params, ext_params) {


            var src = '';
            if (ext_params.source) {
                src = ext_params.source;
            }

            var OnClosed = function (e ,ui) {
                var dialog = $(dialog_id);
                var form = $(form_selector, dialog);
                if (ext_params.OnCloseCallback) {
                    ext_params.OnCloseCallback(popup_selector, form_selector, submit_params, ext_params);
                }
                form.unbind();
            };


            var OnReady = function(e, ui) {

                var dialog = $(dialog_id);

                var success = submit_params.success;

                var OnSuccess = function(data, textStatus, XmlHttpRequest) {
                    if (success) { success(data, textStatus, XmlHttpRequest); }

                    if (!ext_params.stayOpened) {
                        dialog.dialog('close');
                    }
                };

                submit_params.success = OnSuccess;

                var form = $(form_selector, dialog);

                if (ext_params.OnOpenCallback) {
                    ext_params.OnOpenCallback(popup_selector, form_selector, submit_params, ext_params);
                }

                wgsdk.forms.init_countables();

                wgsdk.set_focus(dialog);

                form.submit(function (e){
                    if (ext_params.OnSubmitCallback)
                        ext_params.OnSubmitCallback();

                    if (wgsdk.forms.submit(form_selector, submit_params)) {
                        e.preventDefault();
                    }
                });

                dialog.dialog( "option", "position", 'center' );

                if (ext_params.OnReady) {
                    ext_params.OnReady(dialog);
                }
                if ($('.js-step').length) {
                    var IE='\v'=='v';
                    var stepWrap = $(this);
                    if(IE) {
                    setTimeout(function() {
                        wgsdk.step(stepWrap);
                    }, 100);
                    } else {
                        wgsdk.step($(this));
                    }
                }
            };

            var dialog_params = {
                modal: true,
                open: OnReady,
                close: OnClosed,
                type: ext_params.type || "get",
                resizable: false
            };
            if(typeof(ext_params.autoOpen)) dialog_params.autoOpen = ext_params.autoOpen;

            var ShowDialog = function(e){
                //TODO: move to OnReady?
                try {
                    //since src can be an url instead of selector
                    $(src).removeClass('js-hidden');
                }
                catch(err){}

                if (src) {
                    if (typeof ext_params.source === 'function') {
                        dialog_params.url = src();
                    }
                    else {
                        dialog_params.url = src;
                    }
                }

                if (typeof ext_params.buttons !== 'undefined') {
                    dialog_params.buttons = ext_params.buttons;
                }

                if (ext_params.data) {
                    if (typeof ext_params.data === 'function') {
                        dialog_params.ext_data = ext_params.data();
                    }
                    else {
                        dialog_params.ext_data = ext_params.data;
                    }
                }

                wgsdk.dialog(dialog_id, dialog_params);

                if (e) e.preventDefault();
            }

            if (popup_selector) {
                $(popup_selector).click(ShowDialog);
            }
            else {
                ShowDialog();
            }

        },

        init_countables: function() {

            $(".js-countable-input").add(".js-countable-field input[type=text]").add(".js-countable-field textarea").each( function(idx, field) {
                $(field).closest(".js-countable-field").removeClass('js-countable-field');
                $(field).closest(".js-countable-input").removeClass('js-countable-input');

                var fieldset = $(field).closest('fieldset');
                if (fieldset.length != 1) { alert('js-countable: fieldset not found'); return; }

                var max_value_el = $('.js-countable-max-value', fieldset);
                if (max_value_el.length != 1) { alert('js-countable: max-value not specified'); return; }

                var focusInColor = max_value_el.data('focusinColor'),
                    focusOutColor = max_value_el.data('focusoutColor'),
                    zeroNumColor = max_value_el.data('zeronumColor'),
                    defaultColor = max_value_el.css('color'),
                    isFocusColorsAvailable = (focusInColor !== undefined && focusOutColor !== undefined);

                var addFocusInOutEvents = function (counter) {
                    if (isFocusColorsAvailable) {
                        var input = $('input', counter.closest('fieldset'));

                        input.focusout(function() {
                            if (counter.text() !== "0") {
                                counter.css('color', focusOutColor);
                            }
                        });

                        input.focusin(function() {
                            if (counter.text() !== "0") {
                                counter.css('color', focusInColor);
                            }
                        });
                   }
                };

                var handleCounterColor = function (counter) {
                    if (counter.text() === "0" && zeroNumColor !== undefined) {
                        counter.css('color', zeroNumColor);
                    } else {
                        if (isFocusColorsAvailable) {
                            if ($('input', counter.closest('fieldset')).is(":focus")) {
                                counter.css('color', focusInColor);
                            } else {
                                counter.css('color', focusOutColor);
                            }
                        } else {
                            counter.css('color', defaultColor);
                        }
                    }
                }

                var max_value = parseInt(max_value_el.text());
                $(field).attr('maxlength', max_value);
                max_value_el.text(wgsdk.thousands(max_value));
                
                var curr_number = $('.b-informer .number', fieldset);
                if (curr_number.length != 1) { fieldset.append('<span class="number"></span>'); }

                var onPress = function(e) {
                    var isCharacterKeyPress = function(evt) {
                        if (typeof evt.which == "undefined") {
                            // This is IE, which only fires keypress events for printable keys
                            return true;
                        } else if (typeof evt.which == "number" && evt.which > 0) {
                            // In other browsers except old versions of WebKit, evt.which is
                            // only greater than zero if the keypress is a printable key.
                            // We need to filter out backspace and ctrl/alt/meta key combinations
                            return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
                        }
                        return false;
                    };
                    var value = $(field).val();
                    if (!isCharacterKeyPress(e)) {
                        return true;
                    }

                    if (wgsdk.forms.calc_textarea_real_length(value) >= max_value) {
                        /* Allow user to change selected part of text, even if input value length equals maximum length */
                        if ('selectionStart' in this) { /* IE9+ */
                            if (this.selectionStart !== this.selectionEnd) {
                                return true;
                            }
                        } else if (document.selection.createRange) { /* IE7/8 */
                            if (document.selection.createRange().text !== '') {
                                return true;
                            }
                        }
                        return false;
                    }
                    return true;
                };
                var onChange = function(e){
                    var value = $(field).val();
                    if (wgsdk.forms.calc_textarea_real_length(value) > max_value) {
                        value = value.substring(0, max_value);
                        $(field).val(value);
                    }
                    curr_number.text( wgsdk.thousands(max_value - wgsdk.forms.calc_textarea_real_length($(field).val()) ));
                    handleCounterColor(curr_number);
                };
                $(field).change(onChange);
                $(field).keyup(onChange);
                $(field).keypress(onPress);
                addFocusInOutEvents(max_value_el);
                onChange();
            })
        },

        calc_textarea_real_length: function(str) {
            /* function find in passed string all newline symbols and redouble it when calculate the number of symbols.
            * use when need to calc the length of string before sending to server.
            * pass params: str - string,
            * return: number - the patched length. */
            return (typeof str === 'string' || str instanceof String) ? str.replace(/\r?\n/gm, "\r\n").length : 0;
        }
    }
    return obj;
})($)


$.extend(wgsdk.forms,{
    /* returned value from static/ajax validator shoud be in form:
     * {'status': 'ok'|'error',
     *  'error': 'Optional error description',
     *  'text': 'Optional success text'}
    */
    validate_input: function(input_selector, options) {
        var defaults = {
            'preprocessor': null,
            'postprocessor': null,
            'validator': null,
            'ajaxValidator': null,
            'ajaxDelay': 0,
            'ignoreAccept': false,
            'onStateChange': null,
            'events': null,
            'initValue': undefined
        };

        options = $.extend({}, defaults, options);

        var input = $(input_selector);
        var fieldset = input.parents('fieldset:first');
        var accept = $('.b-accept', fieldset);
        var decline = $('.b-decline', fieldset);

        var context = {
            'input': input,
            'fieldset': fieldset
        };

        var ON_BLUR_DELAY = 200;
        var ON_SET_BLUR_CALLBACK_DELAY = 125;

        var onStateChange = options.onStateChange || function(){};
        var setState = function(states) {
            fieldset.addClass(states);
            onStateChange(context);
        };
        var clearState = function(states) {
            fieldset.removeClass(states || 'decline accept verification');
            onStateChange(context);
        };
        var hasAnyOfStates = function(states) {
            states = states.split(' ');
            for (var i in states) {
                var state = states[i];
                if (state && fieldset.hasClass(state))
                    return true;
            }

            return false;
        };

        function cleanResult(){
            clearState();
            accept.text('');
            decline.text('');
        }
        function isFailed(res){
            return (!res.status || (res.status=='error'));
        }
        function processResult(res){
            function set_text(el, text){
                if(text)
                    el.html(text);
                else
                    el.html('&nbsp;');
            }
            cleanResult();
            if(isFailed(res)){
                setState('decline');
                set_text(decline, res.error);
                return false;
            }

            if (!options.ignoreAccept) {
                setState('accept');
                set_text(accept, res.text);
            }
            return true;
        }

        function inputEqualInitialValue(value) {
            if (options.initValue !== undefined) {
                return options.initValue === value;
            } else {
                return false;
            }
        }

        function Validate(value, validateStatic, validateAjax, instant){
            var isInputEqualInitialValue = inputEqualInitialValue(value);

            if(validateStatic && options.validator && !isInputEqualInitialValue){
                var res = options.validator(value);

                // we'd like to cancel request before updating ui,
                // cause it can clean our changes through callback
                var failed = isFailed(res);
                if(failed)
                    fetcher.cancelRequest();

                processResult(res);

                if(failed)
                    return; // already failed. do not need ajax
            }
            if(validateAjax && options.ajaxValidator && !isInputEqualInitialValue){
                clearState('accept'); // not yet
                fetcher.sendRequest({'value': value}, instant);
            }

            if (isInputEqualInitialValue) {
                cleanResult();
            }
        }

        function onChange(value, old_value){
            if(value.length){
                Validate(value, true, true, false);
            } else{
                cleanResult();
                fetcher.cancelRequest();
            }
        }
        function onRequestStarted(settings){
            cleanResult();
            setState('verification');
        }
        function onRequestFinished(data){
            cleanResult();
            if(data)
                processResult(data);
        }

        // wrap in setTimeout, since we sometimes move focus in form (see submit_from_popup) right before
        // this code is executed and it cause processing an unexpecred OnBlur event in IE
        setTimeout(function() {
            input.blur(function(event) {
                setTimeout(function() {
                    if (!hasAnyOfStates('accept decline verification')) {
                        var value = watcher.getValue();

                        // AJAX validation is pointless for empty values
                        var validateAjax = value != '';
                        Validate(value, true, validateAjax, true);
                    }
                }, ON_BLUR_DELAY);
            });
        }, ON_SET_BLUR_CALLBACK_DELAY);
     
        var watcher = new wgsdk.InputWatcher(input, options.preprocessor, onChange, options.postprocessor, options.events);
        var fetcher = new wgsdk.AjaxFetcher(options.ajaxValidator, onRequestStarted, onRequestFinished, options.ajaxDelay);
        var submitHandler = function(event){
            if (!hasAnyOfStates('accept error decline verification'))
                Validate(watcher.getValue(), true, false, true);

            if (hasAnyOfStates('error decline verification')) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };
        input.parents('form:first').submit(submitHandler);
        input.bind('remove', function(){
            $(this).parents('form:first').unbind('submit', submitHandler);
        });
    },

    validate_input_size: function(inputSelector, params) {
        this.validate_input(inputSelector, {'validator': wgsdk.InputLengthValidator(inputSelector, params)});
    }
});

wgsdk.forms.Forms  = (function(){
    var obj = {
        create: function(method, url, params, target) {
            var form = $('<form>')
                .attr('method', method)
                .attr('action', url);

            if (target) {
                form.attr('target', target);
            }

            $.each(params, function(key, value) {
                $('<input type="hidden">')
                    .attr('name', key)
                    .attr('value', value)
                    .appendTo(form);
            });

            form.appendTo('body');
            return form;
        },
        send: function(method, url, params, target) {
            var form = wgsdk.forms.Forms.create(method, url, params, target);
            form.submit();
        },
        sendGet: function(url, params, target) {
            return wgsdk.forms.Forms.send('GET', url, params, target);
        },
        sendPost: function(url, params, target) {
            return wgsdk.forms.Forms.send('POST', url, params, target);
        }
    };
    return obj;
})($);


wgsdk.autocomplete = (function($, wgsdk) {
    'use strict';

    var globalAutocompleteCounter = 0,
        KEY_BACKSPACE = 8,
        KEY_ENTER = 13,
        KEY_ESCAPE = 27,
        KEY_DOWN = 40,
        KEY_UP = 38,
        ON_BLUR_HIDE_TIMEOUT = 200,
        CONTAINER_SELECTOR = '.js-autocomplete-container';
        
    var module = function (inputSelector, url, options) {

        var autocompleteContainerId = 'js-autocomplete-container-' + (++globalAutocompleteCounter),
            defaults = {
                'autosubmit': false,   /* Submit form on click/enter */
                'minlength': 0,
                'preprocessor': function(value, prefix) {
                    value = $.trim(value);
                    prefix = $.trim(prefix);
                    var matchedSubstrIndex = value.toLowerCase().indexOf(prefix.toLowerCase());
                    value = value.substr(0, matchedSubstrIndex) + '<span class="b-autocomplete_match">'+value.substr(matchedSubstrIndex, prefix.length)+'</span>'+value.substr(matchedSubstrIndex+prefix.length);
                    return value;
                },  
                'zindex': null,
                'customWrapper': null,
                'postprocessor': null,
                'dataprocessor': null,  /* AJAX params processor before send */
                'changeCallback': null,
                'responseDataPreprocessor':null
            },
            $input, $lines, $wrapper, $wrapperContainer, $template, watcher, fetcher, searchValue, $form;
            
        options = $.extend({}, defaults, options);
        
        function getItemContainer() {
            if (options.customWrapper === null) {
                return $wrapper;
            } else {
                return $wrapperContainer;
            }
        }

        function updatePosition() {
            var inputOffset = $input.offset();

            $wrapper
                .outerWidth($input.outerWidth())
                .css({
                    'top' : inputOffset.top + $input.outerHeight(), 
                    'left': inputOffset.left
                });
        }

        function getSelected() {
            return $('.b-autocomplete_item__selected:first');
        }

        function hasScroll() {
            var $container = getItemContainer(),
                scrollHeight = $container[$.fn.prop ? 'prop' : 'attr']('scrollHeight');

            return $container.height() < scrollHeight;
        }

        function setSelected($sel) {
            getSelected().removeClass('b-autocomplete_item__selected');

            if ($sel && $sel.length > 0) {
                $sel.addClass('b-autocomplete_item__selected');

                if (hasScroll()) {
                    var $container = getItemContainer(),
                        offset = $sel.offset().top - $container.offset().top,
                        scroll = $container.scrollTop(),
                        elementHeight = $container.height();

                    if (offset < 0) {
                        $container.scrollTop(scroll + offset);
                    } else if (offset >= elementHeight) {
                        $container.scrollTop(scroll + offset - elementHeight + $sel.height());
                    }
                }
            }
        }

        function updateInputWithSelected(applyFilter) {
            var $sel = getSelected();
            
            if ($sel.length) {
                watcher.setValue($sel.text(), applyFilter);
                if (typeof options.changeCallback === 'function') {
                    options.changeCallback();
                }
            }
        }
        
        function restoreInput() {
            watcher.restoreValue();
            if (typeof options.changeCallback === 'function') {
                options.changeCallback();
            }
        }

        function isSuggestionVisible(){
            return $wrapper.css('display') !== 'none';
        }

        function setVisibility(show) {
            if (show !== isSuggestionVisible()) {
                if (show && $lines && $lines.length) {
                    updatePosition();
                    $wrapper.show();
                } else {
                    $wrapper.hide();
                }
            }
        }

        function applySelected() {
            fetcher.cancelRequest();
            updateInputWithSelected(true);
            setVisibility(false);

            // value was set by .val() call, which doesn't trigger change event
            $input.change();
        }

        function onRequestComplete(data) {
            var template, i, len, content, $newElement;

            if (data && data.result) {
                // overwrite template with new value or add to DOM
                if (data.tmpl) {
                    template = $(data.tmpl).hide();
                    if ($template) {
                        $template.replaceWith(template);
                    } else {
                        $input.after(template);
                        $template = template;
                    }
                }
                if (!$template && !data.tmpl) {
                    $template = $('<div></div>');
                }
        
                $lines = undefined;
                getItemContainer().empty();
                
                if ($template) {

                    $('.js-autocomplete').remove();

                    if (typeof options.responseDataPreprocessor === 'function') {
                        data = options.responseDataPreprocessor(data);
                    }

                    for (i = 0, len = data.result.length; i < len; ++i) {
                        content = data.result[i].text;
                        if (typeof options.preprocessor === 'function') {
                            content = options.preprocessor(content, searchValue, data.result[i]);
                        }
                        $newElement = $template.clone().addClass('js-autocomplete b-autocomplete_item').html(content).show();
                        
                        getItemContainer().append($newElement);
                        
                    }
                    $lines = $('.js-autocomplete');
                    setVisibility(data.result.length > 0 ? true : false);
                }

                $lines
                    .on('click', function() {

                        applySelected();
                        $input.focus();
                        if (options.autosubmit) {
                            $form = $input.closest('form');
                            $form.submit();
                        }

                    })
                    .hover(
                        function(e) { setSelected($(this)); },
                        function(e) { setSelected(null); }
                    );

            } else {
                setVisibility(false);
            }
        }

        function preventAutocomplete() {
            fetcher.cancelRequest();
            setVisibility(false);
        }

        function destroy() {
            preventAutocomplete();
            if ($input.length) {
                $wrapper.remove();
                $input.off('.autocomplete');
                $input.parents('form:first').off('.autocomplete');
            }
            if (watcher) {
                watcher.destroy();
            }
        }
        
        function onValueChange(value, oldValue) {
            var data = {'fl': value};
        
            if (value.length === 0 || value.length < options.minlength) {
                fetcher.cancelRequest();
                setVisibility(false);
                return;
            }
        
            searchValue = value;
        
            if (!$template) {
                data.tmpl = 1;
            }
        
            if (typeof options.dataprocessor === 'function') {
                data = options.dataprocessor(data);
            }
        
            fetcher.sendRequest(data, false);
        }
        
        
        $(document).ready(function() {

            $input = $(inputSelector);

            if ($input.length) {
                if (options.customWrapper === null) {
                    $wrapper = $('<div class="b-autocomplete"></div>');
                } else {
                    $wrapper = $(options.customWrapper);
                    $wrapperContainer = $wrapper.find(CONTAINER_SELECTOR);
                }
                
                if (options.zindex !== null) {
                    $wrapper.css('zIndex', options.zindex + globalAutocompleteCounter);
                }

                $wrapper
                    .attr('id', autocompleteContainerId)
                    .hide()
                    .appendTo('body');
                $wrapper.trigger('appended');
        
                $input.on('keydown.autocomplete', function(event) {
                    if (event.keyCode === KEY_BACKSPACE) {
                        setTimeout(function() { $input.trigger('input'); }, 1); // IE 9 doesn't trigger 'input' event on backspace
                    }
                
                    if (event.keyCode === KEY_ENTER) {
                        fetcher.cancelRequest();
                    }
                    
                    if (!options.autosubmit && isSuggestionVisible() && event.keyCode === KEY_ENTER) {
                        applySelected();
                        event.preventDefault();
                    }
                });

                $input.on('keyup.autocomplete', function(event) {
                    var $selected;

                    if (!isSuggestionVisible()) {
                        return;
                    }
                
                    // suggestions navigation.
                    if(event.keyCode === KEY_ESCAPE) {   
                        restoreInput();
                        setVisibility(false);
                    }
                
                    if ($lines && (event.keyCode === KEY_UP || event.keyCode === KEY_DOWN)) { 
                        // select next element
                        $selected = getSelected();
                        if ($selected.length) {
                            setSelected((event.keyCode === KEY_UP) ? $selected.prev() : $selected.next());
                        } else {
                            setSelected((event.keyCode === KEY_UP) ? $lines.last() : $lines.first());
                        }

                        watcher.stopWatch(); /* IE 7/8 fires propertychange */
                        // if no selection. restore user's input
                        if (getSelected().length) {
                            updateInputWithSelected(false);
                        } else {
                            restoreInput();
                        }
                        watcher.startWatch();
                    }
                });

                $input.parents('form:first').on('submit.autocomplete', function(event) {
                    if (isSuggestionVisible()) {
                        applySelected();
                    }
                });
                
                $input.on('blur.autocomplete', function(event) {
                    if (isSuggestionVisible()) {
                        setTimeout(function() {
                            setVisibility(false);
                        }, ON_BLUR_HIDE_TIMEOUT);   // give some time to process click on suggestion element
                    }
                });

                watcher = new wgsdk.InputWatcher($input, null, onValueChange, options.postprocessor);
                if (typeof(url) === 'function') {
                    fetcher = new wgsdk.NoAjaxFetcher(url, null, onRequestComplete);
                } else {
                    fetcher = new wgsdk.AjaxFetcher({'url': url}, null, onRequestComplete, 600);
                }
                
            }
        
        });

        // API
        return {
            setVisibility: setVisibility,
            preventAutocomplete: preventAutocomplete,
            destroy: destroy
        };
    };

    module.helpers = {};

    module.helpers.clansPreprocessor = function(value, prefix) {
        var regex = /^(\[[^\]]*\])?\s*(.+)?/i,
            result = regex.exec($.trim(value)),
            tag = result[1],
            name = result[2];

        tag = tag.substr(1, tag.length - 2);
        prefix = $.trim(prefix).toLowerCase();

        function highlightAndEscape(inputString, searchString)  {
            var matchedIndex = inputString.toLowerCase().indexOf(searchString);

            if (matchedIndex !== -1) {
                inputString = _.escape(inputString.substr(0, matchedIndex)) +
                              '<span class="b-autocomplete_match">' +
                              _.escape(inputString.substr(matchedIndex, searchString.length)) +
                              '</span>' +
                              _.escape(inputString.substr(matchedIndex + searchString.length));
            } else {
                inputString = _.escape(inputString);
            }

            return inputString;
        }

        return '[' + highlightAndEscape(tag, prefix) + '] ' + highlightAndEscape(name, prefix);
    };
    
    return module;

})(jQuery, wgsdk);
    

wgsdk.clearer = (function($) {
    'use strict';

    var module = function(inputSelector, clrSelector, options) {
        var $instance = $(clrSelector),
            $input = $(inputSelector),
            defaults = {
                clearCallback: undefined
            };
            
        options = $.extend({}, defaults, options);

        if (!($input.length && $instance.length)) {
            return;
        }

        function show() {
            $instance.css('display', 'block');
        }

        function hide() {
            $instance.css('display', 'none');
        }

        function update() {
            if ($input.val() !== '') {
                show();
            } else {
                hide();
            }
        }

        $input.keyup(update);

        $instance.click(function(e) {
            $instance.css('display', 'none');
            if (typeof options.clearCallback === 'function') {
                options.clearCallback(e);
            }
        });

        // API
        return {
            'update': update,
            'hide': hide,
            'show': show
        };
    };

    return module;

})(jQuery);


$(document).ready( function() {
    wgsdk.forms.init_countables();
});


}
/*
     FILE ARCHIVED ON 06:48:39 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:21 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.resolve: 494.42 (4)
  exclusion.robots.policy: 0.203
  esindex: 0.013
  exclusion.robots: 0.219
  CDXLines.iter: 28.598 (3)
  LoadShardBlock: 332.31 (3)
  PetaboxLoader3.datanode: 1331.173 (5)
  RedisCDXSource: 0.787
  captures_list: 366.02
  load_resource: 1521.254 (2)
*/