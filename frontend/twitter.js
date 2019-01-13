import FollowToggle from './follow_toggle';
import UsersSearch from './users_search';
import TweetCompose from './tweet_compose';
import InfiniteTweets from './infinite_tweets';

$(function () {
  $('div.infinite-tweets').each((i, tweet) => new InfiniteTweets(tweet));
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
  $('.users-search').each((i, search) => new UsersSearch(search));
  $('form.tweet-compose').each((i, form) => new TweetCompose(form));
});
