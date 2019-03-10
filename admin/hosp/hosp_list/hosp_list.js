Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospList: [
      {
        hospital_id: '1',
        hospital_logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551808268613&di=aa76870869f2cc55362593828e381488&imgtype=0&src=http%3A%2F%2Fimage.39.net%2FUpload%2FApply%2FOriginal%2F2015%2F11%2F03%2F635821649955797804.JPG',
        hospital_name: '南方医院'
      }
    ]
  },

  jump(e) {
    wx.navigateTo({
      url: '/admin/hosp/hosp_detail/hosp_detail?tag=' + e.currentTarget.dataset.tag
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})