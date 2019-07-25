json.array!(@users) do |user|
  json.(user, *User.column_names)
  if current_user
    json.followed(current_user.follows?(user))
  end
end