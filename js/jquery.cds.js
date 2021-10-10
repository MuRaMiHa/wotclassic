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

/*globals jQuery*/
(function ($) {
    'use strict';

    var defaults = {
        url: '',
        consumer: '',
        place: '',
        locale: '',
        authorized: false,
        pluginPrefix: 'cds',
        requestOnInit: true,
        onResponse: null,
        onSuccess: null,
        onError: null,
        onEmptyContent: null
    };

    var pluginName = 'CDSBanner';

    var overrideParameters = ['place', 'locale', 'authorized'];

    var requiredParameters = ['place', 'locale'];

    var settings;

    var getRequestString = function (options) {
        return $.param({
            consumer: options.consumer,
            place: options.place,
            locale: options.locale,
            is_logged: options.authorized ? 1 : 0
        });
    };

    var onSuccess = function (content) {
        $(this).html(content);
    };

    var onError = function (status, error) {
        console.log('Error on requesting content: "' + status + ' ' + error + '"');
    };

    var onEmptyContent = function () {};

    var getOverriddenParameters = function (element) {
        var customSettings = $.extend({}, settings),
            parameter,
            i;

        for (i = 0; i < overrideParameters.length; i++) {
            parameter = $(element).data(settings.pluginPrefix + '-' + overrideParameters[i]);
            if (parameter) {
                customSettings[overrideParameters[i]] = parameter;
            }
        }

        return customSettings;
    };

    var methods = {
        init: function (options) {
            var i;

            settings = $.extend({}, defaults, options || {});

            if (!settings.url) {
                console.log('Improperly configured: url is required');
                return;
            }

            if (!settings.consumer) {
                console.log('Improperly configured: consumer is required');
                return;
            }

            this.each(function () {
                var $this = $(this),
                    customSettings = getOverriddenParameters($this);

                for (i = 0; i < requiredParameters.length; i++) {
                    if (!customSettings[requiredParameters[i]]) {
                        return;
                    }
                }

                if ($this.data(pluginName)) {
                    return;
                }

                $this.data(pluginName, customSettings);
            });

            if (settings.requestOnInit) {
                methods.request.call(this);
            }

            return this;
        },

        update: function (options, noRequest) {
            this.each(function () {
                var $this = $(this),
                    data = $this.data(pluginName);

                if (!data) {
                    return;
                }

                $this.data(pluginName, $.extend({}, data, options));
            });

            if (!noRequest) {
                methods.request.call(this);
            }

            return this;
        },

        request: function () {
            return this.each(function () {
                var $this = $(this),
                    options = $this.data(pluginName),
                    handleSuccess,
                    handleError,
                    handleEmptyContent;

                if (!options) {
                    return;
                }

                handleSuccess = typeof options.onSuccess == 'function' ? options.onSuccess : onSuccess;
                handleError = typeof options.onError == 'function' ? options.onError : onError;
                handleEmptyContent = typeof options.onEmptyContent == 'function' ? options.onEmptyContent : onEmptyContent;

                $.ajax(options.url, {
                    data: getRequestString(options),
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.status && data.status == 'ok' && data.content) {
                            handleSuccess.call($this, data.content);
                        } else if (data.status == 'error') {
                            handleError.call($this, 200, data.error);
                        } else {
                            handleEmptyContent.call($this);
                        }
                    },
                    error: function (xhr) {
                        handleError.call($this, xhr.status, xhr.statusText);
                    },
                    complete: function (xhr) {
                        if (typeof options.onResponse == 'function') {
                            options.onResponse.call($this, xhr);
                        }
                    }
                });
            });
        }
    };

    $.fn.cds = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        $.error('Method ' + method + ' does not exist for jQuery.cds');
    };
}(jQuery));

}
/*
     FILE ARCHIVED ON 19:41:20 Nov 03, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:47 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 479.509
  exclusion.robots: 0.081
  exclusion.robots.policy: 0.074
  RedisCDXSource: 222.361
  esindex: 0.008
  LoadShardBlock: 234.833 (3)
  PetaboxLoader3.datanode: 271.618 (5)
  CDXLines.iter: 20.115 (3)
  load_resource: 172.24 (2)
  PetaboxLoader3.resolve: 101.024 (2)
*/