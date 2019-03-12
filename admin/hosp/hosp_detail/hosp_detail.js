import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

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
      if (res.data.status == 0) {
        this.setData({
          hospDetail: res.data.data
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
                title: res.data.msg
              });
            }
          }).catch(error => {
            console.error(error);
          });
        }
      }
    })
  },

  /**
   * 更新医院图标
   */
  updateHospitalLogo() {
    wx.showLoading({
      title: '更新图标中...',
      mask: true
    });
    this.upload(() => {
      RESTful.request({
        url: API.hosp + '/' + this.options.id,
        data: this.params,
        method: 'put'
      }).then(res => {
        console.log(res)
        this.setData({
          'hospDetail.hospital_logo': this.params.hospitalLogo
        });
        wx.hideLoading();
      }).catch(error => console.error(error));
    })
  },

  /**
   * 更新医院信息
   * @param {*} e 
   */
  updateHosp(e) {
    let { tag, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/admin/update/update?id=${this.options.id}&tag=${tag}&name=${name}`
    });
  },

  /**
   * 输入事件
   * @param {*} e 
   */
  input(e) {
    switch (e.currentTarget.dataset.name) {
      case 'hospitalName':
        this.params.hospitalName = e.detail.value;
        break;
      case 'contacts':
        this.params.contacts = e.detail.value;
        break;
      case 'address':
        this.params.address = e.detail.value;
        this.params.latitude = "";
        this.params.longitude = "";
        break;
      case 'introduction':
        this.params.introduction = e.detail.value;
        break;
      default:
        break;
    }
  },

  /**
   * 输入框失去焦点事件
   * @param {*} e 
   */
  blur(e) {
    this.setData({
      address: e.detail.value
    });
  },

  /**
   * 显示弹窗
   */
  showPop() {
    this.setData({
      show_pop: true
    });
  },

  /**
   * 关闭弹窗
   */
  hidePop() {
    this.setData({
      show_pop: false
    });
  },

  /**
   * 阻止掩膜滑动
   */
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
        that.params.hospitalLogo = res.tempFiles[0].path;
        that.setData({
          hospitalLogo: res.tempFiles[0].path,
          logoSize: res.tempFiles[0].size
        });
        if (that.options.id) {
          that.updateHospitalLogo();
        }
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
        if (res.address || res.name) {
          that.params.address = res.address + ' ' + res.name;
          that.params.latitude = res.latitude;
          that.params.longitude = res.longitude;
          that.setData({
            address: res.address + ' ' + res.name
          });
        }
      }
    });
  },

  /**
   * 添加医院
   */
  addHosp() {
    if (!this.params.hospitalLogo) {
      wx.showToast({
        title: '医院图标不能为空',
        icon: 'none'
      });
      return;
    }
    if (!this.params.hospitalName) {
      wx.showToast({
        title: '医院名称不能为空',
        icon: 'none'
      });
      return;
    }
    if (!this.params.contacts) {
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none'
      });
      return;
    }
    // if (!this.params.region) {
    //   wx.showToast({
    //     title: '地区信息不能为空',
    //     icon: 'none'
    //   });
    //   return;
    // }
    if (!this.params.address) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none'
      });
      return;
    }
    if (!this.params.introduction) {
      wx.showToast({
        title: '医院简介不能为空',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      titla: '添加中...',
      mask: true
    });
    this.upload(() => {
      RESTful.request({
        url: API.hosp,
        data: this.params,
        method: 'post'
      }).then(res => {
        wx.hideLoading();
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
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
      }).catch(error => console.error(error));
    });
  },

  /**
   * 上传文件
   * @param {*} cb 
   */
  upload(cb) {
    RESTful.uploadFile({
      url: API.upload,
      filePath: this.data.hospitalLogo,
      formData: { fileSize: this.data.logoSize }
    }).then(res => {
      if (res.data.status == 1) {
        this.params.hospitalLogo = res.data.data.url;
        cb && cb();
      } else {
        wx.showToast({
          title: '医院图标上传失败',
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
      this.getHospDetail();
    } else {
      wx.setNavigationBarTitle({
        title: '添加医院'
      });
      this.setData({
        tag: true
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
    if (app.globalData.region) {
      this.params.region = app.globalData.region;
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