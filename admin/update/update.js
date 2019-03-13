import { API } from '../../utils/api';
const RESTful = require('../../utils/request');

Page({
  data: {

  },
  params: {},

  /**
   * 输入事件
   * @param {*} e 
   */
  input(e) {
    if (this.options.name == 'address') {
      this.params.latitude = "";
      this.params.longitude = "";
    }
    this.params[this.options.name] = e.detail.value;
  },

  /**
   * 确认事件
   */
  confirm() {
    if (!this.params[this.options.name] || this.params[this.options.name] == '') {
      wx.showToast({
        title: '新的' + this.options.label + '不能为空',
        icon: 'none'
      });
      return;
    }
    let url = "";
    switch (this.options.tag) {
      case 'hosp':
        url = API.hosp
        break;
      default:
        break;
    }
    wx.showLoading({
      title: '更新中...',
      mask: true
    });
    RESTful.update({
      url,
      data: this.params
    }).then(res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status == 0) {
        wx.showToast({
          title: res.data.msg,
          complete() {
            let id = setTimeout(() => {
              wx.navigateBack();
              clearTimeout(id);
            }, 1500);
          }
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        });
      }
    })
  },

  /**
   * 失去焦点事件
   * @param {*} e 
   */
  blur(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  /**
   * 选择地址
   */
  chooseLocation() {
    let that = this;
    wx.chooseLocation({
      success(res) {
        if (res.address || res.name) {
          that.params.address = res.address + ' ' + res.name;
          that.params.latitude = res.latitude;
          that.params.longitude = res.longitude;
          that.setData({
            keyword: res.address + ' ' + res.name
          });
        }
      }
    });
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '更新' + options.label
    });
    this.params.id = options.id;
    this.setData(options);
  }
})