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

/**
 * Created by y_shatrov on 24.10.14.
 *
 * Requires:
 *   jquery
 *   jquery.cookie
 *
 * Rationale:
 *   Server-generated HTML is cached, so it's not possible to insert valid csrf tokens into HTML on the server.
 *
 * Solution:
 *   If client has no CSRF cookie set, this script performs an AJAX request to a view which sets the cookie.
 *   When the CSRF cookie is present, it is appended to forms (on submit) as a hidden input, and to AJAX requests as
 *   a HTTP header.
 *
 * Usage:
 *  on document ready, add csrf.init()
 */

(function ($) {

    var debug = window.debug || function() {};

    var csrf = window.csrf = {
        settings: {  // default settings should be fine
            COOKIE_NAME: "csrftoken",
            COOKIE_URL: "/",
            FORM_FIELD_NAME: "csrfmiddlewaretoken",
            FORM_NO_CSRF_ATTRIBUTE: "no-csrf-token"
        },

        token: null,

        /** Initialize CSRF token handler (usually on load)
         *
         * @param options object : optional, with keys corresponding to csrf.settings
         */
        init: function(options) {
            options && $.extend(csrf.settings, options);
            csrf.install(true);
        },

        getToken: function(initial) {
            var csrfCookie = $.cookie(csrf.settings.COOKIE_NAME);
            if (! csrfCookie) {
                if (! initial) {
                    debug("getToken(): Token not ready");
                    return;
                }
                // this AJAX call must set CSRF cookie
                debug("getToken(): Try to fetch token");
                $.get(csrf.settings.COOKIE_URL).done(csrf.install);
                return;
            }
            csrf.token = csrfCookie;
            return csrf.token;
        },

        /** Install the CSRF token into AJAX request headers and form input, when the CSRF cookie is present
         *
         */
        install: function(initial) {
            var token = csrf.getToken(initial);
            if (! token) {
                debug("install(): token empty");
                return;
            }
            csrf.addCSRFTokenRequestHeaderToAJAX(token);
            $("body").on("submit", "form", function() {
                var frm = this;
                try {
                    return csrf.addCSRFTokenToForm(token, frm);
                } catch (ex) {
                    debug("Failed to submit form: CSRF token could not be added");
                    return false;
                }
            });
        },

        addCSRFTokenRequestHeaderToAJAX: function(token) {
            $.ajaxSetup({
                beforeSend: function (xhr, settings) {
                    if (!(/^http[s]?:/.test(settings.url))) {
                        // Only send the token to relative URLs i.e. locally.
                        xhr.setRequestHeader("X-CSRFToken", token);
                        debug("Set X-CSRFToken request header");
                    }
                }
            });
        },

        addCSRFTokenToForm: function(token, form) {
            if (form.method.toUpperCase() == "GET" || form.hasAttribute(csrf.FORM_NO_CSRF_ATTRIBUTE)) {
                return true;
            }
            var formToken = form[csrf.settings.FORM_FIELD_NAME];
            if (! formToken || formToken != token) {
                var csrfField = $("<input type=hidden name=" + csrf.settings.FORM_FIELD_NAME + ">");
                csrfField.val(token);
                $(form).append(csrfField);
            }
            return true;
        }
    };

})(jQuery);


}
/*
     FILE ARCHIVED ON 09:36:10 Nov 02, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:43 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 330.553
  exclusion.robots: 0.085
  exclusion.robots.policy: 0.079
  RedisCDXSource: 0.561
  esindex: 0.011
  LoadShardBlock: 305.836 (3)
  PetaboxLoader3.datanode: 167.474 (5)
  CDXLines.iter: 20.824 (3)
  load_resource: 258.528 (2)
  PetaboxLoader3.resolve: 118.559 (2)
*/