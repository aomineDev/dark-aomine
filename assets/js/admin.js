/*!
 * Waves v0.6.4
 * http://fian.my.id/Waves
 *
 * Copyright 2014 Alfiana E. Sibuea and other contributors
 * Released under the MIT license
 * https://github.com/fians/Waves/blob/master/LICENSE
 */

 ;(function(window) {
  'use strict';

  var Waves = Waves || {};
  var $$ = document.querySelectorAll.bind(document);

  // Find exact position of element
  function isWindow(obj) {
    return obj !== null && obj === obj.window;
  }

  function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }

  function offset(elem) {
    var docElem, win,
    box = {top: 0, left: 0},
    doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  }

  function convertStyle(obj) {
    var style = '';

    for (var a in obj) {
      if (obj.hasOwnProperty(a)) {
        style += (a + ':' + obj[a] + ';');
      }
    }

    return style;
  }

  var Effect = {

  // Effect delay
  duration: 750,

  show: function(e, element) {

  // Disable right click
  if (e.button === 2) {
    return false;
  }

  var el = element || this;

  // Create ripple
  var ripple = document.createElement('div');
  ripple.className = 'waves-ripple';
  el.appendChild(ripple);

   // Get click coordinate and element witdh
   var pos         = offset(el);
   var relativeY   = (e.pageY - pos.top);
   var relativeX   = (e.pageX - pos.left);
   var scale       = 'scale('+((el.clientWidth / 100) * 10)+')';

  // Support for touch devices
  if ('touches' in e) {
    relativeY   = (e.touches[0].pageY - pos.top);
    relativeX   = (e.touches[0].pageX - pos.left);
  }

  // Attach data to element
  ripple.setAttribute('data-hold', Date.now());
  ripple.setAttribute('data-scale', scale);
  ripple.setAttribute('data-x', relativeX);
  ripple.setAttribute('data-y', relativeY);

  // Set ripple position
  var rippleStyle = {
    'top': relativeY+'px',
    'left': relativeX+'px'
  };

  // Scale the ripple
  rippleStyle['-webkit-transform'] = scale;
  rippleStyle['-moz-transform'] = scale;
  rippleStyle['-ms-transform'] = scale;
  rippleStyle['-o-transform'] = scale;
  rippleStyle.transform = scale;
  rippleStyle.opacity   = '1';

  rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
  rippleStyle['-moz-transition-duration']    = Effect.duration + 'ms';
  rippleStyle['-o-transition-duration']      = Effect.duration + 'ms';
  rippleStyle['transition-duration']         = Effect.duration + 'ms';

  rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
  rippleStyle['-moz-transition-timing-function']    = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
  rippleStyle['-o-transition-timing-function']      = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
  rippleStyle['transition-timing-function']         = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

  ripple.setAttribute('style', convertStyle(rippleStyle));
},

hide: function(e) {
  TouchHandler.touchup(e);

  var el = this;
  var width = el.clientWidth * 1.4;

  // Get first ripple
  var ripple = null;
  var ripples = el.getElementsByClassName('waves-ripple');
  if (ripples.length > 0) {
    ripple = ripples[ripples.length - 1];
  } else {
    return false;
  }

  var relativeX   = ripple.getAttribute('data-x');
  var relativeY   = ripple.getAttribute('data-y');
  var scale       = ripple.getAttribute('data-scale');

  // Get delay beetween mousedown and mouse leave
  var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
  var delay = 350 - diff;

  if (delay < 0) {
    delay = 0;
  }

  // Fade out ripple after delay
  setTimeout(function() {
    var style = {
      'top': relativeY+'px',
      'left': relativeX+'px',
      'opacity': '0',

    // Duration
    '-webkit-transition-duration': Effect.duration + 'ms',
    '-moz-transition-duration': Effect.duration + 'ms',
    '-o-transition-duration': Effect.duration + 'ms',
    'transition-duration': Effect.duration + 'ms',
    '-webkit-transform': scale,
    '-moz-transform': scale,
    '-ms-transform': scale,
    '-o-transform': scale,
    'transform': scale,
  };

  ripple.setAttribute('style', convertStyle(style));

  setTimeout(function() {
    try {
      el.removeChild(ripple);
    } catch(e) {
      return false;
    }
  }, Effect.duration);
}, delay);
},

  // Little hack to make <input> can perform waves effect
  wrapInput: function(elements) {
    for (var a = 0; a < elements.length; a++) {
      var el = elements[a];

      if (el.tagName.toLowerCase() === 'input') {
        var parent = el.parentNode;

        // If input already have parent just pass through
        if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves') !== -1) {
          continue;
        }
      }
    }
  }
};


/**
* Disable mousedown event for 500ms during and after touch
*/
var TouchHandler = {
/* uses an integer rather than bool so there's no issues with
* needing to clear timeouts if another touch event occurred 
* within the 500ms. Cannot mouseup between touchstart and
* touchend, nor in the 500ms after touchend. */
touches: 0,
allowEvent: function(e) {
  var allow = true;

  if (e.type === 'touchstart') {
    TouchHandler.touches += 1; //push
  } else if (e.type === 'touchend' || e.type === 'touchcancel') {
    setTimeout(function() {
      if (TouchHandler.touches > 0) {
        TouchHandler.touches -= 1; //pop after 500ms
      }
    }, 500);
  } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
    allow = false;
  }

  return allow;
},
touchup: function(e) {
  TouchHandler.allowEvent(e);
}
};

/**
 * Delegated click handler for .waves-effect element.
 * returns null when .waves-effect element not in "click tree"
 */
 function getWavesEffectElement(e) {
  if (TouchHandler.allowEvent(e) === false) {
    return null;
  }

  var element = null;
  var target = e.target || e.srcElement;

  while (target.parentNode !== null) {
    if (!(target instanceof SVGElement) && target.className.indexOf('waves') !== -1) {
      element = target;
      break;
    }
    target = target.parentNode;
  }
  return element;
}

/**
* Bubble the click and show effect if .waves-effect elem was found
*/
function showEffect(e) {
  var element = getWavesEffectElement(e);

  if (element !== null) {
    Effect.show(e, element);

    if ('ontouchstart' in window) {
      element.addEventListener('touchend', Effect.hide, false);
      element.addEventListener('touchcancel', Effect.hide, false);
    }

    element.addEventListener('mouseup', Effect.hide, false);
    element.addEventListener('mouseleave', Effect.hide, false);
    element.addEventListener('dragend', Effect.hide, false);
  }
}

Waves.displayEffect = function(options) {
  options = options || {};

  if ('duration' in options) {
    Effect.duration = options.duration;
  }

//Wrap input inside <i> tag
Effect.wrapInput($$('.waves'));

if ('ontouchstart' in window) {
  document.body.addEventListener('touchstart', showEffect, false);
}

document.body.addEventListener('mousedown', showEffect, false);
};

/**
* Attach Waves to an input element (or any element which doesn't
* bubble mouseup/mousedown events).
*   Intended to be used with dynamically loaded forms/inputs, or
* where the user doesn't want a delegated click handler.
*/
Waves.attach = function(element) {
  //FUTURE: automatically add waves classes and allow users
  // to specify them with an options param? Eg. light/classic/button
  if (element.tagName.toLowerCase() === 'input') {
    Effect.wrapInput([element]);
    element = element.parentNode;
  }

  if ('ontouchstart' in window) {
    element.addEventListener('touchstart', showEffect, false);
  }

  element.addEventListener('mousedown', showEffect, false);
};

window.Waves = Waves;

document.addEventListener('DOMContentLoaded', function() {
  Waves.displayEffect();
}, false);

})(window);

// VARIABLES

// Body
const $body = document.body;

// Loading
const $loading = document.querySelector('.loading');

// LOADING

var $ = {};

$.Particle = function( opt ) {
  this.radius = 7;
  this.x = opt.x;
  this.y = opt.y;
  this.angle = opt.angle;
  this.speed = opt.speed;
  this.accel = opt.accel;
  this.decay = 0.01;
  this.life = 1;
};

$.Particle.prototype.step = function( i ) {
  this.speed += this.accel;
  this.x += Math.cos( this.angle ) * this.speed;
  this.y += Math.sin( this.angle ) * this.speed;
  this.angle += $.PI / 64;
  this.accel *= 1.01;
  this.life -= this.decay;

  if( this.life <= 0 ) {
    $.particles.splice( i, 1 );
  }
};

$.Particle.prototype.draw = function( i ) {
  $.ctx.fillStyle = $.ctx.strokeStyle = 'hsla(' + ( $.tick + ( this.life * 120 ) ) + ', 100%, 60%, ' + this.life + ')';
  $.ctx.beginPath();
  if( $.particles[ i - 1 ] ) {
    $.ctx.moveTo( this.x, this.y );
    $.ctx.lineTo( $.particles[ i - 1 ].x, $.particles[ i - 1 ].y );
  }
  $.ctx.stroke();

  $.ctx.beginPath();
  $.ctx.arc( this.x, this.y, Math.max( 0.001, this.life * this.radius ), 0, $.TWO_PI );
  $.ctx.fill();

  var size = Math.random() * 1.25;
  $.ctx.fillRect( ~~( this.x + ( ( Math.random() - 0.5 ) * 35 ) * this.life ), ~~( this.y + ( ( Math.random() - 0.5 ) * 35 ) * this.life ), size, size );
}

$.step = function() {
  $.particles.push( new $.Particle({
    x: $.width / 2 + Math.cos( $.tick / 20 ) * $.min / 2,
    y: $.height / 2 + Math.sin( $.tick / 20 ) * $.min / 2,
    angle: $.globalRotation + $.globalAngle,
    speed: 0,
    accel: 0.01
  }));

  $.particles.forEach( function( elem, index ) {
    elem.step( index );
  });

  $.globalRotation += $.PI / 6;
  $.globalAngle += $.PI / 6;
};

$.draw = function() {
  $.ctx.clearRect( 0, 0, $.width, $.height );

  $.particles.forEach( function( elem, index ) {
    elem.draw( index );
  });
};

$.init = function() {
  $.canvas = document.createElement( 'canvas' );
  $.ctx = $.canvas.getContext( '2d' );
  $.width = 300;
  $.height = 300;
  $.canvas.width = $.width * window.devicePixelRatio;
  $.canvas.height = $.height * window.devicePixelRatio;
  $.canvas.style.width = $.width + 'px';
  $.canvas.style.height = $.height + 'px';
  $.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  $.min = $.width * 0.5;
  $.particles = [];
  $.globalAngle = 0;
  $.globalRotation = 0;
  $.tick = 0;
  $.PI = Math.PI;
  $.TWO_PI = $.PI * 2;
  $.ctx.globalCompositeOperation = 'lighter';
  $loading.appendChild( $.canvas );
  $.loop();
};

$.loop = function() {
  requestAnimationFrame( $.loop );
  $.step();
  $.draw();
  $.tick++;
};

$.init();

/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
* @license MIT */

;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.NProgress = factory();
  }

})(this, function() {
  var NProgress = {};

  NProgress.version = '0.2.0';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    barSelector: '[role="bar"]',
    parent: '.loading',
    template: '<div class="bar" role="bar"></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
   NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

   NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

   NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
    bar      = progress.querySelector(Settings.barSelector),
    speed    = Settings.speed,
    ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
       setTimeout(next, speed);
     }
   });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
   NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

   NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

   NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   *
   * @param $promise jQUery Promise
   */
   (function() {
    var initial = 0, current = 0;

    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() === "resolved") {
        return this;
      }

      if (current === 0) {
        NProgress.start();
      }

      initial++;
      current++;

      $promise.always(function() {
        current--;
        if (current === 0) {
          initial = 0;
          NProgress.done();
        } else {
          NProgress.set((initial - current) / initial);
        }
      });

      return this;
    };

  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

   NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.querySelector('.nprogress');


    var progress = document.createElement('div');
    progress.className = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
    perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
    parent   = document.querySelector(Settings.parent);

    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

   NProgress.remove = function() {
    var progress = document.querySelector('.nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

   NProgress.isRendered = function() {
    return !!document.querySelector('.nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

   NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
    ('MozTransform' in bodyStyle) ? 'Moz' :
    ('msTransform' in bodyStyle) ? 'ms' :
    ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

   function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

   function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

   function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

   var queue = (function() {
    var pending = [];

    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

   var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
    cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
      capName = name.charAt(0).toUpperCase() + name.slice(1),
      vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
      prop, 
      value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

   function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

   function addClass(element, name) {
    var oldList = classList(element),
    newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

   function removeClass(element, name) {
    var oldList = classList(element),
    newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

   function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

   function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});

NProgress.start();

// WINDOW / DOCUMENT EVENTS

// Completely Loaded
window.addEventListener('load', function() {
// Loading
$loading.style.opacity = '0';
setTimeout(()=>{
  $loading.style.display = 'none';
}, 500);
NProgress.done();
});

//DOM Loaded
window.addEventListener('DOMContentLoaded', function() {
   //AOS
   AOS.init();
 });