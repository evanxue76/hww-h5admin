import axios from "axios";
import config from "./global";
import dd from"./../../vue.config"
import {
  Message
} from 'element-ui'
let util = {}, err_ypes = ["null", "", null, "undefined", undefined];
const ajaxUrl = config.developmentUrl;
util.ajax = axios.create({
  baseURL: ajaxUrl.host1,
  headers: {
    //'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    "Content-Type": "application/json; charset=utf-8",
  }
  //timeout: 10000
});

util.ajax.interceptors.request.use(config => {
  if (err_ypes.includes(localStorage.getItem('hw_token'))) {
    window.location.href = `${dd.publicPath}`
    return
  }
  // 让每个请求携带token
  config.headers['token'] = localStorage.getItem('hw_token')  //"api-token-ylyadmin"
  return config
}, error => {
  Promise.reject(error)
})


util.ajax.interceptors.response.use(
  response => {
    if (response.data.respHead.respCode === "002") {
      Message({
        showClose: true,
        message: `${response.data.respHead.respMsg}`,
        type: 'error',
      })
      setTimeout(function () {
        //  控制路由跳转或者直接改变href到登录页
        window.location.href = `${dd.publicPath}`
      }, 1000)
    }
    return response;
  },
  err => Promise.reject(err)
);

export default util;