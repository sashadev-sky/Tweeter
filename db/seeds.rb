# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Tweet.destroy_all
Mention.destroy_all

USERS = []

10.times do 
  u = Faker::Twitter.screen_name
  if u.length >= 3
    USERS.push(u)
  end
end

USERS << 'test'

USERS.each do |user|
  u = User.create!(username: user, password: "#{user}#{user}")
end

MESSAGES = [
  'All their equipment and instruments are alive.',
  'Almost before we knew it, we had left the ground.',
  'It was going to be a lonely trip back.',
  'A shining crescent far beneath the flying vessel.',
  'My two natures had memory in common.',
  'Mist enveloped the ship three hours out from port.',
  'The face of the moon was in shadow.',
  'Silver mist suffused the deck of the ship.',
  'The recorded voice scratched in the speaker',
  'She stared through the window at the stars.',
  'The spectacle before us was indeed sublime.',
  'The sky was cloudless and of a deep dark blue.',
  'Waves flung themselves at the blue evening.',
  'Then came the night of the first falling star.',
  'A red flare silhouetted the jagged edge of a wing.'
]

User.all.each do |user|
  40.times do
    msg = MESSAGES.sample
    Tweet.create!(user_id: user.id, content: msg, created_at: rand(3000).days.ago)
  end
end

Follow.create!(followee_id: User.first.id, follower_id: User.last.id)
Follow.create!(followee_id: User.last.id, follower_id: User.first.id)
Follow.create!(followee_id: User.last.id, follower_id: User.second.id)
Follow.create!(followee_id: User.first.id, follower_id: User.third.id)
Follow.create!(followee_id: User.third.id, follower_id: User.first.id)
Follow.create!(followee_id: User.first.id, follower_id: User.second.id)
Follow.create!(followee_id: User.fourth.id, follower_id: User.second.id)
Follow.create!(followee_id: User.third.id, follower_id: User.fourth.id)

User.last.tweets.each do |tweet|
  Mention.create!(tweet_id: tweet.id, user_id: User.first.id)
  Mention.create!(tweet_id: tweet.id, user_id: User.second.id)
end

User.first.tweets.each do |tweet|
  Mention.create!(tweet_id: tweet.id, user_id: User.last.id)
  Mention.create!(tweet_id: tweet.id, user_id: User.third.id)
end

User.second.tweets.each do |tweet|
  Mention.create!(tweet_id: tweet.id, user_id: User.first.id)
  Mention.create!(tweet_id: tweet.id, user_id: User.fourth.id)
end

User.third.tweets.each do |tweet|
  Mention.create!(tweet_id: tweet.id, user_id: User.second.id)
  Mention.create!(tweet_id: tweet.id, user_id: User.fourth.id)
end

User.fourth.tweets.each do |tweet|
  Mention.create!(tweet_id: tweet.id, user_id: User.first.id)
  Mention.create!(tweet_id: tweet.id, user_id: User.fifth.id)
end

 