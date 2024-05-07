/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  
];


$(() => {
  const createTweetElement = (tweet) => {
    //const newTweet = $(`<article class="tweet"> ${tweet.content.text} </article>`);
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
          <p>${tweet.created_at}</p>
          <div>
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-repeat"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `)
    return newTweet;
  };


  const renderTweets = (data) => {
    for (let tweet in data) {
      $('#tweet-container').append(createTweetElement(data[tweet]));
    }

  };

  renderTweets(data);

});