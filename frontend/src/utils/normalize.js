/**
 * 将可能为字符串或数组的值统一为数组
 * @param {any} value - 原始值
 * @param {string|RegExp} [separator=/[,;；、\s]+/] - 字符串分隔符
 */
export function normalizeList(value, separator = /[,;；、\s]+/) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') return value.split(separator).map(s => s.trim()).filter(Boolean)
  return []
}

/**
 * 规范化文本值：去空、去占位符 '/'
 * @param {any} value
 */
export function normalizeText(value) {
  const text = String(value ?? '').trim()
  return text && text !== '/' ? text : ''
}

/**
 * 判断 URL 是否为 PDF
 * @param {string} [url='']
 */
export function isPdfUrl(url = '') {
  return /\.pdf($|[?#])/i.test(url)
}

/**
 * 判断 URL 是否为可预览文件
 * @param {string} [url='']
 */
export function isPreviewUrl(url = '') {
  return /\.(pdf|png|jpe?g|gif|webp|bmp|svg)($|[?#])/i.test(url)
}

/**
 * 从附件列表中提取第一个匹配的 URL
 * @param {Array} attachments
 * @param {(url: string) => boolean} checker
 */
function pickAttachmentUrl(attachments, checker) {
  const file = (Array.isArray(attachments) ? attachments : []).find(item => {
    const url = item?.url || item?.fileUrl || item?.downloadUrl || ''
    const name = item?.name || ''
    return checker(url) || checker(name)
  })
  return file?.url || file?.fileUrl || file?.downloadUrl || ''
}

/**
 * 从 data 对象中提取可预览的 URL（检查直接字段 + attachments）
 * 查找优先级：previewUrl > pdfUrl > fileUrl > downloadUrl > url > coverImage > attachments
 * @param {object} data
 */
export function getPreviewUrl(data) {
  if (!data) return ''
  const directUrl = data.previewUrl || data.pdfUrl || data.fileUrl || data.downloadUrl || data.url || data.coverImage
  if (directUrl && isPreviewUrl(directUrl)) return directUrl
  const attachmentUrl = pickAttachmentUrl(data.attachments, isPreviewUrl)
  return attachmentUrl && isPreviewUrl(attachmentUrl) ? attachmentUrl : ''
}

/**
 * 从 data 对象中提取 PDF URL（检查直接字段 + attachments）
 * @param {object} data
 */
export function getPdfUrl(data) {
  if (!data) return ''
  const directUrl = data.pdfUrl || data.fileUrl || data.downloadUrl || data.url
  if (directUrl && isPdfUrl(directUrl)) return directUrl
  const attachmentUrl = pickAttachmentUrl(data.attachments, isPdfUrl)
  return attachmentUrl && isPdfUrl(attachmentUrl) ? attachmentUrl : ''
}
