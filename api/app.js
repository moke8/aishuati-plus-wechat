import request from './request'
export function getUserOpenId(data){
    return request.post('/wx/user/getOpenId', data).then((res) => {
        return res.data
    })
}
export function register(data){
    return request.post('/wx/user/register', data).then((res) => {
        return res.data
    })
}
export function getUserInfo(data){
    return request.get('/wx/user/getUserInfo', data).then((res) => {
        return res.data
    })
}

export function getLibraryList(data){
    return request.get('/wx/library/list', data).then((res) => {
        return res.data
    })
}

export function getSubject(data){
    return request.get('/wx/library/subject', data).then((res) => {
        return res.data
    })
}

export function exportOpinion(data){
    return request.post('/wx/opinion/add', data).then((res) => {
        return res.data
    })
}

export function exportSubject(data){
    return request.post('/wx/opinion/export', data).then((res) => {
        return res.data
    })
}
export function upSubjectFail(data){
    return request.post('/wx/library/upSubjectFail', data, {} ,true).then((res) => {
        return res.data
    })
}
