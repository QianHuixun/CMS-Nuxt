export interface ActivityHeadlineLike {
  id?: number | string
  activityId?: number | string
  isHeadline?: string | null
  sort?: number | string | null
  updateTime?: string | Date | null
}

export interface HeadlineQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  status?: string
}

export function normalizeHeadlineFlag(value: unknown) {
  return value === '1' ? '1' : '0'
}

export function getActivityStableId(activity: ActivityHeadlineLike = {}) {
  return Number(activity.id ?? activity.activityId ?? 0)
}

export function getActivityUpdateTime(activity: ActivityHeadlineLike = {}) {
  const timestamp = activity.updateTime ? new Date(activity.updateTime).getTime() : 0
  return Number.isFinite(timestamp) ? timestamp : 0
}

export function compareActivitiesHeadlineFirst(a: ActivityHeadlineLike = {}, b: ActivityHeadlineLike = {}) {
  const headlineDiff = Number(normalizeHeadlineFlag(b.isHeadline)) - Number(normalizeHeadlineFlag(a.isHeadline))
  if (headlineDiff !== 0) return headlineDiff

  const sortDiff = Number(a.sort ?? 0) - Number(b.sort ?? 0)
  if (sortDiff !== 0) return sortDiff

  const updateTimeDiff = getActivityUpdateTime(b) - getActivityUpdateTime(a)
  if (updateTimeDiff !== 0) return updateTimeDiff

  return getActivityStableId(b) - getActivityStableId(a)
}

export function buildHeadlineActivityQuery(query: HeadlineQuery = {}) {
  const keyword = typeof query.keyword === 'string' ? query.keyword.trim() : ''

  return {
    pageNum: Number(query.pageNum || 1),
    pageSize: Number(query.pageSize || 10),
    isHeadline: '1',
    ...(keyword ? { keyword } : {}),
    ...(query.status ? { status: query.status } : {})
  }
}
