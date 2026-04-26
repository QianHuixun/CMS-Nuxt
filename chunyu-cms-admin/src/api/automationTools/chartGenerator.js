import request from '@/utils/request'

export function getPaperYearlyCountStatistics() {
  return request({
    url: '/paper/statistics/yearly-count',
    method: 'get'
  })
}
