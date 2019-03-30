import { API } from '../../utils/api';
import { formatNumber, rpxToPx } from '../../utils/util';
const RESTful = require('../../utils/request');

const app = getApp();

Page({
  data: {
    loading: true,
    currentIndex: 0,
    // weekList: ['日', '一', '二', '三', '四', '五', '六'],
    currentWeek: 0,
    currentDate: 0
  },

  jump(e) {
    let { id, tag } = e.currentTarget.dataset;
    let url = "";
    if (tag) {
      url = '/pages/time/time?id=' + id + '&tag=' + tag;
    } else {
      url = '/pages/time/time?id=' + id + '&currentWeek=' + this.data.currentWeek + '&currentDate=' + this.data.currentDate + '&fullDate=' + this.data.fullDate;
    }
    wx.navigateTo({
      url
    });
  },

  /**
   * 获取日期选择器高度
   * @param {*} e 
   */
  getDateBarHeight(e) {
    this.setData({
      dateBarHeight: e.detail
    });
  },

  /**
   * 切换数据
   * @param {*} e 
   */
  changeEvent(e) {
    // console.log(e);
    this.setData(e.detail);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    RESTful.request({
      url: API.roster_doctor_list,
      data: {
        departmentId: this.options.id,
        date: this.data.currentDate
      }
    }).then(res => {
      wx.hideLoading();
      this.setData({
        rosterDoctorList: res.data.data
      });
    }).catch(error => console.error(error));
  },

  // /**
  //  * 切换星期
  //  * @param {*} e 
  //  */
  // weekChange(e) {
  //   let { tag } = e.currentTarget.dataset;
  //   let week = this.data.currentWeek;
  //   if (tag == 'next' && week < 2) {
  //     week += 1;
  //   } else if(tag == 'last' && week > 0) {
  //     week -= 1;
  //   } else {
  //     return;
  //   }
  //   this.dateInit(week);
  //   this.setData({
  //     currentWeek: week
  //   });
  // },

  // /**
  //  * 切换日期
  //  * @param {*} e 
  //  */
  // dateChange(e) {
  //   let { index } = e.currentTarget.dataset;
  //   if (index == this.data.currentDate) {
  //     return;
  //   }
  //   this.setData({
  //     currentDate: index
  //   });
  //   this.getRosterDoctorList();
  // },

  // /**
  //  * 日期初始化
  //  */
  // dateInit(week = 0) {
  //   const size = 7;
  //   const date = new Date();
  //   let dateList = [];

  //   date.setDate(date.getDate() + week * size);

  //   for (let i = 0; i < size; i++) {
  //     if (i != 0) {
  //       date.setDate(date.getDate() + 1);
  //     }
  //     dateList.push({ fullDate: this.getFormatDate(date, "yyyy-MM-dd"), date: this.getFormatDate(date, "MM-dd"), day: date.getDay() });
  //   }

  //   this.setData({
  //     dateList
  //   });
  // },

  // /**
  //  * 获取格式化时间
  //  * @param {*} date 
  //  */
  // getFormatDate(date, pattern) {
  //   if (pattern == "yyyy-MM-dd") {
  //     return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('-');
  //   } else if (pattern == "MM-dd") {
  //     return [date.getMonth() + 1, date.getDate()].map(formatNumber).join('-');
  //   }
  // },

  // /**
  //  * 获取该月最后一天的日期
  //  * @param {*} month 
  //  */
  // getLastDate(date, month) {
  //   let m = month ? month : date.getMonth() + 1;
  //   date.setMonth(m);
  //   date.setDate(0);
  //   return date.getDate();
  // },

  tabChange(e) {
    let { index } = e.currentTarget.dataset;
    if (index == this.data.currentIndex) {
      return;
    } else {
      this.setData({
        currentIndex: index
      });
    }
  },

  // /**
  //  * 获取医院详情
  //  */
  // getHospDetail() {
  //   return RESTful.show({
  //     url: API.hosp,
  //     data: {
  //       id: this.options.id
  //     }
  //   });
  // },

  /**
   * 获取医生列表
   */
  getDoctorList() {
    return RESTful.request({
      url: API.doctor_list,
      data: {
        departmentId: this.options.id
      }
    });
  },

  /**
   * 获取排班医生列表
   */
  getRosterDoctorList() {
    // let beginTime = this.data.dateList[this.data.currentDate].fullDate;
    // let date = new Date();
    // date.setDate(date.getDate() + 1);
    // let endTime = this.getFormatDate(date, "yyyy-MM-dd");
    return RESTful.request({
      url: API.roster_doctor_list,
      data: {
        departmentId: this.options.id,
        date: this.data.currentDate
      }
    });
  },

  // /**
  //  * 数据格式化
  //  * @param {*} arr 
  //  */
  // dateFormat(arr) {
  //   arr.forEach(item => {
  //     item.id = item.departmentId;
  //     item.name = item.departmentName;
  //     if (item.childList && item.childList.length > 0) {
  //       this.dateFormat(item.childList);
  //     }
  //   });
  // },

  // /**
  //  * 数据初始化
  //  */
  // dataInit() {
  //   let p1 = this.getHospDetail();
  //   let p2 = this.getDeptList();
  //   Promise.all([p1, p2]).then(res => {
  //     // console.log(res);
  //     let hospDetil = {};
  //     if (res[0].data.status == 0) {
  //       hospDetil = res[0].data.data;
  //     }
  //     let deptList = res[1].data.data;
  //     if (deptList.length > 0) {
  //       this.dateFormat(deptList);
  //     }
  //     this.setData({
  //       loading: false,
  //       hospDetil,
  //       'tmplData.list': deptList
  //     });
  //   }).catch(error => console.log(error));
  // },

  loadData() {
    let p1 = this.getDoctorList;
    let p2 = this.getRosterDoctorList;
    Promise.all([p1(), p2()]).then(res => {
      console.log(res);
      this.setData({
        loading: false,
        doctorList: res[0].data.data,
        rosterDoctorList: res[1].data.data
      });
    }).catch(error => console.error(error));
  },

  /**
   * 页面初始化
   */
  pageInit() {
    this.setData({
      'scrollHeight': wx.getSystemInfoSync().windowHeight - rpxToPx(100)
    });
  },

  onLoad() {
    // this.dataInit();
    // this.dateInit();
    // this.pageInit();
    this.loadData();
  },

  onReady() {
    this.pageInit();
  }
})