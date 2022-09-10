import request from '@/utils/request'

export function getDeployList(u_id,ns) {
  return request({
    url: '/deploy',
    method: 'get',
    params: {
      'ns': ns,
      'u_id': u_id
    }
  })
}

export function deleteDeploy(ns, name) {
  return request({
    url: '/deploy/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}
