const APIUtil = require('./api_util');

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
    
    if (this.followState === 'this is you!' || current_user === this.userId) {
      this.render()
    } else if (this.followState === 'followed') {
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
      case 'this is you!':
        this.$el.prop('disabled', true);
        this.$el.addClass('user-self');
        this.$el.html('this is you!');
        break;
    }
  }
}

module.exports = FollowToggle;