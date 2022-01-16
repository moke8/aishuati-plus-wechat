// 简单确认框提示框
export function confirm(cont) {
    return new Promise((reslove, reject) => {
        wx.showModal({
            title: '提示',
            content: cont,
            success: (res) => {
                if (res.confirm)
                    reslove()
                if (res.cancel)
                    reject()
            },
            fail: () => {
                reject()
            }
        })
    })
}
// 简单提示框，只有确认
export function alert(cont) {
    return new Promise((reslove) => {
        wx.showModal({
            title: '提示',
            content: cont,
            showCancel: false,
            success: () => {
                reslove()
            }
        })
    })
}
// 轻提示
export function toast(cont, type = 'none') {
    console.log(type)
    return wx.showToast({
        icon: type,
        title: cont,
    })
}