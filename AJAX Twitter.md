# AJAX Twitter

---

### **summary:** 

**general notes:**
- if you want something to be available in any frontend JS file, add it to a `<script>` tag in the `<head>` tag of `application.html.erb` as a variable saved on `window`.
- if you dont have an ajax method for something, most likely it will be rendering the HTML files everytime not the json ones

**application.js** and **application.css** and **application.html.erb**
- we no longer link our jQuery in the `head` of our HTML file, rails now handles it for us in its **application.js** manifest file as long as we just include the appropriate gem (jquery-rails)  in gemfile and add the gem names (//= require jquery, //= require jquery_ujs) to the manifest file. 
  - after these we also have `**//= require_tree**` which include any files in `app/assets/javascripts`, for instance, our `bundle.js
- from there, rails has the helper tag  **`<%= java`script`_include_tag 'application' %>`**  in the `head` of the HTML file which will manifest all the required JS files just as if we were putting them in a script tag there.
- This makes it a lot easier for us when we have multiple libraries we want to use in our frontend code
- Rails does the same thing with our css files, we dont link them here either anymore, they go in **application.css** manifest file and are sent in the HTML through the helper tag  `**<%= stylesheet_link_tag    'application', media: 'all' %>**`
- **note:** still totally valid to put script tags and link tags for the JS and CSS, respectively, but the point is that we dont have to. 
  - we actually did that in this project, we imported a google font in a `<style>` tag in the head of application.html.erb (css files get a `<link>` tag, 1 imported google font is not a file event if it is being imported)
  - we could also have just put it in application.css file, but we were ensuring that it will have the highest precedence. common to put fonts for whole app in the application.html.erb file.
  - we put it right after the stylesheet_link_tag
- the 3rd helper_tag we almost always find in the <head> of the HTML is **`<%= csrf_meta_tags %>`**
  - this has always been here too, it is just a meta tag in which Rails stores the csrf token, but thanks to `jquery_ujs` our `.ajax()` method can use it in all of its requests.

**POJO:**
- note the syntax in api_util.js. this is a plain old javascript object (ES6 syntax). we dont need classes or anything for our utility functions, and apparently ajax functions can go under their own utility page.

**Interactive functionalities:**

`**follow/unfollow button toggling**`
- We want to replace the contents of this form with a single HTML element (`**<button>**`) that gets updated via our front-end JavaScript.
  - the button will be a 'follow' button if the current user is not yet following the user, and an 'unfollow' button if they are. 
  - we leave the innerHTML empty - our frontend will set this now
- We'll also need to let the button know the user-id and initial-follow-state ("followed" or "unfollowed") by storing these in `data-*` attributes, retrieving the follow state from a user model method and the user id from a partial which calls our HTML form passing in the @user 
- `FollowToggle#handleClick` method. 
  - Install this click handler in the constructor. 
  - Your click handler should: Prevent the default action, Make a `$.ajax` request to `POST` `/users/:id/follow` if we are not following the user (check followState), else, it should make a `DELETE` request, On success of the `POST/DELETE`, we should toggle the followState and re-render.
- We will actually have 4 string states, in handleClick 
  - **'followed'** changes to **'unfollowing'** and then on success changes to **'unfollowed'**
  - **'unfollowed'** changes to **'following'** then on success changes to **'followed'**
- each part calls `render` method, which uses **.prop('disabled', t/f)** to disable the button when it is in following... or unfollowing... bc this indicates loading and re-enable when its followed... / unfollowed... bc this indicates done loading

`**real time search functionality**` 
- with the current skeleton, we have the capability to search but its not real-time. meaning you have to enter your search before seeing the matching users. then we built on this to make that not the case
- replaced the whole HTML form with just a div tag with class="users-search" or something and an input for users to type in - no more `value` attribute
- made an .ajax with a GET request to /users/search and `data` is the query we have which will be appended to the url (which we track with `this.input.val()`
- we use functionality from the followToggle class to make the search results appear with a button which shows if you follow the user or not
> **solution issues**: you can search for urself and then follow/unfollow urself. and then if you click on the users profile from the search, you can access your own profile and you have a follow/unfollow button there
  - i fixed this. see bottom of this doc 

`**jbuilder**`

> we use jbuilder to switch our views around to be an API. for the parts that we put in jbuilder, the browser will no longer give us a **static HTML page**, but rather a text-based representation of said data that our client-side Javascript can use to render a **dynamic view.**
- json.array!
- json.partial!
- json.extract!
- json.set!

`**composing a tweet**` 
- **-> keeping track of characters left in realtime** - we use`**input**` event handler (which triggers immediately on anything you type in the box) and `**.val()**` (which retrieves the value of an input or textarea tag. updates real time as you type, so we can take its length and subtract that from 140 and interpolate that value into "you have ${interpolatedValue} characters left"
- -> when we submit, we want to `disable` all the form controls until the AJAX method completes (but only after we `serialize` or the input vals will be ignored
- -> **tag multiple users -** we dynamically create more `select` tags to make this happen

`**infinite scroll**`


`**css:**` 
- rails will automatically load any .css files in `app/assets/stylesheets`, but if we want to use sass to organize our files we have to `@import` them into `application.css` and make their extensions `.scss`
- google fonts should be added to the head tag in `layouts/application.html.erb`
- the login and signup page will look very similar so think about how you can reuse classes to produce a standard, repeated aesthetic for the site.


>   **classic pattern**: 
>   1) 1st we write the method which is going to do what we want and save any jquery wrapped variables, etc. we might need
>  2) then we call the AJAX request from within it so it can do what we need it.
>     *---- store ajax methods in a separate file in POJO bc they are 'utility functions'
>  3) we have the success cb available as a promise here instead of as a "success" setting set in the .ajax method
>    * --- bc of the .then() syntax, the moment we invoke that ajax request, ajax has made a promise

---

**Setup**
**gemfile:**
- `gem 'jbuilder'`   already comes loaded into gemfile
- `gem 'jquery-rails'`
  - gives us **jQuery** and **jQuery-ujs**
- `gem 'serialize_json-rails'`

- Start by running `bundle install`
- To setup the database, run `rails db:setup`
- `npm run webpack` in a new tab to transpile the JavaScript.

**webpack.config.js**
- Note that our entry point is `frontend/twitter.js`, so all of our other JavaScript files should be defined in the frontend folder also.
- Webpack will transpile them from there and create a `bundle.js` file in **app/assets/javascripts/**.

**app/assets/javascripts/application.js**
- This is Rails' manifest file for JavaScript.
  - in **application.html.erb** we then have:     `<%= javascript_include_tag 'application' %>` 
- All required JavaScript files are listed in the comment block 
  - in a similar fashion to placing <script> tags in our HTML - except that Rails compiles them all into a single file for production. 
- But **unlike Webpack, Rails doesn't intelligently manage dependencies**, so you still have to be extra **careful about the load order.**
- It's currently only requiring `jquery` and `jquery_ujs` : 
> **jQuery_ujs** is what connects us to the cserf meta tags rails puts in the <head>
```javascript
//= require jquery
//= require jquery_ujs
```
- after these, add **`require jquery.serializejson`** (for submitting forms) and **`require_tree`** (to include any files in app/assets/javascripts, for instance, our bundle.js). 
  - **jquery.serializejson:** before we were using jquery `**.serialize()**`, which returns URL encoded string.
    - For the `.ajax()` **data** setting, we can use the **serializeJSON jQuery plug-in** to add a **`.serializeJSON()`** method to jQuery, which creates a JavaScript object following the Rails parameter conventions.

**gemfile:**
`gem 'serialize_json-rails'`

---

## `**Phase I: FollowToggle**`

We will write a `FollowToggle` class that turns a button into a toggle that will follow/unfollow a user.

a) Look at **app/views/follows/_form.html.erb.** 
- First, let's modify the Rails view for the follow button to accommodate front-end manipulation. 
- Notice that there are two branches of logic: 
  - the button will be a 'follow' button if the current user is not yet following the user, and an 'unfollow' button if they are. 
  - We want to replace the contents of this form with a single HTML element that gets updated via our front-end JavaScript.
1. Replace the contents of the button form with a single `<button>`.
1. Give the button a `class` of`follow-toggle`.
1. We'll also need to let the button know the user-id and initial-follow-state ("followed" or "unfollowed") by storing these in `data-*` attributes. 
  1. We can determine the initial-follow-state using the `User#follows?` method.
1. Leave the inner HTML of the button empty: the FollowToggle class will be responsible for setting this.
**old:**
```html
<% if current_user.follows?(user) %>
  <form action="<%= user_follow_url(user) %>" method="post">
    <input
        type="hidden"
        name="authenticity_token"
        value="<%= form_authenticity_token %>">
    <input type="hidden" name="_method" value="delete">
    <input type="submit" value="Unfollow">
  </form>
<% else %>
  <form action="<%= user_follow_url(user) %>" method="post">
    <input
        type="hidden"
        name="authenticity_token"
        value="<%= form_authenticity_token %>">
    <input type="submit" value="Follow">
  </form>
<% end %>
```

**new:**
note on HTML documentation it says:
> Tip: Always specify the type attribute for a <button> element.  Different browsers use different default types for the <button> element.
they didnt do this here so just noting it 
```html
<button class="follow-toggle" data-user-id="<%= user.id %>" data-initial-follow-state="<%= current_user.follows?(user) ? 'followed' : 'unfollowed' %>"></button>
```

b) FollowToggle Class
- NB: Each of your JavaScript classes for this project should be in a separate file in frontend/. Name the files in snake_case to match the casing of the rest of the Rails app.
- Create a new file in **frontend/** called **follow_toggle.js**.
- Define the constructor for `FollowToggle`. 
  - In the constructor, extract the user-id and initial-follow-state data from el and save them as `this.userId` and `this.followState` for later use.
  - You might also find it convenient to store a jQuery wrapped `el` as an instance variable.
  - Set module.exports to your FollowToggle class to make it require-able.
**note:** we allow this options hash here so that we can pass in from `users_search.js` (later) the data we need. Just an easier way to do what $el.data is already doing
- we stored `**data-user-id="<%= user.id %>"**` in HTML for the button, and we can retrieve it as `**el.data('user-id')**`
```javascript
class FollowToggle {
  constructor(el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = (this.$el.data('initial-follow-state') ||
      options.followState);
    this.render();

    this.$el.on('click', this.handleClick.bind(this));
  }
}

module.exports = FollowToggle;
```

- Using this class, we can now build a FollowToggle instance for each follow-toggle button on the page.
> NB: Though the follow state is stored in our database as a row (or lack thereof) in a join table, on the client side, we'll keep track of the follow state as a string. To do this we've **bootstrapped** the the user's id and follow-state to the user-id and initial-follow-state data- attributes respectively. 
> we got this information on the user's id and follow state through the user's **show.html.erb**, which calls our HTML form that has the button as a **partial**, passing in the user:
> `<%= render 'follows/form', user: @user %>`
> Later we'll add more states in addition to followed/unfollowed.

---
### **Twitter.js**
You'll probably want to start testing this out about now. But if you run Webpack at this point, nothing will get transpiled because twitter.js (the entry point) is empty, so let's fill it in.

- Require your new FollowToggleclass at the top, and define a document ready callback below.
- The callback should call your constructor once for each button.follow-toggle element.
- You can use `jQuery#each` for this, but beware: the DOM element is the second callback argument; index comes first.
**twitter.js**
```javascript
const FollowToggle = require('./follow_toggle');

$(function () {
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
});
```

---
### **follow_toggle.js**
**a) `FollowToggle#render**`
- Once you're sure that your FollowToggle constructor is being called correctly, write a `FollowToggle#render` method.
- The text should be `"Follow!"` if `this.followState === "unfollowed"`,
- The text should be `"Unfollow!"` if `this.followState === "followed"`.
- Call your `#render`method inside the constructor to initially set the inner HTML.
```javascript
render() {
  switch (this.followState) {
    case 'followed':
      this.$el.html('Unfollow!');
      break;
    case 'unfollowed':
      this.$el.html('Follow!');
      break;
  }
}
```

**b) `FollowToggle#handleClick**`
- Next, write a `FollowToggle#handleClick` method. 
- Install this click handler in the constructor. Your click handler should:
  - Prevent the default action.
  - Make a `$.ajax` request to `POST` `/users/:id/follow` if we are not following the user (check followState), else, it should make a `DELETE` request.
  - On success of the `POST/DELETE`, we should toggle the followState and re-render.
Hint: You probably want to set the `**dataType**` option for $.ajax. This way you can have jQuery automatically parse the response as `**JSON**`. 

- note: we moved all of our .ajax methods into a separate file called **api_util.js.** 
- at the top of the **follow_toggle.js** file, we added `const APIUtil = require('./api_util');`
- Use a `**promise**` to chain a success callback onto your API call that changes the followState appropriately and re-renders: by only passing one cb to `**.then()**`, this makes it the success cb.
```javascript
  handleClick(event) {
    event.preventDefault();

    if (this.followState === 'followed') {
      APIUtil.unfollowUser(this.userId).then(() => {
        followToggle.followState = 'unfollowed';
        followToggle.render();
      });
    } else if (this.followState === 'unfollowed') {
      APIUtil.followUser(this.userId).then(() => {
        followToggle.followState = 'followed';
        followToggle.render();
      });
    }
  }
```

Note: what if we just did the below and no ajax request?
```javascript
    if (this.followState === 'followed') {
      this.followState = 'unfollowed';
      this.render();
  }
```

**this would not work.** this would change how the button is rendered, but the issue is that we would never submit a POST or DELETE request to the server, so it wouldnt update the information in the server. so next time we revisited the page, this current status would no longer be updated

by calling the **ajax** method, this triggers a POST/ DELETE request to server and so the info is updated and remembered. Triggering these requests triggers the corresponding actions in the **follows_controller.rb** which makes the database updates
---

### **api_util.js**
- remember that we like to make our **util** class a **POJO,** not an actual class
- Let's refactor our AJAX calls into an api_util file. Your API util should export an object with the methods `APIUtil#followUser(id)` and `APIUtil#unfollowUser(id)`
- Use a **promise** to chain a success callback onto your API call that changes the followState appropriately and re-renders. (shown above in the follow_toggle.js file)
```javascript
const APIUtil = {

  followUser: id => APIUtil.changeFollowStatus(id, 'POST'),

  unfollowUser: id => APIUtil.changeFollowStatus(id, 'DELETE'),

  changeFollowStatus: (id, method) => (
    $.ajax({
      url: `/users/${id}/follow`, // note that you can interpolate values in url
      dataType: 'json',
      method        // according to ES6, equivalent to method: `${method}` (see below)
    })
  )
}

module.exports = APIUtil;
```
> **Note 1:** note 3: usually something like updating info would be a PUT or PATCH request, which routes to the path, for ex, /photos/:id, while a POST request is for submitting something totally new, and routes to /photos, but things like follows and likes are their own resource, not part of the user's information just accessible for a user based on associations we set up.
>    *   ---- so POST actually does make sense - we are creating (POST) a new follow or deleting (DELETE) it.  
>     *   --- we only have a create and delete method in the follows controller
>     
>  **Note 2**: typically with ajax POST requests  we have a **data** setting, but notice here we dont have one. **the result is that no form data is sent to the server**, but thats fine bc we dont need it anyway (Notice we dont need or use it in our success callback, we just update the text of the current button that triggered the event). 
>  the current user's id (which we always have track of) and the person they are following's id (which we store in the **data-* attribute in the HTML**, which we pass in from the **user show.html.erb** through a partial)  is sufficient. on the server side, our path is /user/:id/follows, bc follows is a nested resource. 

**Note 3:** with ES6, ur allowed to do property declaraction in a shorter syntax, so instead of doing:  
```javascript
   var x = 0, y = 0
   obj = {x: x, y: y}
```
- you can just do:
```javascript
   var x = 0, y = 0
   obj = {x, y}; 
```
- and they will infer what you mean

---
### **follow_toggle.js**
> **Lastly, let's freeze-out the button so that people can't click it while the AJAX request is pending.**
- In `handleClick` set **followState** to **following** or **unfollowing** and call `#render.`
- Update your `#render` method to set the ``disabled`` property if the **followState** is **following** or **unfollowing**; otherwise, make sure disabled is set to **false**. (Use jQuery's **`#prop`** method).
  - remember that we need to use jQuery's **prop()** instead of **attr()** for DOM properties `checked`, `selected`, or `disabled` state of form elements.
```javascript
  handleClick(event) {
    // const followToggle = this;           they saved this & then in cb's: followToggle.followState, but this works w/out it.
    event.preventDefault();

    // it changes the state to unfollowing, at which point in the render method it makes it so that the button is disabled, until the ajax request finishes at which point the succuess cb is called and state changed to unfollowed and button undisabled.
    if (this.followState === 'followed') {
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
    }
  }
```
  
  
---

## `**Phase II: UsersSearch**`

> Review **app/controllers/users_controller.rb** and **app/views/users/search.html.erb**. We want to create real-time user search. On every keypress as the user types in a username, we'll show the matching users for the current input.

- with the current skeleton, we have the capability to search but its not real-time. meaning you have to enter your search before seeing the matching users 

**a) UsersSearch Class - app/views/users/search.html.erb**
- Replace the entire form with a nav with `class` `users-search`.
- Add an input field for the user to type the name.
- Nested in the nav.users-search, have a `ul.users` for displaying results.

**old:**
```html
<h1>Search!</h1>

<form action="/users/search" method="GET">
  <input
    type="text"
    name="query"
    value="<%= @query %>">

  <input type="submit" value="Search Users!">
</form>

<ul>
  <% @users.each do |user| %>
    <li>
      <a href="<%= user_url(user) %>"><%= user.username %></a>
      <%= render 'follows/form', user: user %>
    </li>
  <% end %>
</ul>
```

**new:**
- The HTML5 `**placeholder**`attribute is used in input tags.The placeholder attribute specifies a short hint that describes the expected value of an input field (e.g. a sample value or a short description of the expected format).The short hint is displayed in the input field before the user enters a value.
```html
<h2 class='page-header'>Search!</h2>

<div class='users-search'>
<form class="simple-form">
  <div>
    <label for='user-search-input'>Username</label>
    <input class='user-search-input' 
      type="text" 
      name="username"
      placeholder='Enter a username'>
  </div>
</form>

<h4>Results</h4>
<ul class="users"></ul>
</div>
```


**b) UsersSearch Class** **- frontend/users_search.js**
- Create a **frontend/users_search.js** file and define the `UsersSearch` class.
- In the constructor, store jQuery wrapped versions of the `el`, its `input` and its `ul` on this.
  - using `**.find()**` is basically the same as if we had selected the selector directly, except we're narrowing down the search so now our program wont have to look through the entire DOM.
```javascript
const APIUtil = require('./api_util');

class UsersSearch {
  constructor(el) {
    this.$el = $(el);
    this.$input = this.$el.find('input[name=username]');
    this.$ul = this.$el.find('.users');
    // .on input is the event now
    this.$input.on('input', this.handleInput.bind(this));
  }
}
  
module.exports = UsersSearch;
```

---
### **Twitter.js**
- As with FollowToggle, build an instance of UsersSearch for each nav.users-search in your entry file. (although there is really only one, unlike with FollowToggle buttons where there were so many)
```javascript
const FollowToggle = require('./follow_toggle');

$(function () {
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
  $('.users-search').each( (i, search) => new UsersSearch(search) );
});
```

---
### **api_util.js**
- Write an `**APIUtil#searchUsers(queryVal, success)**` to make a request to `/users/search`. You can send query parameters along with an $.ajax call through the data. Don't forget to set dataType!
  - we had to put the **query** as an object to **data** because data takes in a Plain Object, string, or array
  - GET request meaning it will append the **query**, which will just be whatever text we typed into the search bar, to the end of the url
    - according to the ES6 shortened property declaration syntax: this is equivalent to saying: `{ query: query }`
```javascript
  searchUsers: query => (
    $.ajax({
      url: '/users/search',
      dataType: 'json',
      method: 'GET',
      data: { query }    // same as data: { query: query }
    })
  )
```

![Image](https://www.dropbox.com/s/f6uju67n689ipdo/ByUn8p9TX_SJXfc3JC7.png?dl=1)


---
### **users_search.js**

**c)** Write a `**UsersSearch#handleInput**` handler. 
- On each input event, call `APIUtil.searchUsers`, sending the input's val as the query parameter.
```javascript
 handleInput(event) {
    if (this.$input.val() === '') {        // render empty arr if no users
      this.renderResults([]);
      return;
    }
    APIUtil.searchUsers(this.$input.val())
      .then(users => this.renderResults(users));
  }
```
  
---
### **users_controller.rb**
Now, let's set up your controller to respond to AJAX requests with JSON. Because your controller will be handling both HTML and JSON requests, let's separate out each of those types of requests and respond to them separately. 
- Put the following code into your controller to replace the line reading **render :search**:
```ruby
respond_to do |format|
  format.html { render :search }
  format.json { render :search }
end
```

the entire **search action** in the **users controller** now looks like this:
```javascript
  def search
    if params[:query].present?
      @users = User.where('username ~ ?', params[:query])
    else
      @users = User.none
    end

    respond_to do |format|
      format.html { render :search }
      format.json { render :search }
    end
    
  end
```
- apparently using a `**~**` in AR `where` query is for matching regular expressions. 
  - in rails server log looks like:   `User Load (0.8ms)  SELECT "users".* FROM "users" WHERE (username ~ 'a')`
  - we use it because it allows us to match the query anywhere in the string - and imitating the same with LIKE would mean we would have to include a % before and after the query, but that wouldn't work if we're interpolating in the ?. 
  - [https://www.postgresql.org/docs/8.1/functions-matching.html](https://www.postgresql.org/docs/8.1/functions-matching.html)
- `**.present?**` will load all records returned, while `**.exists?**` would just check if there's at least 1 record found, without loading them all
  - theres a big performance issue (.present way slower) but it makes sense to use it in this case
- `**Model.none**` returns an activeRecord relation object that is empty:
  - Returns a chainable relation with zero records, specifically an instance of the ActiveRecord::NullRelation class.
  - Used in cases where a method or scope could return zero records but the result needs to be chainable. 
  - **from testing, it does not look like just saying @users = []** would break the code here. but i guess good to just use this Model.none. it follows the **null object pattern**
  - [https://apidock.com/rails/v4.0.2/ActiveRecord/QueryMethods/none](https://apidock.com/rails/v4.0.2/ActiveRecord/QueryMethods/none)
```javascript
>> Model.none 
=> #<ActiveRecord::Relation []>
```


---
### **Jbuilder Teaser**
For now, just follow along! You're not going to understand all of the jbuilder stuff till we go over next week.

We've told the controller to :
1. render the :search HTML view for requests that want **HTML** -> **app/views/users/search.html.erb** and to 
1. render the :search **JSON** view for requests that want JSON -> **app/views/users/search.json.jbuilder**
But we don't yet have a search.json view! Let's make one. The file, in the /users/ folder, should be named **search.json.jbuilder** and should contain the following code:
- The code below takes your `@users` instance variable and turns it into an array of JSON objects. 
- Each object will have all of its information as well as `followed`, which will be either **true** or **false** depending on whether the current user is following this user.
  - `*items` means that the function accepts variable number of arguments.
  - it turns our array of column_names, shown below this code box, into comma separated list of column names for each user. 
  - and adds on to the end of that comma separated list one more k/v pair: `followed: true/fase`
**in summary, the below creates an array filled with objects, 1 object for each user that came up in the search query. in each object, includes the k/v pairs for the attributes indicated below:**
```ruby
json.array!(@users) do |user|
  json.(user, *User.column_names)
  json.followed(current_user.follows?(user))
end
```

![Image](https://www.dropbox.com/s/ihgzxfxh1n2f446/ByUn8p9TX_r1F-th1A7.png?dl=1)

- `**column_names`:** rails provides a helper method column_names that returns all of the database columns for a model Class 
  - you can even confirm this in **rails console:** 
```ruby
[4] pry(main)> User.column_names
=> ["id", "username", "password_digest", "session_token", "created_at", "updated_at"]
```

---
### **users_search.js**
**Handling Success - `UsersSearch#renderResults**`
- When the AJAX call successfully returns a list of matching users, we want to display those results in the `ul.users`. 
- Write a method `UsersSearch#renderResults` for your promise success handler. It should:
  - Empty out `ul.users` and iterate through the fetched array of users.
  - For each result, use jQuery to build an `li` containing an anchor tag linking to the user.
  - Use the jQuery `**append**` method to add each result to the ul.
  - Last, we want to add follow toggle buttons for each of these results. When building the li tags for each user, build a button, too. You can create a FollowToggle instance for the button to setup the follow toggle.
```javascript
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
```

**testing:** from testing saw that each letter you enter/delete from the search bar, sends a GET request to the server for the users that match the current input in the search bar, and renders them, along with a follow/unfollow button depending on whether you already follow or not
- you can inspect the JSON object you get from the server each time if you go to the **preview** tab under **Networks** for the correct GET request
---
### **Styling**
-----just part of it not all of it
- Change the default page font
- Add headers for your app and the search results page
- Style those buttons!

- **application.scss** - this is our CSS manifest file
  - just like JS, need to be careful about order
  - just like JS, included into **application.html.erb** with   `<%= stylesheet_link_tag    'application', media: 'all' %>`
- i just copied their stylesheets - **reset.scss**, **base.scss**, **nav.scss**
  - added my own **search.scss** to make my own slight changes
- and imported them into the bottom of application.scss in an appropriate order:
```javascript
 @import 'reset.scss';
 @import 'base.scss';
 @import 'nav.scss';
 @import 'simple-form.scss';
 @import 'search.scss';
```

---

## `**Phase III: TweetCompose**`

**tweets_controller.rb**
- First, we're going to update our TweetsController to handle JSON requests, similarly to how we updated our UsersController before. 
- If we've successfully created a tweet from a JSON request, then we should render that tweet back as JSON. We could `render json: @tweet`, but then we might not have all of the information we need. 
- instead, add a `respond_to` block and put cases for format.html and format.json inside it. 
  - If the request matches `format.json`, call `render :show` so that we can structure our response to our application's needs.
***entire tweets_controller `create` method now looks like:***
```ruby
  def create
    # simulate latency
    sleep(1)
    # as of latest rails update, build and new are now the same
    @tweet = current_user.tweets.build(tweet_params)

    if @tweet.save
      respond_to do |format|
        format.html { redirect_to request.referrer }
        format.json { render :show }
      end
    else
      # Lazy: even respond with JSON to invalid HTML request.
      render json: @tweet.errors.full_messages, status: 422
    end
  end
```
- `**request.referrer**` is just the url we were on when we clicked submit new tweet, which is also the url that sends the POST request to the server to add the new tweet. 
  - you can also check this by going into the request headers and looking for `**referer**`.
  - in this case, its Referer: http://localhost:3000/feed.
- For an ActiveRecord Association `**new**` and `**build**` are pretty much the same.
  - I think used to be different but in more recent rails updates they are now the same.
  - either works above
  - but officially, build is just like the new method, but by assocation proxies (not for Models). 

---

**views/tweets/show.json.builder:**
- Now, just as we did before, let's create a show view for our tweets. 
- We're going to call a partial in this view; to that end, we'll put the following code in **`show.json.jbuilder:`**
```ruby
json.partial!("tweets/tweet", tweet: @tweet)
```
  - referencing a file in the same folder called **_tweet.json.jbuilder**
    - Note: never referencing the file _tweet.html.erb

**Partials in Jbuilder work the same way they do in ERB:** - the partial file name starts with a _ and you pass in a piece of information for the partial to render using a hash. 

Let's create that partial right now at `**_tweet.json.jbuilder**`and put the following code into it:
- What this code is doing is collecting the tweet's information, the tweeter's information, and also information about each of that tweet's mentions.
```ruby
json.(tweet, *Tweet.column_names)

json.user(tweet.user, *User.column_names)

json.mentions(tweet.mentions) do |mention|
  json.(mention, *Mention.column_names)
  json.user(mention.user, *User.column_names)
end
```

---

**TweetCompose Class**
- Open **app/views/tweets/_form.html.erb** and give the `form` a `class tweet-compose`.
  - this partial is rendered from **feeds/show.html.erb,** which is the view that shows the user's feed when they click on the 'Feed' tab in the browser. - this is the part of the feed always at the bottom where you can create a new tweet
- in **frontend/twitter.js,** build an instance of TweetCompose for each `form.tweet-compose`. (although I think there really is only one, unlike with FollowToggle buttons where there were so many)
- create a **frontend/tweet_compose.js**. Write a `**TweetCompose**` class that
  - In the TweetCompose constructor, grab this form and install a `submit` event handler.
  - Write a **`TweetCompose#submit`** method that:
    - 1. uses `serializeJSON` to build JSON from the form contents
      - remember that serialize() and serializeJSON both called on form itself
    - 2. As before, **disable** the form when the submit is made. You can't disable an entire form, so you'll have to disable all the inputs. To get all the inputs, use jQuery's `**:input**` pseudo-CSS selector. Make sure not to disable your inputs until after you've serialized the form contents, or their values will be ignored. :(
    - 3. calls **`APIUtil#createTweet(data)`**function to submit the form --- write this method in **frontend/api_utils.js**
    - 4. creates a **promise** and calls a success callback method `TweetCompose#handleSuccess` --directions on writing it next up

***twitter.js:***
```javascript
const FollowToggle = require('./follow_toggle');
const UsersSearch = require('./users_search');
const TweetCompose = require('./tweet_compose');                            x

$(function () {
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
  $('.users-search').each((i, search) => new UsersSearch(search));
  $('form.tweet-compose').each((i, form) => new TweetCompose(form));        x
});
```

***tweet_compose.js***
```javascript
const APIUtil = require('./api_util');
class TweetCompose {
  constructor(el) {
    this.$el = $(el);
    
    this.$el.on('submit', this.submit.bind(this));
  }
  
  handleSuccess(data) {
  }

  submit(event) {
    event.preventDefault();

    const data = this.$el.serializeJSON();

    this.$el.find(':input').prop('disabled', true);

    APIUtil.createTweet(data).then(tweet => this.handleSuccess(tweet));
  }
}
module.exports = TweetCompose;
```
  **note:**  `**:input**` is a jQuery extension selector not a CSS3 selector. it selects all input, textarea, select & button elements. (basically all form controls)  
  - **it is not recommended to use this** the way we did above:
> Because these selectors are jQuery extension and not part of the CSS specification, queries using them cannot take advantage of the performance boost provided by the native DOM `querySelectorAll()` method.To achieve the best performance when using these selectors, first select some elements using a pure CSS selector, then use `.filter(":selectorName")`.
 
***api_util.js***
- we passed in the data as serialized form from the **tweet_compose.js** file. just looks confusing bc typically we just serialize it directly in the .ajax method, but we also wanted to disable the form controls until .ajax method completes, and we must serialize the form before we disable or the values will be ignored, so we had to do it outside of .ajax method in the method that called it
```javascript
createTweet: data => (
    $.ajax({
      url: '/tweets',
      method: 'POST',
      dataType: 'json',
      data
    })
  )
```


`**TweetCompose#handleSucess**` 

in this cb, we:
- 1. want to insert the created tweet into the list of all tweets. How does TweetCompose find the ul of tweets? We can set a `data` attribute on the form where the value is the selector that corresponds to the target ul. 
  - For example, if we give the target ul an id of `#feed`, we can give our form the following data attribute: `data-tweets-ul="#feed"`. 
  - Our TweetCompose can pull out this data attribute and use the selector #feed to find the ul. This is better than hard coding #feed into the JS.
- 2. **just for now:** A successf`ul` AJAX post request for a tweet should return back the newly created tweet in JSON format. For simp`li`city, have TweetCompose call `**JSON.stringify**` on the created Tweet. Build an li with the JSON content, and stick it in the ul. We'll actually render this nicely in a later phase.
  - this just renders it on the page at the bottom of our feed as a JSON string not at all what we want but fine for now
  - were able to call `**JSON.stringify` on it bc we used `.serializeJSON()` earlier so our data is a JS objg.**

***app/views/feeds/show.html.erb:** (just the part that we changed):*
***- old :***
```javascript
<%= render 'tweets/form' %>
```
***- new:*** 
- all we did was pass in a `tweets_ul` variable with the string value of `'#feed'`
- we had to do this on this page instead of just pung '#feed' in the _form.html.erb page bc this page is what the ul with id='feed' is defined in the first place, so even though the data attribute will be on another page it uses ruby erb tags and will evaluate to the ul on this page (see code block after this one)
```javascript
<%= render 'tweets/form', tweets_ul: '#feed' %>
```

***app/views/tweets/_form.html.erb** - again just small part*
```html
<h2>New Tweet!</h2>
<form class="tweet-compose" data-tweets-ul="<%= tweets_ul %>">
```


***tweets_compose.js:***
- *Noting that string interpolation is valid in to create new jQuery object*
```javascript
handleSuccess(data) {
  const $tweetsUl = $(this.$el.data('tweets-ul'));
  const $listEl = $(`<li>${JSON.stringify(data)}</li>`);
  $tweetsUl.append($listEl);
}
```


`**Maximum characters**`

- Finally, let's add a counter that will show the number of characters remaining for a tweet (starting at 140). Add a `strong` tag with `class .chars-left` to the `form`. 
- In the TweetCompose constructor, add an `input` event handler on the `textarea`. In it, update the strong tag with the number of characters remaining.
***tweets/_form.html.erb***
- *noting theres nothing actually inside the strong tag just a class. I guess we'll be defining what it renders in the JS, never seen it used this way before*
```html
<h2>New Tweet!</h2>
<form class="tweet-compose" data-tweets-ul="<%= tweets_ul %>">

  <label for='tweet-textarea'>What's on your mind?</label>
  <textarea id='tweet-textarea' name="tweet[content]" placeholder="What's on your mind?"></textarea>
  <strong class="char-left"></strong>
```
  
  **tweets_compose.js**
- `**'input'**`event reacts immediatally for any typing (so each char) into that textarea
- `**val()`:** retrieve the value of an input or textarea tag. updates real time as you type
- Again, cud have used`**.html()**` in place of `**.text()**` below wouldn't make a diff here bc not working w/ xml
  - but, from general understanding use .text() for rendering any plain text to the page you want the user to see and .html() for things like button text
- `**'submit'**`event can only be attached to `<form>` elements.  - reminder
```javascript
class TweetCompose {
  constructor(el) {
    this.$el = $(el);
    
/*referencing textarea[name="tweet[content]"]. To use any of the meta - chars- !"#$%&'()*+,./:;<=>?@[\]^`{|}~ -as a literal part of a name, must be escaped w/: \\ */
    
    this.$input = this.$el.find('textarea[name=tweet\\[content\\]]');        x
    this.$input.on('input', this.handleInput.bind(this));                    x
    
    this.$el.on('submit', this.submit.bind(this));
  }
  
  handleInput(event) {
    const inputLength = this.$input.val().length;

    this.$el.find('.char-left').text(`${140 - inputLength} characters left`);
  }
}
```

---
### **Style it!**
made a`**tweet.scss**` stylesheet and added it as an import onto the end of `**application.scss**`
- Hide your `label` and use a `placeholder` attribute on your tweet form's textarea
  - I kept the label but styled it in CSS with **display: none** just in case. but note: `**visibility: hidden**` hides the element, but it still takes up space in the layout. `**display: none**` removes the element completely from the document. It does not take up any space, even though the HTML for it is still in the source code.
- Add some padding to your textarea
- Center your form on the page and give it a fixed height and width
  - reasonable to set a height and width on a textarea element - which is all our form is supposed to be right now
---
### `**Phase IV: TweetCompose: Mentioned Users**`
The next part is to allow us to tag multiple users in a tweet. Right now we can select a single user to tag. Our killer feature will be to dynamically create more select tags so we can tag more users.

Rather than have just one select tag visible all the time, we want to have no select tags to start. Instead, we want to show an "Add mention" link which will let us add multiple select tags to the page.

To do this, create a **`newUserSelect`** helper function to create a new `select` element with all of the users as options. You can get the users by **"bootstrapping"** them to the global window from our backend.
- In `**application.html.erb**`, inside a `<script>` and in JavaScript, assign a json array of all of our users (you will have to render a partial) to window.users. This will give us access to window.users from our frontend code.
***application.html.erb - inside of the `<head></head>***`
- *remember our HTML files can access all our models*
```javascript
<script type='text/javascript'>
  window.users = <%= render("users/users.json.jbuilder", users: User.all).html_safe %>; 
</script>
```
- `**html_safe:**` Marks a string as trusted safe. It will be inserted into HTML with no additional escaping performed. It is your responsibilty to ensure that the string contains no malicious content. This method is equivalent to the ``raw`` helper in views. It is recommended that you use ``sanitize`` instead of this method. **It should never be called on user input.**

***users/_users.json.jbuilder***
```javascript
json.partial! partial: 'users/user.json.jbuilder', collection: users, as: :user
```

***user/_user.json.jbuilder***
```javascript
json.extract! user, :id, :username
```

- Now add a button below our textarea that will add a new select element. We can click it more than once to "mention" multiple users.
- Test this out and make sure you can create new select tags by clicking the link.
***tweets/_form.htlm.erb***
```html
<form class="simple-form tweet-compose" data-tweets-ul="<%= tweets_ul %>">
  <label for='tweet-textarea'>What's on your mind?</label>
  <textarea id='tweet-textarea' name="tweet[content]" placeholder="What's on your mind?"></textarea>
  <strong class="char-left"></strong>

  <ul class="mentioned-users"></ul>        x

  <ul class='tweet-actions'>                x
    <li>                                    x             
      <button class="add-mentioned-user">Add mention</button>   x
    </li>                                   x                                                     
    <li>                                    x
      <input type="submit" value="Post Tweet!">            x
    </li>                                            x
  </ul>                                              x
</form>                                              x
```

***tweets_compose.js***
```javascript
class TweetCompose {
  constructor(el) {
    this.$el = $(el);    
    this.$input = this.$el.find('textarea[name=tweet\\[content\\]]');
    
    this.$input.on('input', this.handleInput.bind(this));

    this.$mentionedUsersDiv = this.$el.find('.mentioned-users'); 
    this.$el.find('.add-mentioned-user').on(         
      'click', this.addMentionedUser.bind(this));

    this.$el.on('submit', this.submit.bind(this));
  }

  addMentionedUser(event) {
    event.preventDefault();

    this.$mentionedUsersDiv.append(this.newUserSelect());
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
```

- add functionality to also remove mentioned users before you send the tweet 
***tweet_compose.js***
```javascript
//...
this.$mentionedUsersDiv = this.$el.find('.mentioned-users');
    this.$el.find('.add-mentioned-user').on(
      'click', this.addMentionedUser.bind(this));
    this.$mentionedUsersDiv.on(                    x
      'click', '.remove-mentioned-user',           x this.removeMentionedUser.bind(this));              x
//....

// parent of the button is the div made above holding the button.
  removeMentionedUser(event) {
    event.preventDefault();
    $(event.currentTarget).parent().remove();
  }
```

- Lastly, we want to update `**TweetCompose#clearInput**` to clear out all the selects after form submission succeeds.
- Put all your select tags into a div with class .mentioned-users.
- In `#clearInput`, grab this div and empty() it.
***tweet_compose.js:***
`**clearInput**`
   * 1) sets the value to '' so the textarea becomes blank (.val() setter only takes in 1 param when used as setter)
   * 2) find the div's that hold the mentioned users selected and clear that 
   * 3) undisable the button we disabled earlier for the form submission in 'submit' method
   * 4) empty the field under textarea that tells us how many characters we have left
```javascript
  clearInput() {  
    this.$input.val('');
    this.$mentionedUsersDiv.find('div').empty();
    this.$el.find(':input').prop('disabled', false);
    this.$el.find('.char-left').empty();
  }
  
  handleSuccess(data) {
    const $tweetsUl = $(this.$el.data('tweets-ul'));

    const $listEl = $(`<li>${JSON.stringify(data)}</li>`);
    $tweetsUl.append($listEl)

    this.clearInput();        x
  }
```
  
---
### `**Styling**`
You know the drill. Pretty up your mentions by adding some styles to it.

---
### `**Phase V: Infinite Tweets**`  
Right now we send all the tweets down when the user requests /feed. If there are many, many tweets in the feed, this will send a huge amount of data to the user. Moreover, the user is likely to be interested in only the most recent tweets.

`**User Model**`
- Let's **paginate** the sending of tweets. To start, open up `app/models/user.rb`. 
- Modify the `#feed_tweets` method to send only up to limit tweets. Also, modify it not to return any tweets created after `max_created_at`. 
- Test this out in your Rails console before moving to the JavaScript portion.
***app/models/user.rb:***
```ruby
  def feed_tweets(limit = nil, max_created_at = nil)
    @tweets = Tweet
      .joins(:user)
      .joins('LEFT OUTER JOIN follows ON users.id = follows.followee_id')
      .where('tweets.user_id = :id OR follows.follower_id = :id', id: self.id)
      .order('tweets.created_at DESC')
      .distinct

    # TODO: How can we use limit/max_created_at here??

    @tweets = @tweets.limit(limit) if limit                x
    @tweets = @tweets.where('tweets.created_at < ?',       x max_created_at) if max_created_at                            

    @tweets
  end
```

`**Views**`
- Next, let's begin modifying the `app/views/feeds/show.html.erb` template. You should have a `ul#feed` from phase III. 
- Wrap that ul with a div with `class infinite-tweets`. 
- You can empty out the contents of the ul#feed since we'll be adding the tweets inside dynamically with jQuery now. 
- Also, write an anchor tag with class `fetch-more`; this link will be clicked to load more tweets.
`**Feeds Controller**`
- As we did before, we're going to have to update our FeedsController to handle JSON requests. 
- Replace the `render :show` line in `FeedsController#show` with the following code:
```ruby
respond_to do |format|
  format.html { render :show }
  format.json { render :show }
end
```

***results:***
```ruby
  LIMIT = 20

  def show
    @feed_tweets =
      current_user.feed_tweets(LIMIT, params[:max_created_at]).includes(:user)

    respond_to do |format|
      format.html { render :show }
      format.json { render :show }
    end
  end
```

Now, also in a repetition of our earlier process, let's build out the rest of our JSON API. We'll start by creating a **`feeds/show.json.jbuilder`**. We can reuse the tweet partial we already wrote by calling it in this show view:

```ruby
json.array!(@feed_tweets) do |tweet|
  json.partial!("tweets/tweet", tweet: tweet)
end
```

`**InfiniteTweets Class**`

`twitter.js`
```javascript
const FollowToggle = require('./follow_toggle');
const UsersSearch = require('./users_search');
const TweetCompose = require('./tweet_compose');
const InfiniteTweets = require('./infinite_tweets');        x

$(function () {
  $('div.infinite-tweets').each((i, tweet) => new           x            InfiniteTweets(tweet));
  $('button.follow-toggle').each((i, btn) => new FollowToggle(btn, {}));
  $('.users-search').each((i, search) => new UsersSearch(search));
  $('form.tweet-compose').each((i, form) => new TweetCompose(form));
});
```

- Begin writing an `InfiniteTweets` class.
  - Listen for clicks to fetch more;
  - Create an `InfiniteTweets#fetchTweets` method.
  - Create an `APIUtil` method to make requests to /feed
  - In #fetchTweets, call your APIUtil, and on resolution of the promise call an `#insertTweets` method.
`**insertTweets**`
- For simplicity, for each tweet, just append <li> items with JSON.stringify(tweet) into the appropriate ul.
- If you click the link twice, you'll fetch the same set of tweets twice. We need to send the max_created_at parameter.
- In the InfiniteTweets constructor, initialize this.maxCreatedAt to null.
`**fetchTweets**` pt.2
- In the #fetchTweets method, if maxCreatedAt !== null, send it in the AJAX data parameter. (Notice the often confusing mix of Ruby and JS naming conventions).
- When successfully fetching tweets, record this.max_created_at by looking at the created_at attribute of the last tweet fetched. This should ensure that each call to #fetchTweets fetches the next set of tweets, chronologically.
- Once you've fetched all the tweets, you should remove the "Fetch more tweets" link and replace it with a message that there are no more tweets to fetch. You can tell there are no more tweets to fetch if < 20 tweets are returned.
`infinite_tweets.js`
```javascript
const APIUtil = require('./api_util');

class InfiniteTweets {
  constructor(el) {
    this.$el = $(el);
    
     this.lastCreatedAt = null;
     
    this.$el.on('click', '.fetch-more', this.fetchTweets.bind(this));
  }
  
  insertTweets(data) {
    const $li = $(`<li>${JSON.stringify(data)}</li>`);
    this.$el.find('ul.tweets').append($li);
  }
  
  fetchTweets(events) {
    event.preventDefault();

    const infiniteTweets = this;
    const data = {};
    if (this.lastCreatedAt) data.max_created_at = this.lastCreatedAt;

    APIUtil.fetchTweets(data).then((data) => {
      infiniteTweets.insertTweets(data);

      if (data.length < 20) {
        infiniteTweets.$el
          .find('.fetch-more')
          .replaceWith('<b>No more tweets!</b>');
      }

      if (data.length > 0) {
        infiniteTweets.lastCreatedAt = data[data.length - 1].created_at;
      }
    });
  }
}

module.exports = InfiniteTweets;
```

`api_util.js`
- example of using `**data**` setting with a `GET` request - we just used it here solely for access to it in our success callback to decide which tweets to insert. the data will be in our query string parameters if it is not null
```javascript
fetchTweets: data => (
    $.ajax({
      url: '/feed',
      method: 'GET',
      dataType: 'json',
      data
    })
  )
```

---

### **`Phase VI: jQuery Triggering`**
- There is one last step. Your `**TweetCompose**` also tries to insert tweets into the feed. 
- Should we copy over all the logic of InfiniteTweets into TweetCompose? That doesn't sound very DRY.
- Instead of having TweetCompose insert HTML into the DOM, have it `jQuery#trigger` an `insert-tweet` event on your `#feed ul`. 
- When you trigger the event from the TweetCompose class, pass the newly created tweet's data along as well.
> This is a custom event (not a pre-defined browser event) that you can use so that one module of code can signal another module. Here, this allows TweetCompose to remain agnostic of how a new tweet is inserted; by triggering the custom event, TweetCompose simply notifies InfiniteTweets to do the work of insertion.

***tweet_compose.js***
```javascript
 handleSuccess(data) {
    const $tweetsUl = $(this.$el.data('tweets-ul'));

    // const $listEl = $(`<li>${JSON.stringify(data)}</li>`);   old now we just trigger infiniteTweets class to insert the tweet - not dry to do it twice            x
    // $tweetsUl.append($listEl);                                            x                                
    $tweetsUl.trigger('insert-tweet', data);                                 x            

    this.clearInput();
  }
```


- Add a listener for insert-tweet in the `**InfiniteTweets**` class and have it fire an InfiniteTweets#insertTweet method.
> **Common bug:** You may also want insertTweet to update the the lastCreatedAt instance variable. If you were to compose a tweet and not set lastCreatedAt, you'll fetch the same tweet again when you make an AJAX call to /feed.

```javascript
class InfiniteTweets {
  constructor(el) {
    this.$el = $(el);
    this.lastCreatedAt = null;

    this.$el.on('click', '.fetch-more', this.fetchTweets.bind(this));
    this.$el.on('insert-tweet', this.insertTweet.bind(this));            x
  }

  // this is for tweetCompose. also notice append for fetch more, prepend for add one
  insertTweet(event, data) {
    this.$el.find('ul.tweets').prepend(JSON.stringify(data));        x

    if (!this.lastCreatedAt) {
      this.lastCreatedAt = data.created_at;
    }
  }
  
  insertTweets(data) {
    const $li = $(`<li>${JSON.stringify(data)}</li>`);
    this.$el.find('ul.tweets').append($li);
  }
```
  
---

### `**Phase VII: Jbuilder Practice**`
- Since we're going to be using Jbuilder often over the next few weeks, let's get some more practice with it today. Use its [docs](https://github.com/rails/jbuilder/blob/master/README.md) a guide.

**Follows Show**
- Let's start by creating a simple view for our `FollowsController` to use. 
- In both its `create` and `destroy methods`, the FollowsController calls `render json: @follow`. 
- Replace that with `render :show` and write a show view in Jbuilder. 
- This view should have the same effect as calling render json: @follow - all of the follow's information should get sent to the frontend.
***follows/show.json.jbuilder:***
```ruby
json.extract! @follow
```
- Test your new view by creating and destroying Follows using your app. Does it still work? Yes

**Users Show**
Next, we'll work on a show view for users. 

> In a full Rails API backend, we might use this view when a user is created, destroyed, or shown, as well as whenever a user logs in or out. This view should be similar to the view we just wrote, with one crucial difference: we need to keep our users' private information from being sent over the internet. Write a users/show.json.jbuilder that only returns a user's username and id, keeping their password_digest and session_token safe on the server.

***users/show.json.jbuilder:***
```ruby
json.extract! @user, :id, :username
```
- Test your new view by modifying your `User#create` method to `render :show` when it receives a JSON request. 
- Does your view send back the correct information if you test it using Postman? After your test succeeds, change your controller code back.

**Tweets Index**
- Finally, we'll write an index view for tweets. 
- This view isn't strictly applicable to our current application, but it demonstrates a pattern that you will use in future full-stack applications, particularly when we start using `**Redux**`. 
- We're going to return an object filled with tweets, each tweet keyed by its id. It will look like the following:
```json
{
  "1": {
    "content": "Set world napping record",
    "user_id": 1
  },
  "2": {
    "content": "Jumped to the top of the shelf!",
    "user_id": 1
  },
}
```

- Write a `**tweets/index.json.jbuilder**` that returns an object full of tweets. 
```ruby
@tweets.each do |tweet|
  json.set! tweet.id do
    json.extract! tweet, :content, :user_id
  end
end
```
- Create a `**Tweets#index**` method and route, and render your new index view in it.
- Next, include the tweeter's username along with each tweet. Prevent n+1 queries by using includes. Check your server log and make sure that only two queries are being fired to display all of the tweets and usernames.
-  Test your new code by navigating to localhost:3000/tweets.
*index.json.jbuilder:*
```ruby
@tweets.each do |tweet|
  json.set! tweet.id do
    json.extract! tweet, :content, :user_id
    json.username tweet.user.username
  end
end
```

*tweets_controller.rb:*
```ruby
    @tweets = Tweet.all.includes(:user)
    respond_to do |format|
      format.html { redirect_to request.referrer }
      format.json { render :index }
    end
```
*config/routes.rb:*
```ruby
  resources :tweets, only: [:index], defaults: { format: :json }
```


- Next, include a list of each tweet's mentioned users along with each tweet. Make sure to add :mentioned_users to your includes statement to prevent n+1 queries. 
*index.json.jbuilder:*
```ruby
@tweets.each do |tweet|
  json.set! tweet.id do
    json.extract! tweet, :content, :user_id
    json.username tweet.user.username
    json.mentioned_users tweet.mentioned_users
  end
end
```

tweets_controller.rb:
```ruby
  def index
    @tweets = Tweet.all.includes(:user, :mentioned_users)
    respond_to do |format|
      format.html { redirect_to request.referrer }
      format.json { render :index }
    end 
  end
```
- Test your new code by navigating to localhost:3000/tweets - your returned JSON should look like this:
```json
{
  "1": {
    "content": "Set world napping record",
    "user_id": 1,
    "username": "breakfast",
    "mentioned_users": []
  },
  "2": {
    "content": "Jumped to the top of the shelf!",
    "user_id": 1,
    "username": "breakfast",
    "mentioned_users": []
  },
}
```


---

**Fix rendering for TweetCompose and InfiniteTweets** 
currently we're rendering a json string as our new tweet post and when we click fetch more tweets. instead, we want these to be elements part of our HTML page in the same format as the other instances of them:
```javascript
// this is for tweetCompose
  insertTweet(event, data) {
    this.$el.find('ul.tweets').prepend(this.tweetElement(data));        x    

    if (!this.lastCreatedAt) {
      this.lastCreatedAt = data.created_at;
    }
  }
  
  insertTweets(data) {
    this.$el.find('ul.tweets').append(data.map(this.tweetElement));        x
  }

  tweetElement(tweet) {                                                     x                                                             
    const mentions = tweet.mentions.map(mention =>
      `<li class='tweetee'>
        <a href='/users/${mention.user.id}'>@${mention.user.username}</a>
      </li>`)
      .join('');

    const elementString = `
    <div class='tweet'>
      <h3 class='tweeter'>
        <a href='/users/${tweet.user.id}'>
          @${tweet.user.username}
        </a>
      </h3>
      
      <p>${tweet.content}</p>
      
      <ul>Mentions
        ${mentions}
      </ul>
    </div>`

    return $(elementString);
  }
```
  
  
---

### `**Styling**`
- added a **users.scss** and imported it into applicatin.css
- this styles the results when we use the **user search** functionality

---

### `**solution issue fix**`
- you can search for urself and then follow/unfollow urself. and then if you click on the users profile from the search, you can access your own profile and you have a follow/unfollow button there
- i fixed this:
1. in **application_controller.rb** i added a`**current_user_id**` method, and made it accessible to all views by making it a `helper_method`:
```ruby
  helper_method :current_user, :current_user_id         x
  
  def current_user
    # fetches the user we've logged in as
    return nil if self.session[:session_token].nil?
    User.find_by(session_token: self.session[:session_token])
  end

  def current_user_id                        x
    current_user ? current_user.id : nil
  end
```

2. in **application.html.erb** i added a window.current_user in a `script` tag in the `head` tag to give the js frontend files access to the current_user variable:
- put it in an if statement bc otherwise get called out in chrome dev tools for uncaught syntax error when on a login page bc there is no current_user, and so it just sees window.current_user = 
```ruby
<script type='text/javascript'>
  window.users = <%= render("users/users.json.jbuilder", users: User.all).html_safe %>; 
  <% if current_user %>             x
    window.current_user = <%= current_user_id %>
  <% end %>
</script>
```

3. in **users_search.js** i added a conditional that made sure to send a different options hash to followToggle for the current_user vs other users (bc we use followToggle to render the follow buttons wtihin the users search page results) 
```javascript
renderResults(users) {
    this.$ul.empty();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      let $a = $('<a></a>');
      $a.text(`@${user.username}`);
      $a.attr('href', `/users/${user.id}`);
      const $followToggle = $('<button></button>');
      if (user.id !== current_user) {                        x
        new FollowToggle($followToggle, {
          userId: user.id,
          followState: user.followed ? 'followed' : 'unfollowed'
        });
      } else {                                                x
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
```

4. in **follow_toggle.js,** i added additional code to `followClick` and `render` to include this additional followState: 'this is you!'
- 1) added a class to it so that I could style in CSS to make it not look like a button anymore
- 2) disabled it so that the user wont be clicking and it wont send requests of any sort
- 3) updated the HTML content to say 'this is you'
```javascript
handleClick(event) {
    // const followToggle = this;
    event.preventDefault();
    
    if (this.followState === 'this is you!') {            x
      this.render()
    } else if (this.followState === 'followed') {
      this.followState = 'unfollowing';
      this.render();
      APIUtil.unfollowUser(this.userId).then(() => {
        this.followState = 'unfollowed';
        this.render();
      });
    } else if (this.followState === 'unfollowed') {
       // code ...
    }
  }
  
  render() {
    switch (this.followState) {
      case 'followed':
        this.$el.prop('disabled', false);
        this.$el.html('Unfollow!');
        break;
      case 'unfollowed':
       // code...
      case 'following':
       // code...
      case 'unfollowing':
        // code...
      case 'this is you!':
        this.$el.prop('disabled', true);
        this.$el.addClass('user-self');
        this.$el.html('this is you!');
        break;
    }
  }
```
  
  5. **users.scss:**
```css
  .users {

  flex-direction: column;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px;

    a {
      font-size: 20px;
      color: #1da1f2;
    }

    button {
      margin: 0px;
      cursor: pointer;                            x // wasnt hand pointer b4.
    }

    button.user-self {                            x
      color: inherit;
      background-color: inherit;
      outline: none;
      cursor: default;                              // back to arrow mouse click
    }
  }
}
```

now it looks like:

![Image](https://www.dropbox.com/s/gtgnbbj5jgr426d/ByUn8p9TX_B1bPbTPAm.png?dl=1)

6. still saw that if I navigate to my own profile from the search results, i see a follow button at the top of it that shouldnt be there. in **users/show.html.erb,** i put the render button partial in a conditional to make sure to only render the button if the user is not the current_user:
```css
<h2 class='page-header'><%= @user.username %></h2>

<% if current_user_id != @user.id %>                    x
  <%= render 'follows/form', user: @user %>
<% end %>
```

7. in **follow_toggle.js** i added onto the followState conditional bc now that were not calling followToggle from user_search.js, there is no options hash and it will make the follow_state whatever the initial-follow-state was from the HTML form:
- new part is the right side of the ||
```javascript
handleClick(event) {
    // const followToggle = this;
    event.preventDefault();
    
    if (this.followState === 'this is you!' || current_user === this.userId) {
      this.render()
    } else if (this.followState === 'followed') {
      // code...
      });
    } 
    
    // code...
```
