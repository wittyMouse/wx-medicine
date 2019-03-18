import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
import { formatTime } from '../../../utils/util';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  params: {},

  /**
   * 啥也不干
   */
  stop() {
    return;
  },

  /**
   * 数据格式化
   * @param {*} data 
   */
  dataFormat(data) {
    let temp = data;
    temp.isAdminDir = temp.isAdmin == 1 ? '是' : '否';
    temp.genderDir = temp.gender ? temp.gender == 1 ? '男' : '女' : '未知';
    if (temp.language = 'en') {
      temp.languageDir = '英文'
    } else if (temp.language = 'zh_CN') {
      temp.languageDir = '简体中文'
    } else if (temp.language = 'zh_TW') {
      temp.languageDir = '繁体中文'
    }

    temp.phoneNumber = temp.phoneNumber ? temp.phoneNumber : '未绑定';
    temp.province = temp.province ? temp.province : '无';
    temp.city = temp.city ? temp.city : '无';

    temp.createTime = formatTime(new Date(temp.createTime));
    return temp;
  },

  /**
   * 获取用户详情
   */
  getUserDetail() {
    this.setData({
      loading: true
    });
    RESTful.show({
      url: API.user,
      data: {
        id: this.options.id
      }
    }).then(res => {
      // console.log(res);
      let data = {
        loading: false
      };
      if (res.data.status == 0) {
        data.userDetail = this.dataFormat(res.data.data);
      } else {
        wx.showToast({
          title: '该用户不存在',
          icon: 'none',
          complete() {
            let id = setTimeout(() => {
              wx.navigateBack();
              clearTimeout(id);
            }, 1000);
          }
        });
      }
      this.setData(data);
    }).catch(error => {
      console.error(error);
    })
  },

  /**
   * 进入更新页面
   * @param {*} e 
   */
  updateEvent(e) {
    let { label, name, value } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/admin/update/update?tag=user&id=${this.options.id}&label=${label}&name=${name}&value=${value}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.getUserDetail();
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.options.id && app.globalData.userUpdate) {
      app.globalData.userUpdate = false;
      this.getUserDetail();
    }
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