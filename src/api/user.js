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
// export function register(data) {
//   return request({
//     url: '/register',
//     method: 'post',
//     data
//   })
// }
export function captcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}
export function checkcp(data) {
  return request({
    url: '/checkcp',
    method: 'post',
    data
  })
}

export function emailcaptcha(email) {
  return request({
    url: '/emailcaptcha/' + email,
    method: 'get'
  })
}
// export function verifyemail(data) {
//   return request({
//     url: '/verifyemail',
//     method: 'post',
//     data
//   })
// }

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

export function getUserList(gid) {
  return request({
    url: '/user',
    method: 'get',
    params: {
      'gid': gid,
    }
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'get'
  })
}

export function editUser(id, data) {
  return request({
    url: '/user/edit/' + id,
    method: 'post',
    data
  })
}

export function allocationUser(id, data) {
  return request({
    url: '/user/allocation/' + id,
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
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

export function setEmail(data) {
  return request({
    url: '/user/setemail',
    method: 'post',
    data
  })
}
export function emailcaptchaToSetEmail(email) {
  return request({
    url: '/user/emailcaptcha/' + email,
    method: 'get'
  })
}
export function addRegisterUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function findPass(data) {
  return request({
    url: '/findpass',
    method: 'post',
    data
  })
}
