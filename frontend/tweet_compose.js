const APIUtil = require('./api_util');

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

    const $listEl = $(`<li>${JSON.stringify(data)}</li>`);
    $tweetsUl.append($listEl);
    // $tweetsUl.trigger('insert-tweet', data);

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