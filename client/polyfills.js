/* eslint no-extend-native: 0 */
// core-js comes with Next.js. So, you can import it like below
import includes from 'core-js/library/fn/string/virtual/includes'
import repeat from 'core-js/library/fn/string/virtual/repeat'
import assign from 'core-js/library/fn/object/assign'
import find from 'array.prototype.find'

// Add your polyfills
// This files runs at the very beginning (even before React and Next.js core)

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

String.prototype.includes = includes
String.prototype.repeat = repeat
Object.assign = assign
Array.find = find

if (typeof Number.isFinite !== 'function') {
  Number.isFinite = function isFinite(value) {
      // 1. If Type(number) is not Number, return false.
      if (typeof value !== 'number') {
          return false;
      }
      // 2. If number is NaN, +∞, or −∞, return false.
      if (value !== value || value === Infinity || value === -Infinity) {
          return false;
      }
      // 3. Otherwise, return true.
      return true;
  };
}

window.fbAsyncInit = function() {
  FB.init({
      appId      : '2217653378534404',
      cookie     : true,
      xfbml      : true,
      version    : 'v5.0'
  });

  FB.AppEvents.logPageView();
};
