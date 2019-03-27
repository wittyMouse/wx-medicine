import { getLocationAuth, getLocation } from '../../utils/util';
import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
let app = getApp();

Page({
  data: {
    locationAuth: false
  },
  jump(e) {
    let { tag } = e.currentTarget.dataset;
    if (tag == 'location') {
      let that = this;
      if (this.data.locationAuth) {
        wx.navigateTo({
          url: '/pages/location/location'
        });
      } else {
        wx.openSetting({
          success(res) {
            if (res.authSetting["scope.userLocation"]) {
              getLocation(that, app);
              that.setData({
                locationAuth: true
              });
              wx.navigateTo({
                url: '/pages/location/location'
              });
            }
          }
        });
      }
    } else if (tag == 'search') {
      wx.navigateTo({
        url: '/pages/search/search?tag=hosp&city=' + this.data.city
      });
    } else if (tag == 'hosp') {
      wx.navigateTo({
        url: '/pages/dept/dept?id=' + e.currentTarget.dataset.id
      });
    }
  },

  /**
   * 获取医院列表
   */
  getHospList() {
    let p = 1;
    RESTful.request({
      url: API.hosp_list,
      data: {
        address: this.data.city,
        p,
        page_size: 5
      }
    }).then(res => {
      // console.log(res);
      let newArr = res.data.data,
        data = {};
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
      data.p = p;
      this.setData(data);
    }).catch(error => console.error(error));
  },

  /**
   * 获取更多医院列表
   */
  getMoreHospList() {
    let p = this.data.p + 1;
    RESTful.request({
      url: API.hosp_list,
      data: {
        address: this.data.city,
        p,
        page_size: 5
      }
    }).then(res => {
      // console.log(res);
      let newArr = res.data.data,
        data = {};
      if (newArr.length > 0) {
        data.hospList = this.data.hospList.concat(newArr);
      } else {
        data.noMoreData = true;
      }
      data.p = p;
      this.setData(data);
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    let city = '加载中...';
    if (app.globalData.location.localCity) {
      city = app.globalData.location.localCity;
    }
    this.setData({
      city
    });
    getLocationAuth(this, app);
    this.getHospList();
  },

  onShow() {
    if (app.globalData.location.selectedCity) {
      this.setData({
        city: app.globalData.location.selectedCity
      });
      this.getHospList();
    }
  },

  onReachBottom: function () {
    if (!(this.data.noData || this.data.noMoreData)) {
      this.getMoreHospList();
    }
  }
})