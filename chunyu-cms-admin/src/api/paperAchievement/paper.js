import request from '@/utils/request'

export function listPaper() {
  return request({
    url: '/paper/list',
    method: 'get'
  })
}

export function pagePaper(query) {
  return request({
    url: '/paper/page',
    method: 'get',
    params: query
  })
}

export function getPaperDetail(id) {
  return request({
    url: `/paper/${id}`,
    method: 'get'
  })
}

export function addPaper(data) {
  return request({
    url: '/paper',
    method: 'post',
    data
  })
}

export function updatePaper(data) {
  return request({
    url: '/paper',
    method: 'put',
    data
  })
}

export function deletePaper(id) {
  return request({
    url: `/paper/${id}`,
    method: 'delete'
  })
}

export function updatePaperFeatured(id, data) {
  return request({
    url: `/paper/${id}/featured`,
    method: 'put',
    data
  })
}
