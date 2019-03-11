import { uploadFile } from "../../utils/request";

Page({
  data: {},
  chooseImage(e) {
    let that = this;
    wx.chooseImage({
      success(res) {
        console.log(res);
        that.setData({
          filePath: res.tempFiles[0].path,
          fileSize: res.tempFiles[0].size
        });
      }
    });
  },
  upload(e) {
    let { filePath, fileSize } = this.data;
    if (filePath && fileSize) {
      uploadFile({
        url: "http://127.0.0.1:7001/common/upload",
        method: "post",
        filePath,
        name: "file",
        header: { "content-type": "multipart/form-data" },
        formData: { fileSize }
      })
        .then(res => {
          console.log(res);
        })
        .catch(error => console.error(error));
    } else {
      wx.showToast({
        title: "请先选择文件",
        icon: "none"
      });
    }
  }
});
