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
      console.log(res);
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
      console.log(res);
      let data = {
        loading: false
      };
      if (res.data.status == 0) {
        data.patientDetail = res.data.data;
      }
      this.setData({
        patientDetail: res.data.data
      });
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
    if(!this.data.patientDetail) {
      wx.showToast({ title: '请选择就诊人', icon: 'none' });
      return;
    }
  },

  onLoad(options) {
    this.setData({
      dateTime: options.dateTime
    });
    this.getDoctorDetail();
  },

  onShow() {
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