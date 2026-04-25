import { describe, expect, it } from 'vitest'
import {
  addBlock,
  createDefaultBlock,
  getBlockById,
  moveBlock,
  removeBlock,
  updateBlock
} from './blockUtils'

function createSeedBlocks() {
  return ['text', 'image', 'video'].map((type, index) => {
    const block = createDefaultBlock(type as 'text' | 'image' | 'video', index)
    block.id = `block_${index + 1}`
    return block
  })
}

describe('blockUtils', () => {
  it('createDefaultBlock creates a text block with defaults', () => {
    const block = createDefaultBlock('text', 2)

    expect(block.type).toBe('text')
    expect(block.sort).toBe(2)
    expect(block.padding).toBe(20)
    expect(block.bgColor).toBe('#ffffff')
    expect(block.content).toContain('请输入正文内容')
    expect(block.config).toMatchObject({
      fontSize: 16,
      color: '#223047',
      align: 'left'
    })
  })

  it('addBlock inserts a block and selects it', () => {
    const blocks = createSeedBlocks()
    const result = addBlock(blocks, 'table', 1, blocks[0].id)

    expect(result.blocks).toHaveLength(4)
    expect(result.blocks[1].type).toBe('table')
    expect(result.selectedBlockId).toBe(result.addedBlock.id)
    expect(result.blocks.map((block) => block.sort)).toEqual([0, 1, 2, 3])
  })

  it('removeBlock deletes target block', () => {
    const blocks = createSeedBlocks()
    const result = removeBlock(blocks, 'block_2', 'block_1')

    expect(result.blocks).toHaveLength(2)
    expect(result.removedBlock?.id).toBe('block_2')
    expect(result.blocks.find((block) => block.id === 'block_2')).toBeUndefined()
    expect(result.selectedBlockId).toBe('block_1')
  })

  it('removeBlock updates selectedBlockId to next block when selected block is removed', () => {
    const blocks = createSeedBlocks()
    const result = removeBlock(blocks, 'block_2', 'block_2')

    expect(result.selectedBlockId).toBe('block_3')
  })

  it('removeBlock updates selectedBlockId to previous block when removing last selected block', () => {
    const blocks = createSeedBlocks()
    const result = removeBlock(blocks, 'block_3', 'block_3')

    expect(result.selectedBlockId).toBe('block_2')
  })

  it('removeBlock clears selectedBlockId when deleting the only selected block', () => {
    const block = createDefaultBlock('text', 0)
    block.id = 'single'

    const result = removeBlock([block], 'single', 'single')

    expect(result.blocks).toEqual([])
    expect(result.selectedBlockId).toBeNull()
  })

  it('updateBlock merges patch and nested config', () => {
    const blocks = createSeedBlocks()
    const result = updateBlock(blocks, 'block_2', {
      content: '/uploads/example.jpg',
      config: {
        alt: 'example image',
        width: 80
      }
    }, 'block_2')

    const updatedBlock = getBlockById(result.blocks, 'block_2')
    expect(updatedBlock?.content).toBe('/uploads/example.jpg')
    expect(updatedBlock?.config).toMatchObject({
      alt: 'example image',
      width: 80,
      borderRadius: 16
    })
    expect(result.selectedBlockId).toBe('block_2')
  })

  it('moveBlock swaps blocks and keeps selectedBlockId', () => {
    const blocks = createSeedBlocks()
    const result = moveBlock(blocks, 2, 'up', 'block_3')

    expect(result.blocks.map((block) => block.id)).toEqual(['block_1', 'block_3', 'block_2'])
    expect(result.blocks.map((block) => block.sort)).toEqual([0, 1, 2])
    expect(result.selectedBlockId).toBe('block_3')
  })

  it('getBlockById returns block by id and null for missing id', () => {
    const blocks = createSeedBlocks()

    expect(getBlockById(blocks, 'block_1')?.id).toBe('block_1')
    expect(getBlockById(blocks, 'missing')).toBeNull()
    expect(getBlockById(blocks, null)).toBeNull()
  })
})
