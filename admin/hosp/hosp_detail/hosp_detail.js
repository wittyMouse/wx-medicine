import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // hospital_id
    // hospital_name
    // hospital_logo
    // address
    // longitude
    // latitude
    // contacts
    // introduction
    // create_time
  },
  params: {},

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

  input(e) {
    console.log(e);
    switch (e.currentTarget.dataset.name) {
      case 'hospitalName':
        this.params.hospitalName = e.detail.value;
        break;
      // case 'hospitalLogo': 
      //   this.params.hospitalLogo = e.detail.value;
      // break;
      case 'contacts':
        this.params.contacts = e.detail.value;
        break;
      case 'address':
        this.params.address = e.detail.value;
        break;
      case 'introduction':
        this.params.introduction = e.detail.value;
        break;
      default:
        break;
    }
  },

  showPop() {
    this.setData({
      show_pop: true
    });
  },

  hidePop() {
    this.setData({
      show_pop: false
    });
  },

  stopTouch() {
    return;
  },

  /**
   * 选择图片
   */
  chooseImage() {
    let that = this;
    that.hidePop();
    wx.chooseImage({
      count: 1,
      success(res) {
        that.setData({
          hospitalLogo: res.tempFiles[0].path,
          logoSize: res.tempFiles[0].size
        });
      }
    });
  },

  /**
   * 选择区域
   */
  chooseRegion() {
    wx.navigateTo({
      url: '/pages/region/region?id=1&time=1'
    });
  },

  /**
   * 选择地址
   */
  chooseLocation() {
    let that = this;
    wx.chooseLocation({
      success(res) {
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { tag, id } = options;
    if (options.tag) {
      this.setData({
        tag
      });
    }
    switch (tag) {
      case 'add':

        break;
      default:
        break;
    }
    // if (options.id) {
    //   this.getHospDetail();
    // } else {
    //   wx.showToast({
    //     title: '参数不能为空',
    //   });
    //   wx.navigateBack();
    // }
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
    if (app.globalData.region) {
      this.setData({
        region: app.globalData.region
      });
      app.globalData.region = "";
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