import request from '@/utils/request'

export function getHadoopList(u_id, g_id) {
  return request({
    url: '/app/hadoop',
    methd: 'get',
    params: {
      'u_id': u_id,
      'g_id': g_id
    }
  })
}

export function deleteHadoop(name) {
  return request({
    url: '/app/hadoop/delete/' + name,
    method: 'get'
  })
}

export function addHadoop(data) {
  return request({
    url: '/app/hadoop/add',
    method: 'post',
    data
  })
}

export function updateHadoop(data) {
  return request({
    url: '/app/hadoop/update',
    method: 'post',
    data
  })
}

export function infoHadoop(name) {
  return request({
    url: '/app/hadoop/info',
    methd: 'get',
    params: {
      'name': name
    }
  })
}
