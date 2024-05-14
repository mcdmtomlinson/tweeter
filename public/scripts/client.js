/*
* Client-side JS logic goes here
*/

$(() => {
 loadTweets();
 $("#submit-tweet").on("submit", onSubmit);
 $("#new-tweet-btn").on("click", slideForm);
 $("#second-toggle-btn").on("click", function() {
   slideForm();
   window.scrollTo({
     top:0,
     left:0,
     behavior: "smooth"
   });
   $("#container-second-toggle-btn").fadeOut();
 });
 $(window).on("scroll", toggleButton);
});

/////////////////////////////////////////////////////////////////////HELPER FUNCTIONS /////////////////////////////////////////////////////////

let lastScrollTop = 0;
let isScrollingDown = false;

const toggleButton = function() {
 const toggleButton = $("#container-second-toggle-btn");
 const currentScrollTop = $(this).scrollTop();
 
 if (currentScrollTop > lastScrollTop) {
   toggleButton.fadeIn();
   isScrollingDown = true;
 } else {
   if (!isScrollingDown) {
     toggleButton.fadeOut();
   }
   isScrollingDown = false;
 }
 
 lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

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
       ${escape(tweet.content.text)}
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

 if (isTweetValid(tweetText)) {
   const errorContainer = $("#error-message");
   errorContainer.empty();
   $.post("/tweets", serializedForm)
     .then(() => {
       container.empty();
     })
     .then(() => {
       $(this).find(".tweet-text").val("");
       $(this).find(".counter").text("140");
       $(this).find(".counter").removeClass("counter-red");
       loadTweets();
     })
     .catch((error) => {
       errorMessage(`Error submitting tweets: ${error.text}`);
     });
 }
};

/**
* Function to validate if a tweet is valid based on character count.
* @returns boolean
*/
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
   .catch((error) => {
     errorMessage(`Error loading tweets: ${error.text}`);
   });
};
  const validatingForm = () => {
    const textInput = $('#tweet-text').val();

    if (textInput.length > 140) {
      return { status: false, message: ERROR_MESSAGE.too_long };
    } else if (!textInput || textInput.length === 1) {
      // textInput.length to send error if enter is pressed with no message
      return {
        status: false,
        message: ERROR_MESSAGE.empty,
      };
    }
    return { status: true };
  };

  const createTweetElement = (newTweet) => {
    const { name, avatars, handle } = newTweet.user;
    const message = newTweet.content.text;
    const createdAt = newTweet.created_at;
    const diff = moment(createdAt).fromNow();

    const tweetHTML = `
<article>
<div class="tweet-header">
  <div class="profile">
    <img src="${avatars}" alt="" id="avatars"/>
    <span id="sender-name">${name}</span>
  </div>
  <div id="tweeter-account">${handle}</div>
</div>
<p class="tweet-text">${escape(message)}</p>
<div class="more-info">
  <div id="created-at">${diff}</div>
  <div class="icons">
    <i class="fas fa-flag fa-xs"></i>
    <i class="far fa-retweet fa-xs"></i>
    <i class="far fa-heart fa-xs"></i>
  </div>
</div>
</article>
`;

    return tweetHTML;
  };

  const renderTweets = (tweets) => {
    $('#tweets-container').empty();
    const render = tweets.map((tweet) => {
      const newTweet = createTweetElement(tweet);
      $('#tweets-container').prepend(newTweet);
    });
  };

  const renderErrorMessage = (message) => {
    const errorDiv = $(
      `<div class="error-message"><i class="fal fa-exclamation-triangle"></i>${message}<i class="fal fa-exclamation-triangle"></i></div>`
    ).hide();
    $('section').append(errorDiv);
    errorDiv.slideDown(900);
  };

  const loadTweets = () => {
    $.get('http://localhost:8080/tweets').then((fetchedData) => renderTweets(fetchedData));
  };

  // Load old tweets when webpage loaded first time
  loadTweets();

  $('.form').submit(function (e) {
    e.preventDefault();
    // remove error-message element if exists
    $('.error-message').remove();
    const formValidation = validatingForm();

    // validate form and set error message
    if (!formValidation.status) {
      renderErrorMessage(formValidation.message);
      return;
    }
    const serializedData = $(this).serialize();
    $.post('http://localhost:8080/tweets', serializedData).then(() => {
      loadTweets();

      // empty tweeter input area
      $('#tweet-text').val('');

      // reset character count
      $('#chars').text(140);
    });
  });

  // Allow user to submit tweet pressing 'enter' button
  $('.form').keyup(function (e) {
    e.preventDefault();
    // 13 for enter
    if (e.which === 13) {
      $('.form').submit();
      return;
    }
  });
