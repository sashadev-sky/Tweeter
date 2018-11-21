class TweetsController < ApplicationController
  before_action :require_logged_in!

  def create
    # simulate latency
    sleep(1)
    # For an ActiveRecord Association new and build are pretty much the same.
    # i think used to be different but in more recent rails updates they are now the same.
    # either works below
    # but officially, build is just like the new method, but by assocation proxies (not for Models). 
    @tweet = current_user.tweets.build(tweet_params)
    # request.referrer is just the url we were on when we clicked submit
    # new tweet, which is also the url that sends the POST request to the
    # server to add the new tweet. you can also check this by going into the request headers
    # and looking for referer. in this case, its Referer: http://localhost:3000/feed.
    if @tweet.save
      respond_to do |format|
        format.html { redirect_to request.referrer }
        format.json { render :show }
      end
    else
      # Lazy: even respond with JSON to invalid HTML request.
      render json: @tweet.errors.full_messages, status: 422
    end
  end

  private
  def tweet_params
    params.require(:tweet).permit(:content, mentioned_user_ids: [])
  end
end
