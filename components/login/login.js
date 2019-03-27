import { login, set_userinfo } from "../../utils/util";
const app = getApp();

Component({
    properties: {
        showLogin: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        getUserInfo(e) {
            let data = e.detail;
            this.triggerEvent('getuserinfo', data);
            if (data.errMsg == 'getUserInfo:ok') {
                wx.checkSession({
                    success() {
                        set_userinfo(app, data);
                    },
                    fail() {
                        login(app, () => {
                            set_userinfo(app, data);
                        });
                    }
                });
            }
        },
    }
})