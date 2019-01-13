# Tweeter

## Environment
- Rails - DB/Server
- jQuery - frontend manipulation
- Bundler - Ruby dependencies
- Npm - JavaScript dependencies
- Webpack - module bundler
- Babel - transpiler


### Setup 
- `bundle install` - install gems
- `npm install` - JS dependencies
- `rails db:setup` - creates and loads the schema, then seeds the db
- `npm run webpack` - transpiles the JavaScript
- `rails s` - runs the server
- in the browser, visit `localhost:3000` (default port. If you have a different one, you can find it specified in your terminal after running the server)

### Features

- custom auth pattern
- real time search functionality
- ability to follow and unfollow users
- user mentions in posts
- infinite feed scroll
- partials for dry code 
- Adheres to a RESTful API

- implement JS promises for readability
- jbuilder for building JSON API??