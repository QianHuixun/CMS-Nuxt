import request from '@/utils/request'

export function pageTalent(query) {
  return request({
    url: '/talent/page',
    method: 'get',
    params: query
  })
}

export function getTalentDetail(id) {
  return request({
    url: `/talent/${id}`,
    method: 'get'
  })
}

export function addTalent(data) {
  return request({
    url: '/talent',
    method: 'post',
    data
  })
}

export function updateTalent(data) {
  return request({
    url: '/talent',
    method: 'put',
    data
  })
}

export function deleteTalent(id) {
  return request({
    url: `/talent/${id}`,
    method: 'delete'
  })
}
