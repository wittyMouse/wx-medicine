import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {
    loading: true
  },

  /**
   * 跳转
   * @param {*} e 
   */
  jump(e) {
    wx.navigateTo({
      url: '/pages/patient/patient?tag=select'
    });
  },

  // 获取医生详情
  getDoctorDetail() {
    RESTful.request({
      url: API.doctor_detail,
      data: {
        id: this.options.id
      }
    }).then(res => {
      // console.log(res);
      if (res.data.status == 0) {
        this.setData({
          doctorDetail: res.data.data
        });
      }
    }).catch(error => console.error(error));
  },

  /**
   * 获取就诊人信息
   */
  getPatientDetail() {
    RESTful.show({
      url: API.patient,
      data: {
        id: this.data.patientId
      }
    }).then(res => {
      // console.log(res);
      let data = {
        loading: false
      };
      if (res.data.status == 0) {
        data.patientDetail = res.data.data;
      }
      this.setData(data);
    }).catch(error => console.error(error));
  },

  /**
   * 获取默认就诊人
   */
  getDefaultPatientDetail() {
    RESTful.request({
      url: API.patient_list,
      data: {
        token: app.globalData.token,
        isDefault: 1
      }
    }).then(res => {
      // console.log(res);
      let newArr = res.data.data,
        data = {
          loading: false
        };
      if (newArr.length > 0) {
        data.patientDetail = newArr[0];
      }
      this.setData(data);
    }).catch(error => console.error(error));
  },

  /**
   * 查询余额
   */
  checkBalance() {
    RESTful.request({
      url: API.check_balance,
      data: {
        token: app.globalData.token
      },
      method: "POST"
    }).then(res => {
      // console.log(res);
      if (res.data.status == 0) {
        this.setData({
          balance: res.data.data.balance
        });
      }
    }).catch(error => console.error(error));
  },

  /**
   * 切换就诊人
   */
  deletePatient() {
    this.setData({
      patientDetail: ""
    });
  },

  /**
   * 确认订单
   */
  confirm() {
    if (!this.data.patientDetail) {
      wx.showToast({ title: '请选择就诊人', icon: 'none' });
      return;
    }
    if (this.data.balance < this.data.doctorDetail.fee) {
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        success() {
          let id = setTimeout(() => {
            wx.navigateTo("/pages/wallet/wallet");
            clearTimeout(id);
          }, 1000);
        }
      });
    } else {
      let valueStr = this.data.doctorDetail.fee + '',
        idx = valueStr.indexOf('.');
      if (idx > -1) {
        if (idx == valueStr.length - 1) {
          valueStr += '00';
        } else if (idx == valueStr.length - 2) {
          valueStr += '0';
        }
      } else {
        valueStr += '.00';
      }
      let that = this;
      wx.showLoading({
        title: '正在加载',
        mask: true
      });
      let id = setTimeout(() => {
        wx.hideLoading();
        that.setData({
          showPop: true,
          focus: true,
          valueStr
        });
        clearTimeout(id);
      }, 200);
    }
  },

  input(e) {
    this.setData({
      password: e.detail.value,
      length: e.detail.value.toString().length
    });
    if (e.detail.value.length == 6) {
      this.putRequest();
    }
  },

  close() {
    this.setData({
      password: '',
      length: 0,
      showPop: false
    });
  },

  itemTap() {
    this.setData({
      focus: true
    });
  },

  blur() {
    this.setData({
      focus: false
    });
  },

  /**
   * 创建挂号记录
   */
  createRegister() {
    RESTful.request({
      url: API.register,
      data: {
        patient_id: this.data.patientDetail.patientId,
        doctor_id: this.data.doctorDetail.doctorId,
        visit_time: this.options.dateTime,
        fee: this.data.doctorDetail.fee,
      },
      method: 'POST'
    }).then(res => {
      console.log(res);
      if (res.data.status == 0) {
        wx.showToast({
          title: '挂号成功'
        });
        let id = setTimeout(() => {
          wx.redirectTo({
            url: '/pages/note/note'
          });
          clearTimeout(id);
        }, 1000);
      } else {
        wx.showToast({
          title: '挂号失败',
          icon: 'none'
        });
      }
    }).catch(error => console.error(error));
  },

  putRequest() {
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    RESTful.request({
      url: API.update_userinfo,
      data: {
        key: 'balance',
        value: this.data.doctorDetail.fee,
        token: app.globalData.token
      },
      method: "POST"
    }).then(res => {
      wx.hideLoading();
      if (res.data.status == 0) {
        this.createRegister();
      } else {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
      }
      this.close();
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    this.setData(options);
    this.getDoctorDetail();
    this.getDefaultPatientDetail();
  },

  onShow() {
    this.checkBalance();
    if (app.globalData.patientId) {
      this.setData({
        loading: true,
        patientId: app.globalData.patientId
      }, () => {
        app.globalData.patientId = "";
      });
      this.getPatientDetail();
    }
  }
})