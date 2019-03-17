import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true
  },
  selectedList: [],

  /**
   * 跳转
   * @param {*} e 
   */
  jump(e) {
    let url = "",
      dataset = e.currentTarget.dataset;
    for (let key in dataset) {
      if (key == 'i') {
        continue;
      }
      if (key == 'url') {
        url = dataset[key] + url;
      } else {
        let temp = "";
        if (url.search(/\?/g) > -1) {
          temp = '&';
        } else {
          temp = '?';
        }
        url += temp + key + '=' + dataset[key];
      }
    }
    wx.navigateTo({
      url
    });
  },

  /**
   * 获取用户列表
   * @param {*} t 
   */
  getUserList(t = 1) {
    if (t) {
      this.setData({
        loading: true
      });
    }
    RESTful.request({
      url: API.user_list,
      data: {
        p: 1,
        page_size: 10
      }
    }).then(res => {
      // console.log(res);
      let data = {};
      if (t) {
        data.loading = false;
      } else {
        wx.stopPullDownRefresh();
      }
      if (res.data.status == 0) {
        let newArr = res.data.data;
        if (newArr.length > 0) {
          if (this.data.noData) {
            data.noData = false;
          }
          if (this.data.noMoreData) {
            data.noMoreData = false;
          }
          data.userList = newArr;
        } else {
          data.noData = true;
        }
        data.p = 1;
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  /**
   * 获取更多用户列表
   */
  getMoreUserList() {
    let p = this.data.p + 1;
    this.setData({
      loadMore: true
    });
    RESTful.request({
      url: API.user_list,
      data: {
        p,
        page_size: 10
      }
    }).then(res => {
      // console.log(res);
      let data = {
        loadMore: false
      };
      if (res.data.status == 0) {
        let newArr = res.data.data;
        if (newArr.length > 0) {
          data.userList = this.data.userList.concat(newArr);
          data.p = p;
        } else {
          data.noMoreData = true;
        }
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  /**
   * 点击搜索框
   */
  enterSearch() {
    wx.navigateTo({
      url: '/admin/search/search?tag=user'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList();
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
    this.getUserList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!(this.data.noData || this.data.noMoreData)) {
      this.getMoreUserList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})