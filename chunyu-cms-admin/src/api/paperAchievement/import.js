import request from '@/utils/request'

export function downloadImportTemplate(type) {
  return request({
    url: '/import/template',
    method: 'get',
    params: { type },
    responseType: 'blob'
  })
}

export function previewImport(formData) {
  return request({
    url: '/import/preview',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      repeatSubmit: false
    }
  })
}

export function confirmImport(data) {
  return request({
    url: '/import/confirm',
    method: 'post',
    data,
    headers: {
      repeatSubmit: false
    }
  })
}
