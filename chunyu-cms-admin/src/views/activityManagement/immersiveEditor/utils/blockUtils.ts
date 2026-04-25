export type BlockType = 'text' | 'image' | 'table' | 'video'

export type BlockDirection = 'up' | 'down'

export interface BlockConfig {
  [key: string]: any
}

export interface BlockItem {
  id: string
  type: BlockType
  sort: number
  bgColor: string
  padding: number
  content: any
  config: BlockConfig
  tableData?: string
  [key: string]: any
}

export interface BlockOperationResult {
  blocks: BlockItem[]
  selectedBlockId: string | null
}

export interface AddBlockResult extends BlockOperationResult {
  addedBlock: BlockItem
}

export interface RemoveBlockResult extends BlockOperationResult {
  removedBlock: BlockItem | null
}

export interface UpdateBlockResult extends BlockOperationResult {
  updatedBlock: BlockItem | null
}

export function createTableMatrix(rows: number, cols: number) {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => (rowIndex === 0 ? `表头${colIndex + 1}` : `内容${rowIndex}-${colIndex + 1}`))
  )
}

export function normalizeTable(content: any, rows: number, cols: number) {
  const safeRows = Number(rows || 2)
  const safeCols = Number(cols || 1)
  return Array.from({ length: safeRows }, (_, rowIndex) =>
    Array.from({ length: safeCols }, (_, colIndex) => {
      const value = Array.isArray(content?.[rowIndex]) ? content[rowIndex][colIndex] : undefined
      if (value !== undefined && value !== null && value !== '') return value
      return rowIndex === 0 ? `表头${colIndex + 1}` : ''
    })
  )
}

function createBlockId() {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function createBaseConfig(type: BlockType) {
  if (type === 'text') {
    return { fontSize: 16, color: '#223047', align: 'left', bold: false, italic: false, lineHeight: '1.8' }
  }

  if (type === 'image') {
    return { width: 100, borderRadius: 16, alt: '', align: 'center' }
  }

  if (type === 'table') {
    return { rows: 4, cols: 3, headerBgColor: '#f3f6fb', borderColor: '#d7dfeb', striped: true }
  }

  return { title: '', cover: '', coverTime: 0.1, autoplay: false, loop: false, controls: true, uploadStatus: 'idle' }
}

function createBaseContent(type: BlockType, config: BlockConfig) {
  if (type === 'text') {
    return '<p>请输入正文内容</p>'
  }

  if (type === 'table') {
    return createTableMatrix(config.rows, config.cols)
  }

  return ''
}

export function createDefaultBlock(type: BlockType, sort = 0): BlockItem {
  const config = createBaseConfig(type)
  return {
    id: createBlockId(),
    type,
    sort,
    bgColor: '#ffffff',
    padding: 20,
    content: createBaseContent(type, config),
    config
  }
}

export function normalizeBlock(block: Partial<BlockItem> & { type?: BlockType }, index: number): BlockItem {
  const type = (block.type || 'text') as BlockType
  const fallback = createDefaultBlock(type, index)
  const nextBlock: BlockItem = {
    ...fallback,
    ...block,
    sort: index,
    config: {
      ...fallback.config,
      ...(block.config || {})
    }
  }

  if (nextBlock.type === 'table') {
    const legacyTable =
      typeof block.tableData === 'string'
        ? block.tableData.split('\n').map((line) => line.split(',').map((cell) => cell.trim()))
        : null
    nextBlock.content = normalizeTable(Array.isArray(block.content) ? block.content : legacyTable, nextBlock.config.rows, nextBlock.config.cols)
  }

  if (nextBlock.type !== 'table' && Array.isArray(nextBlock.content)) {
    nextBlock.content = ''
  }

  return nextBlock
}

function normalizeBlocks(blocks: BlockItem[]) {
  return blocks.map((block, index) => normalizeBlock(block, index))
}

export function getBlockById(blocks: BlockItem[], blockId?: string | null) {
  if (!blockId) return null
  return blocks.find((block) => block.id === blockId) || null
}

export function addBlock(blocks: BlockItem[], type: BlockType, index = blocks.length, selectedBlockId: string | null = null): AddBlockResult {
  const nextBlocks = [...blocks]
  const insertIndex = Math.max(0, Math.min(index, nextBlocks.length))
  const addedBlock = createDefaultBlock(type, insertIndex)
  nextBlocks.splice(insertIndex, 0, addedBlock)

  return {
    blocks: normalizeBlocks(nextBlocks),
    selectedBlockId: addedBlock.id,
    addedBlock
  }
}

export function removeBlock(blocks: BlockItem[], blockId: string, selectedBlockId: string | null = null): RemoveBlockResult {
  const removeIndex = blocks.findIndex((block) => block.id === blockId)
  if (removeIndex === -1) {
    return {
      blocks: normalizeBlocks([...blocks]),
      selectedBlockId,
      removedBlock: null
    }
  }

  const removedBlock = blocks[removeIndex]
  const nextBlocks = [...blocks]
  nextBlocks.splice(removeIndex, 1)
  const normalizedBlocks = normalizeBlocks(nextBlocks)

  let nextSelectedBlockId = selectedBlockId
  if (selectedBlockId === blockId) {
    nextSelectedBlockId = normalizedBlocks[removeIndex]?.id || normalizedBlocks[removeIndex - 1]?.id || null
  }

  return {
    blocks: normalizedBlocks,
    selectedBlockId: nextSelectedBlockId,
    removedBlock
  }
}

export function updateBlock(
  blocks: BlockItem[],
  blockId: string,
  patch: Partial<BlockItem> & { config?: BlockConfig },
  selectedBlockId: string | null = null
): UpdateBlockResult {
  let updatedBlock: BlockItem | null = null

  const normalizedBlocks = normalizeBlocks(
    blocks.map((block) => {
      if (block.id !== blockId) return block

      updatedBlock = normalizeBlock(
        {
          ...block,
          ...patch,
          config: patch.config ? { ...block.config, ...patch.config } : block.config
        },
        block.sort
      )

      return updatedBlock
    })
  )

  return {
    blocks: normalizedBlocks,
    selectedBlockId,
    updatedBlock
  }
}

export function moveBlock(
  blocks: BlockItem[],
  index: number,
  direction: BlockDirection,
  selectedBlockId: string | null = null
): BlockOperationResult {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || index >= blocks.length || targetIndex < 0 || targetIndex >= blocks.length) {
    return {
      blocks: normalizeBlocks([...blocks]),
      selectedBlockId
    }
  }

  const nextBlocks = [...blocks]
  const temp = nextBlocks[index]
  nextBlocks[index] = nextBlocks[targetIndex]
  nextBlocks[targetIndex] = temp

  return {
    blocks: normalizeBlocks(nextBlocks),
    selectedBlockId
  }
}
