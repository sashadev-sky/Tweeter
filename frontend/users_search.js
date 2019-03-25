import APIUtil from './api_util';
import FollowToggle from './follow_toggle';

class UsersSearch {
  constructor(el) {
    this.$el = $(el);
    this.$input = this.$el.find('input[name=username]');
    this.$ul = this.$el.find('.users');

    this.$el.find('.simple-form').submit(() => false);
    this.$input.on('input', _.debounce(this.handleInput.bind(this), 275));
  }

  handleInput(e) {
    if (this.$input.val() === '') this.render([]);
    else {
    APIUtil.searchUsers(this.$input.val())
      .then(users => this.render(users));
    }
  }

  render(users) {
    this.$ul.empty();

    if (users.length === 0) {
      this.$ul.html('No results matched your search');
      this.$ul.addClass('no-results')
    } else { this.$ul.removeClass('no-results') }

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      let $a = $('<a></a>');
      $a.text(`@${user.username}`);
      $a.attr('href', `/users/${user.id}`);
      const $followToggle = $('<button></button>');
      if (user.id !== current_user) {
        new FollowToggle($followToggle, {
          userId: user.id,
          followState: user.followed ? 'followed' : 'unfollowed'
        });
      } else {
        new FollowToggle($followToggle, {
          userId: user.id,
          followState: 'this is you!'
        });
      }

      const $li = $('<li></li>');
      $li.append($a);
      $li.append($followToggle);

      this.$ul.append($li);
    }
  }
}


export default UsersSearch;
