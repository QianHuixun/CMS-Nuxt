import request from '@/utils/request'

export function pageResearchTool(query) {
  return request({
    url: '/research-tool/page',
    method: 'get',
    params: query
  })
}

export function getResearchTool(id) {
  return request({
    url: `/research-tool/${id}`,
    method: 'get'
  })
}

export function addResearchTool(data) {
  return request({
    url: '/research-tool',
    method: 'post',
    data
  })
}

export function updateResearchTool(data) {
  return request({
    url: '/research-tool',
    method: 'put',
    data
  })
}

export function deleteResearchTool(id) {
  return request({
    url: `/research-tool/${id}`,
    method: 'delete'
  })
}
