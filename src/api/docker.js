import request from '@/utils/request'

export function getImageList(u_id, page) {
  return request({
    url: '/docker/' + page,
    method: 'get',
    params: {
      'u_id': u_id
    }
  })
}

export function RemoveImageById(image_id) {
  return request({
    url: '/docker/remove/' + image_id,
    method: 'get'
  })
}

export function PullPublic(data) {
  return request({
    url: '/docker/pullpublic',
    method: 'post',
    data
  })
}

export function CreateImageByTag(data) {
  return request({
    url: '/docker/tagadd',
    method: 'post',
    data
  })
}
export function PullPrivate(data) {
  return request({
    url: '/docker/pullprivate',
    method: 'post',
    data
  })
}

export function CreateImageById(data) {
  return request({
    url: `/docker/createimagebyid`,
    method: 'post',
    data
  })
}
