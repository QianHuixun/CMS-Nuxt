export interface SceneLike {
  id?: number | string
  activityId?: number | string
  content_blocks?: string
  contentBlocks?: string
  content_html?: string
  contentHtml?: string
  [key: string]: any
}

export interface SceneContentPayload {
  id: number | string
  activityId: number | string
  content_blocks: string
  content_html: string
}

export function normalizeScene(scene: SceneLike = {}) {
  return {
    ...scene,
    id: scene.id ?? scene.activityId,
    activityId: scene.activityId ?? scene.id,
    content_blocks: scene.content_blocks ?? scene.contentBlocks ?? '',
    content_html: scene.content_html ?? scene.contentHtml ?? ''
  }
}

export function parseSceneBlocks(contentBlocks: string | null | undefined) {
  if (!contentBlocks) return []

  try {
    const parsed = JSON.parse(contentBlocks)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function buildSceneContentPayload(scene: SceneLike, blocks: unknown[], htmlContent = ''): SceneContentPayload {
  const normalizedScene = normalizeScene(scene)

  return {
    id: normalizedScene.id as number | string,
    activityId: (normalizedScene.activityId ?? normalizedScene.id) as number | string,
    content_blocks: JSON.stringify(blocks),
    content_html: htmlContent
  }
}
