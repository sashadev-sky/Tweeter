import APIUtil from "./api_util";
class TweetCompose {
  constructor(el) {
    this.$el = $(el);
    // textarea[name="tweet[content]"] - escape metacharacters such as '[' ']' with two backlashes 
    this.$input = this.$el.find('textarea[name=tweet\\[content\\]]');
    this.$input.on('input', this.handleInput.bind(this));

    this.$mentionedUsersDiv = this.$el.find('.mentioned-users');
    this.$el.find('.add-mentioned-user').on(
      'click', this.addMentionedUser.bind(this));
    this.$mentionedUsersDiv.on(
      'click', '.remove-mentioned-user', this.removeMentionedUser.bind(this));

    this.$el.on('submit', this.submit.bind(this));
  }

  addMentionedUser(e) {
    e.preventDefault();
    this.$mentionedUsersDiv.append(this.newUserSelect());
  }

  clearInput() {
    this.$input.val('');
    this.$mentionedUsersDiv.find('div').empty();
    this.$el.prop('disabled', false);
    this.$el.find(':input').prop('disabled', false);
    this.$el.find('.char-left').empty();
  }

  handleInput(e) {
    const inputLength = this.$input.val().length;
    this.$el.find('.char-left').text(`${140 - inputLength} characters left`);
  }

  handleSuccess(data) {
    const $tweetsUl = $(this.$el.data('tweets-ul'));
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

  removeMentionedUser(e) {
    e.preventDefault();
    $(e.currentTarget).parent().remove();
  }

  submit(e) {
    const data = this.$el.serializeJSON();
    
    e.preventDefault();

    // disable **after** serializing or values woulld be ignored
    if (data.tweet.content) {
      this.$el.prop('disabled', true);
      this.$el.find(':input').prop('disabled', true);
      APIUtil.createTweet(data).then(tweet => this.handleSuccess(tweet));
    }
  }
}

export default TweetCompose;