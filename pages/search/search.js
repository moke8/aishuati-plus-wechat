// pages/type/type.js
import {
	getSubject
} from '../../api/app.js'
import user from '../../utils/user.js'
import { toast } from '../../utils/util'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		searchText: '',
		data: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			options
		})
		wx.setNavigationBarTitle({
			title: options.name
		})
	},
	search(event){
		if(!event.detail.value){
			toast('请输入要搜索的内容')
			return
		}
		this.setData({
			searchText: event.detail.value
		})
		getSubject({
			id: this.data.options.id,
			searchText: event.detail.value
		}).then(response => {
			this.setData({
				data: response.map(item => {
					item.option = JSON.parse(item.opt)
					return item
				})
			})
			console.log(this.data.data)
		})
	},
	next(event) {
		wx.navigateTo({
			url: "/pages/timu/timu?type=search&id=" + this.data.options.id + "&title=" + this.data.options.name+"&timu="+event.currentTarget.dataset.id+ "&search=" + this.data.searchText
		})
	},
})