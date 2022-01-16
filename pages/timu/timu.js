import {
	getSubject,
	upSubjectFail
} from '../../api/app.js'
import user from '../../utils/user.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		data: [],
		page: 0,
		timu: {},
		zidian: ['A', 'B', 'C', 'D', 'E'],
		daan: [],
		answer: false,
		result: false,
		options: {},
		isRecite: false,
		isSetting: false,
		autoNext: false,
		playAudio: false,
		audio: {
			success: '',
			fail: ''
		},
		mode: 'day',
		size: 3,
		successNum: 0,
		failNum: 0,
		isOverview: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		user.waitLogin().then(() => {
			this.setData({
				options,
				autoNext: wx.getStorageSync('autoNext') || false,
				playAudio: wx.getStorageSync('playAudio') || false,
				mode: wx.getStorageSync('mode') || 'day',
				size: wx.getStorageSync('size') || 3,
				"audio.success": wx.createInnerAudioContext(),
				"audio.fail": wx.createInnerAudioContext(),
			})
			this.setHeadColor(this.data.mode)
			this.data.audio.success.src = "/assets/practice_right.mp3"
			this.data.audio.fail.src = "/assets/practice_error.mp3"

			wx.setNavigationBarTitle({
				title: options.title
			})
			if (!options.id) {
				wx.navigateBack({
					delta: 10,
				})
			}
			getSubject({
				id: options.id,
				searchText: options.search || ''
			}).then(response => {
				wx.setStorageSync('length_'+options.id, response.length)
				this.setData({
					data: response.map(item => {
						item.option = JSON.parse(item.opt)
						return item
					})
				})
				if (options.type == "wrong") {
					// 如果没有错题
					const key = 'wrong_' + this.data.options.id
					wx.getStorage({
						key
					}).then(res => {
						const result = res.data
						if(result.length === 0){
							wx.showModal({
								title: '您暂时无错题记录，已自动为您选择乱序答题模式',
								showCancel: false
							})
							this.setData({
								['options.type']: 'random'
							})
							return 
						}
						this.setData({
							data: this.wrongArray(this.data.data, result)
						})
					}, err => {
						wx.showModal({
							title: '您暂时无错题记录，已自动为您选择乱序答题模式',
							showCancel: false
						})
						this.setData({
							['options.type']: 'random'
						})
					})
				}
				// 乱序模式需要随机排序题目
				else if (options.type == "random") {
					this.setData({
						data: this.randomArray(this.data.data)
					})
				}
				// 顺序答题选择是否恢复上次答题
				else { // 'radio','check','short','complete'
					if (options.type === 'radio') {
						this.setData({
							data: this.data.data.filter(item => {
								if (item.option.length && item.answer.length === 1) {
									return true
								}
							})
						})
					}
					if (options.type === 'check') {
						this.setData({
							data: this.data.data.filter(item => {
								if (item.option.length && item.answer.length > 1) {
									return true
								}
							})
						})
					}
					if (options.type === 'short') {
						this.setData({
							data: this.data.data.filter(item => {
								if (item.option.length === 0 && item.answer.length > 16) {
									return true
								}
							})
						})
					}
					if (options.type === 'complete') {
						this.setData({
							data: this.data.data.filter(item => {
								if (item.option.length === 0 && item.answer.length <= 16) {
									return true
								}
							})
						})
					}
					if (this.data.options.timu) {
						let timuIndex = 0
						this.data.data.forEach((item, index) => {
							if(item.id === Number(this.data.options.timu)){
								timuIndex = index
							}
								
						})
						const data = this.data.data[timuIndex]
						this.data.data.splice(timuIndex, 1);
						this.data.data.unshift(data)
						this.setData({
							data: this.data.data
						})
					} else {
						this.recovery(options.type)
					}
				}
				if (this.data.data.length === 0) {
					wx.showModal({
						content: '暂无题目',
						success: () => {
							wx.navigateBack({
								delta: 1,
							})
						}
					})
					return
				}
				// 初始化题目
				this.initTimu();
			})

		})
	},
	recovery(type) {
		wx.getStorage({
			key: type + '_' + this.data.options.id,
			success: res => {
				if (res) {
					wx.showModal({
						content: '检测到你上次答到第' + (res.data + 1) + '题，是否继续？',
						success: (result) => {
							if (result.confirm) {
								this.setData({
									page: res.data
								})
								this.initTimu()
							}
						}
					})
				}
			}
		})
	},
	select(event) {
		console.log(event.currentTarget.dataset.daan)
		const k = event.currentTarget.dataset.daan
		if (this.data.daan.indexOf(k) != -1) {
			this.data.daan.splice(this.data.daan.findIndex(item => item === k), 1);
		} else {
			// 单选同时只能选一项
			if (String(this.data.timu.answer).length === 1) {
				this.setData({
					daan: [k]
				})
			} else {
				this.data.daan.push(k)
			}
		}
		console.log(this.data.daan)
		this.setData({
			daan: this.data.daan
		})
	},
	huida() {
		let answer = this.data.timu.answer.split('')
		this.setData({
			result: 1,
			["data[" + this.data.page + "].uAnswer"]: this.data.daan
		})
		if (this.data.daan.length != answer.length) {
			this.setData({
				result: 0
			})
		} else {
			for (const i in this.data.daan) {
				console.log(this.data.zidian)
				if (answer.indexOf(this.data.zidian[this.data.daan[i]]) == -1) {
					this.setData({
						result: 0
					})
				}
			}
		}
		// 答对自动进入下一题
		if (this.data.result) {
			if (this.data.autoNext) {
				setTimeout(() => {
					this.next()
				}, 800)
			}
			if (this.data.playAudio) {
				this.data.audio.success.play()
			}
			// 记录答对数量
			this.setData({
				["data[" + this.data.page + "].isSuccess"]: true
			})
			this.setData({
				successNum: this.data.data.filter(item => {
					return item.isSuccess
				}).length,
				failNum: this.data.data.filter(item => {
					return item.isSuccess === false
				}).length
			})

		} else {
			// 记录答错数量
			this.setData({
				["data[" + this.data.page + "].isSuccess"]: false
			})
			this.setData({
				successNum: this.data.data.filter(item => {
					return item.isSuccess
				}).length,
				failNum: this.data.data.filter(item => {
					return item.isSuccess === false
				}).length
			})
			if (this.data.playAudio) {
				this.data.audio.fail.play()
			}
			upSubjectFail({
				id: this.data.timu.id
			})
			// 错题ID记录
			const key = 'wrong_' + this.data.options.id
			wx.getStorage({
				key
			}).then(res => {
				const result = res.data
				if (Array.isArray(result) && result.indexOf(this.data.timu.id) == -1) {
					result.push(this.data.timu.id)
					wx.setStorageSync(key, result)
				}
				else{
					wx.setStorageSync(key, [this.data.timu.id])
				}
			}, () => {
				wx.setStorageSync(key, [this.data.timu.id])
			})
		}
		this.setData({
			answer: true
		})
	},
	// 下一题
	next() {
		if (this.data.page < this.data.data.length - 1) {
			this.setData({
				page: this.data.page + 1
			})
			this.initTimu()
			// 除去错题模式和搜索模式都记录错题进度
			if (this.data.options.type !== 'random' && this.data.options.type !== 'search') {
				wx.setStorageSync(this.data.options.type + '_' + this.data.options.id, this.data.page)
			}
		}
	},
	// 上一题
	prev() {
		if (this.data.page !== 0) {
			this.setData({
				page: this.data.page - 1
			})
			this.initTimu()
			if (this.data.options.type !== 'random' && this.data.options.type !== 'search') {
				wx.setStorageSync(this.data.options.type + '_' + this.data.options.id, this.data.page)
			}
		}
	},
	// 去掉错题
	del() {
		const key = "wrong_" + this.data.options.id
		const wrong = wx.getStorageSync(key)
		const index = wrong.indexOf(this.data.timu.id)
		console.log(index)
		wrong.splice(index, 1)
		wx.setStorageSync(key, wrong)
		wx.showToast({
			icon: 'success',
			title: '删除错题成功！'
		})
		this.data.data.splice(this.data.page, 1)
		// 如果删除到了最后一题，将页数向前推
		if (this.data.page >= this.data.data.length) {
			this.setData({
				page: this.data.data.length - 1
			})
		}
		this.setData({
			data: this.data.data
		})
		this.initTimu()
	},
	// 题目控制
	initTimu() {
		// 对之前的记录清空
		this.setData({
			daan: this.data.data[this.data.page].uAnswer || [],
			answer: this.data.data[this.data.page].uAnswer || false,
			timu: this.data.data[this.data.page]
		})
		// 背题模式直接显示解析和答案
		if (this.data.options.type == "recite") {
			this.setData({
				answer: true,
				result: 3
			})
		}
	},
	// 打乱数组顺序
	randomArray(array) {
		var m = array.length,
			t, i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	},
	// 将现有数组中的错题提取出来
	wrongArray(array, wrong) {
		let result = [];
		for (let i in wrong) {
			for (let j in array) {
				if (wrong[i] === array[j].id) {
					result.push(array[j]);
				}
			}
		}
		// 错题乱序返回
		return this.randomArray(result);
	},
	switchNotRecite() {
		this.setData({
			isRecite: false
		})
	},
	switchRecite() {
		this.setData({
			isRecite: true
		})
	},
	// 查看答案
	previewAnswer() {
		this.setData({
			answer: true,
			result: 2
		})
	},
	// 记录答案
	answerSync(event) {
		this.setData({
			["data[" + this.data.page + "].uAnswer"]: event.detail.value
		})
		console.log(this.data.data[this.data.page])
	},
	// 显示设置界面
	showSetting() {
		this.setData({
			isSetting: true
		})
	},
	// 设置自动跳转下一题
	switchAuto(event) {
		console.log(event)
		this.setData({
			autoNext: event.detail.value
		})
		wx.setStorageSync('autoNext', event.detail.value)
	},
	// 设置播放音乐
	switchAudio(event) {
		this.setData({
			playAudio: event.detail.value
		})
		wx.setStorageSync('playAudio', event.detail.value)
	},
	// 切换模式
	switchMode(event) {
		this.setData({
			mode: event.currentTarget.dataset.mode
		})
		wx.setStorageSync('mode', event.currentTarget.dataset.mode)
		this.setHeadColor(event.currentTarget.dataset.mode)
	},
	setHeadColor(type) {
		wx.setNavigationBarColor({
			backgroundColor: type === 'day' ? '#389aff' : (type === 'safe' ? '#BBC8BB' : '#1E2022'),
			frontColor: '#ffffff'
		})
	},
	switchSize(event) {
		this.setData({
			size: event.detail.value
		})
		wx.setStorageSync('size', event.detail.value)
	},
	exportFail() {
		wx.navigateTo({
			url: '/pages/export-fail/export-fail?libraryId=' + this.data.options.id + '&subjectId=' + this.data.timu.id,
		})
	},
	goSubject(event) {
		console.log(event)
		this.setData({
			page: event.currentTarget.dataset.index
		})
		this.initTimu()
		if (this.data.options.type !== 'random' && this.data.options.type !== 'search') {
			wx.setStorageSync(this.data.options.type + '_' + this.data.options.id, this.data.page)
		}
		this.setData({
			isOverview: false
		})
	},
	openOverview() {
		this.setData({
			isOverview: true
		})
	},
	hideContainer(){
		this.setData({
			isOverview: false,
			isSetting: false
		})
	},
	onShareAppMessage() {
		return {
			title: this.data.options.title,
			path: '/pages/timu/timu?type=order&id=' + this.data.options.id + '&title=顺序练习&timu=' + this.data.timu.id,
		}
	},
	onShareTimeline() {
		return {
			title: this.data.options.title,
			path: '/pages/timu/timu?type=order&id=' + this.data.options.id + '&title=顺序练习&timu=' + this.data.timu.id,
		}
	}
})