import request from '@/utils/request'

export function getSparkList(u_id, g_id) {
  return request({
    url: '/app/spark',
    methd: 'get',
    params: {
      'u_id': u_id,
      'g_id': g_id
    }
  })
}

export function deleteSpark(name) {
  return request({
    url: '/app/spark/delete/' + name,
    method: 'get'
  })
}

export function addSpark(data) {
  return request({
    url: '/app/spark/add',
    method: 'post',
    data
  })
}

export function updateSpark(data) {
  return request({
    url: '/app/spark/update',
    method: 'post',
    data
  })
}

// 更新之前先获取表单信息
export function infoSpark(name) {
  return request({
    url: '/app/spark/info/',
    method: 'get',
    params: {
      'name': name
    }
  })
}
