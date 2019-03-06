import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 获取医院详情
   */
  getHospDetail() {
    RESTful.show({
      url: API.hosp,
      data: {
        id: this.options.id
      }
    }).then(res => {
      if (typeof res.data == 'object') {
        this.setData({
          hospDetail: res.data
        });
      } else {
        wx.showToast({
          title: '该医院不存在',
          icon: 'none',
          complete() {
            let id = setTimeout(() => {
              wx.navigateBack();
              clearTimeout(id);
            }, 1500);
          }
        });
      }
    }).catch(error => {
      console.error(error);
    })
  },

  /**
   * 删除医院
   */
  deleteHosp() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该医院？',
      success(res) {
        if (res.confirm) {
          RESTful.destroy({
            url: API.hosp,
            data: {
              id: that.options.id
            }
          }).then(res => {
            wx.showToast({
              title: res.data.msg,
              complete() {
                let id = setTimeout(() => {
                  wx.navigateBack();
                  clearTimeout(id);
                }, 1500);
              }
            });
          }).catch(error => {
            console.error(error);
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.getHospDetail();
    } else {
      wx.showToast({
        title: '参数不能为空',
      });
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})