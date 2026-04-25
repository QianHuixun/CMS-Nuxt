import request from '@/utils/request'

// 获取活动列表
export function listActivity(query) {
  return request({
    url: '/activity/list',
    method: 'get',
    params: query
  })
}

// 查询活动详情
export function getActivity(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

// 新增活动
export function addActivity(data) {
  return request({
    url: '/activity',
    method: 'post',
    data
  })
}

// 修改活动
export function updateActivity(data) {
  return request({
    url: '/activity',
    method: 'put',
    data
  })
}

// 删除活动
export function delActivity(id) {
  return request({
    url: `/activity/${id}`,
    method: 'delete'
  })
}

// 获取活动内容块列表
export function listActivityContent(id) {
  return request({
    url: `/activity/${id}/content`,
    method: 'get'
  })
}

// 保存活动内容块
export function saveActivityContent(id, data) {
  return request({
    url: `/activity/${id}/content`,
    method: 'post',
    data
  })
}

// 获取场景列表
export function listScene(query) {
  return request({
    url: '/activity/scene/list',
    method: 'get',
    params: query
  })
}

// 新增场景
export function addScene(data) {
  return request({
    url: '/activity/scene',
    method: 'post',
    data
  })
}

// 修改场景
export function updateScene(data) {
  return request({
    url: '/activity/scene',
    method: 'put',
    data
  })
}

// 删除场景
export function delScene(id) {
  return request({
    url: `/activity/scene/${id}`,
    method: 'delete'
  })
}
