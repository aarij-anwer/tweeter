/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// takes an object called `tweet` that represents a tweet
const createTweetElement = function(tweet) {
  const timeSince = timeago.format(tweet.created_at);
  const answer =
  `<article>
    <header>
      <div>
        <img src="${tweet.user.avatars}">
        <p class="name">${tweet.user.name}</p>
      </div>
      <p class="handle">${tweet.user.handle}</p>
    </header>
    <p class="tweet">${tweet.content.text}</p>
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
  tweets.forEach(element => {
    const $tweet = createTweetElement(element);
    $('#tweets-container').append($tweet);
  });
};

const loadTweets = function() {
  $.get("/tweets", function(data) {
    renderTweets(data);
  });
};

// renderTweets is called when the document is ready and loaded
$(document).ready(function() {

  loadTweets();

  $("#tweet").submit(function(event) {
    $.post("/tweets", $(this).serialize());
    event.preventDefault();
    $(this).find("#tweet-text").val('');
    $(this).find(".counter").val(140);
  });
});