/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

$(document).ready(function() {
  // --- our code goes here ---

  $('#tweet-text').on('input', function(event) {
    const amountTyped = $(this).val().trimStart().length;
    let counter = 140 - amountTyped;

    const form = $(this).parent();
    const counterElement = form.find('.counter');

    counterElement.text(counter);
    if (counter < 0) {
      counterElement.css('color','red');
    } else {
      counterElement.css('color','black');
    }
  });
});