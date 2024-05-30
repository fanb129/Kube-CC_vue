import request from '@/utils/request'

export function getStatefulSetList(ns) {
  return request({
    url: '/app/statefulSet',
    method: 'get',
    params: {
      'ns': ns
    }
  })
}

export function deleteStatefulSet(ns, name) {
  return request({
    url: '/app/statefulSet/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

export function addStatefulSet(data) {
  return request({
    url: '/app/statefulSet/add',
    method: 'post',
    data
  })
}

export function updateStatefulSet(data) {
  return request({
    url: '/app/statefulSet/update',
    method: 'post',
    data
  })
}

export function infoStatefulSet(ns, name) {
  return request({
    url: '/app/statefulSet/info',
    methd: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}
