import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
    data: {
        balance: '0'
    },
    jump(e) {
        wx.navigateTo({
            url: '/pages/put/put'
        });
    },

    /**
     * 查询余额
     */
    checkBalance() {
        this.setData({
            loading: true
        });
        RESTful.request({
            url: API.check_balance,
            data: {
                token: app.globalData.token
            },
            method: "POST"
        }).then(res => {
            console.log(res);
            let data = {
                loading: false
            }
            if (res.data.status == 0) {
                data.balance = res.data.data.balance
            }
            this.setData(data);
        }).catch(error => console.error(error));
    },

    onLoad(options) {

    },

    onShow() {
        this.checkBalance();
    }
})