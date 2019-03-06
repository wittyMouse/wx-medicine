import { HOST } from '../config';

const API = {
    // 登录
    login: HOST + '/common/login',
    
    // 地址解析
    geocoder: HOST + '/common/geocoder',
    
    // 医院
    hosp: HOST + "/hospital",
};

module.exports = {
    API
}