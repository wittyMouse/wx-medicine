import { API } from '../../utils/api';
import { formatTime, rpxToPx } from '../../utils/util';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {
    loading: false,
    tabList: [
      { name: '全部' },
      // { name: '待支付' },
      { name: '待就诊' },
      { name: '已就诊' },
      // { name: '售后' }
    ],
    scrollHeight: app.globalData.sys.windowHeight - rpxToPx(100),
    type: 0
  },

  /**
   * tab点击事件
   * @param {*} e 
   */
  tabChange(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({
      type: e.detail,
      p: 1
    });
    this.getRegisterList(() => {
      wx.hideLoading();
    });
  },

  /**
   * 
   * @param {*} e 
   */
  // itemTap(e) {
  //   wx.navigatorTo({
  //     url: "/pages/note/note_detail/note_detail"
  //   });
  // },

  /**
   * 获取挂号记录
   */
  getRegisterList(cb) {
    RESTful.request({
      url: API.register_record,
      data: {
        token: app.globalData.token,
        type: this.data.type,
        p: 1,
        page_size: 10
      },
      method: "POST"
    }).then(res => {
      // console.log(res);
      cb && cb();
      let newArr = res.data.data,
        data = {
          p: 1,
          loading: false
        };
      if (res.data.status == 0) {
        if (newArr.length > 0) {
          if (this.data.noData) {
            data.noData = false;
          }
          if (this.data.noMoreData) {
            data.noMoreData = false;
          }
          newArr.forEach(item => {
            item.visitTime = formatTime(new Date(item.visitTime));
          });
        } else {
          data.noData = true;
        }
        data.registerList = newArr;
        this.setData(data);
      }
    }).catch(error => console.error(error));
  },

  /**
   * 获取更多挂号记录
   */
  getMoreRegisterList() {
    let p = this.data.p + 1;
    this.setData({
      loadMore: true
    });
    RESTful.request({
      url: API.register_record,
      data: {
        token: app.globalData.token,
        type: this.data.type,
        p,
        page_size: 10
      },
      method: "POST"
    }).then(res => {
      console.log(res);
      let newArr = res.data.data,
        data = {
          loadMore: false
        };
      if (res.data.status == 0) {
        if (newArr.length > 0) {
          data.registerList = this.data.registerList.concat(newArr);
          data.p = p;
        } else {
          data.noMoreData = true;
        }
        this.setData(data);
      }

    }).catch(error => console.error(error));
  },

  /**
   * 滚动条滑到底部
   */
  scrollToLower() {
    if (!(this.data.noData || this.data.noMoreData)) {
      this.getMoreRegisterList();
    }
  },

  onLoad() {
    this.getRegisterList();
  }
})