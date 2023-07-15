import request from '@/utils/request'

export function getJobList(u_id, ns) {
  return request({
    url: '/job',
    method: 'get',
    params: {
      'ns': ns,
      'u_id': u_id
    }
  })
}

