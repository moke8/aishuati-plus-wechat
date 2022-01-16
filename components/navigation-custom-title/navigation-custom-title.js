const app = getApp()
Component({
    data: { top: app.globalData.menuTop, },
    properties: {
		back: Boolean,
		color: String
	},
	created(){
		console.log(this)
	},
    methods: {
		goBack(){
			wx.navigateBack()
		}
	}
})