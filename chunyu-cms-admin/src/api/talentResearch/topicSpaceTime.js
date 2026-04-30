import request from '@/utils/request'

export function listTopic(query) {
  return request({
    url: '/talent/topic/list',
    method: 'get',
    params: query
  })
}

export function getTopic(id) {
  return request({
    url: `/talent/topic/${id}`,
    method: 'get'
  })
}

export function addTopic(data) {
  return request({
    url: '/talent/topic',
    method: 'post',
    data
  })
}

export function updateTopic(data) {
  return request({
    url: '/talent/topic',
    method: 'put',
    data
  })
}

export function delTopic(id) {
  return request({
    url: `/talent/topic/${id}`,
    method: 'delete'
  })
}

export function changeTopicStatus(data) {
  return request({
    url: '/talent/topic/status',
    method: 'put',
    data
  })
}

export function getTopicStats() {
  return request({
    url: '/talent/topic/stats',
    method: 'get'
  })
}
