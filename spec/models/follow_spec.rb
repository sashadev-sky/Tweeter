require 'rails_helper'

RSpec.describe Follow, type: :model do
  it 'requires a follower and followee' do
    follow = Follow.create
    expect(follow.errors.messages[:followee]).to eq(["must exist"])
    expect(follow.errors.messages[:follower]).to eq(["must exist"])
  end

  it 'belongs to a follower and followee' do
    user = User.create!({username: 'userfollow', password: '123456'})
    user2 = User.create!({username: 'userfollowed', password: '123456'})
    follow = Follow.create!({followee_id: user.id, follower_id: user2.id})
    expect(follow).to be_valid
  end
end
