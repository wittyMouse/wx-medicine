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

    loginEvent() {
        this.setData({
            showLogin: true
        });
    },

    getUserInfo(e) {
        // console.log(e);
        let data = e.detail;
        if (data.errMsg == 'getUserInfo:ok') {
            this.setData({
                showLogin: false,
                isLogin: true,
                avatarUrl: data.userInfo.avatarUrl,
                nickName: data.userInfo.nickName
            });
        }
    },

    jump(e) {
        if (!this.data.isLogin) {
            this.loginEvent();
            return;
        }
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
    },

    onShow() {
        this.setData({
            showLogin: false
        });
    }
})