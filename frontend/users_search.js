const APIUtil = require('./api_util');
const FollowToggle = require('./follow_toggle');

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
