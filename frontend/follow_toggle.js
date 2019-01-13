import APIUtil from './api_util';
class FollowToggle {
  constructor(el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = (this.$el.data('initial-follow-state') || options.followState);
    this.render();

    this.$el.on('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    e.preventDefault();
    
    if (this.followState === 'this is you!' || current_user === this.userId) this.render()
    else if (this.followState === 'followed') {
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

  newHtml(val) {
    const result = `${val.charAt(0).toUpperCase()}${val.slice(1)}...`;
    return this.$el.html(result);
  }

  render() {
    const fs = this.followState;

    this.$el.prop('disabled', (i, val) => {
      val = !val
    });

    if (fs.slice(-3) === 'ing') this.newHtml(fs)

    switch (fs) {
      case 'followed':
        this.$el.html('Unfollow!');
        break;
      case 'unfollowed':
        this.$el.html('Follow!');
        break;
      case 'this is you!':
        this.$el.addClass('user-self');
        this.$el.html('this is you!');
        break;
    }
  }
}

export default FollowToggle;