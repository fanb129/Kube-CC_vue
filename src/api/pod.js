import request from '@/utils/request'

export function getPodList(u_id,ns) {
  return request({
    url: '/pod',
    method: 'get',
    params: {
      'u_id': u_id,
      'ns': ns
    }
  })
}

export function deletePod(ns, name) {
  return request({
    url: '/pod/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

export function getPodYaml(name,ns){
  return request({
    url: '/pod/info',
    method: 'get',
    params: {
      'name': name,
      'ns': ns
    }
  })
}
