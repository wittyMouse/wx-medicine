import { API } from '../../utils/api';
const RESTful = require('../../utils/request');
const app = getApp();

Page({
    data: {

    },
    input(e) {
        let { tag } = e.currentTarget.dataset;
        if (tag == 1) {
            this.setData({
                money: e.detail.value
            });
        } else if (tag == 2) {
            this.setData({
                password: e.detail.value,
                length: e.detail.value.toString().length
            });
            if (e.detail.value.length == 6) {
                this.putRequest();
            }
        }
    },
    put(e) {
        if (!this.data.money || /^\.|^.+\..{3,}/.test(this.data.money)) {
            wx.showToast({
                title: '请输入正确金额',
                icon: 'none'
            });
            return;
        }
        let valueStr = this.data.money,
            idx = valueStr.indexOf('.');
        if (idx > -1) {
            if (idx == valueStr.length - 1) {
                valueStr += '00';
            } else if (idx == valueStr.length - 2) {
                valueStr += '0';
            }
        } else {
            valueStr += '.00';
        }
        let that = this;
        wx.showLoading({
            title: '正在加载',
            mask: true
        });
        let id = setTimeout(() => {
            wx.hideLoading();
            that.setData({
                showPop: true,
                focus: true,
                valueStr
            });
            clearTimeout(id);
        }, 200);
    },
    close() {
        this.setData({
            password: '',
            length: 0,
            showPop: false
        });
    },
    itemTap() {
        this.setData({
            focus: true
        });
    },
    putRequest() {
        wx.showLoading({
            title: '充值中...',
            mask: true
        });
        RESTful.request({
            url: API.update_userinfo,
            data: {
                key: 'balance',
                value: this.data.money,
                tag: 'add',
                token: app.globalData.token
            },
            method: "POST"
        }).then(res => {
            wx.hideLoading();
            if (res.data.status == 0) {
                wx.showToast({
                    title: '充值成功'
                });
                let id = setTimeout(() => {
                    wx.navigateBack();
                    clearTimeout(id);
                }, 1000);
            } else {
                wx.showToast({
                    title: '充值失败',
                    icon: 'none'
                });
            }
            this.close();
        }).catch(error => console.error(error));
    }
})