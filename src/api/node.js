import request from '@/utils/request'

export function getNodeList() {
  return request({
    url: '/node',
    methd: 'get'
  })
}
