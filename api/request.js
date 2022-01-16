import globalData from '../utils/global.js'
import {
    toast,
    confirm
} from '../utils/util.js'
import user from '../utils/user.js'


let requestList = 0
let errorStatus = false

class Request {
    constructor(baseurl) {
        this.baseUrl = baseurl
    }

    all(object, hideLoading = false) {
        if (!/http/.test(object.url)) {
            object.url = this.baseUrl + object.url
        }
        if (!requestList && !hideLoading) {
            wx.showLoading({
                mask: true,
                title: '数据加载中'
            })
        }
        if (!hideLoading)
            requestList += 1
        if (globalData.token && object.header)
            object.header.Authorization = globalData.token
        if (globalData.token && !object.header)
            object.header = {
                Authorization:  globalData.token
            }

        return new Promise((reslove, reject) => {
            object.success = (res) => {
                if (res.statusCode === 200 && res.data.code === 401) {
                    toast('登录超时，正在为您重新登录')
                    setTimeout(() => {
                        user.reLogin().then(() => {
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }, () => {
                            confirm('登录失败，请尝试重新打开小程序或联系管理员')
                        })
                    }, 1500)
                    return 0
                }
                if (res.statusCode > 300 || res.statusCode < 200 || res.data.code > 300 || res.data
                    .code < 200) {
                    wx.hideLoading({
                        complete() {
                            toast(res.data.msg ? res.data.msg : '请求错误')
                        }
                    })
                    reject()
                } else {
                    reslove(res)
                }
            }
            object.fail = (err) => {
                wx.hideLoading()
                if (!errorStatus) {
                    errorStatus = true
                    wx.hideLoading({
                        complete() {
                            toast(err.data ? err.data.error : '网络错误，请检查网络后重试')
                        }
                    })
                    errorStatus = false
                }
                console.log(err)
                reject(err)
            }
            object.complete = () => {
                if (!hideLoading)
                    requestList -= 1
                if (requestList === 0) {
                    wx.hideLoading()
                }
            }
            wx.request(object)
        })
    }

    post(url, data, params = {}, hideLoading = false) {
        return this.all({
            url: url,
            params: params,
            data: JSON.stringify(data),
            method: 'post',
            header: {
                'content-type': 'application/json'
            }
        }, hideLoading)
    }

    get(url, data) {
        return this.all({
            url: url,
            data: data,
            method: 'get',
        })
    }

    put(url, data) {
        return this.all({
            url: url,
            data: data,
            method: 'put',
        })
    }

    delete(url, data) {
        return this.all({
            url: url,
            data: data,
            method: 'delete',
        })
    }


}

const request = new Request(globalData.baseUrl)
export default request