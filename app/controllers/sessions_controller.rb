class SessionsController < ApplicationController
  before_action :require_not_logged_in!, only: [:create, :new]
  before_action :require_logged_in!, only: [:destroy]

  def create
    @user = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )
    
    if @user.nil?
      flash.now[:errors] = ['Invalid credentials']
      render :new
    else
      log_in!(@user)
      redirect_to feed_url
    end
  end

  def destroy
    log_out!
    redirect_to new_session_url
  end

  def new
    render :new
  end
end
