import request from '@/utils/request'

export function listPapers() {
  return request({
    url: '/paper/list',
    method: 'get'
  })
}

export function getPaper(id) {
  return request({
    url: `/paper/${id}`,
    method: 'get'
  })
}

export function getPaperKeywords(id) {
  return request({
    url: `/paper/${id}/keywords`,
    method: 'get'
  })
}

export function updatePaperKeywords(id, data) {
  return request({
    url: `/paper/${id}/keywords`,
    method: 'put',
    data
  })
}

export function getPaperKeywordCloud() {
  return request({
    url: '/paper/keywords/cloud',
    method: 'get'
  })
}
