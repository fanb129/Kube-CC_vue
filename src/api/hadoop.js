import request from '@/utils/request'

export function getHadoopList(u_id) {
  return request({
    url: '/hadoop',
    methd: 'get',
    params: {
      'u_id': u_id
    }
  })
}

export function deleteHadoop(name) {
  return request({
    url: '/hadoop/delete/' + name,
    method: 'get'
  })
}

export function addHadoop(data) {
  return request({
    url: '/hadoop/add',
    method: 'post',
    data
  })
}

export function updateHadoop(data) {
  return request({
    url: '/hadoop/update',
    method: 'post',
    data
  })
}
