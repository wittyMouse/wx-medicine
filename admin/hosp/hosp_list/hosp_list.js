import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    edit: false,
    // showBottomBtn: true
  },
  selectedList: [],
  // scrollTop: 0,

  /**
   * 跳转
   * @param {*} e 
   */
  jump(e) {
    let url = "",
      dataset = e.currentTarget.dataset;
    for (let i in dataset) {
      if (i == 'i') {
        continue;
      }
      if (i == 'url') {
        url = dataset[i] + url;
      } else {
        let temp = "";
        if (url.search(/\?/g) > -1) {
          temp = '&';
        } else {
          temp = '?';
        }
        url += temp + i + '=' + dataset[i];
      }
    }
    wx.navigateTo({
      url
    });
  },

  /**
   * 编辑医院
   */
  editHosp() {
    if (!this.data.noData) {
      let data = {};
      if (this.data.edit && this.selectedList.length > 0) {
        let hospList = this.data.hospList;
        this.selectedList.map(value => {
          hospList[value.i].selected = false;
        });
        data.hospList = hospList;
        this.selectedList = [];
      }
      data.edit = !this.data.edit;
      this.setData(data);
    }
  },

  /**
   * 选择医院
   * @param {*} e 
   */
  selectHosp(e) {
    let { i, id } = e.currentTarget.dataset;
    if (this.data.hospList[i].selected) {
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
      [`hospList[${i}].selected`]: this.data.hospList[i].selected ? false : true,
    });
  },

  /**
   * 删除医院
   */
  deleteHosp() {
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
              url: API.hosp_delete,
              data: {
                ids
              },
              method: 'post'
            }).then(res => {
              wx.hideLoading();
              if (res.data.status == 0) {
                // let hospList = that.data.hospList;
                // that.selectedList.map(value => {
                //   hospList.splice(value.i, 1);
                // });
                // that.selectedList = [];
                // that.setData({
                //   hospList,
                //   edit: false
                // });
                that.selectedList = [];
                that.getHospList();
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
   * 获取医院列表
   * @param {*} t 
   */
  getHospList(t = 1) {
    let p = 1;
    if (t) {
      this.setData({
        loading: true
      });
    }
    RESTful.request({
      url: API.hosp_list,
      data: {
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
          data.hospList = newArr;
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
  getMoreHospList() {
    let p = this.data.p + 1;
    this.setData({
      loadMore: true
    });
    RESTful.request({
      url: API.hosp_list,
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
          data.hospList = this.data.hospList.concat(newArr);
          data.p = p;
        } else {
          data.noMoreData = true;
        }
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHospList();
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
    if (app.globalData.hospInit) {
      app.globalData.hospInit = false;
      this.getHospList();
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
      this.editHosp();
    }
    this.getHospList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!(this.data.noData || this.data.noMoreData || this.data.edit)) {
      this.getMoreHospList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面滑动事件
   */
  // onPageScroll(e) {
  //   if (e.scrollTop > this.scrollTop + 10) {
  //     if (this.data.showBottomBtn) {
  //       this.setData({
  //         showBottomBtn: false
  //       });
  //     }
  //     this.scrollTop = e.scrollTop;
  //   } else if (e.scrollTop < this.scrollTop) {
  //     if (!this.data.showBottomBtn) {
  //       this.setData({
  //         showBottomBtn: true
  //       });
  //     }
  //     this.scrollTop = e.scrollTop;
  //   }
  // }
})