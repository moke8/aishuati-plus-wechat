import { exportOpinion, register } from '../../api/app.js'
import { toast, alert } from '../../utils/util.js'
import user from '../../utils/user.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contact: '',
        content: ''
    },
    contact(event){
        this.setData({
            contact: event.detail.value
        })
    },
    content(event){
        this.setData({
            content: event.detail.value
        })
    },
    submit(){
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
                    user.reLogin().then(()=>{
                        this.submit()
                    })
                })
			},err=>{
                console.log(err)
            })
			return
		}
        if(!this.data.contact){
            toast('请输入您的联系方式以便我们后续反馈')
            return
        }
        if(!this.data.content){
            toast('请输入您的建议内容')
            return
        }
        exportOpinion({
            contact: this.data.contact,
            content: this.data.content
        }).then(()=>{
            alert('提交成功，我们将尽快与您联系')
            this.setData({
                contact: '',
                content: ''
            })
        })
    }
})