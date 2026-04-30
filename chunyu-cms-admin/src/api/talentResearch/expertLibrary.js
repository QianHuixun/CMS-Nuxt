import request from '@/utils/request'

export function listExpert(query) {
  return request({
    url: '/talent/expert/list',
    method: 'get',
    params: query
  })
}

export function getExpert(id) {
  return request({
    url: `/talent/expert/${id}`,
    method: 'get'
  })
}

export function addExpert(data) {
  return request({
    url: '/talent/expert',
    method: 'post',
    data
  })
}

export function updateExpert(data) {
  return request({
    url: '/talent/expert',
    method: 'put',
    data
  })
}

export function delExpert(id) {
  return request({
    url: `/talent/expert/${id}`,
    method: 'delete'
  })
}

export function changeExpertStatus(data) {
  return request({
    url: '/talent/expert/status',
    method: 'put',
    data
  })
}

export function listPaperOptions(query) {
  return request({
    url: '/talent/expert/options/paper',
    method: 'get',
    params: query
  })
}

export function listTopicOptions(query) {
  return request({
    url: '/talent/expert/options/topic',
    method: 'get',
    params: query
  })
}

export function listPatentOptions(query) {
  return request({
    url: '/talent/expert/options/patent',
    method: 'get',
    params: query
  })
}
