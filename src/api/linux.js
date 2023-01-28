import request from '@/utils/request'

export function getLinuxList(u_id,os) {
  return request({
    url: '/linux',
    methd: 'get',
    params: {
      'u_id': u_id,
      'os': os
    }
  })
}

export function deleteLinux(name) {
  return request({
    url: '/linux/delete/' + name,
    method: 'get'
  })
}

export function addLinux(data) {
  return request({
    url: '/linux/add',
    method: 'post',
    data
  })
}

export function updateLinux(data) {
  return request({
    url: '/linux/update',
    method: 'post',
    data
  })
}
