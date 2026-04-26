import request from '@/utils/request'

export function pageBookSimulation(query) {
  return request({
    url: '/book-simulation/page',
    method: 'get',
    params: query
  })
}

export function getBookSimulationDetail(id) {
  return request({
    url: `/book-simulation/${id}`,
    method: 'get'
  })
}

export function addBookSimulation(data) {
  return request({
    url: '/book-simulation',
    method: 'post',
    data
  })
}

export function updateBookSimulation(data) {
  return request({
    url: '/book-simulation',
    method: 'put',
    data
  })
}

export function deleteBookSimulation(id) {
  return request({
    url: `/book-simulation/${id}`,
    method: 'delete'
  })
}
