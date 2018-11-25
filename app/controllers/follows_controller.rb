class FollowsController < ApplicationController
  before_action :require_logged_in!

  def create
    # simulate latency
    sleep(1)
    # setting an out_follow onn the current user, u will pass in the current users id 
    # and the user they followed, and so then this will be stored in follows table and you can just
    # access followers or follewees through associations. 
    @follow = current_user.out_follows.create!(followee_id: params[:user_id])

    respond_to do |format|
      format.html { redirect_to request.referrer }
      format.json { render :show }
    end
  end

  def destroy
    # simulate latency
    sleep(1)

    @follow = current_user.out_follows.find_by(followee_id: params[:user_id])
    @follow.destroy!

    respond_to do |format|
      format.html { redirect_to request.referrer }
      format.json { render :show }
    end
  end
end
