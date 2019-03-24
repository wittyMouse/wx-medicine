import { API } from '../../utils/api';
import { request } from '../../utils/request';
import { login } from '../../utils/util';
const app = getApp();

Page({
    data: {
        isLogin: false,
        list: [
            { name: '余额', url: '/pages/wallet/wallet' },
            { name: '挂号记录', url: '/pages/note/note' },
            { name: '就诊人', url: '/pages/patient/patient' },
            { name: '后台管理', url: '/admin/index/index'}
        ]
    },
    getUserInfo(e) {
        let that = this;
        let data = e.detail;
        wx.checkSession({
            success() {
                that.set_userinfo(data);
            },
            fail() {
                login(app, () => {
                    that.set_userinfo(data);
                });
            }
        })
    },
    set_userinfo(data) {
        wx.showLoading({
            title: '登陆中...',
            mask: true,
        });
        if (data.errMsg == 'getUserInfo:ok') {
            let userInfo = data.userInfo;
            data.token = app.globalData.token;
            data.userInfo = JSON.stringify(data.userInfo);
            request({
                url: API.set_userinfo,
                method: 'post',
                data
            }).then(res => {
                // console.log(res);
                wx.hideLoading();
                if(res.data.status == 0) {
                    app.globalData.userInfo = userInfo;
                    this.setData({
                        isLogin: true,
                        avatarUrl: userInfo.avatarUrl,
                        nickName: userInfo.nickName
                    });
                } else {
                    wx.showToast({
                        title: '登录失败，请检查网络连接',
                        icon: 'none'
                    });
                }
            }).catch(error => console.error(error));
        }
    },
    jump(e) {
        let { i } = e.currentTarget.dataset;
        wx.navigateTo({
            url: this.data.list[i].url
        });
    },
    onLoad(options) {
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                nickName: app.globalData.userInfo.nickName
            })
        }
    }
})