export function safeBack(router, fallback = '/home') {
  const previousRoute = window.history.state?.back
  if (previousRoute) {
    router.back()
    return
  }
  router.push(fallback)
}
