import request from '@/utils/request'

export function applyYaml(data) {
  return request({
    url: '/yaml/apply',
    method: 'post',
    data
  })
}

export function createYaml(data) {
  return request({
    url: '/yaml/create',
    method: 'post',
    data
  })
}

// export function getYaml(data) {
//   return request({
//     url: '/yaml/apply',
//     method: 'post',
//     data
//   })
// }
