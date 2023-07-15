import request from '@/utils/request'

// 查询SysLoginlog列表
export function listSysLoginlog(query) {
  return request({
    url: '/api/v1/sys_login_log',
    method: 'get',
    params: query
  })
}

// 查询SysLoginlog详细
export function getSysLoginlog(ID) {
  return request({
    url: '/api/v1/sys_login_log/' + ID,
    method: 'get'
  })
}

// 删除SysLoginlog
export function delSysLoginlog(data) {
  return request({
    url: '/api/v1/sys_login_log',
    method: 'delete',
    data: data
  })
}

