import { API } from '../../utils/api';
import { getFormatDate, rpxToPx } from '../../utils/util';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {
    loading: true
  },

  getDateBarHeight(e) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight - rpxToPx(160) - e.detail
    });
  },

  /**
   * 改变日期
   * @param {*} e 
   */
  changeEvent(e) {
    this.setData(e.detail);
    // if (this.options.tag) {
    //   this.loadDataTag();
    // } else {
    //   this.loadData();
    // }
    this.loadData();
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
        url: `/pages/register/register?id=${this.options.id}&dateTime=${this.data.fullDate + ' ' + time + ':00'}`
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
    // let obj = this.getTimeObj();
    let data = {
      doctorId: this.options.id
    };
    if (this.options.fullDate || this.data.currentDate > -1) {
      data.date = this.data.currentDate;
    }
    return RESTful.request({
      url: API.get_ticket,
      data
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

  /**
   * 获取数据
   */
  loadDataTag() {
    let p1 = this.getDoctorDetail;
    let p2 = this.getRosterDoctorList;
    Promise.all([p1(), p2()]).then(res => {
      // console.log(res)
      let newList = res[1].data.data;
      this.setData({
        doctorDetail: res[0].data.data,
        timeList: newList,
        currentDate: new Date(newList[0].beginTime).getDay(),
        fullDate: newList[0].beginTime
      });

      let obj = this.getTimeObj();
      RESTful.request({
        url: API.register_list,
        data: {
          doctorId: this.options.id,
          ...obj
        }
      }).then(result => {
        let timeList = this.data.timeList;
        let registerList = result.data.data;

        let temp = [];
        timeList.forEach(item => {
          let beginDate = new Date(item.beginTime),
            endDate = new Date(item.endTime),
            nowDate = new Date();
          if (endDate > nowDate) {
            while (beginDate < endDate) {
              temp.push({
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
        this.setData({
          loading: false,
          timeList: temp
        });
      }).catch(error => console.error(error));
    }).catch(error => console.error(error));
  },

  onLoad(options) {
    this.setData(options);
  },

  onShow() {
    if (this.options.fullDate) {
      this.loadData();
    } else {
      this.loadDataTag();      
    }
  }
})