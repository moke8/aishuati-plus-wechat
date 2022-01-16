// pages/type/type.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		typeList: [{
			id: 'order',
			name: "顺序练习"
		}, {
			id: 'random',
			name: "乱序练习"
		}, {
			id: 'type',
			name: "题型练习"
		}, {
			id: 'wrong',
			name: "错题练习"
		}],
		options: {},
		processLength: 0,
		process: 0
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
		this.setData({
			processLength: wx.getStorageSync('length_' + options.id) || false,
			process: wx.getStorageSync('order_' + options.id),
		})

	},
	goNext(event) {
		if (event.currentTarget.dataset.id === 'type') {
			wx.showActionSheet({
				itemList: ['单选题', '多选题', '简答题', '填空题'],
			}).then(res => {
				const types = ['radio', 'check', 'short', 'complete']
				console.log(res.tapIndex)
				wx.navigateTo({
					url: "/pages/timu/timu?type=" + types[res.tapIndex] + "&id=" + this.data.options.id + "&title=" + this.data.options.name
				})
			})
			return
		}
		wx.navigateTo({
			url: "/pages/timu/timu?type=" + event.currentTarget.dataset.id + "&id=" + this.data.options.id + "&title=" + this.data.options.name
		})
	},
	onSearch(){
		wx.navigateTo({
			url: "/pages/search/search?type=search&id=" + this.data.options.id + "&name=" + this.data.options.name
		})
	}
})