/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// this function takes `str` representing user input and ensures its not vulnerable to XSS
const escapeMaliciousScripts = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// takes an object called `tweet` that represents a tweet
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
        <img class="avatar" src="${tweet.user.avatars}">
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
  $errorDialog.hide();
  $errorDialog.empty();

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

const slide = function(area) {
  if (area.is(":hidden")) {
    area.slideDown("slow");
  } else {
    area.slideUp("slow", () => {
      area.hide();
    });
  }
};

$(document).ready(function() {
  //load tweets first
  loadTweets();

  const $form = $("#tweet");
  const $tweetArea = $(".new-tweet");
  const $textArea = $tweetArea.find('#tweet-text');
  const $toggle = $(".toggle");
  $textArea.focus();
  
  //event handler for toggling new tweet area (stretch)
  $toggle.click(function(event) {
    slide($tweetArea);
    $textArea.focus();
  });
  
  //event handler for submitting new tweets
  $form.submit(function(event) {
    event.preventDefault();
    const $tweetText = $(this).find('#tweet-text').val().trimStart(); //remove whitespace from the beginning
    
    const $errorDialog = $('.error');
    
    if ($errorDialog) {
      $errorDialog.slideUp("slow", () => {
        $errorDialog.hide();
        $errorDialog.empty();
        postTweet($form, $tweetText);
      });
    } else {
      postTweet($form, $tweetText);
    }
    //focus on textarea so user can fix tweet or type new tweet
    $textArea.focus();
  });

});