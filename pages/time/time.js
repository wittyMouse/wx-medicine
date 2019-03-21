import { API } from '../../utils/api';
import { getFormatDate, rpxToPx } from '../../utils/util';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {
    scrollHeight: app.globalData.sys.windowHeight - rpxToPx(360) - 3
  },

  /**
   * 改变日期
   * @param {*} e 
   */
  changeEvent(e) {
    let { fullDate } = e.detail;
    this.setData({
      fullDate
    });
  },

  /**
   * 选择时间
   * @param {*} e 
   */
  timeSelected(e) {
    let { time, registered } = e.currentTarget.dataset;
    if (registered) {
      return;
    } else {
      wx.navigateTo({
        url: `/pages/register/register?id=${this.options.id}&time=${this.data.fullDate + ' ' + time + ':00'}`
      });
    }
  },

  /**
   * 获取医生详情
   */
  getDoctorDetail() {
    return RESTful.show({
      url: API.doctor,
      data: {
        id: this.options.id
      }
    });
  },

  /**
   * 获取排班医生列表
   */
  getRosterDoctorList() {
    let obj = this.getTimeObj();
    return RESTful.request({
      url: API.roster_doctor_list,
      data: {
        doctorId: this.options.id,
        ...obj
      }
    });
  },

  /**
   * 获取挂号记录列表
   */
  getRegisterList() {
    let obj = this.getTimeObj();
    return RESTful.request({
      url: API.register_list,
      data: {
        doctorId: this.options.id,
        ...obj
      }
    });
  },

  /**
   * 获取时间区间
   */
  getTimeObj() {
    let date = new Date(this.data.fullDate);
    let beginTime = getFormatDate(date, 'yyyy-MM-dd') + ' 00:00:00';
    date.setDate(date.getDate() + 1);
    let endTime = getFormatDate(date, 'yyyy-MM-dd') + ' 00:00:00';
    return { beginTime, endTime };
  },

  /**
   * 获取数据
   */
  loadData() {
    let p1 = this.getDoctorDetail;
    let p2 = this.getRosterDoctorList;
    let p3 = this.getRegisterList;
    Promise.all([p1(), p2(), p3()]).then(res => {
      let data = {
        loading: false,
        doctorDetail: res[0].data.data
      };

      let timeList = res[1].data.data;
      let registerList = res[2].data.data;
      
      data.timeList = [];
      timeList.forEach(item => {
        let beginDate = new Date(item.beginTime),
          endDate = new Date(item.endTime),
          nowDate = new Date();
        if (endDate > nowDate) {
          while (beginDate < endDate) {
            data.timeList.push({
              time: getFormatDate(beginDate, 'hh:mm'),
              hidden: beginDate < nowDate,
              registered: ((arr) => {
                for (let i = 0; i < arr.length; i++) {
                  if (Date.parse(beginDate) == Date.parse(arr[i].visitTime)) {
                    return true;
                  }
                }
                return false;
              })(registerList)
            });
            beginDate.setMinutes(beginDate.getMinutes() + 10);
          }
        }
      });
      this.setData(data);
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    this.setData(options);
    this.loadData();
  }
})