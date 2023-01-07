/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/* All generic, non-Tweeter specific helper functions are in this file */

// this function takes `str` representing user input and ensures its not vulnerable to XSS
const escapeMaliciousScripts = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//clears `element` of text and hides it
const clearDialog = function(element) {
  element.hide();
  element.empty();
};

//hides `element` if visible, shows it if hidden using slideDown and slideUp
const slideDialog = function(element) {
  if (element.is(":hidden")) {
    element.slideDown("slow");
  } else {
    element.slideUp("slow", () => {
      element.hide();
    });
  }
};