import request from '@/utils/request'

export function getGroupInfo() {
  return request({
    url: '/group/info',
    method: 'get'
    // params: { token }
  })
}

export function getGroupList(page) {
  return request({
    url: '/group/' + page,
    method: 'get'
  })
}

export function viewGroupUser(g_id) {
  return request({
    url: '/group/view/' + g_id,
    method: 'get'
  })
}

export function creatGroup(ad_id,data) {
  return request({
    url: '/group/creat/' + ad_id,
    method: 'post',
    data
  })
}

export function deleteGroup(g_id) {
  return request({
    url: '/group/delete/' + g_id,
    method: 'get'
  })
}

// export function transAdmin(g_id,data) {
//   return request({
//     url: '/group/transadmin/' + g_id,
//     method: 'post',
//     data
//   })
// }

// export function removeUser(u_id) {
//   return request({
//     url: '/group/remove/' + u_id,
//     method: 'get',
//   })
// }

export function addUser(u_id, data) {
  return request({
    url: '/group/add/' + u_id,
    method: 'post',
    data
  })
}

export function removeUser(u_id) {
  return request({
    url: '/group/remove/' + u_id,
    method: 'get',
  })
}

export function updateGroup(g_id,data) {
  return request({
    url: '/group/update/' + g_id,
    method: 'post',
    data
  })
}

