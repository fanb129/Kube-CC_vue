import request from '@/utils/request'

export function getSparkList(u_id) {
  return request({
    url: '/spark',
    methd: 'get',
    params: {
      'u_id': u_id
    }
  })
}

export function deleteSpark(name) {
  return request({
    url: '/ns/delete/' + name,
    method: 'get'
  })
}

export function addSpark(data) {
  return request({
    url: '/spark/add',
    method: 'post',
    data
  })
}
