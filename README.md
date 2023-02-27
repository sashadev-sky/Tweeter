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

1. `bundle install` - install gems
2. `npm install -g yarn` - install Yarn, which is available through npm
3. `yarn install` - JS dependencies
4. `yarn webpack` - transpile JavaScript
5. `rails db:setup` - creates and loads the schema, then seeds the db
6. `rails s` - runs the server
7. In the browser, visit `localhost:3000` (default port. If you have a different one, you can find it specified in your terminal after running the server)

### Development

#### Login

- username: test
- password: testtest

#### Testing

- `rspec` - runs the test suite

### Features

- Hand rolled user authentication system
- Real-time user search functionality
- Ability to toggle user follows
- User mentions in posts
- Partials for dry code
- Adheres to a RESTful API
- JSON data feeds built in jBuilder DSL
- Performance optimization via debounced user requests
