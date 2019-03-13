import { API } from '../../../utils/api';
const RESTful = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    page_size: 10,
    edit: !1
  },
  selectedList: [],

  /**
   * 跳转
   * @param {*} e 
   */
  jump(e) {
    let dataset = e.currentTarget.dataset;
    let url = "";
    for(let i in dataset) {
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
   * 选择医院
   * @param {*} e 
   */
  selectHosp(e) {
    let { i, id } = e.currentTarget.dataset;
    if (this.data.hospList[i].selected) {
      for(let i = 0; i < this.selectedList.length; i++) {
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
   * 编辑医院
   * @param {*} e 
   */
  editHosp(e) {
    let hospList = this.data.hospList;
    if (this.data.edit && this.selectedList.length > 0) {
      this.selectedList.map(value => {
        hospList[value.i].selected = false;
      });
      this.selectedList = [];
    }
    this.setData({
      hospList,
      edit: !this.data.edit
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
                let hospList = that.data.hospList;
                that.selectedList.map(value => {
                  hospList.splice(value.i, 1);
                });
                that.selectedList = [];
                that.setData({
                  hospList,
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
   */
  getHospList() {
    RESTful.request({
      url: API.hosp_list,
      // data: {

      // }
    }).then(res =>{
      console.log(res);
      if (res.data.status == 0) {
        this.setData({
          hospList: res.data.data
        });
      }
    }).catch(error => console.error(error));
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getHospList();        
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