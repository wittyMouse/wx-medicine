import { getLocationAuth, getLocation } from '../../utils/util';
import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
let app = getApp();

Page({
  data: {
    locationAuth: false,
    hospList: 2
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
        url: '/pages/search/search'
      });
    } else if (tag == 'hosp') {
      wx.navigateTo({
        url: '/pages/dept/dept?id=' + e.currentTarget.dataset.id
      });
    }
  },

  getHospList() {
    RESTful.request({
      url: API.hosp_list
    }).then(res => {
      console.log(res);
      this.setData({
        hospList: res.data.data
      });
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
    }
  }
})