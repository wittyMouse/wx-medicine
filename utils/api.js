import { HOST } from '../config';

const API = {
    // 登录
    login: HOST + '/common/login',

    // 地址解析
    geocoder: HOST + '/common/geocoder',

    // 上传文件
    upload: HOST + "/common/upload",

    // 保存用户信息
    set_userinfo: HOST + '/set_userinfo',

    // 获取用户信息
    get_userinfo: HOST + '/get_userinfo',

    // 更新用户信息
    update_userinfo: HOST + '/update_userinfo',

    // 查询余额
    check_balance: HOST + '/check_balance',

    // 医院
    hosp: HOST + "/hospital",

    // 获取医院列表
    hosp_list: HOST + "/hosp_list",

    // 批量删除医院
    hosp_delete: HOST + "/hosp_delete",

    // 科室
    dept: HOST + "/department",

    // 获取科室列表
    dept_list: HOST + "/dept_list",

    // 批量删除科室
    dept_delete: HOST + "/dept_delete",

    // 医生
    doctor: HOST + "/doctor",

    // 获取医生列表
    doctor_list: HOST + "/doctor_list",

    // 批量删除医生
    doctor_delete: HOST + "/doctor_delete",

    // 获取医生详情
    doctor_detail: HOST + "/doctor_detail",

    // 用户
    user: HOST + "/user",

    // 获取用户列表
    user_list: HOST + "/user_list",

    // 批量删除用户
    user_delete: HOST + "/user_delete",

    // 就诊人
    patient: HOST + "/patient",

    // 获取就诊人列表
    patient_list: HOST + "/patient_list",

    // 批量删除就诊人
    patient_delete: HOST + "/patient_delete",

    // 排班医生
    roster_doctor: HOST + "/roster_doctor",
    get_ticket: HOST + "/get_ticket",
    roster_doctor_list: HOST + "/roster_doctor_list",
    roster_doctor_delete: HOST + "/roster_doctor_delete",

    // 挂号信息
    register: HOST + "/register",
    // 获取挂号记录列表
    register_list: HOST + "/register_list",
    // 获取个人挂号记录
    register_record: HOST + '/register_record',
    // 获取挂号记录详情
    register_detail: HOST + '/register_detail'
};

module.exports = {
    API
}