import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
// export function getInfo(token) {
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getUserList(page) {
  return request({
    url: '/' + page,
    method: 'get'
  })
}

export function deleteUser(id) {
  return
}
