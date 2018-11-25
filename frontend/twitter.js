const FollowToggle = require('./follow_toggle');
const UsersSearch = require('./users_search');
const TweetCompose = require('./tweet_compose');
const InfiniteTweets = require('./infinite_tweets');

$(function () {
  $('div.infinite-tweets').each((i, tweet) => new InfiniteTweets(tweet));
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
  $('.users-search').each((i, search) => new UsersSearch(search));
  $('form.tweet-compose').each((i, form) => new TweetCompose(form));
});
