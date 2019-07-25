/**
 * just practice with vanilla DOM manipulation. Did not include this file
 * anywhere in the code - I never make an instance of it in the entry file, twitter.js
 */
const APIUtil = require('./api_util');

const FollowToggle = require('./follow_toggle');

class UsersSearch {
  constructor(el) {
    // el is an HTMLElement
    this.el = el;
    // querySelector returns the first match
    this.input = this.el.querySelector("input[name=username]");
    this.ul = this.el.querySelector(".users");


    this.input.addEventListener("input", this.handleInput.bind(this));
  }

  handleInput(event) {
    if (this.input.value === "") {
      this.renderResults([]);
      return;
    }
    APIUtil.searchUsers(this.input.value)
      .then(users => this.renderResults(users));
  }

  renderResults(users) {
    // setting the innerHTML to '' is equivalent to removing all the child elements
    this.ul.innerHTML = '';

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // makes a new <a>, which is not yet attached to the DOM
      const a = document.createElement('a');
      a.textContent = user.username;
      a.setAttribute("href", `/users/${user.id}`);

      const followToggle = document.createElement('button');
      new FollowToggle(followToggle, {
        userId: user.id,
        followState: user.followed ? "followed" : "unfollowed"
      });

      const li = document.createElement("li");
      // adds the  <a> element to the <li>
      li.appendChild(a);
      li.appendChild(followToggle);
      this.ul.appendChild(li);
    }
  }
}

module.exports = UsersSearch;
