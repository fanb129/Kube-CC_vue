import request from '@/utils/request'

export function getDeployList(ns) {
  return request({
    url: '/deploy',
    method: 'get',
    params: {
      'ns': ns
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
