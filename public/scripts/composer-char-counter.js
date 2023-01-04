
$(document).ready(function() {
  // --- our code goes here ---
  let counter = 140;

  $('#tweet-text').on('input', function(event) {
    let amountTyped = this.value.length;
    counter = 140 - amountTyped;

    const form = event.originalEvent.path[1];
    let counterElement = form[2];

    counterElement.value = counter;
    if (counter < 0) {
      counterElement.id = 'red';
    } else {
      counterElement.id = 'black';
    }
  });
});