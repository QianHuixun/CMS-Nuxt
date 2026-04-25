import { describe, expect, it } from 'vitest'
import { buildSceneContentPayload, normalizeScene, parseSceneBlocks } from './scenePersistence'

describe('scenePersistence', () => {
  it('normalizeScene maps backend camelCase fields to frontend snake_case fields', () => {
    const scene = normalizeScene({
      activityId: 12,
      name: 'test scene',
      contentBlocks: '[{"id":"block_1"}]',
      contentHtml: '<p>hello</p>'
    })

    expect(scene.id).toBe(12)
    expect(scene.activityId).toBe(12)
    expect(scene.content_blocks).toBe('[{"id":"block_1"}]')
    expect(scene.content_html).toBe('<p>hello</p>')
  })

  it('normalizeScene keeps existing snake_case fields unchanged', () => {
    const scene = normalizeScene({
      id: 9,
      activityId: 12,
      content_blocks: '[1]',
      content_html: '<p>saved</p>'
    })

    expect(scene.id).toBe(9)
    expect(scene.activityId).toBe(12)
    expect(scene.content_blocks).toBe('[1]')
    expect(scene.content_html).toBe('<p>saved</p>')
  })

  it('parseSceneBlocks returns parsed array for valid json array', () => {
    expect(parseSceneBlocks('[{"id":"block_1"},{"id":"block_2"}]')).toEqual([
      { id: 'block_1' },
      { id: 'block_2' }
    ])
  })

  it('parseSceneBlocks returns empty array for invalid json or non-array content', () => {
    expect(parseSceneBlocks('{"id":"block_1"}')).toEqual([])
    expect(parseSceneBlocks('not-json')).toEqual([])
    expect(parseSceneBlocks('')).toEqual([])
  })

  it('buildSceneContentPayload builds persistence payload from scene and blocks', () => {
    const payload = buildSceneContentPayload(
      { id: 7, activityId: 8 },
      [{ id: 'block_1', type: 'text' }],
      '<p>rich text</p>'
    )

    expect(payload).toEqual({
      id: 7,
      activityId: 8,
      content_blocks: '[{"id":"block_1","type":"text"}]',
      content_html: '<p>rich text</p>'
    })
  })

  it('buildSceneContentPayload falls back to id when activityId is missing', () => {
    const payload = buildSceneContentPayload(
      { id: 15 },
      [],
      ''
    )

    expect(payload.activityId).toBe(15)
    expect(payload.id).toBe(15)
    expect(payload.content_blocks).toBe('[]')
  })
})
