import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    edit: false
  },
  selectedList: [],

  /**
   * 跳转
   */
  jump() {
    wx.navigateTo({
      url: "/admin/doctor/doctor_detail/doctor_detail?tag=add"
    });
  },

  itemEvent(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/admin/doctor/doctor_detail/doctor_detail?id=" + id
    });
  },

  /**
   * 编辑医生
   */
  editEvent() {
    if (!this.data.noData) {
      let data = {};
      if (this.data.edit && this.selectedList.length > 0) {
        let doctorList = this.data.doctorList;
        this.selectedList.map(value => {
          doctorList[value.i].selected = false;
        });
        data.doctorList = doctorList;
        this.selectedList = [];
      }
      data.edit = !this.data.edit;
      this.setData(data);
    }
  },

  /**
   * 选择医生
   * @param {*} e 
   */
  selectEvent(e) {
    let { i, id } = e.currentTarget.dataset;
    if (this.data.doctorList[i].selected) {
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
      [`doctorList[${i}].selected`]: this.data.doctorList[i].selected ? false : true,
    });
  },

  /**
   * 删除医生
   */
  deleteEvent() {
    let that = this;
    if (that.selectedList.length > 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除选中的医院？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '删除中...',
              mask: true
            });
            let ids = "";
            that.selectedList.map((value, index) => {
              if (index == 0) {
                ids += value.id
              } else {
                ids += ',' + value.id
              }
            });
            RESTful.request({
              url: API.doctor_delete,
              data: {
                ids
              },
              method: 'post'
            }).then(res => {
              wx.hideLoading();
              if (res.data.status == 0) {
                that.selectedList = [];
                that.getDoctorList();
                that.setData({
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
            }).catch(error => {
              console.error(error);
            });
          }
        }
      })
    } else {
      wx.showToast({
        title: '请先选择需要删除的医生',
        icon: 'none'
      });
    }
  },

  /**
   * 获取医生列表
   * @param {*} t 
   */
  getDoctorList(t = 1) {
    let p = 1;
    if (t) {
      this.setData({
        loading: true
      });
    }
    RESTful.request({
      url: API.doctor_list,
      data: {
        departmentId: this.options.id,
        p,
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
          data.doctorList = newArr;
        } else {
          data.noData = true;
        }
        data.p = 1;
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  /**
   * 获取更多医院列表
   */
  getMoreDoctorList() {
    let p = this.data.p + 1;
    this.setData({
      loadMore: true
    });
    RESTful.request({
      url: API.doctor_list,
      data: {
        departmentId: this.options.id,
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
          data.doctorList = this.data.doctorList.concat(newArr);
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
      url: '/admin/search/search?tag=doctor'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDoctorList();
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
    if (app.globalData.doctorInit) {
      app.globalData.doctorInit = false;
      this.getDoctorList();
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
    if (this.data.edit) {
      this.editEvent();
    }
    this.getDoctorList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!(this.data.noData || this.data.noMoreData || this.data.edit)) {
      this.getMoreDoctorList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})