import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 更新事件
   */
  updateEvent(e) {
    this.setData({
      checked: e.detail.value
    });
    this.updateRegisterDetail();
  },

  /**
   * 获取挂号记录详情
   */
  getRegisterDetail() {
    RESTful.show({
      url: API.register_detail,
      data: {
        id: this.options.id
      }
    }).then(res => {
      console.log(res);
      if (res.data.status == 0) {
        this.setData({
          registerDetail: res.data.data,
          checked: res.data.data.type == 1 ? false : true
        });
      }
    }).catch(error => console.error(error));
  },

  /**
   * 更新挂号记录详情
   */
  updateRegisterDetail() {
    RESTful.update({
      url: API.register,
      data: {
        id: this.options.id,
        type: this.data.checked ? 2 : 1
      }
    }).then(res => {
      // console.log(res);
      if (res.data.status == 0) {
        app.globalData.updateRegister = true;
        wx.showToast({
          title: res.data.msg
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    }).catch(error => console.error(error));
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.getRegisterDetail();
    } else {
      wx.showToast({
        title: '参数不能为空',
        icon: 'none',
        complete() {
          let id = setTimeout(() => {
            wx.navigateBack();
            clearTimeout(id);
          }, 1000);
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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