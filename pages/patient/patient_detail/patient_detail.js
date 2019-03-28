import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
const app = getApp();

Page({
  data: {

  },
  params: {},

  /**
   * 输入事件
   * @param {*} e 
   */
  input(e) {
    // console.log(e);
    let { label } = e.currentTarget.dataset;
    this.params[label] = e.detail.value;
    if (label == 'address') {
      if (this.options.tag) {
        this.setData({
          address: e.detail.value
        });
      } else {
        this.setData({
          'patientDetail[address]': e.detail.value
        });
      }
    }
  },

  /**
   * 开关切换事件
   * @param {*} e 
   */
  change(e) {
    // console.log(e);
    let { tag, label } = e.currentTarget.dataset;
    switch (tag) {
      case 'radio':
        this.params[label] = parseInt(e.detail.value);
        break;
      case 'switch':
        this.params[label] = e.detail.value ? 1 : 0;
        break;
      default:
        break;
    }
  },

  /**
   * 选择地址
   */
  chooseLocation(e) {
    let that = this;
    let { label } = e.currentTarget.dataset;
    wx.chooseLocation({
      success(res) {
        console.log(res);
        if (res.address || res.name) {
          that.params[label] = res.address + ' ' + res.name;
          if (that.options.tag) {
            that.setData({
              address: res.address + ' ' + res.name
            });
          } else {
            that.setData({
              'patientDetail[address]': res.address + ' ' + res.name
            });
          }
        }
      }
    });
  },

  /**
   * 按钮事件
   */
  buttonEvent() {
    if (this.data.tag) {
      console.log(this.params);
      if (!this.params.patientName) {
        wx.showToast({
          title: "姓名不能为空",
          icon: 'none'
        });
        return;
      }
      if (!this.params.gender) {
        wx.showToast({
          title: "性别不能为空",
          icon: 'none'
        });
        return;
      }
      if (!this.params.idCard) {
        wx.showToast({
          title: "证件号不能为空",
          icon: 'none'
        });
        return;
      }
      if (!this.params.phoneNumber) {
        wx.showToast({
          title: "手机号不能为空",
          icon: 'none'
        });
        return;
      }
      if (!this.params.address) {
        wx.showToast({
          title: "地址不能为空",
          icon: 'none'
        });
        return;
      }
      this.createPatient();
    } else {
      if (Object.keys(this.params).length > 0) {
        this.updatePatient();
      } else {
        wx.showToast({
          title: "请先更新信息",
          icon: 'none'
        });
      }
    }
  },

  /**
   * 获取就诊人数据
   */
  getPatientDetail() {
    this.setData({
      loading: true
    });
    RESTful.show({
      url: API.patient,
      data: {
        id: this.options.id
      }
    }).then(res => {
      // console.log(res);
      let data = {
        loading: false
      }
      if (res.data.status == 0) {
        data.patientDetail = res.data.data;
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true,
          success() {
            let id = setTimeout(() => {
              wx.hideToast();
              wx.navigateBack();
              clearTimeout(id);
            }, 1000);
          }
        });
      }
      this.setData(data);
    }).catch(error => console.error(error));
  },

  /**
   * 创建就诊人
   */
  createPatient() {
    wx.showLoading({
      title: '创建中...',
      mask: true
    });
    RESTful.request({
      url: API.patient,
      data: {
        token: app.globalData.token,
        ...this.params
      },
      method: "POST"
    }).then(res => {
      // console.log(res);
      wx.hideLoading();
      if (res.data.status == 0) {
        app.globalData.patientInit = true;
        wx.showToast({
          title: res.data.msg,
          mask: true,
          success() {
            let id = setTimeout(() => {
              wx.hideToast();
              wx.navigateBack();
              clearTimeout(id);
            }, 1000);
          }
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        });
      }
    }).catch(error => console.error(error));
  },

  /**
   * 更新就诊人信息
   */
  updatePatient() {
    wx.showLoading({
      title: '更新中...',
      mask: true
    });
    RESTful.update({
      url: API.patient,
      data: {
        id: this.options.id,
        ...this.params
      }
    }).then(res => {
      // console.log(res);
      wx.hideLoading();
      if (res.data.status == 0) {
        app.globalData.patientInit = true;
        wx.showToast({
          title: res.data.msg,
          mask: true,
          success() {
            let id = setTimeout(() => {
              wx.hideToast();
              wx.navigateBack();
              clearTimeout(id);
            }, 1000);
          }
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        });
      }
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    if (options.tag) {
      this.setData({
        tag: options.tag
      });
    } else {
      this.getPatientDetail();
    }
  }

})