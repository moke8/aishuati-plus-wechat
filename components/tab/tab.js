Component({
    properties: {
        list: Array,
        active: Number
    },
    data: {
        animationData: {},
        animation: ''
    },
    externalClasses: ['margin'],
    observers: {
        active: function(index) {
            console.log(index)
            this.navigateTo(index)
        }
    },
    ready() {
        console.log(this.data.active,this.data.list)
        this.setData({
            animation: wx.createAnimation()
        })
    },
    mounted() {
        this.navigateTo(this.active)
    },
    methods: {
        async navigateTo(index) {
            this.animationData = {}
            console.log('#tab' + index)
            this.createSelectorQuery().select('#tab' + index).boundingClientRect().exec(ele=>{
                console.log(ele)
                this.createSelectorQuery().select('#container').boundingClientRect().exec(container=>{
                    console.log(ele[0].left + ele[0].width / 2 - container[0].left - 20)
                    this.data.animation
                        .translateX(ele[0].left + ele[0].width / 2 - container[0].left - 20)
                        .step({
                            duration: 200
                        })
                    this.setData({
                        animationData: this.data.animation.export()
                    })
                })

            })

        },
        async onTab(event) {
            console.log(event)
            let {index} = event.currentTarget.dataset
            this.triggerEvent('change', index)
        },
        getElementWidth(ele) {
            return new Promise(resolve => {
                const selector = wx.createSelectorQuery()
                selector.in(this)
                selector.select(ele).boundingClientRect(res => {
                    console.log(res)
                    resolve(res)
                })
                selector.exec()
            })
        }
    }
})
