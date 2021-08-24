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

function initFancyboxConfigs(fancyBoxClass, hasTitle)
{
    $(fancyBoxClass).fancybox({
        'titlePosition': 'over',
        'titleShow'     : hasTitle
    });

}

var initializeFancyboxElements = function(){

    initFancyboxConfigs('.js-fancybox', true);
    initFancyboxConfigs('.js-fancybox-no-title', false);

    $('.js-fancybox-youtube-video').fancybox({
        'titleShow'     : true,
        'type'          : 'swf',
        'swf'           : {'wmode':'transparent','allowfullscreen':'true'}
    });
};

var fancyboxImageResizer = function(container){
        $('img', $(container)).each(function (index, elem) {
            createFancyboxWrappers(elem);
        });
        // Initialize image gallery
        initializeFancyboxElements();
};


var createFancyboxWrappers = function(elem) {
    if ($(elem).hasClass('fancybox-image')) {
        var src = $(elem).attr('src');
        var title = $(elem).attr('title');

        if (elem.className.match(/(?:^|\s)fancybox-gallery-/)) {
            // Create image gallery
            var classList = $(elem).attr('class').split(' ');
            var rel = (function (values) {
                var rel = '';
                $.each(values, function (index, value) {
                    if (value.match('^fancybox-gallery-')) {
                        rel = value.replace('fancybox-gallery-', '');
                    }
                });
                return rel;
            })(classList);

            $(elem).wrap($('<a/>').attr({
                'class': 'js-fancybox',
                title: title,
                rel: rel,
                href: src
            }));
        } else {
            // Create single-image fancybox
            $(elem).wrap($('<a/>').attr({
                title: title,
                href: src
            }));

            $($(elem).parent()).fancybox({
                'titlePosition': 'over'
            });

        }
    }
};


/*!
 * jQuery imagesLoaded plugin v2.0.1
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */

/*global jQuery: false */

(function($, undefined) {
'use strict';

var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function( callback ) {
	var $this = this,
		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
		hasNotify = $.isFunction(deferred.notify),
		$images = $this.find('img').add( $this.filter('img') ),
		loaded = [],
		proper = [],
		broken = [];

	function doneLoading() {
		var $proper = $(proper),
			$broken = $(broken);

		if ( deferred ) {
			if ( broken.length ) {
				deferred.reject( $images, $proper, $broken );
			} else {
				deferred.resolve( $images );
			}
		}

		if ( $.isFunction( callback ) ) {
			callback.call( $this, $images, $proper, $broken );
		}
	}

	function imgLoaded( img, isBroken ) {
		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
			return;
		}

		loaded.push( img );

		if ( isBroken ) {
			broken.push( img );
		} else {
			proper.push( img );
		}

		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

		if ( hasNotify ) {
			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
		}

		if ( $images.length === loaded.length ){
			setTimeout( doneLoading );
			$images.unbind( '.imagesLoaded' );
		}
	}

	if ( !$images.length ) {
		doneLoading();
	} else {
		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){
			imgLoaded( event.target, event.type === 'error' );
		}).each( function( i, el ) {
			var src = el.src;

			var cached = $.data( el, 'imagesLoaded' );
			if ( cached && cached.src === src ) {
				imgLoaded( el, cached.isBroken );
				return;
			}

			if ( el.complete && el.naturalWidth !== undefined ) {
				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
				return;
			}

			if ( el.readyState || el.complete ) {
				el.src = BLANK;
				el.src = src;
			}
		});
	}

	return deferred ? deferred.promise( $this ) : $this;
};

})(jQuery);


}
/*
     FILE ARCHIVED ON 06:48:57 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:24 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 80.372
  exclusion.robots: 0.157
  exclusion.robots.policy: 0.144
  RedisCDXSource: 2.682
  esindex: 0.011
  LoadShardBlock: 50.53 (3)
  PetaboxLoader3.datanode: 65.32 (5)
  CDXLines.iter: 22.547 (3)
  load_resource: 307.284 (2)
  PetaboxLoader3.resolve: 267.104 (2)
*/