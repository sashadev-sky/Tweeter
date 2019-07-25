# Tweeter

## Environment
- Rails - DB/Server
- jQuery - frontend manipulation
- Bundler - Ruby dependencies
- npm - JavaScript dependencies
- Yarn - package Manager
- Webpack - module bundler
- Babel - transpiler

### Setup 
- `bundle install` - install gems
- `npm install -g yarn` - install Yarn, which is available through npm
- `yarn install` - JS dependencies
    - postinstall script will transpile the JavaScript for you
- `rails db:setup` - creates and loads the schema, then seeds the db
- `rails s` - runs the server
- in the browser, visit `localhost:3000` (default port. If you have a different one, you can find it specified in your terminal after running the server)

### login
- username: test
- password: testtest 

### Features
- Hand rolled user authentication system
- Real-time user search functionality
- Ability to toggle user follows
- User mentions in posts
- Partials for dry code 
- Adheres to a RESTful API
- JSON data feeds built in jBuilder DSL
- Performance optimization via debounced user requests