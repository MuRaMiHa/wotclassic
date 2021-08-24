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

(function(globalSettings, $, _, window, undefined) {

// logging
var console = {log: $.noop};
var debugLog = globalSettings.DEBUG_LOG || false;
if (debugLog && window.console) {
    console = window.console;
}

var HtmlForms = window.HtmlForms || undefined,
    AjaxForms = window.AjaxForms || undefined,
    settings = globalSettings.AuthenticationOID || undefined,
    authenticationSSOSettings = globalSettings.AuthenticationSSO || undefined;

if (_.isUndefined(HtmlForms) || _.isUndefined(AjaxForms) ||
    _.isUndefined(settings) || _.isUndefined(authenticationSSOSettings)) {
    console.log('auth:openid: returned from openid.js; it requires HtmlForms, AjaxForms, '+
                'Settings.AuthenticationOID, Settings.AuthenticationSSO to be defined');
    return;
}

var events = {
    initializeAuthLoginLink: 'authenticationoid:initialize-login-link',
    initializeAuthLogoutLink: 'authenticationoid:initialize-logout-link',
    startAuthentication: 'authenticationoid:start-authentication',
    logout: 'authenticationoid:logout'
};

var EventDispatcher = window.Application || undefined;

var openIdRequestIsProcessing = false;
var resetOpenIdRequestProcessStatus = function() {
    openIdRequestIsProcessing = false;
};

$(function() {
    if (_.isUndefined(EventDispatcher)) {
        EventDispatcher = $('body');
    }

    if (_.isFunction(EventDispatcher.on)) {
        EventDispatcher.on(events.initializeAuthLoginLink, initializeAuthLoginLink);
        EventDispatcher.on(events.initializeAuthLogoutLink, initializeAuthLogoutLink);
        EventDispatcher.on(events.startAuthentication, submitOpenIdVerifyForm);
        EventDispatcher.on(events.logout, submitLogoutForm);
    } else {
        EventDispatcher.delegate('a', events.initializeAuthLoginLink, initializeAuthLoginLink);
        EventDispatcher.delegate('a', events.initializeAuthLogoutLink, initializeAuthLogoutLink);
        EventDispatcher.bind(events.startAuthentication, submitOpenIdVerifyForm);
        EventDispatcher.bind(events.logout, submitLogoutForm);
    }

    initializeAuthLoginLink();
    initializeAuthLogoutLink();

    handleOpenIdFlow();
});

window.Application = window.Application || {};
window.Application.Authentication = window.Application.Authentication || {};

// common form and field error handlers
var logErrorMessage = function(msg) {
    console.log(msg);
};
var onFieldError = $.noop;
var onGenericLoginError = function() {
    var errorMessage = gettext('Вход временно невозможен');
    EventDispatcher.trigger('authenticationoid:authentication-ended', {
        'status': 'error',
        'error': errorMessage
    });
    resetOpenIdRequestProcessStatus();
    logErrorMessage(errorMessage);
};
var onGenericLoginErrorLogOnly = function() {
    var errorMessage = gettext('Вход временно невозможен');
    logErrorMessage(errorMessage);
};

// handles click on “Login”
var authLinkClick = function() {
    var data = {
        'next': $(this).attr('data-next-url')
    };
    submitOpenIdVerifyForm(data, false);
    return false;
};
var initializeAuthLoginLink = function() {
    var authLoginLinks = $('.js-auth-openid-link');
    authLoginLinks.unbind();
    authLoginLinks.click(authLinkClick);
};

// handles click on “Logout”
var authLogoutLinkClick = function() {
    var returnTo = $(this).data('return-to');
    submitLogoutForm(returnTo);

    return false;
};
var initializeAuthLogoutLink = function() {
    var authLogoutLink = $('.js-auth-logout-link');
    authLogoutLink.unbind();
    authLogoutLink.click(authLogoutLinkClick);
};
var submitLogoutForm = function(returnTo) {
    var form = createLogoutForm({'return_to': returnTo});
    var onSubmit = function(event) {
        var isAjax = AjaxForms.submit(this, {
            'success': onLogoutFormSuccess,
            'onFormError': onLogoutFormError,
            'iframeProxy': true
        });
        if (isAjax) {
            event.preventDefault();
        }
    };
    form.submit(onSubmit);
    form.submit();
};
var createLogoutForm = function(formParams) {
    var method = 'POST';
    var url = settings.LogoutUrl;
    var params = formParams || {};
    var target = 'ssl';

    return HtmlForms.create(method, url, params, target);
};
var onLogoutFormSuccess = function(data) {
    if (data.success_url) {
        location.replace(data.success_url);
    }
};
var onLogoutFormError = function() {
    // most likely to happen if a user has already logged out
    window.location.replace(settings.LogoutErrorRedirectUrl);
};

var handleOpenIdFlow = function() {
    var processFailed = handleOpenIdProcessCompletion();
    if (!processFailed) {
        return;
    }

    handleOpenIdImmediateFlow();
};
var handleOpenIdImmediateFlow = function() {
    if (authenticationSSOSettings.checkIsAuthenticated &&
        authenticationSSOSettings.isAuthenticated) {
        console.log('auth:openid:handleOpenIdImmediateFlow: deleting SSO attempt immediate cookie (if any)');
        // for 'jsonp' mode assures backwards compatibility
        deleteOpenIdSSOAttemptImmediateCookie();
        console.log('auth:openid:handleOpenIdImmediateFlow: already authenticated, nothing to do');
        return;
    }

    if (authenticationSSOSettings.signinMode === 'jsonp') {
        console.log('auth:openid:handleOpenIdImmediateFlow: using "jsonp" mode, will make request');
        handleOpenIdSSOJsonpMode();
    } else { // 'notification' or unknown
        console.log('auth:openid:handleOpenIdImmediateFlow: using "notification" mode, will check for cookie');
        handleOpenIdSSONotificationMode();
    }
};
var handleOpenIdSSOJsonpMode = function() {
    var jsonpUrl = authenticationSSOSettings.signinJsonpUrl;
    if (jsonpUrl) {
        var jsonp = authenticationSSOSettings.signinJsonpCallbackParameter || 'callback';
        $.ajax({
            'url': jsonpUrl,
            'jsonp': jsonp,
            'dataType': 'jsonp',
            'success': onOpenIdSSOJsonpResponseSuccess,
            'error': onOpenIdSSOJsonpResponseError
        });
    } else {
        console.log('auth:openid:handleOpenIdImmediateJsonpMode: jsonp URL is empty, will not continue');
    }
};
var handleOpenIdSSONotificationMode = function() {
    if (doesOpenIdSSOAttemptImmediateCookieExist()) {
        deleteOpenIdSSOAttemptImmediateCookie();

        console.log('auth:openid:handleOpenIdSSONotificationMode: cookie found and deleted, attempting immediate');
        triggerOpenIdVerifyImmediate();
    } else {
        console.log('auth:openid:handleOpenIdSSONotificationMode: no cookie found, will not attempt immediate');
    }
};
var onOpenIdSSOJsonpResponseSuccess = function(response) {
    if (response && 'authenticated' in response) {
        if (response.authenticated) {
            console.log('auth:openid:onOpenIdSSOJsonpResponseSuccess: got response, authenticated, attempting immediate');
            triggerOpenIdVerifyImmediate();
        } else {
            console.log('auth:openid:onOpenIdSSOJsonpResponseSuccess: got response, not authenticated, will not attempt immediate');
        }
    } else {
        console.log('auth:openid:onOpenIdSSOJsonpResponseSuccess: no authentication data in response');
        console.log(response);
    }
};
var onOpenIdSSOJsonpResponseError = function() {
    console.log('auth:openid:onOpenIdSSOJsonpResponseError: failed to receive JSONP response');
    console.log(arguments);
};
var deleteOpenIdSSOAttemptImmediateCookie = function() {
    var cookieOptions = {
        path: authenticationSSOSettings.attemptImmediateCookie.path
    };
    $.cookie(authenticationSSOSettings.attemptImmediateCookie.name, null, cookieOptions);
};
var doesOpenIdSSOAttemptImmediateCookieExist = function() {
    return $.cookie(authenticationSSOSettings.attemptImmediateCookie.name) === 'yes';
};

var triggerOpenIdVerifyImmediate = function() {
    var authLoginLinks = $('.js-auth-openid-link'),
        nextUrl = authLoginLinks.attr('data-next-url');

    if (_.isUndefined(nextUrl)) {
        var query = window.location.search.substr(1);
        if (query) {
            query = '?' + query;
        }

        nextUrl = window.location.pathname + query;
    }

    var data = {
        'next': nextUrl
    };
    submitOpenIdVerifyForm(data, true);
};
var submitOpenIdVerifyForm = function(formData, isImmediate) {
    if (openIdRequestIsProcessing) {
        return;
    }
    openIdRequestIsProcessing = true;
    EventDispatcher.trigger('authenticationoid:authentication-started');

    var form = createOpenIdVerifyForm(formData, isImmediate);
    var onSubmit = function(event) {
        var isAjax = AjaxForms.submit(this, {
            'success': isImmediate ? onOpenIdVerifyImmediateSuccess : onOpenIdVerifySuccess,
            'error': onOpenIdVerifyError,
            'onFieldError' : onFieldError,
            'iframeProxy': true
        });
        if (isAjax) {
            event.preventDefault();
        }
    };
    form.submit(onSubmit);
    form.submit();
};
window.Application.Authentication.start = function(formData, isImmediate) {
    console.log("This method is deprecated. Use 'authenticationoid:start-authentication' event.");
    return submitOpenIdVerifyForm(formData, isImmediate);
};

var createOpenIdVerifyForm = function(formData, isImmediate) {
    var method = 'POST';
    var url = isImmediate ? settings.OpenIdVerifyImmediateUrl : settings.OpenIdVerifyUrl;
    var params = formData || {};
    var target = 'ssl';

    return HtmlForms.create(method, url, params, target);
};
var onOpenIdVerifySuccess = function(data) {
    var action = data.action || null;
    if (action === 'form') {
        var url = data.form.action;
        var params = data.fields;

        HtmlForms.sendPost(url, params);
    }
    EventDispatcher.trigger('authenticationoid:authentication-ended', {
        'status': 'ok'
    });
    resetOpenIdRequestProcessStatus();
    console.log('auth:openid:onOpenIdVerifySuccess');
    console.log(arguments);
};
var onOpenIdVerifyImmediateSuccess = function(data) {
    var action = data.action || null;
    if (action === 'form') {
        var method = 'POST';
        var target = 'ssl';
        var url = data.form.action;
        var params = data.fields;

        var form = HtmlForms.create(method, url, params, target);

        // For immediate requests, a user should not see any process steps; at the same time, OpenID server
        // may return not only raw 302 redirect, but also an HTML page containing an auto-submitted form. This
        // page would be seen by the user unless we make the request (and get the response) inside an iframe.
        var onSubmit = function(event) {
            var isAjax = AjaxForms.submit(this, {
                'iframeProxy': true
            });
            if (isAjax) {
                event.preventDefault();
            }
        };
        form.submit(onSubmit);
        form.submit();
    }
    EventDispatcher.trigger('authenticationoid:authentication-ended', {
        'status': 'ok'
    });
    resetOpenIdRequestProcessStatus();
    console.log('auth:openid:onOpenIdVerifyImmediateSuccess');
    console.log(arguments);
};
var onOpenIdVerifyError = function() {
    console.log('auth:openid:onOpenIdVerifyError');
    console.log(arguments);

    if (arguments.length === 0) {
        onGenericLoginError();
    } else {
        var data = arguments[0];
        if (data.error) {
            EventDispatcher.trigger('authenticationoid:authentication-ended', {
                'status': 'error',
                'error': data.error
            });
            resetOpenIdRequestProcessStatus();
            logErrorMessage(data.error);
        } else {
            onGenericLoginError();
        }
    }
};
var handleOpenIdProcessCompletion = function() {
    var processFailed = true,
        query = window.location.search;
    if (query === '' || query === '?') {
        return processFailed;
    }
    // check if we shall trigger “process” step of OpenID authentication flow to complete
    var processTokenParameter = settings.OpenIdProcessTokenQueryParameter;
    query = query.substr(1);
    if (query.indexOf(processTokenParameter) === -1) {
        return processFailed;
    }

    var queryParams = decodeQueryString(query);
    if (processTokenParameter in queryParams) {
        var processToken = queryParams[processTokenParameter];
        if (processToken === 'openid_process_error') {
            console.log('auth:openid:handleOpenIdProcessCompletion:openid_process_error');
            onGenericLoginError();
        } else {
            processFailed = false;
            triggerOpenIdProcessCompletion(processToken);
        }
        popLocationQueryParameter(processTokenParameter);
    }
    return processFailed;
};
var triggerOpenIdProcessCompletion = function(processToken) {
    var url = getOpenIdProcessStatusUrl(processToken);
    var form = HtmlForms.create('GET', url, {});
    var onSubmit = function(event) {
        AjaxForms.submit(this, {
            'success': onOpenIdProcessSuccess,
            'error': onOpenIdProcessError,
            'onFormError': $.noop,
            'onFieldError': $.noop
        });

        event.preventDefault();
    };
    form.submit(onSubmit);
    form.submit();
};
var getOpenIdProcessStatusUrl = function(processToken) {
    var statusUrlTemplate = _.template(settings.OpenIdProcessStatusUrlTemplate);
    return statusUrlTemplate({'token': processToken});
};
var onOpenIdProcessSuccess = function(data) {
    console.log('auth:openid:onOpenIdProcessSuccess: deleting SSO attempt immediate cookie (if any)');
    deleteOpenIdSSOAttemptImmediateCookie();

    // Identify if a webpage is being loaded inside an iframe or directly into the browser window.
    if (window.top !== window.self) {
        // if userdata returned into iframe - trigger 'authentication-end' event on window.top
        // to update page state without reload
        if (_.isObject(data) && data.userdata && window.top.Application) {
            window.top.Application.trigger('authenticationoid:authentication-ended', data);
        } else {
            window.parent.location.href = window.location.href;
        }
    }
    EventDispatcher.trigger('authenticationoid:authentication-ended', data);
    resetOpenIdRequestProcessStatus();
    console.log('auth:openid:onOpenIdProcessSuccess');
    console.log(arguments);
};
var onOpenIdProcessError = function() {
    console.log('auth:openid:onOpenIdProcessError');
    console.log(arguments);

    if (arguments.length === 0) {
        onGenericLoginErrorLogOnly();
    } else {
        var data = arguments[0];
        if (data.error) {
            logErrorMessage(data.error);
        } else {
            onGenericLoginErrorLogOnly();
        }
    }
    resetOpenIdRequestProcessStatus();
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
var _popLocationQueryParameter = function(processParameter) {
    var query = window.location.search.substr(1),
        queryParams = decodeQueryString(query);

    if (processParameter in queryParams) {
        delete queryParams[processParameter];
    }

    query = $.param(queryParams);
    if (query) {
        query = '?' + query;
    }

    return query;
};
var popLocationQueryParameter = function(processParameter) {
    if ('replaceState' in window.history) {
        var query = _popLocationQueryParameter(processParameter);
        window.history.replaceState('', document.title, window.location.pathname + query);
    }
};

})(window.Settings || {}, jQuery, _, window);


}
/*
     FILE ARCHIVED ON 06:48:44 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:22 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 586.546 (3)
  exclusion.robots.policy: 0.212
  PetaboxLoader3.datanode: 688.269 (5)
  captures_list: 613.693
  load_resource: 421.483 (2)
  esindex: 0.015
  PetaboxLoader3.resolve: 136.374 (2)
  RedisCDXSource: 1.973
  CDXLines.iter: 20.521 (3)
  exclusion.robots: 0.227
*/