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
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var APIUtil = {
  // POST / DELETE follows. They are their own resource to follow RESTful convention
  followUser: function followUser(id) {
    return APIUtil.changeFollowStatus(id, 'POST');
  },
  unfollowUser: function unfollowUser(id) {
    return APIUtil.changeFollowStatus(id, 'DELETE');
  },
  changeFollowStatus: function changeFollowStatus(id, method) {
    return $.ajax({
      url: "/users/".concat(id, "/follow"),
      dataType: 'json',
      method: method
    });
  },
  searchUsers: function searchUsers(query) {
    return $.ajax({
      url: '/users/search',
      dataType: 'json',
      method: 'GET',
      data: {
        query: query
      }
    });
  },
  createTweet: function createTweet(data) {
    return $.ajax({
      url: '/tweets',
      method: 'POST',
      dataType: 'json',
      data: data
    });
  },
  fetchTweets: function fetchTweets(data) {
    return $.ajax({
      url: '/feed',
      method: 'GET',
      dataType: 'json',
      data: data
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (APIUtil);

/***/ }),

/***/ "./frontend/follow_toggle.js":
/*!***********************************!*\
  !*** ./frontend/follow_toggle.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var FollowToggle =
/*#__PURE__*/
function () {
  function FollowToggle(el, options) {
    _classCallCheck(this, FollowToggle);

    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = this.$el.data('initial-follow-state') || options.followState;
    this.render();
    this.$el.click(_.debounce(this.handleClick.bind(this), 250, {
      leading: true,
      trailing: false
    }));
  }

  _createClass(FollowToggle, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this = this;

      var fs = this.followState;
      if (fs === 'this is you!' || current_user === this.userId) this.render();else if (fs === 'followed') {
        this.$el.prop('disabled', true);
        _api_util__WEBPACK_IMPORTED_MODULE_0__["default"].unfollowUser(this.userId).then(function () {
          _this.followState = 'unfollowed';

          _this.render();
        });
      } else if (fs === 'unfollowed') {
        this.$el.prop('disabled', true);
        _api_util__WEBPACK_IMPORTED_MODULE_0__["default"].followUser(this.userId).then(function () {
          _this.followState = 'followed';

          _this.render();
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var fs = this.followState;

      switch (fs) {
        case "followed":
          this.$el.prop("disabled", false);
          this.$el.html("Unfollow!");
          break;

        case "unfollowed":
          this.$el.prop("disabled", false);
          this.$el.html("Follow!");
          break;

        case "this is you!":
          this.$el.prop("disabled", true);
          this.$el.addClass("user-self");
          this.$el.html("this is you!");
          break;
      }
    }
  }]);

  return FollowToggle;
}();

/* harmony default export */ __webpack_exports__["default"] = (FollowToggle);

/***/ }),

/***/ "./frontend/infinite_tweets.js":
/*!*************************************!*\
  !*** ./frontend/infinite_tweets.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var InfiniteTweets =
/*#__PURE__*/
function () {
  function InfiniteTweets(el) {
    _classCallCheck(this, InfiniteTweets);

    this.$el = $(el);
    this.lastCreatedAt = null;
    this.$el.on('click', '.fetch-more', this.fetchTweets.bind(this));
    this.$el.on('insert-tweet', this.insertTweet.bind(this));
  } // this is for tweetCompose


  _createClass(InfiniteTweets, [{
    key: "insertTweet",
    value: function insertTweet(e, data) {
      this.$el.find('ul.tweets').prepend(this.tweetElement(data));
      if (!this.lastCreatedAt) this.lastCreatedAt = data.created_at;
    }
  }, {
    key: "insertTweets",
    value: function insertTweets(data) {
      this.$el.find('ul.tweets').append(data.map(this.tweetElement));
    }
  }, {
    key: "fetchTweets",
    value: function fetchTweets(e) {
      e.preventDefault();
      var infiniteTweets = this;
      var data = {};
      if (this.lastCreatedAt) data.max_created_at = this.lastCreatedAt;
      _api_util__WEBPACK_IMPORTED_MODULE_0__["default"].fetchTweets(data).then(function (data) {
        infiniteTweets.insertTweets(data);

        if (data.length < 20) {
          infiniteTweets.$el.find('.fetch-more').replaceWith('<b>No more tweets!</b>');
        }

        if (data.length > 0) {
          infiniteTweets.lastCreatedAt = data[data.length - 1].created_at;
        }
      });
    }
  }, {
    key: "tweetElement",
    value: function tweetElement(tweet) {
      var mentions = tweet.mentions.map(function (mention) {
        return "<li class='tweetee'>\n        <a href='/users/".concat(mention.user.id, "'>@").concat(mention.user.username, "</a>\n      </li>");
      }).join(",&nbsp;");
      var elementString = "\n    <div class='tweet'>\n      <h3 class='tweeter'>\n        <a href='/users/".concat(tweet.user.id, "'>\n          @").concat(tweet.user.username, "&nbsp;\n        </a>\n      </h3>\n      \n      <p>").concat(tweet.content, "</p>\n      \n      <ul>Mentions:&nbsp;\n        ").concat(mentions, "\n      </ul>\n    </div>");
      return $(elementString);
    }
  }]);

  return InfiniteTweets;
}();

/* harmony default export */ __webpack_exports__["default"] = (InfiniteTweets);

/***/ }),

/***/ "./frontend/tweet_compose.js":
/*!***********************************!*\
  !*** ./frontend/tweet_compose.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var TweetCompose =
/*#__PURE__*/
function () {
  function TweetCompose(el) {
    _classCallCheck(this, TweetCompose);

    this.$el = $(el); // textarea[name="tweet[content]"] - escape metacharacters such as '[' ']' with two backlashes 

    this.$input = this.$el.find('textarea[name=tweet\\[content\\]]');
    this.$input.on('input', this.handleInput.bind(this));
    this.$mentionedUsersDiv = this.$el.find('.mentioned-users');
    this.$el.find('.add-mentioned-user').on('click', this.addMentionedUser.bind(this));
    this.$mentionedUsersDiv.on('click', '.remove-mentioned-user', this.removeMentionedUser.bind(this));
    this.$el.on('submit', this.submit.bind(this));
  }

  _createClass(TweetCompose, [{
    key: "addMentionedUser",
    value: function addMentionedUser(e) {
      e.preventDefault();
      this.$mentionedUsersDiv.append(this.newUserSelect());
    }
  }, {
    key: "clearInput",
    value: function clearInput() {
      this.$input.val('');
      this.$mentionedUsersDiv.find('div').empty();
      this.$el.prop('disabled', false);
      this.$el.find(':input').prop('disabled', false);
      this.$el.find('.char-left').empty();
    }
  }, {
    key: "handleInput",
    value: function handleInput(e) {
      var inputLength = this.$input.val().length;
      this.$el.find('.char-left').text("".concat(140 - inputLength, " characters left"));
    }
  }, {
    key: "handleSuccess",
    value: function handleSuccess(data) {
      var $tweetsUl = $(this.$el.data('tweets-ul'));
      $tweetsUl.trigger('insert-tweet', data);
      this.clearInput();
    }
  }, {
    key: "newUserSelect",
    value: function newUserSelect() {
      var userOptions = window.users.map(function (user) {
        return "<option value='".concat(user.id, "'>").concat(user.username, "</option>");
      }).join('');
      var html = "\n      <div>\n        <select name='tweet[mentioned_user_ids][]'>\n          ".concat(userOptions, "\n        </select>\n        <button class='remove-mentioned-user'>Remove</button>\n      </div>");
      return $(html);
    }
  }, {
    key: "removeMentionedUser",
    value: function removeMentionedUser(e) {
      e.preventDefault();
      $(e.currentTarget).parent().remove();
    }
  }, {
    key: "submit",
    value: function submit(e) {
      var _this = this;

      var data = this.$el.serializeJSON();
      e.preventDefault(); // disable **after** serializing or values woulld be ignored

      if (data.tweet.content) {
        this.$el.prop('disabled', true);
        this.$el.find(':input').prop('disabled', true);
        _api_util__WEBPACK_IMPORTED_MODULE_0__["default"].createTweet(data).then(function (tweet) {
          return _this.handleSuccess(tweet);
        });
      }
    }
  }]);

  return TweetCompose;
}();

/* harmony default export */ __webpack_exports__["default"] = (TweetCompose);

/***/ }),

/***/ "./frontend/twitter.js":
/*!*****************************!*\
  !*** ./frontend/twitter.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _follow_toggle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./follow_toggle */ "./frontend/follow_toggle.js");
/* harmony import */ var _users_search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./users_search */ "./frontend/users_search.js");
/* harmony import */ var _tweet_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tweet_compose */ "./frontend/tweet_compose.js");
/* harmony import */ var _infinite_tweets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./infinite_tweets */ "./frontend/infinite_tweets.js");




$(function () {
  $('div.infinite-tweets').each(function (i, tweet) {
    return new _infinite_tweets__WEBPACK_IMPORTED_MODULE_3__["default"](tweet);
  });
  $('button.follow-toggle').each(function (i, btn) {
    return new _follow_toggle__WEBPACK_IMPORTED_MODULE_0__["default"](btn, {});
  });
  $('.users-search').each(function (i, search) {
    return new _users_search__WEBPACK_IMPORTED_MODULE_1__["default"](search);
  });
  $('form.tweet-compose').each(function (i, form) {
    return new _tweet_compose__WEBPACK_IMPORTED_MODULE_2__["default"](form);
  });
});

/***/ }),

/***/ "./frontend/users_search.js":
/*!**********************************!*\
  !*** ./frontend/users_search.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js");
/* harmony import */ var _follow_toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./follow_toggle */ "./frontend/follow_toggle.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var UsersSearch =
/*#__PURE__*/
function () {
  function UsersSearch(el) {
    _classCallCheck(this, UsersSearch);

    this.$el = $(el);
    this.$input = this.$el.find('input[name=username]');
    this.$ul = this.$el.find('.users');
    this.$el.find('.simple-form').submit(function () {
      return false;
    });
    this.$input.on('input', _.debounce(this.handleInput.bind(this), 275));
  }

  _createClass(UsersSearch, [{
    key: "handleInput",
    value: function handleInput(e) {
      var _this = this;

      if (this.$input.val() === '') this.render([]);else {
        _api_util__WEBPACK_IMPORTED_MODULE_0__["default"].searchUsers(this.$input.val()).then(function (users) {
          return _this.render(users);
        });
      }
    }
  }, {
    key: "render",
    value: function render(users) {
      this.$ul.empty();

      if (users.length === 0) {
        this.$ul.html('No results matched your search');
        this.$ul.addClass('no-results');
      } else {
        this.$ul.removeClass('no-results');
      }

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var $a = $('<a></a>');
        $a.text("@".concat(user.username));
        $a.attr('href', "/users/".concat(user.id));
        var $followToggle = $('<button></button>');

        if (user.id !== current_user) {
          new _follow_toggle__WEBPACK_IMPORTED_MODULE_1__["default"]($followToggle, {
            userId: user.id,
            followState: user.followed ? 'followed' : 'unfollowed'
          });
        } else {
          new _follow_toggle__WEBPACK_IMPORTED_MODULE_1__["default"]($followToggle, {
            userId: user.id,
            followState: 'this is you!'
          });
        }

        var $li = $('<li></li>');
        $li.append($a);
        $li.append($followToggle);
        this.$ul.append($li);
      }
    }
  }]);

  return UsersSearch;
}();

/* harmony default export */ __webpack_exports__["default"] = (UsersSearch);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map