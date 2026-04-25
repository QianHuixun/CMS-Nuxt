import { describe, expect, it } from 'vitest'
import { buildHeadlineActivityQuery, compareActivitiesHeadlineFirst, normalizeHeadlineFlag } from './headline'

describe('activity headline utils', () => {
  it('normalizes headline flag to project convention', () => {
    expect(normalizeHeadlineFlag('1')).toBe('1')
    expect(normalizeHeadlineFlag('0')).toBe('0')
    expect(normalizeHeadlineFlag(undefined)).toBe('0')
    expect(normalizeHeadlineFlag(true)).toBe('0')
  })

  it('builds headline query with forced isHeadline filter', () => {
    expect(buildHeadlineActivityQuery({ pageNum: 2, pageSize: 20, keyword: '  中医药  ' })).toEqual({
      pageNum: 2,
      pageSize: 20,
      keyword: '中医药',
      isHeadline: '1'
    })
  })

  it('sorts activities with headline first and uses sort/updateTime/id as fallback', () => {
    const rows = [
      { id: 1, isHeadline: '0', sort: 0, updateTime: '2026-04-20 10:00:00' },
      { id: 2, isHeadline: '1', sort: 3, updateTime: '2026-04-18 10:00:00' },
      { id: 3, isHeadline: '1', sort: 1, updateTime: '2026-04-19 10:00:00' },
      { id: 4, isHeadline: '1', sort: 1, updateTime: '2026-04-21 10:00:00' },
      { id: 5, isHeadline: '1', sort: 1, updateTime: '2026-04-21 10:00:00' }
    ]

    expect(rows.sort(compareActivitiesHeadlineFirst).map(item => item.id)).toEqual([5, 4, 3, 2, 1])
  })
})
