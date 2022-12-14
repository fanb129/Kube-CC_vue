import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function checkPass(data) {
  return request({
    url: '/checkPass',
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
    url: '/user/' + page,
    method: 'get'
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'get'
  })
}

export function editUser(id,data) {
  return request({
    url: '/user/edit/' + id,
    method: 'post',
    data
  })
}

export function updateUser(id,data) {
  return request({
    url: '/user/update/' + id,
    method: 'post',
    data
  })
}
export function resetPass(id, data) {
  return request({
    url: '/user/resetpass/' + id,
    method: 'post',
    data
  })
}
