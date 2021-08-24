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

wgsdk = window.wgsdk || {};
wgsdk.vars = window.wgsdk.vars || {};

wgsdk.time = {};
wgsdk.time.init = (function() {

    var obj = function() {
        var wotTimeDelimiter = wgsdk.vars.TIME_DELIMITER || ':',
            wotDateDelimiter = wgsdk.vars.DATE_DELIMITER || '.',
            wotDateFormat = wgsdk.vars.DATE_FORMAT || 'dmy';

        function PadZeros2(number) {
            var str;

            if (number === undefined) {
                return '00';
            }
            str = number.toString();
            switch (str.length) {
                case 0: return '00';
                case 1: return '0' + str;
                default: return str;
            }
        }

        function FormatDate(day, month, year, delimiter) {
            var str = '';
            for (var i = 0; i < wotDateFormat.length; ++i) {
                switch (wotDateFormat.charAt(i).toLowerCase()) {
                    case 'y': {
                        str += year;
                        break;
                    }
                    case 'm': {
                        str += month;
                        break;
                    }
                    case 'd': {
                        str += day;
                        break;
                    }
                }
                if (i != wotDateFormat.length - 1) {
                    str += delimiter;
                }
            }
            return str;
        }

        Date.prototype.formatShortDate = function() {
            var currentDate = new Date();

            if (currentDate.getYear() === this.getYear()) {
                return this.wotToLocaleDateStringShortWithoutYear();
            } else {
                return this.wotToLocaleDateStringShort();
            }
        };

        Date.prototype.wotGetDatepickerDateFormat = function() {
            var str = '';

            for (var i = 0; i < wotDateFormat.length; ++i) {
                switch (wotDateFormat.charAt(i).toLowerCase()) {
                    case 'y': {
                        str += 'yy';
                        break;
                    }
                    case 'm': {
                        str += 'mm';
                        break;
                    }
                    case 'd': {
                        str += 'dd';
                        break;
                    }
                }
                if (i != wotDateFormat.length - 1) {
                    str += wotDateDelimiter;
                }
            }
            return str;
        };

        Date.prototype.wotGetDatepickerTimeFormat = function() {
            return ('hh' + wotTimeDelimiter + 'mm' + wotTimeDelimiter + 'ss');
        };

        Date.prototype.wotFormatTime = function(h, m, s) {
            return (PadZeros2(h) + wotTimeDelimiter + PadZeros2(m) + wotTimeDelimiter + PadZeros2(s));
        };

        Date.prototype.wotFormatTimeHM = function(h, m) {
            if (m === undefined) {
                if (h === undefined) {
                    h = this.getHours();
                    m = this.getMinutes();
                } else {
                    h = Math.floor(h / 1000);
                    m = Math.floor(h % (60*60) / 60);
                    h = Math.floor(h % (60*60*24) / (60*60));
                }
            }

            return (PadZeros2(h) + wotTimeDelimiter + PadZeros2(m));
        };

        Date.prototype.wotFormatTimeMS = function(m, s) {
            if (s === undefined) {
                if (m === undefined) {
                    m = this.getMinutes();
                    s = this.getSeconds();
                } else {
                    m = Math.floor(m / 1000);
                    s = m % 60;
                    m = Math.floor(m % (60*60) / 60);
                }
            }
            return (PadZeros2(m) + wotTimeDelimiter + PadZeros2(s));
        };

        Date.prototype.wotFormatDate = function(day, month, year) {
            if (day === undefined) {
                day = this.getDate();
            }
            if (month === undefined) {
                month = this.getMonth();
            }
            if (year === undefined) {
                year = this.getFullYear();
            }

            // universal big-endian format time
            day = PadZeros2(parseInt(day));
            month = PadZeros2(parseInt(month) + 1);

           return FormatDate(day, month, year, wotDateDelimiter);
        };


        function FormatDateWithoutYear(day, month, delimiter) {
            var date_array = [];

            for (var i = 0; i < wotDateFormat.length; ++i) {
                var code = wotDateFormat.charAt(i).toLowerCase();
                if (code == 'm') {
                    date_array.push(month);
                } else if (code == 'd') {
                    date_array.push(day);
                }
            }
            return date_array.join(delimiter);
        }

        Date.prototype.wotFormatDateWithoutYear = function(day, month) {
            if (day === undefined) {
                day = this.getDate();
            }
            if (month === undefined) {
                month = this.getMonth();
            }

            // universal big-endian format time
            day = PadZeros2(parseInt(day));
            month = PadZeros2(parseInt(month) + 1);

            return FormatDateWithoutYear(day, month, wotDateDelimiter);
        };

        Date.prototype.wotUTCDateStringWithoutYear = function() {
            return this.wotFormatDateWithoutYear(this.getUTCDate(), this.getUTCMonth());
        };

        Date.prototype.wotTimeString = function(time) {
            var h, m, s;

            if (time !== undefined) {
                time = Math.floor(time / 1000);
                s = time % 60;
                m = ( (time - s) / 60) % 60;
                h = (time - m * 60 - s) / (60*60) % 24;
                return this.wotFormatTime(h, m ,s);
            }

            return this.wotFormatTime(this.getHours(), this.getMinutes(), this.getSeconds());
        };

        Date.prototype.wotUTCTimeString = function() {
           return (PadZeros2(this.getUTCHours()) + wotTimeDelimiter + PadZeros2(this.getUTCMinutes()) + wotTimeDelimiter + PadZeros2(this.getUTCSeconds()));
        };

        Date.prototype.wotDateString = function() {
            return this.wotFormatDate();
        };
        Date.prototype.wotUTCDateString = function() {
            return this.wotFormatDate(this.getUTCDate(), this.getUTCMonth(), this.getUTCFullYear());
        };

        Date.prototype.wotDateTimeString = function() {
            return (this.wotDateString() + ' ' + this.wotFormatTimeHM());
        };
        Date.prototype.wotUTCDateTimeString = function() {
            return (this.wotUTCDateString() + ' ' + this.wotFormatTimeHM(this.getUTCHours(), this.getUTCMinutes()));
        };

        // time in seconds
        // after converting, norm value to be in the same in [0h 0m 0s .. 23h 59m 59s]
        Date.prototype.wotTimeFromUTC = function(time) {
            var offset = -this.getTimezoneOffset() * 60,
                day = 24 * 60 * 60;

            time = Math.floor(time / 1000);
            time += offset;
            time %= day;

            if (time < 0) {
                time += day;
            }
            return (time * 1000);
        };

        Date.prototype.wotToLocaleDayOfWeek = function(dayNumber) {

            if (dayNumber === undefined) {
                dayNumber = this.getDay();
            }

            switch(dayNumber) {
                case 0: return translate('TIME_SUNDAY');
                case 1: return translate('TIME_MONDAY');
                case 2: return translate('TIME_TUESDAY');
                case 3: return translate('TIME_WEDNESDAY');
                case 4: return translate('TIME_THURSDAY');
                case 5: return translate('TIME_FRIDAY');
                case 6: return translate('TIME_SATURDAY');
            }
            return this.getDay();
        };

        Date.prototype.wotToLocaleShortDayOfWeek = function(dayNumber) {
            var days = [
                translate('TIME_SHORT_SUNDAY'),
                translate('TIME_SHORT_MONDAY'),
                translate('TIME_SHORT_TUESDAY'),
                translate('TIME_SHORT_WEDNESDAY'),
                translate('TIME_SHORT_THURSDAY'),
                translate('TIME_SHORT_FRIDAY'),
                translate('TIME_SHORT_SATURDAY')
            ];

            if (dayNumber === undefined) {
                dayNumber = this.getDay();
            }

            return days[dayNumber] || this.getDay();
        };

        Date.prototype.wotToLocaleShortestDayOfWeek = function(dayNumber) {
            var days = [
                translate('TIME_MIN_SUNDAY'),
                translate('TIME_MIN_MONDAY'),
                translate('TIME_MIN_TUESDAY'),
                translate('TIME_MIN_WEDNESDAY'),
                translate('TIME_MIN_THURSDAY'),
                translate('TIME_MIN_FRIDAY'),
                translate('TIME_MIN_SATURDAY')
            ];

            if (dayNumber === undefined) {
                dayNumber = this.getDay();
            }

            return days[dayNumber] || this.getDay();
        };

        Date.prototype.wotToLocaleMonthName = function(monthNumber) {

            if (monthNumber === undefined) {
                monthNumber = this.getMonth();
            }

            switch(monthNumber) {
                case 0: return translate('TIME_JANUARY');
                case 1: return translate('TIME_FEBRUARY');
                case 2: return translate('TIME_MARCH');
                case 3: return translate('TIME_APRIL');
                case 4: return translate('TIME_MAY');
                case 5: return translate('TIME_JUNE');
                case 6: return translate('TIME_JULY');
                case 7: return translate('TIME_AUGUST');
                case 8: return translate('TIME_SEPTEMBER');
                case 9: return translate('TIME_OCTOBER');
                case 10: return translate('TIME_NOVEMBER');
                case 11: return translate('TIME_DECEMBER');
            }

            return this.getMonth();
        };

        Date.prototype.wotToLocaleDateString = function() {
            return (FormatDate(this.getDate(), this.wotToLocaleMonthName(), this.getFullYear(), ' ') + translate('TIME_YEAR_REDUCTION'));
        };

        Date.prototype.newUTCDate = function() {
            return new Date(
                this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(),
                this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(),
                this.getUTCMilliseconds()
            );
        };

        Date.prototype.wotToLocaleMonthShortName = function(monthNumber) {

            if (monthNumber === undefined) {
                monthNumber = this.getMonth();
            }

            switch(monthNumber) {
                case 0: return translate('TIME_SHORT_JANUARY');
                case 1: return translate('TIME_SHORT_FEBRUARY');
                case 2: return translate('TIME_SHORT_MARCH');
                case 3: return translate('TIME_SHORT_APRIL');
                case 4: return translate('TIME_SHORT_MAY');
                case 5: return translate('TIME_SHORT_JUNE');
                case 6: return translate('TIME_SHORT_JULY');
                case 7: return translate('TIME_SHORT_AUGUST');
                case 8: return translate('TIME_SHORT_SEPTEMBER');
                case 9: return translate('TIME_SHORT_OCTOBER');
                case 10: return translate('TIME_SHORT_NOVEMBER');
                case 11: return translate('TIME_SHORT_DECEMBER');
            }

            return this.getMonth();
        };

        Date.prototype.wotToLocaleDateStringShort = function() {
            return (FormatDate(this.getDate(), this.wotToLocaleMonthShortName(), this.getFullYear(), ' '));
        };

        Date.prototype.wotToLocaleDateStringShortWithoutYear = function() {
            return FormatDateWithoutYear(this.getDate(), this.wotToLocaleMonthShortName(), ' ');
        };

    };

    return obj;

})();

wgsdk.time.formatDatesRange = function(startDate, endDate, delimiter) {
    var startDateParts = {
            d: startDate.getDate(),
            m: startDate.getMonth(),
            y: startDate.getFullYear()
        },
        endDateParts = {
            d: endDate.getDate(),
            m: endDate.getMonth(),
            y: endDate.getFullYear()
        },
        currentYear = (new Date()).getFullYear(),
        value;

    delimiter = delimiter || '-';

    if (startDateParts.y !== endDateParts.y || startDateParts.y !== currentYear) {
        value = startDate.wotToLocaleDateStringShort();
    } else {
        value = startDate.wotToLocaleDateStringShortWithoutYear();
    }

    if (startDateParts.d !== endDateParts.d || startDateParts.m !== endDateParts.m || startDateParts.y !== endDateParts.y) {
        value += ' ' + delimiter + ' ';

        if (startDateParts.y !== endDateParts.y || endDateParts.y !== currentYear) {
            value += endDate.wotToLocaleDateStringShort();
        } else {
            value += endDate.wotToLocaleDateStringShortWithoutYear();
        }
    }

    return value;
};

function wotGetTimepickerDefaults() {
    var timeFormat = get_format('TIME_FORMAT');

    // 12-hour format strings from https://docs.djangoproject.com/en/dev/ref/templates/builtins/#date
    var timeTwelveHourFormats = ['A', 'a', 'f', 'g', 'h', 'P'];
    var timeTwelveHour = false;
    for (var i in timeTwelveHourFormats) {
        if (timeFormat.indexOf(timeTwelveHourFormats[i]) != -1) {
            timeTwelveHour = true;
        }
    }

    return {
        timeOnlyTitle: translate('TIME_DT_PICKER_CHOOSE_TIME'),
        timeText: translate('TIME_DT_PICKER_TIME'),
        hourText: translate('TIME_DT_PICKER_HOURS'),
        minuteText: translate('TIME_DT_PICKER_MINUTES'),
        secondText: translate('TIME_DT_PICKER_SECONDS'),
        currentText: translate('TIME_DT_PICKER_CURRENT'),
        closeText: translate('TIME_DT_PICKER_CLOSE'),
        cancelText: translate('TIME_DT_PICKER_CANCEL'),
        ampm: timeTwelveHour
    };
}

function wotGetDatepickerDefaults() {

    var date = new Date();

    return { closeText: translate('TIME_DT_PICKER_CLOSE'),
             prevText: translate('TIME_DT_PICKER_PREV'),
             nextText: translate('TIME_DT_PICKER_NEXT'),
             currentText: translate('TIME_DT_PICKER_TODAY'),
             monthNames: [ translate('TIME_JANUARY'),
                           translate('TIME_FEBRUARY'),
                           translate('TIME_MARCH'),
                           translate('TIME_APRIL'),
                           translate('TIME_MAY'),
                           translate('TIME_JUNE'),
                           translate('TIME_JULY'),
                           translate('TIME_AUGUST'),
                           translate('TIME_SEPTEMBER'),
                           translate('TIME_OCTOBER'),
                           translate('TIME_NOVEMBER'),
                           translate('TIME_DECEMBER')],
             monthNamesShort: [ translate('TIME_SHORT_JANUARY'),
                                translate('TIME_SHORT_FEBRUARY'),
                                translate('TIME_SHORT_MARCH'),
                                translate('TIME_SHORT_APRIL'),
                                translate('TIME_SHORT_MAY'),
                                translate('TIME_SHORT_JUNE'),
                                translate('TIME_SHORT_JULY'),
                                translate('TIME_SHORT_AUGUST'),
                                translate('TIME_SHORT_SEPTEMBER'),
                                translate('TIME_SHORT_OCTOBER'),
                                translate('TIME_SHORT_NOVEMBER'),
                                translate('TIME_SHORT_DECEMBER')],
             dayNames: [ translate('TIME_SUNDAY'),
                         translate('TIME_MONDAY'),
                         translate('TIME_TUESDAY'),
                         translate('TIME_WEDNESDAY'),
                         translate('TIME_THURSDAY'),
                         translate('TIME_FRIDAY'),
                         translate('TIME_SATURDAY')],
             dayNamesShort: [ translate('TIME_SHORT_SUNDAY'),
                              translate('TIME_SHORT_MONDAY'),
                              translate('TIME_SHORT_TUESDAY'),
                              translate('TIME_SHORT_WEDNESDAY'),
                              translate('TIME_SHORT_THURSDAY'),
                              translate('TIME_SHORT_FRIDAY'),
                              translate('TIME_SHORT_SATURDAY')],
             dayNamesMin: [ translate('TIME_MIN_SUNDAY'),
                            translate('TIME_MIN_MONDAY'),
                            translate('TIME_MIN_TUESDAY'),
                            translate('TIME_MIN_WEDNESDAY'),
                            translate('TIME_MIN_THURSDAY'),
                            translate('TIME_MIN_FRIDAY'),
                            translate('TIME_MIN_SATURDAY')],
             weekHeader: translate('TIME_DT_PICKER_WEEK_HEADER'),
             dateFormat: date.wotGetDatepickerDateFormat(),
             firstDay: 1,
             isRTL: false,
             showMonthAfterYear: false,
             yearSuffix: ''};
}


function wotUpdateDateTimeFields(selector_prefix) {
    if (selector_prefix) {
        selector_prefix = selector_prefix + ' ';
    } else {
        selector_prefix = '';
    }

    function GetDateObject(el) {
        var timestamp = parseInt(el.data('timestamp'), 10),
            date;

        if (!timestamp) {
            return undefined;
        }
        date = new Date(timestamp * 1000);
        return date;
    }

    jQuery(selector_prefix + '.js-datetime-format').each(function(i, v) {
        var el = jQuery(v),
            date = GetDateObject(el),
            str;

        if (date && date instanceof Date) {
            str = date.wotDateTimeString();
            if (str) {
                el.html(str);
            }
        }
    });

    jQuery(selector_prefix + '.js-date-format').each(function(i, v) {
        var el = jQuery(v),
            date = GetDateObject(el),
            str;

        if (date && date instanceof Date) {
            str = date.wotDateString();
            if (str) {
                el.html(str);
            }
        }
    });

    jQuery(selector_prefix + '.js-date-format-utc').each(function(i, v) {
        var el = jQuery(v),
            date = GetDateObject(el),
            str;

        if (date && date instanceof Date) {
            str = date.wotUTCDateString();
            if (str) {
                el.html(str);
            }
        }
    });

    jQuery(selector_prefix + '.js-date-format-without-year').each(function(i, v) {
        var el = jQuery(v),
            date = GetDateObject(el),
            str;

        if (date && date instanceof Date) {
            str = date.wotFormatDateWithoutYear();
            if (str) {
                el.html(str);
            }
        }
    });

    jQuery(selector_prefix + '.js-time-format').each(function(i, v) {
        var el = jQuery(v),
            date = GetDateObject(el),
            str;

        if (date && date instanceof Date) {
            str = date.wotFormatTimeHM();
            if (str) {
                el.html(str);
            }
        }
    });
}


// by default jQuery does not availbale in django admin
if (window.jQuery) {

    wgsdk.time.init();

    jQuery(document).ready(function() {
        wotUpdateDateTimeFields();
    });

    (function($) {

        var SECOND = 1000,
            MINUTE = 60 * SECOND,
            HOUR = 60 * MINUTE,
            DAY = 24 * HOUR;

        /**
         * Formats datetime value
         *
         * @param {Object} params
         * @param {boolean} params.relative
         * @param {boolean} params.HM - should Hours and Minutes will be returned with whole date for relative format
         * @param {String|Number} params.timestamp
         *
         * @returns {string}
         */
        function getFormatedDateTime(params) {
            var passedTimeStamp, parsedTimestamp,
                currentDateTime = new Date(),
                currentTimestamp = currentDateTime.getTime(),
                text = params.timestamp,
                dateDiff,
                cache;

            passedTimeStamp = parseInt(text, 10) * 1000;
            parsedTimestamp = new Date(passedTimeStamp);

            if (params.style === 'relative') {
                if (params.HM === undefined || params.HM === null) {
                    params.HM = true;
                }

                dateDiff = currentTimestamp - passedTimeStamp;

                if (dateDiff < 5 * MINUTE) {
                    text = window.gettext('только что');
                } else if (dateDiff < HOUR) {
                    cache = Math.floor(dateDiff / MINUTE);
                    text = (params.HM)
                        ? window.interpolate(window.ngettext('%(min)s минуту назад', '%(min)s минуты назад', cache), {'min': cache}, true)
                        : translate('DATETIME_ONE_HOUR_AGO');
                } else if (dateDiff < DAY) {
                    if (parsedTimestamp.getDay() === currentDateTime.getDay()) {
                        cache = Math.floor(dateDiff / HOUR);
                        text = (params.HM)
                            ? window.interpolate(window.ngettext('%(hours)s час назад', '%(hours)s часов назад', cache), {'hours': cache}, true)
                            : translate('DATETIME_TODAY');
                    } else {
                        text = (params.HM)
                            ? window.interpolate(window.gettext('вчера в %(time)s'), {'time': parsedTimestamp.wotFormatTimeHM()}, true)
                            : translate('DATETIME_YESTERDAY');
                    }
                } else {
                    text = parsedTimestamp.wotDateString();
                }
            } else {
                text = parsedTimestamp.wotDateTimeString();
            }

            return text;
        }

        $.fn.datetime = function(params) {
            var $ret;

            this.each( function() {
                var $elem = $(this),
                    dateTimeValue = params.timestamp || $elem.data('timestamp'),
                    dateTime = getFormatedDateTime($.extend({}, params, {'timestamp': dateTimeValue}));

                $elem.data('wg_datetime', dateTime);
                $elem.text(dateTime);
                $ret = ($ret ? $ret.add($elem) : $elem);
            });

            return $ret;
        };

        // wotTimePickerInit wotDatePickerInit start
        function wotDateTimePickerInitParams(params) {
            if (params.onClose) {
                var callback = params.onClose;
                params.onClose = function() {
                    callback();
                    $(this).parent().parent().removeClass('js-calendar-open');
                };
            } else {
                params.onClose = function() {
                    $(this).parent().parent().removeClass('js-calendar-open');
                };
            }
        }
        function wotTimePickerInit(widgetSelector, params) {
            wotDateTimePickerInitParams(params);
            widgetSelector.datetimepicker(params);
        }
        window.wotTimePickerInit = wotTimePickerInit;

        function wotDatePickerInit(widgetSelector, params) {
            wotDateTimePickerInitParams(params);
            widgetSelector.datepicker(params);
        }
        window.wotDatePickerInit = wotDatePickerInit;

        $(document).on('click', '.js-calendar-button', function() {
            if ($(this).parent().hasClass('js-calendar-open') ) {
                $(this).parent().removeClass('js-calendar-open');
            } else {
                $(this).parent().find('input').focus();
            }
        });
        $(document).on('focus', '.js-calendar-input', function() {
            $(this).parent().parent().addClass('js-calendar-open');
        });
        // wotTimePickerInit wotDatePickerInit end

        $(document).ready(function() {
            $('.js-relative-datetime-format').each(function(i, v) {
                $(this).datetime({'style': 'relative', 'HM': false});
            });
        });

    })(jQuery);

}


}
/*
     FILE ARCHIVED ON 06:48:34 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:21 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 223.02
  exclusion.robots: 0.186
  exclusion.robots.policy: 0.172
  RedisCDXSource: 2.542
  esindex: 0.011
  LoadShardBlock: 191.53 (3)
  PetaboxLoader3.datanode: 103.601 (5)
  CDXLines.iter: 25.457 (3)
  PetaboxLoader3.resolve: 172.429 (4)
  load_resource: 105.677 (2)
*/