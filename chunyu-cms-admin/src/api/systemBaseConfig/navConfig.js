import request from '@/utils/request'

export function pageNavConfig(query) {
  return request({
    url: '/nav-config/page',
    method: 'get',
    params: query
  })
}

export function getNavConfig(id) {
  return request({
    url: `/nav-config/${id}`,
    method: 'get'
  })
}

export function addNavConfig(data) {
  return request({
    url: '/nav-config',
    method: 'post',
    data
  })
}

export function updateNavConfig(data) {
  return request({
    url: '/nav-config',
    method: 'put',
    data
  })
}

export function deleteNavConfig(id) {
  return request({
    url: `/nav-config/${id}`,
    method: 'delete'
  })
}
