import axios from 'axios'
import qs from 'qs'
//MOCK // npm run dev 会自动启用 mock , npm run build 会自动关掉 mock, 如果想直接关闭 mock 可以注释掉本行

const debug = false
axios.defaults.withCredentials = true;
export const http = axios.create({
    baseURL: 'http://27.115.117.6:8099',
    timeout: 20000,
    headers: {
		//'Authorization': 'Bearer ' + localStorage.getItem('token')
		'Content-Type': 'application/json;charset=UTF-8',
		  
    },
	//withCredentials: true,
    paramsSerializer: function(params) {
        return qs.stringify(params, {indices: false})
    },
})
//http request拦截器
http.interceptors.request.use(function(config){
  if (config.method === 'get') {
    //  给data赋值以绕过if判断
    config.data = true; 
  }
  config.headers['Content-Type'] = 'application/json;charset=UTF-8;';
  return config;
}, function(err){
	return Promise.reject(err);
})
//http response 拦截器
http.interceptors.response.use(function (response) {
    const request = response.config
    if (debug) {
        console.log(
            '>>>', request.method.toUpperCase(), request.url, request.params,
            '\n   ', response.status, response.data
        )
    }
    return response.data;
}, function (error) {
    console.warn('http response error:', error)

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {// 处理 401
        } else if (error.response.status === 403) {
            ht.Default.errorMessage('您没有权限执行该操作', '错误', 'top', 320, 4000)
        } else {
            //ht.Default.errorMessage('Error: http' + error.response.status, i18n.t('错误'), 'topRight', 320, 4000)
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // ht.Default.errorMessage(i18n.t('通讯超时'), i18n.t('错误'), 'top', 320, 4000)
    } else if (axios.isCancel(error)) {
        // App.toast(i18n.t('已取消操作')) // TODO: i18n
    } else { // Something happened in setting up the request that triggered an Error
        // ht.Default.errorMessage(i18n.t(error.message), i18n.t('错误'), 'top', 320, 4000)
    }
    // Do something with response error
    return Promise.reject(error)
})

export const httpGet = function(url, params, options) {
    return http.get(url, {params}, options)
}
export const httpGetImg = function(url,params, options) {
    return http.get(url, {responseType: "arraybuffer",},{params}, options)
}

export const httpPostForm = function(url, data, options) {
    return http.post(url, qs.stringify(data, {indices: false}), options)
}

export const httpPostJson = function(url, data, options) {
    return http.post(url, data, options)
}
