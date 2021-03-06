import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
  data: {
    loading: true,
    tmplData: {
      currentIndex: 0,
      currentChildIndex: 0
    }
  },

  scrollItemTap(e) {
    let { index } = e.currentTarget.dataset,
      { currentIndex } = this.data.tmplData;
    if (currentIndex == index) {
      return;
    }
    this.setData({
      'tmplData.currentIndex': index
    });
  },

  scrollChildItemTap(e) {
    let { index } = e.currentTarget.dataset,
      { currentIndex, currentChildIndex } = this.data.tmplData;
    if (currentChildIndex != index) {
      this.setData({
        'tmplData.currentChildIndex': index
      });
    }
    wx.navigateTo({
      url: '/pages/doctor/doctor?id=' + this.data.tmplData.list[currentIndex].childList[index].departmentId
    });
  },

  /**
   * 获取医院详情
   */
  getHospDetail() {
    return RESTful.show({
      url: API.hosp,
      data: {
        id: this.options.id
      }
    });
  },

  /**
   * 获取科室列表
   */
  getDeptList() {
    return RESTful.request({
      url: API.dept_list,
      data: {
        hospitalId: this.options.id
      }
    });
  },

  /**
   * 数据格式化
   * @param {*} arr 
   */
  dateFormat(arr) {
    arr.forEach(item => {
      item.id = item.departmentId;
      item.name = item.departmentName;
      if (item.childList && item.childList.length > 0) {
        this.dateFormat(item.childList);
      }
    });
  },

  /**
   * 数据初始化
   */
  loadData() {
    let p1 = this.getHospDetail;
    let p2 = this.getDeptList;
    Promise.all([p1(), p2()]).then(res => {
      // console.log(res);
      let hospDetil = {};
      if (res[0].data.status == 0) {
        hospDetil = res[0].data.data;
      }
      let deptList = res[1].data.data;
      if (deptList.length > 0) {
        this.dateFormat(deptList);
      }
      this.setData({
        loading: false,
        hospDetil,
        'tmplData.list': deptList
      });
      this.pageInit();
    }).catch(error => console.log(error));
  },

  /**
   * 页面初始化
   */
  pageInit() {
    let that = this;
    wx.createSelectorQuery().select('.header').boundingClientRect((rect) => {
      that.setData({
        'tmplData.panelHeight': wx.getSystemInfoSync().windowHeight - rect.height
      });
    }).exec();
  },

  onLoad() {
    this.loadData();
  }
})