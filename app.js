import { login } from './utils/util';

App({
    onLaunch() {
        this.globalData.sys = wx.getSystemInfoSync();
        let localCity = wx.getStorageSync('localCity');
        if (localCity) {
            this.globalData.location.localCity = localCity;
        }
        login();
    },
    globalData: {
        location: {
            defaultCity: '广州'
        }
    }
})