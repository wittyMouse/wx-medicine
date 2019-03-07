import { HOST } from '../config';

const API = {
    // 登录
    login: HOST + '/common/login',
    
    // 地址解析
    geocoder: HOST + '/common/geocoder',

    // 保存用户信息
    set_userinfo: HOST + '/users/set_userinfo',

    // 获取用户信息
    get_userinfo: HOST + '/users/get_userinfo',
    
    // 医院
    hosp: HOST + "/hospital",
};

module.exports = {
    API
}