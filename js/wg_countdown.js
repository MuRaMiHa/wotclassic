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

var WG = (function($, WG) {
    'use strict';

    WG.countdown = function(selector, options) {

        var defaultOptions = {
            secondsLeft: 0,
            digitSlideSpeed: 500,
            digitWidth: 29,
            digitHeight: 44,
            interval: 1000,
            onFinish: function() {}
        };

        this.options = $.extend({}, defaultOptions, options || {});
        this.$container = $(selector);
        
        this.init();
    };

    WG.countdown.prototype = {

        init: function() {
            this._timeLeft = this.options.startTime;
            this._timeLeftString = '';
            this._timeLeftStringPrev = '';
            this._startTimestamp = new Date().getTime();
            this._timer = undefined;

            this.timeFunc(true);
        },

        timeFunc: function(immidiate) {
            var self = this;
            clearTimeout(this._timer);
            this._timer = setTimeout(function(){ self.timeFunc(); }, this.options.interval);
            this.update(immidiate);

        },

        /* Number with leading zero */
        lz: function(number) {
            return (number < 10 ? '0' : '') + number;
        },

        calculate: function() {
            var days, hours, mins, secs, diff, timeLeft;
            
            diff = ((new Date()).getTime() - this._startTimestamp);

            this._timeLeft = timeLeft = this.options.secondsLeft - Math.round(diff / 1000);

            if (timeLeft < 0) {
                this.checkFinish();
            }

            secs = Math.round(timeLeft % 60);
            timeLeft = Math.floor(timeLeft / 60);
            mins = Math.round(timeLeft % 60);
            timeLeft = Math.floor(timeLeft / 60);
            hours = Math.round(timeLeft % 24);
            timeLeft = Math.floor(timeLeft / 24);
            days = Math.round(timeLeft % 99);
            timeLeft = Math.floor(timeLeft / 99);
            
            if (timeLeft > 0) {
                days = 99;
            }

            this._timeLeftStringPrev = this._timeLeftString;

            this._timeLeftString = this.lz(days) + this.lz(hours) + this.lz(mins) + this.lz(secs);

        },

        animate: function(immidiate) {
            var prevDigit, nextDigit, nextDigitPositionY, $digit, i;

            for (i = 1; i < 9; i++) {
                $digit = this.$container.find('.js-digit-' + i);

                prevDigit = parseInt(this._timeLeftStringPrev.charAt(i-1), 10);
                nextDigit = parseInt(this._timeLeftString.charAt(i-1), 10);
                nextDigit = (nextDigit + 10) % 10;
                nextDigitPositionY = -(nextDigit * this.options.digitHeight);

                if ((prevDigit !== nextDigit) || immidiate === true) {
                
                    if (nextDigit === 9) {
                        $digit.css('top', -(this.options.digitHeight * 10));
                    }

                    if (nextDigit === 5 && $digit.hasClass('js-digit-max-5')) {
                        $digit.css('top', -(this.options.digitHeight * 6));
                    }

                    if (nextDigit === 2 && $digit.hasClass('js-digit-max-2')) {
                        $digit.css('top', -(this.options.digitHeight * 3));
                    }
                    
                    if (immidiate === true) {
                        $digit.css({ top: nextDigitPositionY + 'px'});
                    } else {
                        $digit.stop(true, true).animate({
                            top: nextDigitPositionY + 'px'
                        }, this.options.digitSlideSpeed);
                    }

                }
                
            }

            this.checkFinish();
        },

        checkFinish: function() {
            if (this._timeLeft > 0) {
                return false;
            }       

            clearTimeout(this._timer);
            this.options.onFinish();
            return true;
        },

        update: function(immidiate) {
            this.calculate();    
            this.animate(immidiate);
        }

    };

    return WG;

})(jQuery, window.WG || {});

}
/*
     FILE ARCHIVED ON 06:49:06 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:23 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.126
  load_resource: 285.568 (2)
  CDXLines.iter: 21.254 (3)
  esindex: 0.012
  PetaboxLoader3.resolve: 161.061 (2)
  captures_list: 140.224
  PetaboxLoader3.datanode: 205.975 (5)
  LoadShardBlock: 107.764 (3)
  exclusion.robots: 0.136
  RedisCDXSource: 7.795
*/