import {
    toast
} from './util.js'
import {
    getUserOpenId,
    getUserInfo
} from '../api/app.js'
import global from './global.js'
class User {
    constructor() {
        this.openid = '' // 用户openID
        this.unionid = '' // 用户unionid
        this.session_key = '' // 微信session
        this.userId = '' // 用户唯一ID
        this.userName = '' // 用户名称
        this.avatarUrl = '' // 头像url
        this.waiting = true // 控制位，是否正在登陆中
    }
    reLogin() {
        return new Promise((reslove, reject) => {
            wx.login({
                success: (res)=> {
                    console.log('获取到用户code:' + res.code)
                    if (res.code) {
                        // 发起网络请求
                        getUserOpenId({
                            code: res.code
                        }).then((res) => {
                            this.session_key = res.session_key
                            this.openid = res.openid
                            getUserInfo({
                                openid: res.openid
                            }).then(res => {
                                this.waiting = false
                                if (res.isRegister) {
                                    this.userId = res.id
                                    this.userName = res.xcx_nickname
                                    this.avatarUrl = res.xcx_avatar
                                    global.token = res.token
                                    reslove(this)
                                } else {
                                    reject()
                                }
                            })
                        })

                    }
                },
                fail() {
                    this.waiting = false
                    toast('获取用户信息失败', 'error')
                    reject()
                }
            })
        })
    }

    // 登录
    login() {
            // 如果已登录（使用Promise.relove()需要开增强编译）
            if (this.userId) {
                this.waiting = false
                return new Promise((reslove) => {
                    reslove(this)
                })
            }
            // 未登录
            return this.reLogin()
        }
        // 等待登录
        waitLogin() {
            return new Promise((reslove, reject) => {
                const wait = setInterval(() => {
                    if (!this.waiting) {
                        clearInterval(wait)
                        if (this.userId) {
                            reslove(this)
                        } else {
                            reject()
                        }
                    }
                }, 500)
            })
        }
}

export default new User()