import request from '@/utils/request'

export function pageScreenSaverConfig(query) {
  return request({
    url: '/screensaver-config/page',
    method: 'get',
    params: query
  })
}

export function getScreenSaverConfig(id) {
  return request({
    url: `/screensaver-config/${id}`,
    method: 'get'
  })
}

export function addScreenSaverConfig(data) {
  return request({
    url: '/screensaver-config',
    method: 'post',
    data
  })
}

export function updateScreenSaverConfig(data) {
  return request({
    url: '/screensaver-config',
    method: 'put',
    data
  })
}

export function deleteScreenSaverConfig(id) {
  return request({
    url: `/screensaver-config/${id}`,
    method: 'delete'
  })
}
