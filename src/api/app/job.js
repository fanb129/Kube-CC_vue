import request from '@/utils/request'

export function getJobList(ns) {
  return request({
    url: 'app//job',
    method: 'get',
    params: {
      'ns': ns,
    }
  })
}

export function addJob(data) {
  return request({
    url: '/app/job/add',
    method: 'post',
    data
  })
}

export function infoJob(ns, name) {
  return request({
    url: '/app/job/info',
    methd: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

export function deleteJob(ns, name) {
  return request({
    url: '/app/job/delete',
    method: 'get',
    params: {
      'ns': ns,
      'name': name
    }
  })
}

