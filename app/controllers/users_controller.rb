class UsersController < ApplicationController
  before_action :require_not_logged_in!, only: [:create, :new]
  before_action :require_logged_in!, only: [:show]

  def create
    # sign up the user
    @user = User.new(user_params)
    if @user.save
      # redirect them to the new user's show page
      log_in!(@user)
      redirect_to feed_url
    else
      # input didn't pass validation; re-render sign up form.
      render :new
    end
  end

  def new
    # present form for signup
    @user = User.new # dummy user object
    render :new
  end

  def show
    if current_user.nil?
      # let them log in
      redirect_to new_session_url
      return
    end

    @user = User.includes(tweets: :mentioned_users).find(params[:id])
    render :show
  end

  # apparently using a ~ in an AR is for matching regular expressions. it allows us to match anywhere in the string.
  #.present? will load all records returned, while
  # .exists? would just check if there's at least 1 record found, without loading them all
  # theres a big performance issue (.present way slower) but it makes sense to use it in this case

  # Model.none returns an activeRecord relation object that is empty:
#   >> Model.none 
# => #<ActiveRecord::Relation []>
# Returns a chainable relation with zero records, specifically an instance of the ActiveRecord::NullRelation class.
# Used in cases where a method or scope could return zero records but the result needs to be chainable.
  def search
    if params[:query].present?
      @users = User.where('username ~ ?', params[:query])
    else
      @users = []
    end

    respond_to do |format|
      format.html { render :search }
      format.json { render :search }
    end
    
  end

  protected
  def user_params
    self.params.require(:user).permit(:username, :password)
  end
end
