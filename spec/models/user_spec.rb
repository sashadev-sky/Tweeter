require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#create' do
    it 'should not create a user with a password less than 6 characters long' do
      user = User.create({username: 'sashadev', password: '12345'})
      expect(user.errors.messages[:password]).to eq(["is too short (minimum is 6 characters)"])
    end

    it 'should not create a user with a non-unique username' do
      user = User.create!({username: 'sashadev', password: '123456'})
      expect(user).to be_valid

      user2 = User.create({username: 'sashadev', password: '654321'})
      expect(user2.errors.messages[:username]).to eq(["has already been taken"])
    end
  end

  describe 'password encryption' do
    it 'does not save passwords to the database' do
      User.create!({username: 'sashadev', password: '123456'})
      user = User.find_by_username('sashadev')
      expect(user.password).not_to be('123456')
    end
  end
end