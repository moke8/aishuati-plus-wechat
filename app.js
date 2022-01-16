// app.js
import global from './utils/global.js'
import user from './utils/user.js'
App({
    onLaunch(options) {
        this.globalData.menuTop = wx.getMenuButtonBoundingClientRect().top

        user.login()

        wx.getStorage({
            key: 'follow'
        }).then(res => {}, () => {
            wx.showModal({
                content: '关注公众号后可以第一时间得到题库更新通知，是否立即关注公众号？',
                success: (result) => {
                    if (result.confirm) {
                        wx.navigateTo({
                            url: '/pages/webview/webview',
                        })
                        wx.setStorageSync('follow', true)
                    }
                }
            })
        })
    },
    globalData: global,
})