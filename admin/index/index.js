Page({
    jump(e) {
        let { url } = e.currentTarget.dataset;
        wx.navigateTo({
            url
        });
    }
})