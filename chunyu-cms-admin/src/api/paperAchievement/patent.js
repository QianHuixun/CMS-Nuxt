import request from '@/utils/request'

export function listPatent() {
  return request({
    url: '/patent/list',
    method: 'get'
  })
}

export function pagePatent(query) {
  return request({
    url: '/patent/page',
    method: 'get',
    params: query
  })
}

export function getPatentDetail(id) {
  return request({
    url: `/patent/${id}`,
    method: 'get'
  })
}

export function addPatent(data) {
  return request({
    url: '/patent',
    method: 'post',
    data
  })
}

export function updatePatent(data) {
  return request({
    url: '/patent',
    method: 'put',
    data
  })
}

export function deletePatent(id) {
  return request({
    url: `/patent/${id}`,
    method: 'delete'
  })
}
