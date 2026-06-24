const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function request(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`
  const res = await fetch(fullUrl, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch (e) {
    const preview = text.trim().slice(0, 80)
    throw new Error(`接口返回非 JSON: ${fullUrl}${preview ? ` (${preview})` : ''}`)
  }
  if (!json || typeof json !== 'object') {
    throw new Error(`接口返回为空: ${fullUrl}`)
  }
  if (json.code !== 200) {
    throw new Error(json.message || '请求失败')
  }
  return json.data
}

export const get = (url, params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v))
  })
  const qs = query.toString()
  return request(qs ? `${url}?${qs}` : url)
}

export default request
