import request from '@/utils/request'

export function getServiceList(u_id,ns) {
  return request({
    url: '/service',
    method: 'get',
    params: {
      'u_id': u_id,
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

export function getServiceYaml(name,ns){
  return request({
    url: '/service/info',
    method: 'get',
    params: {
      'name': name,
      'ns': ns
    }
  })
}
