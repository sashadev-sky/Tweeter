const APIUtil = {

  followUser: id => APIUtil.changeFollowStatus(id, 'POST'),

  unfollowUser: id => APIUtil.changeFollowStatus(id, 'DELETE'),

  /** before it was just method on its own no value with it. i think with ES6
   * ur allowed to do property declaraction in a shorter syntax, so instead of doing:
   * 
   * var x = 0, y = 0
   * obj = {x: x, y: y}
   * 
   * you can just do: 
   * 
   * var x = 0, y = 0
   * obj = {x, y}; 
   * 
   * and they will infer what you mean
   * 
   * 
   * note 2: you can interpolate for the url value
   * 
   * note 3: usually something like updating info would be a PUT or PATCH request, which routes
   * to the path, for ex, /photos/:id, while a POST request is for submitting something totally new,
   * and routes to /photos, but here I guess it doesnt matter bc we do a POST request, but we provide the 
   * URL to send the request to so would go directly to the controller for that specific user anyways.
   *   --- we only have a create and delete method in the follows controller anyway.
   *   ---- so POST actually does make sense - we are creating (POST) a new follow or deleting (DELETE) it.
   * 
   * note 4: we dont have a data setting here bc we dont need it in the success callback, we just update the text
   * of the current button that triggered the event
   * 
  */
  changeFollowStatus: (id, method) => (
    $.ajax({
      url: `/users/${id}/follow`,
      dataType: 'json',
      method: `${method}`
    })
  ),
  /**
   * same thing goes for query here, this is equivalent to saying: { query: query }
   */
  searchUsers: query => (
    $.ajax({
      url: '/users/search',
      dataType: 'json',
      method: 'GET',
      data: { query }
    })
  ),

  createTweet: data => (
    $.ajax({
      url: '/tweets',
      method: 'POST',
      dataType: 'json',
      data
    })
  )

  // fetchTweets: data => (
  //   $.ajax({
  //     url: '/feed',
  //     method: 'GET',
  //     dataType: 'json',
  //     data
  //   })
  // )
};

module.exports = APIUtil;