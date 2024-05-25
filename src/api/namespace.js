import request from '@/utils/request'

export function getNsList(g_id, u_id) {
  return request({
    url: '/ns',
    method: 'get',
    params: {
      'u_id': u_id,
      'g_id': g_id
    }
  })
}

export function deleteNs(ns) {
  return request({
    url: '/ns/delete/' + ns,
    method: 'get'
  })
}

export function addNs(data) {
  return request({
    url: '/ns/add',
    method: 'post',
    data
  })
}

export function updateNs(data) {
  return request({
    url: '/ns/update',
    method: 'post',
    data
  })
}

// 用于监控
export function totalNs(u_id) {
  return request({
    url: '/ns/total',
    method: 'get',
    params: {
      'u_id': u_id
    }
  })
}

// export function allkindNs(u_id) {
//   return request({
//     url: '/ns/allkind',
//     method: 'get',
//     params: {
//       'u_id': u_id
//     }
//   })
// }
