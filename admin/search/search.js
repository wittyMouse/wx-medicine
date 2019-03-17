import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {

  },

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
   * 点击搜索事件
   * @param {*} e 
   */
  searchEvent(e) {
    // console.log(e);
    let { tag } = e.detail;
    if (tag == 'search') {
      this.keyword = e.detail.keyword;
      if (!this.keyword) {
        wx.showToast({
          title: '请输入要搜索的内容',
          icon: 'none'
        });
        return;
      }
      if (this.data.noData) {
        this.setData({
          noData: false
        });
      }
      this.search();
    } else {
      wx.navigateBack();
    }
  },

  /**
   * 搜索列表
   */
  search() {
    let url = ''
    switch (this.options.tag) {
      case 'hosp':
        url = API.hosp_list
        break;
      case 'user':
        url = API.user_list
        break;
      default:
        break;
    }
    wx.showLoading({
      title: '搜索中...',
      mask: true
    });
    RESTful.request({
      url,
      data: {
        keyword: this.keyword
      }
    }).then(res => {
      // console.log(res);
      wx.hideLoading();
      if (res.data.status == 0) {
        let data = {},
          newArr = res.data.data;
        if (newArr.length > 0) {
          data.dataList = newArr;
        } else {
          data.noData = true;
        }
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    let listType = '';
    switch (options.tag) {
      case 'hosp':
        listType = 'hosp-list';
        break;
      case 'user':
        listType = 'user-list';
        break;
      default:
        break;
    }
    this.setData({
      listType
    });
  }
})