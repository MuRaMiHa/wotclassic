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

// Requirements:
//     * jQuery
//     * Underscore.js
//     * URI.js
//     * Porthole.js (wgext.contrib.iframeproxy)
(function(settings, messages, $, _, window, undefined) {
    var authenticationBaseSettings = settings.AuthenticationBase || {};

    // logging
    var console = {log: $.noop};
    var debugLog = settings.DEBUG_LOG || false;
    if (debugLog && window.console) {
        console = window.console;
    }

    var HtmlForms = {
        create: function(method, url, params, target, sendCsrfToken) {
            var form = $('<form>')
                .attr('method', method)
                .attr('action', url);

            if (target) {
                form.attr('target', target);
            }

            if (params) {
                $.each(params, function(key, value) {
                    $('<input type="hidden">')
                        .attr('name', key)
                        .attr('value', value)
                        .appendTo(form);
                });
            }

            if (_.isUndefined(sendCsrfToken)) {
                sendCsrfToken = true;
            }
            if (typeof method === 'string') {
                method = method.toUpperCase();
            }
            if (sendCsrfToken && method === 'POST' && isSameOrigin(url)) {
                $('<input type="hidden">')
                    .attr('name', 'csrfmiddlewaretoken')
                    .attr('value', settings.CSRF_TOKEN)
                    .appendTo(form);
            }

            form.appendTo('body');
            return form;
        },
        send: function(method, url, params, target, sendCsrfToken) {
            var form = HtmlForms.create(method, url, params, target, sendCsrfToken);
            form.submit();
        },
        sendGet: function(url, params, target) {
            return HtmlForms.send('GET', url, params, target);
        },
        sendPost: function(url, params, target, sendCsrfToken) {
            return HtmlForms.send('POST', url, params, target, sendCsrfToken);
        }
    };
    window.HtmlForms = HtmlForms;

    var AjaxForms = {
        __iframe_number: 0,
        __defaultParams: {
            onFormError: function(form, errorMessage) {
                console.log('AjaxForms:onFormError');
                console.log(errorMessage);
            },
            onFieldError: function(fieldName, form, errorMessage) {
                console.log('AjaxForms:onFieldError');
                console.log(fieldName, form, errorMessage);
            },
            onWaitingStart: function() {},
            onWaitingEnd: function() {},
            onErrorUnauthorized: function(data) {
                // reloading a page that requires authentication
                // would result in a redirect to the login page
                window.location.reload();
            }
        },
        __requestsToAbort: [],

        setup: function(params) {
            AjaxForms.__defaultParams = _.defaults((_.isObject(params) ? params : {}), AjaxForms.__defaultParams);
        },

        cancel: function(selector) {
            $(selector).data('form-canceled', true);
        },

        abort: function(requestId) {
            AjaxForms.__requestsToAbort.push(requestId);
        },

        submit: function(selector, params) {
            // for iFrameProxy
            //     Usually you need to add target='ssl' to form
            //     params['iframeProxy'] should be true
            // for ajax
            //     Usually event handler that calls this function should return false
            //     to prevent non-AJAX form submit

            var form = $(selector);

            form.data('form-canceled', false);

            params = _.defaults((_.isObject(params) ? params : {}), AjaxForms.__defaultParams);

            var onFormError = function(errorMessage, errorCode, errorContext) {
                params.onFormError(form, errorMessage, errorCode, errorContext);
            };
            var onFieldError = function(fieldName, errorMessage) {
                params.onFieldError(fieldName, form, errorMessage);
            };


            var processingMaximumTime = window.PENDING_OPERATION_JAVASCRIPT_TIMEOUT || 10;
            var processingStartTime;
            var processingWaitTime = params.processingWaitTime || window.PENDING_OPERATION_JAVASCRIPT_WAIT || 1;
            var processing = false;

            var authErrorCodeUnauthorized = authenticationBaseSettings.ErrorCodeUnauthorized || 401;

            var onRequestSuccess = function(data, status, request) {
                processing = false;

                if (form.data('form-canceled')) {
                    return false;
                }

                if (!data) {
                    onFormError(messages.JSBASE_UNKNOWN_ERROR);
                    return;
                }

                if (data.status === 'ok') {
                    if (params.success) {
                        params.success.call(this, data, status, request);
                    }

                    // order matters: value from params overrides value from data
                    if (params.success_url) {
                        location.href = params.success_url;
                    } else if (data.success_url) {
                        location.href = data.success_url;
                    }

                    return;
                }

                if (data.status === 'redirect') {

                    if (data.redirect_url) {
                        location.href = data.redirect_url;
                    } else {
                        console.log('Empty redirect_url parameter');
                    }

                    return;
                }

                if (data.status === 'processing') {
                    var requestId = this.requestId;
                    if (!_.isUndefined(requestId) && _.include(AjaxForms.__requestsToAbort, requestId)) {
                        AjaxForms.__requestsToAbort = _.without(AjaxForms.__requestsToAbort, requestId);
                        console.log('Aborted request with ID ' + requestId);
                        return;
                    }

                    var date = new Date();
                    if (_.isUndefined(processingStartTime)) {
                        processingStartTime = date.getTime();
                    }

                    var stillProcessing = date.getTime() - processingStartTime < processingMaximumTime * 1000;
                    if (stillProcessing) {
                        processing = true;
                        _.delay(checkProcessingStatus, processingWaitTime * 1000, data.status_url, this);
                        return;
                    }

                    // form error data
                    data.status = 'error';
                    data.error = messages.JSBASE_TIMEOUT_ERROR;
                }

                if (data.status === 'error') {
                    var errorCode = data.error_code || null;
                    if (errorCode === authErrorCodeUnauthorized) {
                        params.onErrorUnauthorized.call(this, data);
                    } else {
                        handleDjangoFormErrors(data, onFormError, onFieldError);
                    }
                } else {
                    onFormError(messages.JSBASE_UNKNOWN_ERROR);
                }

                if (params.error) {
                    params.error.call(this, data);
                }
            };
            var onRequestError = params.onRequestError || function(request, text, errorThrown) {
                onFormError(messages.JSBASE_SERVER_ERROR);
                console.log(errorThrown);

                if (params.onRequestErrorStatus) {
                    params.onRequestErrorStatus.call(this, request, text, errorThrown);
                }

                if (params.error) {
                    params.error.call(this);
                }
            };
            var onRequestComplete = function(request) {
                if (!processing) {
                    params.onWaitingEnd.call(this);
                    if (params.complete) {
                        var data = {};
                        try {
                            data = $.parseJSON(request.responseText);
                        } catch (err) {
                            console.log('An error occurred while parsing JSON response');
                        }
                        params.complete.call(this, data);
                    }
                }
            };
            var checkProcessingStatus = function(statusUrl, context) {
                $.ajax({
                    type: 'get',
                    url:  statusUrl,
                    dataType: 'json',
                    context: context,
                    success: onRequestSuccess,
                    error: onRequestError,
                    complete: onRequestComplete,
                    cache: false
                });
            };
            var handleDjangoFormErrors = function(data, onFormError, onFieldError) {
                var errorMessage = data.error || '',
                    errorCode = data.error_code || '',
                    errorContext = data.error_context;

                if (errorMessage || errorCode) {
                    onFormError(errorMessage, errorCode, errorContext);
                }

                var errors = data.errors || {};
                if (errors) {
                    _.each(errors, function(messages, field) {
                        var errorMessage = messages[0];
                        if (field === '__all__') {
                            onFormError(errorMessage, errorCode);
                        } else {
                            onFieldError(field, errorMessage);
                        }
                    });
                }
            };

            var submitIFrame = function(target) {
                var iframeId = nextIFrameId(target),
                    iframeMarker = iframeId+'|';
                var iframe = $('<iframe id="'+iframeId+'" name="'+iframeId+'" style="display:none;"></iframe>');
                iframe.appendTo($('body'));
                form.attr('target', iframeId);

                if (params.action) {
                    form.attr('action', params.action);
                }

                if (params.iframeProxy) {
                    var action = form.attr('action');
                    var newAction = extendUrlQuery(action, {
                        'iframe_proxy': 1,
                        'iframe_marker': iframeMarker
                    });
                    form.attr('action', newAction);

                    var frameProxyUrl = settings.IFRAME_PROXY_URL || null;
                    var proxy = new Porthole.WindowProxy(frameProxyUrl, iframeId);
                    Porthole.proxies[proxy.proxyIFrameName] = proxy;

                    var removeEventListener = function() {
                        proxy.removeEventListener(proxyEventListener);
                        delete Porthole.proxies[proxy.proxyIFrameName];
                    };

                    var processingTimeout = _.delay(function() {
                        var request = {
                            status: 500,
                            statusText: 'Internal Server Error'
                        };
                        console.log('iFrame proxy postMessage waiting timeout error');
                        onRequestError(request, 'error', messages.JSBASE_TIMEOUT_ERROR);
                        onRequestComplete(request);
                        removeEventListener();
                    }, processingMaximumTime * 1000);

                    var proxyEventListener = function(messageEvent) {
                        var dataString = messageEvent.data;
                        if (dataString.indexOf(iframeMarker) !== 0) {
                            return;
                        }
                        clearTimeout(processingTimeout);
                        dataString = dataString.substring(iframeMarker.length);
                        onIFrameResponse(iframe, dataString, {
                            onComplete: removeEventListener
                        });
                    };
                    proxy.addEventListener(proxyEventListener);
                } else {
                    iframe.load(function(e) {
                        var dataString = $('body', iframe.contents()).text();
                        onIFrameResponse(iframe, dataString);
                    });
                }
            };
            var nextIFrameId = function(target) {
                AjaxForms.__iframe_number += 1;
                return target + '-' + AjaxForms.__iframe_number;
            };
            var onIFrameResponse = function(iframe, dataString, params) {
                if (!dataString) {
                    // TODO: should we call params.onComplete anyway?
                    return;
                }

                params = params || {};

                var data;
                var status = 'success';
                var request = {
                    status: 200,
                    statusText: 'iFrame fake status'
                };

                if (_.isUndefined(JSON)) {
                    console.log('Request error caused by JSON object being undefined.');
                }

                try {
                    data = JSON.parse(dataString);
                } catch (err) {
                    status = 'error';
                    request.status = 404;
                    onRequestError(request, status, messages.JSBASE_PARSE_RESPONSE_ERROR);
                    onRequestComplete(request);
                }

                if (data) {
                    onRequestSuccess(data, status, request);
                    onRequestComplete(request);
                }

                if (params.onComplete) {
                    params.onComplete();
                }

                iframe.remove();
            };

            var submitAjax = function() {
                $.ajax({
                    type: params.method || form.attr('method') || 'post',
                    url:  params.action || form.attr('action'),
                    data: params.data || form.serializeArray(),
                    dataType: 'json',
                    context: params.context,
                    success: onRequestSuccess,
                    error: onRequestError,
                    complete: onRequestComplete
                });
            };

            params.onWaitingStart.call(params.context);

            var target = form.attr('target');
            if (target) {
                submitIFrame(target);
                return false;
            } else {
                submitAjax();
                return true;
            }
        }
    };
    window.AjaxForms = AjaxForms;

    // utilities
    var isSameOrigin = function(url) {
        var hostname = URI.parse(url).hostname;
        if (!_.isUndefined(hostname)) {
            if (hostname !== window.location.hostname) {
                return false;
            }
        }

        var path = URI.parse(url).path;
        var isCurrentLocation = path === '';
        if (isCurrentLocation) {
            return true;
        }

        var sitePath = settings.SITE_PATH;
        var index = path.indexOf(sitePath);
        var isSubPath = index === 0;
        if (isSubPath) {
            return true;
        }

        var isRelativeToLocation = index === -1 && path.charAt(0) !== '/';
        if (isRelativeToLocation) {
            return true;
        }

        return false;
    };
    var extendUrlQuery = function(url, params) {
        var pos,
            fragment,
            query;

        url = url || '';

        // fragment
        pos = url.indexOf('#');
        if (pos !== -1) {
            fragment = url.substring(pos + 1) || null;
            url = url.substring(0, pos);
        }

        // query
        pos = url.indexOf('?');
        if (pos !== -1) {
            query = url.substring(pos + 1) || null;
            url = url.substring(0, pos);
        }

        // extend query
        query = $.param($.extend({}, decodeQueryString(query), params));

        // append query
        if (query) {
            url += '?' + query;
        }

        // append fragment
        if (fragment) {
            url += '#' + fragment;
        }

        return url;
    };
    var decodeQueryString = function(query) {
        if (!query) {
            return {};
        }

        var params = {},
            match,
            rSpace = /\+/g,
            rKeyValue = /([^&=]+)=?([^&]*)/g,
            decode = function (str) {
                return decodeURIComponent(str.replace(rSpace, ' '));
            };

        while (match = rKeyValue.exec(query)) {
            params[decode(match[1])] = decode(match[2]);
        }

        return params;
    };

})(window.Settings || {}, window.Messages || {}, jQuery, _, window);


}
/*
     FILE ARCHIVED ON 06:48:43 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:21 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 294.695
  exclusion.robots: 0.08
  exclusion.robots.policy: 0.073
  RedisCDXSource: 8.208
  esindex: 0.007
  LoadShardBlock: 266.232 (3)
  PetaboxLoader3.datanode: 265.158 (5)
  CDXLines.iter: 17.824 (3)
  load_resource: 1273.392 (2)
  PetaboxLoader3.resolve: 1115.056 (2)
*/