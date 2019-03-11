function request(params) {
  if (params.header) {
    if (!params.header['content-type']) {
      params.header['content-type'] = 'application/x-www-form-urlencoded';
    }
  } else {
    params.header = { 'content-type': 'application/x-www-form-urlencoded' }
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success(res) {
        resolve(res);
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

function uploadFile(params) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      ...params,
      success(res) {
        resolve(res);
      },
      fail(error) {
        reject(error);
      }
    });
  })
}

function show(params) {
  params.url += '/' + params.data.id;
  delete params.data;
  return request(params);
}

function destroy(params) {
  params.url += '/' + params.data.id;
  delete params.data;
  params.method = 'DELETE';
  return request(params);
}

module.exports = {
  request,
  uploadFile,
  show,
  destroy
}