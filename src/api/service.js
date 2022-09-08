import request from '@/utils/request'

export function getServiceList(ns) {
  return request({
    url: '/service',
    method: 'get',
    params: {
      'ns': ns
    }
  })
}

export function deleteService(ns, name) {
  return request({
    url: '/service/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}
