import request from '@/utils/request'

export function getNsList(u_id) {
  return request({
    url: '/ns',
    methd: 'get',
    params: {
      'u_id': u_id
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
