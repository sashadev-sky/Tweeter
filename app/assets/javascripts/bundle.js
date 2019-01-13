!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var i={followUser:function(e){return i.changeFollowStatus(e,"POST")},unfollowUser:function(e){return i.changeFollowStatus(e,"DELETE")},changeFollowStatus:function(e,t){return $.ajax({url:"/users/".concat(e,"/follow"),dataType:"json",method:t})},searchUsers:function(e){return $.ajax({url:"/users/search",dataType:"json",method:"GET",data:{query:e}})},createTweet:function(e){return $.ajax({url:"/tweets",method:"POST",dataType:"json",data:e})},fetchTweets:function(e){return $.ajax({url:"/feed",method:"GET",dataType:"json",data:e})}},r=i;function o(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var s=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$el=$(t),this.userId=this.$el.data("user-id")||n.userId,this.followState=this.$el.data("initial-follow-state")||n.followState,this.render(),this.$el.on("click",this.handleClick.bind(this))}return function(e,t,n){t&&o(e.prototype,t),n&&o(e,n)}(e,[{key:"handleClick",value:function(e){var t=this;e.preventDefault(),"this is you!"===this.followState||current_user===this.userId?this.render():"followed"===this.followState?(this.followState="unfollowing",this.render(),r.unfollowUser(this.userId).then(function(){t.followState="unfollowed",t.render()})):"unfollowed"===this.followState&&(this.followState="following",this.render(),r.followUser(this.userId).then(function(){t.followState="followed",t.render()}))}},{key:"newHtml",value:function(e){var t="".concat(e.charAt(0).toUpperCase()).concat(e.slice(1),"...");return this.$el.html(t)}},{key:"render",value:function(){var e=this.followState;switch(this.$el.prop("disabled",function(e,t){t=!t}),"ing"===e.slice(-3)&&this.newHtml(e),e){case"followed":this.$el.html("Unfollow!");break;case"unfollowed":this.$el.html("Follow!");break;case"this is you!":this.$el.addClass("user-self"),this.$el.html("this is you!")}}}]),e}();function a(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var l=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$el=$(t),this.$input=this.$el.find("input[name=username]"),this.$ul=this.$el.find(".users"),this.$el.find(".simple-form").submit(function(){return!1}),this.$input.on("input",this.handleInput.bind(this))}return function(e,t,n){t&&a(e.prototype,t),n&&a(e,n)}(e,[{key:"handleInput",value:function(e){var t=this;""===this.$input.val()?this.render([]):r.searchUsers(this.$input.val()).then(function(e){return t.render(e)})}},{key:"render",value:function(e){this.$ul.empty(),0===e.length?(this.$ul.html("No results matched your search"),this.$ul.addClass("no-results")):this.$ul.removeClass("no-results");for(var t=0;t<e.length;t++){var n=e[t],i=$("<a></a>");i.text("@".concat(n.username)),i.attr("href","/users/".concat(n.id));var r=$("<button></button>");n.id!==current_user?new s(r,{userId:n.id,followState:n.followed?"followed":"unfollowed"}):new s(r,{userId:n.id,followState:"this is you!"});var o=$("<li></li>");o.append(i),o.append(r),this.$ul.append(o)}}}]),e}();function u(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var c=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$el=$(t),this.$input=this.$el.find("textarea[name=tweet\\[content\\]]"),this.$input.on("input",this.handleInput.bind(this)),this.$mentionedUsersDiv=this.$el.find(".mentioned-users"),this.$el.find(".add-mentioned-user").on("click",this.addMentionedUser.bind(this)),this.$mentionedUsersDiv.on("click",".remove-mentioned-user",this.removeMentionedUser.bind(this)),this.$el.on("submit",this.submit.bind(this))}return function(e,t,n){t&&u(e.prototype,t),n&&u(e,n)}(e,[{key:"addMentionedUser",value:function(e){e.preventDefault(),this.$mentionedUsersDiv.append(this.newUserSelect())}},{key:"clearInput",value:function(){this.$input.val(""),this.$mentionedUsersDiv.find("div").empty(),this.$el.find(":input").prop("disabled",!1),this.$el.find(".char-left").empty()}},{key:"handleInput",value:function(e){var t=this.$input.val().length;this.$el.find(".char-left").text("".concat(140-t," characters left"))}},{key:"handleSuccess",value:function(e){$(this.$el.data("tweets-ul")).trigger("insert-tweet",e),this.clearInput()}},{key:"newUserSelect",value:function(){var e=window.users.map(function(e){return"<option value='".concat(e.id,"'>").concat(e.username,"</option>")}).join(""),t="\n      <div>\n        <select name='tweet[mentioned_user_ids][]'>\n          ".concat(e,"\n        </select>\n        <button class='remove-mentioned-user'>Remove</button>\n      </div>");return $(t)}},{key:"removeMentionedUser",value:function(e){e.preventDefault(),$(e.currentTarget).parent().remove()}},{key:"submit",value:function(e){var t=this;e.preventDefault();var n=this.$el.serializeJSON();this.$el.find(":input").prop("disabled",!0),r.createTweet(n).then(function(e){return t.handleSuccess(e)})}}]),e}();function f(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var h=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$el=$(t),this.lastCreatedAt=null,this.$el.on("click",".fetch-more",this.fetchTweets.bind(this)),this.$el.on("insert-tweet",this.insertTweet.bind(this))}return function(e,t,n){t&&f(e.prototype,t),n&&f(e,n)}(e,[{key:"insertTweet",value:function(e,t){this.$el.find("ul.tweets").prepend(this.tweetElement(t)),this.lastCreatedAt||(this.lastCreatedAt=t.created_at)}},{key:"insertTweets",value:function(e){this.$el.find("ul.tweets").append(e.map(this.tweetElement))}},{key:"fetchTweets",value:function(e){e.preventDefault();var t=this,n={};this.lastCreatedAt&&(n.max_created_at=this.lastCreatedAt),r.fetchTweets(n).then(function(e){t.insertTweets(e),e.length<20&&t.$el.find(".fetch-more").replaceWith("<b>No more tweets!</b>"),e.length>0&&(t.lastCreatedAt=e[e.length-1].created_at)})}},{key:"tweetElement",value:function(e){var t=e.mentions.map(function(e){return"<li class='tweetee'>\n        <a href='/users/".concat(e.user.id,"'>@").concat(e.user.username,"</a>\n      </li>")}).join(",&nbsp;"),n="\n    <div class='tweet'>\n      <h3 class='tweeter'>\n        <a href='/users/".concat(e.user.id,"'>\n          @").concat(e.user.username,"&nbsp;\n        </a>\n      </h3>\n      \n      <p>").concat(e.content,"</p>\n      \n      <ul>Mentions:&nbsp;\n        ").concat(t,"\n      </ul>\n    </div>");return $(n)}}]),e}();$(function(){$("div.infinite-tweets").each(function(e,t){return new h(t)}),$("button.follow-toggle").each(function(e,t){return new s(t,{})}),$(".users-search").each(function(e,t){return new l(t)}),$("form.tweet-compose").each(function(e,t){return new c(t)})})}]);
//# sourceMappingURL=bundle.js.map