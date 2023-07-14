import request from '@/utils/request'

export function getDeployList(ns) {
  return request({
    url: '/app/deploy',
    method: 'get',
    params: {
      'ns': ns
    }
  })
}

export function deleteDeploy(ns, name) {
  return request({
    url: '/app/deploy/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

export function addDeploy(data) {
  return request({
    url: '/app/deploy/add',
    method: 'post',
    data
  })
}

export function updateDeploy(data) {
  return request({
    url: '/app/deploy/update',
    method: 'post',
    data
  })
}

export function infoDeploy(ns, name) {
  return request({
    url: '/app/deploy/info',
    methd: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}
