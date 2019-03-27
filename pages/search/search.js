import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
let app = getApp();

Page({
    data: {
        loading: false,
        keyword: ''
    },
    /**
     * 点击搜索图标
     */
    searchHandle(e) {
        let { tag } = e.currentTarget.dataset;
        this.searchType(tag);
    },
    /**
     * 键盘输入事件
     */
    inputHandle(e) {
        this.setData({
            keyword: e.detail.value
        });
    },
    /**
     * 点击完成按钮事件
     */
    confirmHandle(e) {
        let { tag } = e.currentTarget.dataset;
        this.searchType(tag);
    },
    /**
     * 选择搜索类型
     */
    searchType(tag) {
        if (tag == 'dept') {
            this.deptSearch();
        } else if (tag == 'hosp') {
            this.hopsSearch();
        }
    },
    /**
     * 搜索科室
     */
    deptSearch(keyword) {

    },
    /**
     * 搜索医院
     */
    hopsSearch() {
        RESTful.request({
            url: API.hosp_list,
            data: {
                address: this.options.city,
                keyword: this.data.keyword
            }
        }).then(res => {
            // console.log(res);
            let newArr = res.data.data,
                data = {};
            if (newArr.length > 0) {
                if (this.data.noData) {
                    data.noData = false;
                }
                data.hospList = newArr;
            } else {
                data.noData = true;
            }
            this.setData(data);
        }).catch(error => console.error(error));
    },
    /**
     * 清空输入框
     */
    reset(e) {
        this.setData({
            keyword: '',
            focus: true
        });
    },
    /**
     * 点击取消事件
     */
    cancal(e) {
        wx.navigateBack();
    },
    /**
     * 进入医院详情
     */
    jump(e) {
        let { tag } = e.currentTarget.dataset;
        if (tag == 'hosp') {
            wx.navigateTo({
                url: '/pages/dept/dept?id=' + e.currentTarget.dataset.id
            });
        }
    },
    loadData() {
        // request({
        //     url: '',
        //     data: {
        //         p: 1,
        //         page_size: 10
        //     }
        // }).then(res => {
        //     console.log(res);
        // }).catch(error => {
        //     console.error(error)
        // });
        // this.setData({
        //     loading: false
        // })
    },
    loadMoreData() {
        // this.setData({
        //     loadMore: true
        // });
        // let p = this.data.currentPage;
        // request({
        //     url: '',
        //     data: {
        //         p,
        //         page_size: 10
        //     }
        // }).then(res => {
        //     console.log(res);
        // }).catch(error => {
        //     console.error(error)
        // });
        // this.setData({
        //     loadMore: false
        // })
    },
    /**
     * 第一次进入页面
     * @param {*} options 
     */
    onLoad: function (options) {
        if (options.keyword) {
            this.setData({
                keyword: options.keyword
            });
        }
        if (options.dept) {
            this.setData({
                dept: true
            });
        }
    },
    // /**
    //  * 上拉触底事件
    //  */
    // onReachBottom() {
    //     this.loadMoreData();
    // }
})