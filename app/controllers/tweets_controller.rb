class TweetsController < ApplicationController
  before_action :require_logged_in!

  def create
    @tweet = current_user.tweets.build(tweet_params)
    if @tweet.save
      respond_to do |format|
        format.html { redirect_to request.referrer }
        format.json { render :show }
      end
    else
      flash.now[:errors] = @tweet.errors.full_messages
      respond_to do |format|
        format.html { redirect_to request.referrer }
      end
    end 
      # render json: @tweet.errors.full_messages, status: 422
  end

  def index
    @tweets = Tweet.all.includes(:user, :mentioned_users)
    respond_to do |format|
      format.html { redirect_to request.referrer }
      format.json { render :index }
    end 
  end

  private
  def tweet_params
    params.require(:tweet).permit(:content, mentioned_user_ids: [])
  end
end
