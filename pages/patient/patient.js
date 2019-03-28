import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {
    loading: true,
    edit: false,
    navUrl: ''
  },
  selectedList: [],

  /**
   * 项目点击事件
   * @param {*} e 
   */
  itemEvent(e) {
    let { id } = e.currentTarget.dataset;
    if (this.options.tag == 'select') {
      app.globalData.patientId = id;
      wx.navigateBack();
    } else {
      wx.navigateTo({
        url: "/pages/patient/patient_detail/patient_detail?id=" + id
      });
    }
  },

  /**
   * 跳转
   */
  jump(e) {
    wx.navigateTo({
      url: "/pages/patient/patient_detail/patient_detail?tag=add"
    });
  },

  /**
   * 编辑事件
   */
  editEvent() {
    if (!this.data.noData) {
      let data = {};
      if (this.data.edit && this.selectedList.length > 0) {
        let patientList = this.data.patientList;
        this.selectedList.forEach(item => {
          patientList[item.i].selected = false;
        });
        data.patientList = patientList;
        this.selectedList = [];
      }
      data.edit = !this.data.edit;
      this.setData(data);
    }
  },

  /**
   * 选择事件
   * @param {*} e 
   */
  selectEvent(e) {
    let { id, i } = e.currentTarget.dataset;
    if (this.data.patientList[i].selected) {
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].id == id) {
          this.selectedList.splice(i, 1);
          break;
        }
      }
    } else {
      this.selectedList.push({ id, i });
    }
    this.setData({
      [`patientList[${i}].selected`]: this.data.patientList[i].selected ? false : true,
    });
  },

  /**
   * 删除事件
   */
  deleteEvent() {
    let that = this;
    if (this.selectedList.length > 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除选中的项目？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '删除中...',
              mask: true
            });
            let ids = "";
            that.selectedList.forEach((item, index) => {
              if (index == 0) {
                ids += item.id
              } else {
                ids += ',' + item.id
              }
            });
            that.deletePatient(ids);
          }
        }
      });
    } else {
      wx.showToast({ title: '请先选择需要删除的项目', icon: 'none' });
    }
  },

  /**
   * 删除就诊人
   */
  deletePatient(ids) {
    RESTful.request({
      url: API.patient_delete,
      data: {
        ids
      },
      method: 'post'
    }).then(res => {
      wx.hideLoading();
      if (res.data.status == 0) {
        this.selectedList = [];
        this.getPatientList();
        this.setData({
          edit: false
        });
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
   * 获取就诊人列表
   */
  getPatientList() {
    RESTful.request({
      url: API.patient_list,
      date: {
        token: app.globalData.token,
      }
    }).then(res => {
      // console.log(res);
      let newArr = res.data.data,
        data = {
          loading: false
        };
      if (newArr.length > 0) {
        data.patientList = newArr;
      } else {
        data.noData = true;
      }
      this.setData(data);
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    this.setData(options);
    this.getPatientList();
  },

  onShow() {
    if (app.globalData.patientInit) {
      app.globalData.patientInit = false;
      this.getPatientList();
    }
  }
})