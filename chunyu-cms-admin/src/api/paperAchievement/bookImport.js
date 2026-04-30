import request from '@/utils/request'

export function listBook(query) {
  return request({
    url: '/paperAchievement/book/list',
    method: 'get',
    params: query
  })
}

export function getBook(id) {
  return request({
    url: `/paperAchievement/book/${id}`,
    method: 'get'
  })
}

export function addBook(data) {
  return request({
    url: '/paperAchievement/book',
    method: 'post',
    data
  })
}

export function updateBook(data) {
  return request({
    url: '/paperAchievement/book',
    method: 'put',
    data
  })
}

export function delBook(id) {
  return request({
    url: `/paperAchievement/book/${id}`,
    method: 'delete'
  })
}

export function changeBookStatus(data) {
  return request({
    url: '/paperAchievement/book/status',
    method: 'put',
    data
  })
}

export function uploadBookObject(data) {
  return request({
    url: '/paperAchievement/book/object/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      repeatSubmit: false
    }
  })
}

export function bindBookObject(data) {
  return request({
    url: '/paperAchievement/book/object/bind',
    method: 'put',
    data
  })
}

export function getBookAccessUrl(id) {
  return request({
    url: `/paperAchievement/book/${id}/access-url`,
    method: 'get'
  })
}

export function previewBookImport(data) {
  return request({
    url: '/paperAchievement/book/import/preview',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      repeatSubmit: false
    }
  })
}

export function confirmBookImport(data) {
  return request({
    url: '/paperAchievement/book/import/confirm',
    method: 'post',
    data
  })
}

export function listBookImportHistory(query) {
  return request({
    url: '/paperAchievement/book/import/history/list',
    method: 'get',
    params: query
  })
}

export function getBookImportDetails(id) {
  return request({
    url: `/paperAchievement/book/import/history/${id}`,
    method: 'get'
  })
}

export function downloadBookTemplate() {
  return request({
    url: '/paperAchievement/book/import/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportBook(query) {
  return request({
    url: '/paperAchievement/book/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
