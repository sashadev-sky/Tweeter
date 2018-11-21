# rails provides a helper method column_names that returns all of the columns for a model Class
# asteriskitems means that the function accepts variable number of arguments.
json.array!(@users) do |user|
  json.(user, *User.column_names)
  json.followed(current_user.follows?(user))
end