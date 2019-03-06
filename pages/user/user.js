const app = getApp();

Page({
    data: {
        isLogin: false,
        list: [
            { name: '余额', url: '/pages/wallet/wallet' },
            { name: '挂号记录', url: '/pages/note/note' },
            { name: '收藏夹', url: '/pages/favorite/favorite' },
            { name: '后台管理', url: '/admin/index/index'}
        ]
    },
    getUserInfo(e) {
        console.log(e)
        wx.showLoading({
            title: '登陆中...',
            mask: true,
        });
        if (e.detail.errMsg == 'getUserInfo:ok') {
            app.globalData.userInfo = e.detail.userInfo;
            this.setData({
                isLogin: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName
            });
            wx.hideLoading();
        }
    },
    jump(e) {
        let { i } = e.currentTarget.dataset;
        wx.navigateTo({
            url: this.data.list[i].url
        });
    }
})