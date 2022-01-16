// 全局参数
const env = __wxConfig.envVersion
const baseUrls= {
    develop: '',
    release: '',
    trial: ''
}

export default{
    env,
    baseUrl: baseUrls[env],
    token: ''
}
