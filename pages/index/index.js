import user from '../../utils/user.js'
import {
	register,
	getLibraryList
} from '../../api/app.js'
Page({
	data: {
		top: 0,
		jsonList: [],
		active: 0,
		isStar: true
	},
	onLoad() {
		this.setData({
			top: wx.getMenuButtonBoundingClientRect().top
		})
		getLibraryList().then(res => {
			this.setData({
				jsonList: res,
				starList: res.filter(item => {
					if(!!Number(item.orderNum)){
						return true
					}
				})
			})
		})
	},
	goNext(event) {
		if (!user.userId) {
			wx.getUserProfile({
				desc: '需要获取您的用户信息用于登录'
			}).then(res => {
				register({
					openid: user.openid,
					sessionKey: user.session_key,
					encryptedData: res.encryptedData,
					iv: res.iv
				}).then(()=>{
					user.reLogin()
				})
			}).then(() => {
				wx.navigateTo({
					url: "/pages/type/type?id=" + event.currentTarget.dataset.id + '&name=' + event.currentTarget.dataset.name
				})
			})
			return
		}
		wx.navigateTo({
			url: "/pages/type/type?id=" + event.currentTarget.dataset.id + '&name=' + event.currentTarget.dataset.name
		})
	},
	onTab(event) {
		this.setData({
			active: event.detail,
			isStar: !Number(event.detail)
		})
	},
	follow(){
		wx.navigateTo({
			url: '/pages/webview/webview?type=follow',
		})
		wx.setStorageSync('follow', true)
	},
	about(){
		wx.navigateTo({
			url: '/pages/webview/webview?type=about',
		})
	},
	onShareAppMessage() {},
	onShareTimeline() {}
})