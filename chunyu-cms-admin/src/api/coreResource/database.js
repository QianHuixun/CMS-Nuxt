import request from '@/utils/request'

export function pageResourceDatabase(query) {
  return request({
    url: '/resource-database/page',
    method: 'get',
    params: query
  })
}

export function getResourceDatabase(id) {
  return request({
    url: `/resource-database/${id}`,
    method: 'get'
  })
}

export function addResourceDatabase(data) {
  return request({
    url: '/resource-database',
    method: 'post',
    data
  })
}

export function updateResourceDatabase(data) {
  return request({
    url: '/resource-database',
    method: 'put',
    data
  })
}

export function deleteResourceDatabase(id) {
  return request({
    url: `/resource-database/${id}`,
    method: 'delete'
  })
}
