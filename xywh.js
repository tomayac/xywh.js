/**
 * Implements the spatial media fragments dimension of the W3C Media Fragments
 * URI specification as a polyfill. See
 * http://www.w3.org/TR/media-frags/#naming-space for the full details.
 *
 * The polyfill works for both images and videos, albeit for videos, your
 * mileage may vary, as this requires a wrapper element to be inserted, which
 * may interfere with already existing event handlers on the video and/or
 * existing style definitions that could affect the wrapper element.
 *
 * @author: Thomas Steiner (tomac@google.com)
 * @version: 0.0.1
 * @license: CC0
 */
var mediaFragments = (function(window, document) {
  var DEBUG = false;
  /**
   * Retrieves all media items with a spatial fragment identifier
   */
  function getAllMediaItems(opt_startElement) {
    var selector = 'img,video';
    var mediaItems = opt_startElement ?
        opt_startElement.querySelectorAll(selector) :
        document.querySelectorAll(selector);
    for (var i = 0, len = mediaItems.length; i < len; i++) {
      var mediaItem = mediaItems[i];
      // Make sure we support <video> with multiple <source> child elements:
      // in this case, the <video> @src attribute is empty, but the
      // @currentSrc is set
      var source = mediaItem.src || mediaItem.currentSrc;
      // See http://www.w3.org/TR/media-frags/#naming-space
      var xywhRegEx = /[#&\?]xywh\=(pixel\:|percent\:)?(\d+),(\d+),(\d+),(\d+)/;
      var match = xywhRegEx.exec(source);
      if (match) {
        var mediaFragment = {
          mediaItem: mediaItem,
          mediaType: mediaItem.nodeName.toLowerCase(),
          unit: (match[1] ? match[1] : 'pixel:'),
          x: match[2],
          y: match[3],
          w: match[4],
          h: match[5]
        };
        if (DEBUG) console.log(match[0]);
        applyFragment(mediaFragment);
      }
    }
  }

  /**
   * Applies the spatial media fragment:
   *
   * For images, we replace the @src attribute with a transparent GIF data URL,
   * resize the image to match the fragment's dimensions, and set the image's
   * CSS background-image according to the fragment's x and y values.
   *
   * For videos, we wrap the video in a <div> wrapper of the fragment's
   * dimensions, set its CSS overflow value to "hidden", and apply a CSS3
   * 2D transformation according to the fragment's x and y values.
   */
  function applyFragment(fragment) {
    var mediaItem = fragment.mediaItem;
    var x, y, w, h;
    // Unit is pixel:
    if (fragment.unit === 'pixel:') {
      w = fragment.w + 'px';
      h = fragment.h + 'px';
      x = '-' + fragment.x + 'px';
      y = '-' + fragment.y + 'px';
    // Unit is percent:
    } else {
      var originalWidth = mediaItem.width || mediaItem.videoWidth;
      var originalHeight = mediaItem.height || mediaItem.videoHeight;
      w = (originalWidth * fragment.w / 100) + 'px';
      h = (originalHeight * fragment.h / 100) + 'px';
      x = '-' + (originalWidth * fragment.x / 100) + 'px';
      y = '-' + (originalHeight * fragment.y / 100) + 'px';
    }
    // Media item is a video
    if (fragment.mediaType === 'video') {
      var wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.width = w;
      wrapper.style.height = h;

      mediaItem.style.transform =
          'translate(' + x + ',' + y + ')';
      mediaItem.style['-webkit-transform'] =
          'translate(' + x + ',' + y + ')';
      // Evil DOM operations
      mediaItem.parentNode.insertBefore(wrapper, mediaItem);
      wrapper.appendChild(mediaItem);

      // We need to manually trigger @autoplay, as DOM access seems to kill it
      if (mediaItem.hasAttribute('autoplay')) {
        mediaItem.play();
      }
    // Media item is an image
    } else {
      mediaItem.setAttribute('style',
          'width:' + w + '; '+
          'height:' + h + '; ' +
          'background:url(' + mediaItem.src + ') ' + // background-image
          'no-repeat ' + // background-repeat
          x + ' ' + y + ';'); // background-position
      // Base64-encoded transparent 1x1 pixel GIF
      mediaItem.src = 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    }
  }

  /**
   * Starts the media fragment application process when the document has loaded.
   */
  window.addEventListener('load', function() {
    getAllMediaItems();
  });

  return {
    /**
     * Initializes the media fragment application process. Pretty useless for now,
     * but may prove useful in the future for more advanced intermediate steps.
     */
    apply: function init() {
      getAllMediaItems();
    }
  };

})(window, document);