import mockModules from '../mock/index.js'

function parseRequest(input) {
  const rawUrl = typeof input === 'string' ? input : input.url
  const parsedUrl = new URL(rawUrl, window.location.origin)
  return {
    rawUrl,
    pathname: parsedUrl.pathname,
    query: Object.fromEntries(parsedUrl.searchParams.entries()),
  }
}

function matchRoute(pattern, pathname) {
  const routeParts = pattern.replace(/\/+$/, '').split('/').filter(Boolean)
  const pathParts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  if (routeParts.length !== pathParts.length) return null

  const params = {}
  for (let index = 0; index < routeParts.length; index += 1) {
    const routePart = routeParts[index]
    const pathPart = pathParts[index]
    if (routePart.startsWith(':')) {
      params[routePart.slice(1)] = decodeURIComponent(pathPart)
    } else if (routePart !== pathPart) {
      return null
    }
  }
  return params
}

export function setupProdMockServer() {
  const originalFetch = window.fetch

  window.fetch = async function mockFetch(input, init = {}) {
    const { rawUrl, pathname, query } = parseRequest(input)
    const requestMethod = typeof input === 'string' ? undefined : input.method
    const method = (init.method || requestMethod || 'GET').toLowerCase()
    let routeParams = {}

    const matched = mockModules.find((item) => {
      const itemMethod = (item.method || 'get').toLowerCase()
      if (itemMethod !== method) return false
      const params = matchRoute(item.url, pathname)
      if (!params) return false
      routeParams = params
      return true
    })

    if (!matched) {
      return originalFetch(input, init)
    }

    const rawResponse = typeof matched.response === 'function'
      ? matched.response({ url: rawUrl, params: routeParams, query, method, body: init.body })
      : matched.response

    return new Response(JSON.stringify(rawResponse), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
