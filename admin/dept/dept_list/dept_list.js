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
      url: "/admin/dept/dept_detail/dept_detail?tag=add"
    });
  },

  itemEvent(e) {
    let { id, tag } = e.currentTarget.dataset;
    if (!tag && this.data.tag) {
      return;
    }
    let url = "";
    switch(this.data.tag) {
      case 'doctor':
        url = "/admin/doctor/doctor_list/doctor_list?id=" + id;
        break;
      case 'roster':
        url = "/admin/roster/roster_list/roster_list?id=" + id;
        break;
      default:
        url = "/admin/dept/dept_detail/dept_detail?id=" + id;
        break;
    }
    wx.navigateTo({
      url
    });
  },

  /**
   * 编辑科室
   */
  editEvent() {
    if (!this.data.noData) {
      let data = {};
      if (this.data.edit && this.selectedList.length > 0) {
        let deptList = this.data.deptList;
        this.selectedList.map(value => {
          deptList[value.i].selected = false;
        });
        data.deptList = deptList;
        this.selectedList = [];
      }
      data.edit = !this.data.edit;
      this.setData(data);
    }
  },

  /**
   * 选择科室
   * @param {*} e 
   */
  selectEvent(e) {
    let { i, id } = e.currentTarget.dataset;
    if (this.data.deptList[i].selected) {
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
      [`deptList[${i}].selected`]: this.data.deptList[i].selected ? false : true,
    });
  },

  /**
   * 删除科室
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
              url: API.dept_delete,
              data: {
                ids
              },
              method: 'post'
            }).then(res => {
              wx.hideLoading();
              if (res.data.status == 0) {
                that.selectedList = [];
                that.getDeptList();
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
        title: '请先选择需要删除的医院',
        icon: 'none'
      });
    }
  },

  /**
   * 获取科室列表
   * @param {*} t 
   */
  getDeptList(t = 1) {
    let p = 1;
    if (t) {
      this.setData({
        loading: true
      });
    }
    RESTful.request({
      url: API.dept_list,
      data: {
        hospitalId: this.options.id,
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
          data.deptList = newArr;
        } else {
          data.noData = true;
        }
        data.p = 1;
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  /**
   * 获取更多科室列表
   */
  getMoreDeptList() {
    let p = this.data.p + 1;
    this.setData({
      loadMore: true
    });
    RESTful.request({
      url: API.dept_list,
      data: {
        hospitalId: this.options.id,
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
          data.deptList = this.data.deptList.concat(newArr);
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
      url: '/admin/search/search?tag=dept'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tag) {
      this.setData({
        tag: options.tag
      });
    }
    this.getDeptList();
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
    if (app.globalData.deptInit) {
      app.globalData.deptInit = false;
      this.getDeptList();
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
    this.getDeptList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!(this.data.noData || this.data.noMoreData || this.data.edit)) {
      this.getMoreDeptList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})