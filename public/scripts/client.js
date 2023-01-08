/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// takes an object called `tweet` that represents a tweet
// escapeMaliciousScripts() function is in the helpers.js file
const createTweetElement = function(tweet) {
  const timeSince = timeago.format(tweet.created_at);

  //protection against XSS
  const userName = escapeMaliciousScripts(tweet.user.name);
  const userHandle = escapeMaliciousScripts(tweet.user.handle);
  const userTweet = escapeMaliciousScripts(tweet.content.text);
  const answer =
  `<article>
    <header>
      <div>
        <img alt="Avatar of tweeter" class="avatar" src="${tweet.user.avatars}">
        <p class="name">${userName}</p>
      </div>
      <p class="handle">${userHandle}</p>
    </header>
    <p class="tweet">${userTweet}</p>
    <span><hr /></span>
    <footer>
      <p class="days">${timeSince}</p>
      <div>
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </footer>
  </article>`;

  return answer;
};

// loops through `tweets` array, containing objects representing a tweet
// calls createTweetElement for each tweet
// takes return value and appends it to the tweets container
const renderTweets = function(tweets) {
  const $tweetContainer = $("#tweets-container");

  $tweetContainer.empty();
  tweets.forEach(element => {
    const $tweet = createTweetElement(element);
    $tweetContainer.prepend($tweet); //changed to show the earliest tweet first
  });
};

// `loadTweets` makes a GET request to /tweets and then calls `renderTweets` to display the data
const loadTweets = function() {
  //hide the error dialog
  const $errorDialog = $('.error');
  clearDialog($errorDialog);
  
  //make GET request for tweets and pass that on to `renderTweets` to display
  $.get("/tweets", function(data) {
    renderTweets(data);
  });
};

//validate that `tweetText` is > 0 and <= 140
const validate = function(tweetText) {
  let answer = true;
  const $errorDialog = $('.error');

  if (tweetText.length === 0) {
    $errorDialog.html("⛔️ Nothing to tweet! Please add at least 1 character (excluding whitespace) to your tweet!");
    $errorDialog.slideDown("slow");
    answer = false;
  }
  
  if (tweetText.length > 140) {
    $errorDialog.html("⛔️ Tweet is too long! Please ensure your tweet is 140 characters or less.");
    $errorDialog.slideDown("slow");
    answer = false;
  }
  
  return answer;
};

const postTweet = function(form, tweetText) {
  //validate the tweet
  if (validate(tweetText)) {
  //tweet is valid, send a post request
    $.post("/tweets", form.serialize(), (response) => {
    //in the callback to the post request, clear the text, reset counter and reload the page
      form.find("#tweet-text").val('');
      form.find(".counter").val(140);
      loadTweets();
    });
  }
};

//main function where all the magic happens :)
$(document).ready(function() {
  //reference all the necessary DOM elements
  const $form = $("#tweet");
  const $tweetArea = $(".new-tweet");
  const $textArea = $tweetArea.find('#tweet-text');
  const $toggle = $(".toggle");
  const $errorDialog = $('.error');
  
  //load tweets and focus on textarea so user can type right away
  loadTweets();
  $textArea.focus();
  
  //event handler for hiding/unhiding compose tweet elements when "new" is clicked in the header (stretch)
  $toggle.click(function(event) {
    slideDialog($tweetArea);
    $textArea.focus();
  });
  
  //event handler for submitting new tweets
  $form.submit(function(event) {
    event.preventDefault();
    const $tweetText = $textArea.val().trimStart(); //remove whitespace from the beginning
    
    if ($errorDialog) {
      //error dialog is visible due to a previous validation error
      $errorDialog.slideUp("slow", () => {
        //slideUp needs to finish and then post the Tweet
        //otherwise the UX is choppy
        clearDialog($errorDialog);
        postTweet($form, $tweetText);
      });
    } else {
      //no error, so post tweet
      postTweet($form, $tweetText);
    }
    //focus on textarea so user can fix tweet or type new tweet
    $textArea.focus();
  });

});