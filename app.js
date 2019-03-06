import { login } from './utils/util';

App({
    onLaunch() {
        // 保存硬件信息
        this.globalData.sys = wx.getSystemInfoSync();
        let localCity = wx.getStorageSync('localCity');
        if (localCity) {
            this.globalData.location.localCity = localCity;
        }
        if (!this.globalData.token) {
            login(this);
        }
    },
    globalData: {
        location: {
            defaultCity: '广州'
        }
    }
})