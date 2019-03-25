import APIUtil from './api_util';
class FollowToggle {
  constructor(el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = (this.$el.data('initial-follow-state') || options.followState);
    this.render();

    this.$el.click(_.debounce(this.handleClick.bind(this), 250));
  }

  handleClick(e) {
    const fs = this.followState;
    
    if (fs === 'this is you!' || current_user === this.userId) this.render()
    else if (fs === 'followed') {
      this.$el.prop('disabled', true);
      APIUtil.unfollowUser(this.userId).then(() => {
        this.followState = 'unfollowed';
        this.render();
      });
    } else if (fs === 'unfollowed') {
      this.$el.prop('disabled', true);
      APIUtil.followUser(this.userId).then(() => {
        this.followState = 'followed';
        this.render();
      });
    }
  }

  render() {
    const fs = this.followState;

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
}

export default FollowToggle;