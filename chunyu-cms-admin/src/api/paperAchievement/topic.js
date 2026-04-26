import request from '@/utils/request'

export function pageTopic(query) {
  return request({
    url: '/topic/page',
    method: 'get',
    params: query
  })
}

export function getTopicDetail(id) {
  return request({
    url: `/topic/${id}`,
    method: 'get'
  })
}

export function addTopic(data) {
  return request({
    url: '/topic',
    method: 'post',
    data
  })
}

export function updateTopic(data) {
  return request({
    url: '/topic',
    method: 'put',
    data
  })
}

export function deleteTopic(id) {
  return request({
    url: `/topic/${id}`,
    method: 'delete'
  })
}
