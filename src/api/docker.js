import request from '@/utils/request'

export function getImageList(u_id,g_id) {
  return request({
    url: '/docker',
    method: 'get',
    params: {
      'u_id': u_id,
      'g_id': g_id,
    }
  })
}

export function getOkImageList() {
  return request({
    url: '/docker/ok',
    method: 'get',
  })
}

export function deleteImageById(id) {
  return request({
    url: '/docker/delete/' + id,
    method: 'get'
  })
}

export function pullImage(data) {
  return request({
    url: '/docker/pull',
    method: 'post',
    data
  })
}

export function saveImage(data) {
  return request({
    url: '/docker/save',
    method: 'post',
    data
  })
}
export function updateImage(data) {
  return request({
    url: '/docker/update',
    method: 'post',
    data
  })
}

