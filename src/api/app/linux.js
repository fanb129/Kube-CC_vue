import request from '@/utils/request'

export function getLinuxList(ns, os) {
  return request({
    url: '/app/linux',
    methd: 'get',
    params: {
      'ns': ns,
      'os': os
    }
  })
}

export function deleteLinux(ns,name) {
  return request({
    url: '/app/linux/delete/',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

export function addLinux(data) {
  return request({
    url: '/app/linux/add',
    method: 'post',
    data
  })
}

export function updateLinux(data) {
  return request({
    url: '/app/linux/update',
    method: 'post',
    data
  })
}

export function infoLinux(ns, name) {
  return request({
    url: '/app/linux/info',
    methd: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}
