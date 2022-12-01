import request from '@/utils/request'

export function getNodeList() {
  return request({
    url: '/node',
    methd: 'get'
  })
}
export function deleteNode(node) {
  return request({
    url: '/node/delete/' + node,
    method: 'get'
  })
}
export function addNode(data) {
  return request({
    url: '/node/add',
    method: 'post',
    data
  })
}

