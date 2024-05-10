/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {
  loadTweets();
  $("#submit-tweet").on("submit", onSubmit);
  $("#new-tweet-btn").on("click", slideForm);
});

/////////////////////HELPER FUNCTIONS ///////////////////////////////////

/**
 * Function to togle new tweet form.
 */
const slideForm = function() {
  const newTweetForm = $("#form-toggle");
  newTweetForm.slideToggle("slow", ()=> {
    $(".tweet-text").focus();
  });
};


/**
 * Function to protect XSS
 * @param {*} str 
 * @returns 
 */
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

/**
   * Function to create HTML tweets,
   * @param {*} tweet
   * @returns html
   */
const createTweetElement = (tweet) => {
  const newTweet = $(`
      <article class="tweet"> 
      <header>
        <div class="profile">
          <img src="${tweet.user.avatars}"> 
          <span>${tweet.user.name}</span>
        </div>
        <div class="user_id">
          <span>${tweet.user.handle}</span>
        </div>
      </header>
      <p>
        ${tweet.content.text}
      </p>
      <footer>
        <p>${timeago.format(tweet.created_at)}</p>
        <div>
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-repeat"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
  return newTweet;
};


  /**
 * Function to render tweets data
 * @param {*} tweets
 */
const renderTweets = (tweets) => {
  const container = $("#tweet-container");

  for (let tweet of tweets) {
    const element = createTweetElement(tweet);
    container.prepend(element);
  }
};

/**
 * Callback/handler function that is passed to the event listener of submit form.
 * @param {*} event
 */
const onSubmit = function(event) {
  event.preventDefault();
  const container = $("#tweet-container");
  const errorContainer = $("#error-message");
  const serializedForm = $(this).serialize();
  const tweetText = $(".tweet-text").val();
  errorContainer.slideUp();
  if (isTweetValid()) {
    const errorContainer = $("#error-message");
    errorContainer.empty();
    $.post("/tweets", serializedForm)
    .then(() => {
      container.empty();
      loadTweets();
    })
    .then(() => {
      $(this).find(".tweet-text").val("");
      $(this).find(".counter").text("140");
      $(this).find(".counter").removeClass("counter-red");
      console.log('Tweet sent');
    })
    .catch(error => {
      errorMessage(`Error submitting tweets: ${error.text}`);
    })
  }
};

/**
 * Function to validate if a tweet is valid based on character count.
 * @returns boolean
 */

/**
 * Function to validate if a tweet is valid based on character count.
 * @returns boolean
 */
const isTweetValid = function() {
  const isTweetValid = function(tweetText) {
    const tweetTooLong = "<img src='https://i.imgur.com/GnyDvKN.png'> <p>Oh dear! It looks like you're trying to squeeze in more than the allowed 140 characters. Our little birdies have delicate ears and can only handle so much chatter. Please trim down your tweet to keep our aviary harmonious!</p>";
    const noTweet = "<img src='https://i.imgur.com/GnyDvKN.png'> <p>Oops! It seems like you're trying to send a tweet without any text. Our birds are quite picky eaters and they demand some words to chirp about. Please add some text to your tweet before sending it!</p>";
  if (tweetText === "") {
    errorMessage(noTweet);
      return false;
  }
  if (tweetText.length > 140) {
    errorMessage(tweetTooLong);
    return false;
  }
  return true;
};

/**
 * Function that handles the behaviour of error messages.
 * @param {*} errorText
 */
const errorMessage = function(errorText) {
  const container = $("#error-message");
  container.empty();
  container.append(errorText);
  container.slideDown();
};

/**
* function that fetches tweets from backend and appends them to the HTML.
*/
const loadTweets = function() {
$.get("/tweets")
.then((data) => {
  renderTweets(data);
})
.catch(error) => {
  errorMessage(`Error loading tweets: ${error.text}`);
}
};