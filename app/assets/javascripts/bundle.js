/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/twitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/api_util.js":
/*!******************************!*\
  !*** ./frontend/api_util.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

const APIUtil = {

  followUser: id => APIUtil.changeFollowStatus(id, 'POST'),

  unfollowUser: id => APIUtil.changeFollowStatus(id, 'DELETE'),

  /** before it was just method on its own no value with it. i think with ES6
   * ur allowed to do property declaraction in a shorter syntax, so instead of doing:
   * 
   * var x = 0, y = 0
   * obj = {x: x, y: y}
   * 
   * you can just do: 
   * 
   * var x = 0, y = 0
   * obj = {x, y}; 
   * 
   * and they will infer what you mean
   * 
   * 
   * note 2: you can interpolate for the url value
   * 
   * note 3: usually something like updating info would be a PUT or PATCH request, which routes
   * to the path, for ex, /photos/:id, while a POST request is for submitting something totally new,
   * and routes to /photos, but here I guess it doesnt matter bc we do a POST request, but we provide the 
   * URL to send the request to so would go directly to the controller for that specific user anyways.
   *   --- we only have a create and delete method in the follows controller anyway.
   *   ---- so POST actually does make sense - we are creating (POST) a new follow or deleting (DELETE) it.
   * 
   * note 4: we dont have a data setting here bc we dont need it in the success callback, we just update the text
   * of the current button that triggered the event
   * 
  */
  changeFollowStatus: (id, method) => (
    $.ajax({
      url: `/users/${id}/follow`,
      dataType: 'json',
      method: `${method}`
    })
  ),
  /**
   * same thing goes for query here, this is equivalent to saying: { query: query }
   */
  searchUsers: query => (
    $.ajax({
      url: '/users/search',
      dataType: 'json',
      method: 'GET',
      data: { query }
    })
  ),

  createTweet: data => (
    $.ajax({
      url: '/tweets',
      method: 'POST',
      dataType: 'json',
      data
    })
  ),

  fetchTweets: data => (
    $.ajax({
      url: '/feed',
      method: 'GET',
      dataType: 'json',
      data
    })
  )
};

module.exports = APIUtil;

/***/ }),

/***/ "./frontend/follow_toggle.js":
/*!***********************************!*\
  !*** ./frontend/follow_toggle.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");

// we allow this options hash here so that we can pass in from users_search the data we need.
// just an easier way to do what $el.data is already doing
class FollowToggle {
  constructor(el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = (this.$el.data('initial-follow-state') ||
      options.followState);
    this.render();

    this.$el.on('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    // const followToggle = this;
    event.preventDefault();

    if (this.followState === 'followed') {
      this.followState = 'unfollowing';
      this.render();
      APIUtil.unfollowUser(this.userId).then(() => {
        this.followState = 'unfollowed';
        this.render();
      });
    } else if (this.followState === 'unfollowed') {
      this.followState = 'following';
      this.render();
      APIUtil.followUser(this.userId).then(() => {
        this.followState = 'followed';
        this.render();
      });
    }
  }


  render() {
    switch (this.followState) {
      case 'followed':
        this.$el.prop('disabled', false);
        this.$el.html('Unfollow!');
        break;
      case 'unfollowed':
        this.$el.prop('disabled', false);
        this.$el.html('Follow!');
        break;
      case 'following':
        this.$el.prop('disabled', true);
        this.$el.html('Following...');
        break;
      case 'unfollowing':
        this.$el.prop('disabled', true);
        this.$el.html('Unfollowing...');
        break;
    }
  }
}

module.exports = FollowToggle;

/***/ }),

/***/ "./frontend/infinite_tweets.js":
/*!*************************************!*\
  !*** ./frontend/infinite_tweets.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");

class InfiniteTweets {
  constructor(el) {
    this.$el = $(el);
    this.lastCreatedAt = null;

    this.$el.on('click', '.fetch-more', this.fetchTweets.bind(this));
    this.$el.on('insert-tweet', this.insertTweet.bind(this));
  }

  // this is for tweetCompose
  insertTweet(event, data) {
    this.$el.find('ul.tweets').prepend(this.tweetElement(data));

    if (!this.lastCreatedAt) {
      this.lastCreatedAt = data.created_at;
    }
  }
  
  insertTweets(data) {
    const $li = $(`<li>${JSON.stringify(data)}</li>`);
    this.$el.find('ul.tweets').append($li);
  }

  fetchTweets(event) {
    event.preventDefault();

    const infiniteTweets = this;
    const data = {};
    if (this.lastCreatedAt) data.max_created_at = this.lastCreatedAt;

    APIUtil.fetchTweets(data).then((data) => {
      infiniteTweets.insertTweets(data);

      if (data.length < 20) {
        infiniteTweets.$el
          .find('.fetch-more')
          .replaceWith('<b>No more tweets!</b>');
      }

      if (data.length > 0) {
        infiniteTweets.lastCreatedAt = data[data.length - 1].created_at;
      }
    });
  }

}

module.exports = InfiniteTweets;

/***/ }),

/***/ "./frontend/tweet_compose.js":
/*!***********************************!*\
  !*** ./frontend/tweet_compose.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");

class TweetCompose {
  constructor(el) {
    this.$el = $(el);
    // this is referring to textarea[name="tweet[content]"].
    // to use any of the meta - characters(such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) 
    // as a literal part of a name, it must be escaped with with two backslashes: \\
    
    this.$input = this.$el.find('textarea[name=tweet\\[content\\]]');

    // figure out if this means like if you just type in anything: yes. 
    // 'input' reacts w/ the type of each char
    
    this.$input.on('input', this.handleInput.bind(this));

    this.$mentionedUsersDiv = this.$el.find('.mentioned-users');
    this.$el.find('.add-mentioned-user').on(
      'click', this.addMentionedUser.bind(this));
    this.$mentionedUsersDiv.on(
      'click', '.remove-mentioned-user', this.removeMentionedUser.bind(this));

    this.$el.on('submit', this.submit.bind(this));
  }

  addMentionedUser(event) {
    event.preventDefault();

    this.$mentionedUsersDiv.append(this.newUserSelect());
  }
  /**
   * 1) sets the value to '' so the textarea becomes blank (.val() setter only takes in 1 param when used as setter)
   * 2) find the div's that hold the mentioned users selected and clear that 
   * 3) undisable the button we disabled earlier for the form submission in 'submit' method
   * 4) empty the field under textarea that tells us how many characters we have
   */
  clearInput() {
    this.$input.val('');
    this.$mentionedUsersDiv.find('div').empty();
    this.$el.find(':input').prop('disabled', false);
    this.$el.find('.char-left').empty();
  }

  handleInput(event) {
    const inputLength = this.$input.val().length;

    this.$el.find('.char-left').text(`${140 - inputLength} characters left`);
  }

  handleSuccess(data) {
    const $tweetsUl = $(this.$el.data('tweets-ul'));

    // const $listEl = $(`<li>${JSON.stringify(data)}</li>`);   old now we just trigger infiniteTweets class to insert the tweet - not dry to do it twice
    // $tweetsUl.append($listEl);
    $tweetsUl.trigger('insert-tweet', data);

    this.clearInput();
  }

  newUserSelect() {
    const userOptions = window.users
      .map(user =>
        `<option value='${user.id}'>${user.username}</option>`)
      .join('');

    const html = `
      <div>
        <select name='tweet[mentioned_user_ids][]'>
          ${userOptions}
        </select>
        <button class='remove-mentioned-user'>Remove</button>
      </div>`;

    return $(html);
  }

  // the parent of the button is the div we made above that holds the button.
  removeMentionedUser(event) {
    event.preventDefault();
    $(event.currentTarget).parent().remove();
  }

  submit(event) {
    event.preventDefault();
    // remember that serialize() and serializeJSON both called on form itself
    const data = this.$el.serializeJSON();

    //  input -> $(':input') -> all input, textarea, select & button els.
    //  note: Because these selectors are jQuery extension and not part of the CSS specification, queries using them cannot take advantage of the performance boost provided by the native DOM querySelectorAll() method.To achieve the best performance when using these selectors, first select some elements using a pure CSS selector, then use.filter(":selectorName").
    // have to make sure to disable **after** - not before - serializing or our values would be ignored
    this.$el.find(':input').prop('disabled', true);

    APIUtil.createTweet(data).then(tweet => this.handleSuccess(tweet));
  }
}

module.exports = TweetCompose;

/***/ }),

/***/ "./frontend/twitter.js":
/*!*****************************!*\
  !*** ./frontend/twitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(/*! ./follow_toggle */ "./frontend/follow_toggle.js");
const UsersSearch = __webpack_require__(/*! ./users_search */ "./frontend/users_search.js");
const TweetCompose = __webpack_require__(/*! ./tweet_compose */ "./frontend/tweet_compose.js");
const InfiniteTweets = __webpack_require__(/*! ./infinite_tweets */ "./frontend/infinite_tweets.js");

$(function () {
  $('div.infinite-tweets').each((i, tweet) => new InfiniteTweets(tweet));
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
  $('.users-search').each((i, search) => new UsersSearch(search));
  $('form.tweet-compose').each((i, form) => new TweetCompose(form));
});


/***/ }),

/***/ "./frontend/users_search.js":
/*!**********************************!*\
  !*** ./frontend/users_search.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");
const FollowToggle = __webpack_require__(/*! ./follow_toggle */ "./frontend/follow_toggle.js");

class UsersSearch {
  constructor(el) {
    this.$el = $(el);
    this.$input = this.$el.find('input[name=username]');
    this.$ul = this.$el.find('.users');

    this.$input.on('input', this.handleInput.bind(this));
  }

  /**
   * classic pattern: 
   * 
   * 1) 1st we write the method which is going to do what we want and saves
   * any jquery wrapped variables, etc. we might need
   * 
   * 2) then we call the AJAX request from within it so it can do what we need it to
   * 
   * 
   * 
   * 3) we have the success cb available as a promise here 
   * instead of as a "success" setting set in the .ajax method
   * 
   * --- bc of the .then() syntax, the moment we invoke that ajax request, ajax has made a promise
   *
   */
  handleInput(event) {
    if (this.$input.val() === '') {
      this.renderResults([]);
      return;
    }
    APIUtil.searchUsers(this.$input.val())
      .then(users => this.renderResults(users));
  }

  renderResults(users) {
    this.$ul.empty();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      let $a = $('<a></a>');
      $a.text(`@${user.username}`);
      $a.attr('href', `/users/${user.id}`);

      const $followToggle = $('<button></button>');
      new FollowToggle($followToggle, {
        userId: user.id,
        followState: user.followed ? 'followed' : 'unfollowed'
      });

      const $li = $('<li></li>');
      $li.append($a);
      $li.append($followToggle);

      this.$ul.append($li);
    }
  }
}

module.exports = UsersSearch;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map