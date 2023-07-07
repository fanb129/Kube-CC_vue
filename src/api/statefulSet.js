import request from '@/utils/request'

export function getStatefulSetList(u_id, ns) {
  return request({
    url: '/statefulSet',
    method: 'get',
    params: {
      'ns': ns,
      'u_id': u_id
    }
  })
}

export function deleteStatefulSet(ns, name) {
  return request({
    url: '/statefulSet/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

export function getStatefulSetYaml(name, ns) {
  return request({
    url: '/statefulSet/info',
    method: 'get',
    params: {
      'name': name,
      'ns': ns
    }
  })
}
