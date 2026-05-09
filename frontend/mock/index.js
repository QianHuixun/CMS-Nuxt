const wrap = (data) => ({ code: 200, message: 'success', data })

const databases = [
  {
    id: 'db_tianhui',
    title: '天回医简数据库',
    status: 'active',
    info: '汇聚天回汉墓出土医简高清图像、释文、注释、单字切分图像与检索数据。',
    url: 'https://example.edu/databases/tianhui',
    icon: 'database',
    sort: 1,
    backimg: 'https://example.edu/databases/xx.img'
  },
  {
    id: 'db_bashu',
    title: '巴蜀古籍医籍数据库',
    status: 'active',
    info: '收录巴蜀地区历代中医古籍文献，支持全文检索与图像对照。',
    url: 'https://example.edu/databases/bashu',
    icon: 'book',
    sort: 2,
    backimg: 'https://example.edu/databases/bashu.img'
  },
  {
    id: 'db_wanjuan',
    title: '万卷华章数据库',
    status: 'active',
    info: '整合出土医学文献与传世医籍，构建多维度知识关联。',
    url: 'https://example.edu/databases/wanjuan',
    icon: 'scroll',
    sort: 3,
    backimg: 'https://example.edu/databases/wanjuan.img'
  }
]

const tools = [
  {
    id: 'tool_annotation',
    title: '出土医学文献标注工具',
    description: '支持原简图像、释文、注释、实体和关系的协同标注。',
    icon: 'pen-tool',
    url: 'https://example.edu/tools/annotation',
    sort: 1
  },
  {
    id: 'tool_digitize',
    title: '简牍图像数字化处理工具',
    description: '提供简牍图像增强、切分、字符识别与批量导出功能。',
    icon: 'image',
    url: 'https://example.edu/tools/digitize',
    sort: 2
  }
]

const talents = [
  {
    id: 1,
    name: '陈维',
    avatar: 'https://example.edu/mock/talents/chen-wei.jpg',
    title: '教授',
    researchArea: '出土医学文献整理与经脉数字化',
    institution: '成都中医药大学'
  },
  {
    id: 2,
    name: '周明',
    avatar: 'https://example.edu/mock/talents/zhou-ming.jpg',
    title: '副教授',
    researchArea: '医学史; 数字化人文',
    institution: '成都中医药大学'
  },
  {
    id: 3,
    name: '李青',
    avatar: 'https://example.edu/mock/talents/li-qing.jpg',
    title: '讲师',
    researchArea: '文献学; 数据工程',
    institution: '成都中医药大学'
  }
]

const wordClouds = [
  {
    id: 1,
    title: '年度热词',
    type: 'annual',
    words: [
      { text: '天回医简', weight: 100 },
      { text: '经脉', weight: 88 },
      { text: '出土文献', weight: 82 },
      { text: '数字化', weight: 76 },
      { text: '知识服务', weight: 64 },
      { text: '简牍', weight: 58 },
      { text: '中医药', weight: 52 },
      { text: '古籍', weight: 48 }
    ]
  }
]

const projects = [
  {
    id: 'project_001',
    title: '出土医学文献多模态整理与知识组织研究',
    type: '国家级',
    startYear: 2024,
    endYear: 2027,
    leader: '陈维',
    participant: '周明;李青',
    institution: '成都中医药大学',
    summary: '围绕出土医学文献图像、释文、注释和成果数据开展多模态整理。',
    keywords: '出土医学文献; 多模态; 知识组织',
    coverImage: 'https://example.edu/mock/projects/project-001.jpg'
  },
  {
    id: 'project_002',
    title: '巴蜀医籍数字化保护与利用',
    type: '省部级',
    startYear: 2023,
    endYear: 2025,
    leader: '周明',
    participant: '陈维',
    institution: '成都中医药大学',
    summary: '对巴蜀地区珍稀中医古籍进行数字化采集、修复与知识标引。',
    keywords: '巴蜀医籍; 数字化; 古籍保护',
    coverImage: 'https://example.edu/mock/projects/project-002.jpg'
  }
]

const papers = [
  {
    id: 'paper_001',
    title: '天回医简经脉文献源流研究',
    firstAuthor: '陈维',
    corresponding: '陈维',
    otherAuthors: '周明',
    journal: '中华医史杂志',
    year: 2026,
    type: '核心',
    coverImage: 'https://example.edu/mock/papers/paper-001.jpg'
  },
  {
    id: 'paper_002',
    title: '出土医学文献图像标注方法探讨',
    firstAuthor: '周明',
    corresponding: '陈维',
    otherAuthors: '李青',
    journal: '中医文献杂志',
    year: 2025,
    type: '普通',
    coverImage: 'https://example.edu/mock/papers/paper-002.jpg'
  }
]

const books = [
  {
    id: 'book_001',
    title: '天回医简与早期经脉医学',
    author: '陈维 主编',
    publisher: '人民卫生出版社',
    year: 2026,
    coverImage: 'https://example.edu/mock/books/book-001.jpg',
    isbn: '978-7-117-00000-0'
  },
  {
    id: 'book_002',
    title: '巴蜀古籍医籍概论',
    author: '周明 著',
    publisher: '四川科学技术出版社',
    year: 2024,
    coverImage: 'https://example.edu/mock/books/book-002.jpg',
    isbn: '978-7-536-00000-0'
  }
]

const softwarePatents = [
  {
    id: 'software_001',
    title: '出土医学文献标注系统',
    type: '软件著作权',
    registrationNo: '2024SR001234',
    owner: '成都中医药大学',
    inventors: '周明;陈维',
    year: 2024,
    coverImage: 'https://example.edu/mock/ip/software-001.jpg'
  },
  {
    id: 'patent_001',
    title: '一种简牍图像增强方法',
    type: '发明专利',
    registrationNo: 'ZL202410000001.0',
    owner: '成都中医药大学',
    inventors: '陈维;周明',
    year: 2026,
    coverImage: 'https://example.edu/mock/ip/patent-001.jpg'
  }
]

const activityPhotos = [
  {
    id: 'photo_001',
    title: '出土医学文献数字化研讨会现场',
    organizer: '出土医学文献文物保护研究数字实验室',
    location: '成都中医药大学博物馆会议厅',
    thumbUrl: 'https://example.edu/mock/activities/photo-001-thumb.jpg',
    activityTime: '2026-04-18T09:00:00Z',
    summary: '围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。'
  },
  {
    id: 'photo_002',
    title: '天回医简学术沙龙',
    organizer: '中医大出土文献研究中心',
    location: '图书馆报告厅',
    thumbUrl: 'https://example.edu/mock/activities/photo-002-thumb.jpg',
    activityTime: '2025-11-10T14:00:00Z',
    summary: '分享天回医简最新研究成果与数字化进展。'
  }
]

const activities = [
  {
    id: 'activity_001',
    name: '出土医学文献数字化研讨会',
    time: '2026-04-18T09:00:00Z',
    endTime: '2026-04-18T17:30:00Z',
    location: '成都中医药大学博物馆会议厅',
    organizer: '出土医学文献文物保护研究数字实验室',
    coverImage: 'https://example.edu/mock/activities/activity-001.jpg',
    summary: '围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。',
    content: '<p>本次研讨会邀请医史文献、数字人文和数据工程方向专家，围绕平台建设、数据治理和成果展示进行交流。</p>',
    status: 'past'
  },
  {
    id: 'activity_002',
    name: '天回医简学术沙龙',
    time: '2025-11-10T14:00:00Z',
    endTime: '2025-11-10T17:00:00Z',
    location: '图书馆报告厅',
    organizer: '中医大出土文献研究中心',
    coverImage: 'https://example.edu/mock/activities/activity-002.jpg',
    summary: '分享天回医简最新研究成果与数字化进展。',
    content: '<p>学术沙龙聚焦天回医简经脉文献的整理、释读与数字化展示。</p>',
    status: 'past'
  }
]

const landingConfig = {
  title: '出土医学文献文物保护研究数字重点实验室',
  subtitle: '数据集成平台',
  actionText: '进入系统 →'
}

const homeConfig = {
  eyebrow: 'DIGITAL HUMANITIES ARCHIVE',
  title: '传承出土文献，赓续中医文脉',
  description: '本中心致力于通过数字化技术与现代科研手段，深挖中国出土医学文献与文物的学术价值，构建跨学科的知识服务平台。',
  cards: [
    {
      key: 'resources',
      title: '资源导航',
      description: '整合分散的出土医学文献资源，提供多维度的检索与分类导航服务。',
      route: '/resources',
      actionText: '进入导航'
    },
    {
      key: 'knowledge',
      title: '知识图谱',
      description: '基于本体建模技术，可视化展示古医籍、中药、方剂与经络的内在关联。',
      route: '/knowledge',
      actionText: '开启探索'
    },
    {
      key: 'academic',
      title: '学术动态',
      description: '发布最新考古发现、学术论文及科研成果，促进中医文献学界交流。',
      route: '/academic',
      actionText: '查看详情'
    }
  ]
}

const knowledgeGraph = {
  symptoms: [
    '头痛', '发热', '咳嗽', '脉浮', '咳嗽', '脉浮', '咳嗽',
    '头痛', '咳嗽', '脉浮', '咳嗽', '脉浮', '咳嗽', '脉浮',
    '头痛', '咳嗽', '脉浮', '咳嗽', '发热', '脉浮', '咳嗽',
    '头痛', '咳嗽', '发热', '脉浮', '咳嗽', '脉浮', '咳嗽'
  ],
  medicines: [
    '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
    '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
    '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
    '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '连翘',
    '薄荷', '连翘', '荆芥', '薄荷', '连翘', '荆芥', '薄荷'
  ],
  causes: ['风热犯肺', '营分热炽', '营分热炽'],
  totalCount: '12,842',
  nodes: [
    { name: '叶天士', type: 'scholar', size: 'size-xl' },
    { name: '张仲景', type: 'scholar', size: 'size-m' },
    { name: '孙思邈', type: 'scholar', size: 'size-m' },
    { name: '李时珍', type: 'scholar', size: 'size-s' },
    { name: '王清任', type: 'scholar', size: 'size-s' },
    { name: '皇甫谧', type: 'scholar', size: 'size-s' },
    { name: '温热论', type: 'book', size: 'size-m' },
    { name: '临证指南', type: 'book', size: 'size-s' },
    { name: '温病条辨', type: 'book', size: 'size-s' },
    { name: '伤寒论', type: 'book', size: 'size-m' },
    { name: '金匮要略', type: 'book', size: 'size-s' },
    { name: '千金要方', type: 'book', size: 'size-s' },
    { name: '千金翼方', type: 'book', size: 'size-xs' },
    { name: '本草纲目', type: 'book', size: 'size-xs' },
    { name: '叶氏医案', type: 'book', size: 'size-xs' },
    { name: '医林改错', type: 'book', size: 'size-xs' }
  ],
  detail: {
    title: '温热论',
    subtitle: '学术思想：卫气营血辨证',
    year: '清代(1746年)',
    citations: '2,482 次',
    abstract: '温邪上受，首先犯肺，逆传心包。肺主气属卫，心主血属营。大凡看法，卫之后方言气，营之后方言血...',
    relatedCount: 12,
    related: [
      { name: '银翘散', type: '治疗方剂' },
      { name: '邪留三焦', type: '病机描述' }
    ]
  }
}

const activityTimeline = {
  eyebrow: 'Chronicles of Excellence',
  title: '活动足迹·时光影卷',
  description: '穿梭于传统与创新的交汇点，记录实验室每一个具有里程碑意义的瞬间。\n每一张照片都是智慧的沉淀，每一段历程都是对未来的承诺。',
  eventCards: [
    {
      className: 'event-card-primary',
      title: '科普影响力',
      description: '为期两周的展览吸引了超过5000名观众，现场展示的分子生药学交互装置广受好评。',
      highlights: [
        { value: '5,000+', label: '观展人次' },
        { value: '2周', label: '展览周期' }
      ]
    },
    {
      className: 'event-card-secondary',
      title: '跨学科研讨',
      description: '邀请医学史、文物保护、人工智能团队共同参与，围绕出土医学文献数字化方法展开交流。',
      highlights: [
        { value: '12场', label: '专题报告' },
        { value: '8组', label: '协作团队' }
      ]
    }
  ],
  timelineDots: [
    { className: 'dot-large dot-one' },
    { className: 'dot-medium dot-two' },
    { className: 'dot-large dot-three' },
    { className: 'dot-small dot-four' }
  ]
}

function paginate(list, pageNum = 1, pageSize = 10) {
  const start = (pageNum - 1) * pageSize
  const rows = list.slice(start, start + pageSize)
  return { total: list.length, pageNum: Number(pageNum), pageSize: Number(pageSize), rows }
}

export default [
  {
    url: '/api/v1/site/landing',
    method: 'get',
    response: () => wrap(landingConfig)
  },
  {
    url: '/api/v1/site/home',
    method: 'get',
    response: () => wrap(homeConfig)
  },
  {
    url: '/api/v1/knowledge/graph',
    method: 'get',
    response: () => wrap(knowledgeGraph)
  },
  // ------ 静态列表/无参路由（必须排在 :id 路由前面，避免匹配冲突） ------

  // 1. 获取数据库列表
  {
    url: '/api/v1/databases',
    method: 'get',
    response: () => wrap({ total: databases.length, list: databases.filter(d => d.status === 'active') })
  },
  // 2. 获取自研工具列表
  {
    url: '/api/v1/tools',
    method: 'get',
    response: () => wrap({ total: tools.length, list: tools })
  },
  // 3. 获取人才信息概要列表
  {
    url: '/api/v1/talents',
    method: 'get',
    response: () => wrap({ total: talents.length, list: talents })
  },
  // 4. 获取词云列表
  {
    url: '/api/v1/wordClouds',
    method: 'get',
    response: () => wrap({ list: wordClouds })
  },
  // 5. 查询课题概要列表
  {
    url: '/api/v1/projects/paginate',
    method: 'get',
    response: ({ query = {} }) => {
      let list = [...projects]
      if (query.year) list = list.filter(p => p.startYear === Number(query.year) || p.endYear === Number(query.year))
      if (query.type) list = list.filter(p => p.type === query.type)
      return wrap(paginate(list, query.pageNum, query.pageSize))
    }
  },
  // 6. 查询论文概要列表
  {
    url: '/api/v1/papers/paginate',
    method: 'get',
    response: ({ query = {} }) => {
      let list = [...papers]
      if (query.year) list = list.filter(p => p.year === Number(query.year))
      if (query.type) list = list.filter(p => p.type === query.type)
      return wrap(paginate(list, query.pageNum, query.pageSize))
    }
  },
  // 7. 查询专著概要列表
  {
    url: '/api/v1/books/paginate',
    method: 'get',
    response: ({ query = {} }) => {
      let list = [...books]
      if (query.year) list = list.filter(b => b.year === Number(query.year))
      return wrap(paginate(list, query.pageNum, query.pageSize))
    }
  },
  // 8. 查询软著专利概要列表
  {
    url: '/api/v1/softwarePatents/paginate',
    method: 'get',
    response: ({ query = {} }) => {
      let list = [...softwarePatents]
      if (query.year) list = list.filter(s => s.year === Number(query.year))
      if (query.type) list = list.filter(s => s.type === query.type)
      return wrap(paginate(list, query.pageNum, query.pageSize))
    }
  },
  // 9. 查询活动剪影列表
  {
    url: '/api/v1/activityPhotos/paginate',
    method: 'get',
    response: ({ query = {} }) => {
      const pageSize = query.pageSize || 12
      return wrap(paginate(activityPhotos, query.pageNum, pageSize))
    }
  },
  // 11. 获取软著专利统计
  {
    url: '/api/v1/softwarePatents/stats',
    method: 'get',
    response: () => wrap({
      total: softwarePatents.length,
      byYear: [
        { year: 2026, count: 1 },
        { year: 2024, count: 1 }
      ],
      byType: {
        '软件著作权': 1,
        '发明专利': 1
      }
    })
  },
  // 13. 获取论文统计
  {
    url: '/api/v1/papers/stats',
    method: 'get',
    response: () => wrap({
      total: papers.length,
      byYear: [
        { year: 2026, count: 1 },
        { year: 2025, count: 1 }
      ],
      byType: {
        '核心': 1,
        '普通': 1
      }
    })
  },
  // 15. 获取专著统计
  {
    url: '/api/v1/books/stats',
    method: 'get',
    response: () => wrap({
      total: books.length,
      byYear: [
        { year: 2026, count: 1 },
        { year: 2024, count: 1 }
      ]
    })
  },
  // 17. 获取课题统计
  {
    url: '/api/v1/projects/stats',
    method: 'get',
    response: () => wrap({
      total: projects.length,
      byYear: [
        { year: 2024, count: 1 },
        { year: 2023, count: 1 }
      ],
      byType: {
        '国家级': 1,
        '省部级': 1
      }
    })
  },
  // 20. 查询活动概要列表
  {
    url: '/api/v1/activities/paginate',
    method: 'get',
    response: ({ query = {} }) => {
      const list = activities.map(a => ({
        id: a.id,
        title: a.name,
        type: '会议',
        time: a.time,
        location: a.location,
        organizer: a.organizer,
        coverImage: a.coverImage,
        summary: a.summary,
        status: a.status
      }))
      return wrap(paginate(list, query.pageNum, query.pageSize))
    }
  },
  {
    url: '/api/v1/activities/timeline',
    method: 'get',
    response: () => wrap(activityTimeline)
  },

  // ------ 以下为带 :id 参数的路由（放在后面，避免误匹配） ------

  // 10. 获取人才详情
  {
    url: '/api/v1/talents/:id',
    method: 'get',
    response: ({ query = {} } = {}) => {
      const id = Number(query.id)
      const t = talents.find(x => x.id === id)
      if (!t) return wrap(null)
      const achievements = [
        { id: 'paper_001', type: 'paper', title: '天回医简经脉文献源流研究' },
        { id: 'book_001', type: 'book', title: '天回医简与早期经脉医学' },
        { id: 'project_001', type: 'project', title: '出土医学文献多模态整理与知识组织研究' }
      ]
      return wrap({ ...t, bio: '长期从事出土医学文献整理、简牍图像数字化和中医药知识服务研究。', achievements })
    }
  },
  // 12. 查询软著专利详情
  {
    url: '/api/v1/softwarePatents/:id',
    method: 'get',
    response: ({ query = {} } = {}) => {
      const sp = softwarePatents.find(s => s.id === query.id)
      if (!sp) return wrap(null)
      return wrap({
        ...sp,
        applicationDate: '2024-01-15T00:00:00Z',
        issueDate: '2024-06-20T00:00:00Z',
        description: '用于医学文献图像、释文、注释和实体的在线标注。',
        attachments: [
          { name: '登记证书.pdf', url: 'https://example.edu/mock/files/software-001.pdf' }
        ]
      })
    }
  },
  // 14. 查询论文详情
  {
    url: '/api/v1/papers/:id',
    method: 'get',
    response: ({ query = {} } = {}) => {
      const p = papers.find(x => x.id === query.id)
      if (!p) return wrap(null)
      return wrap({
        ...p,
        authors: '陈维, 周明',
        authorIds: [1, 2],
        volume: '56',
        issue: '2',
        pages: '101-112',
        doi: '10.12345/j.cmhistory.2026.002',
        url: 'https://example.edu/mock/files/paper-001.pdf',
        abstract: '论文讨论天回医简经脉文献与早期经脉理论之间的关系。',
        keywords: ['天回医简', '经脉', '出土医学文献'],
        attachments: [
          { name: '论文全文.pdf', url: 'https://example.edu/mock/files/paper-001.pdf' }
        ]
      })
    }
  },
  // 16. 查询专著详情
  {
    url: '/api/v1/books/:id',
    method: 'get',
    response: ({ query = {} } = {}) => {
      const b = books.find(x => x.id === query.id)
      if (!b) return wrap(null)
      return wrap({
        ...b,
        authorId: 1,
        publishDate: '2026-03-15T00:00:00Z',
        price: 98.0,
        pages: 456,
        words: 580000,
        description: '围绕天回医简材料、经脉理论源流和医学史价值展开系统研究。',
        toc: '第一章 出土背景; 第二章 文献整理; 第三章 经脉理论; 第四章 数字化应用',
        attachments: [
          { name: '试读 PDF', url: 'https://example.edu/mock/files/book-001-sample.pdf' },
          { name: '馆藏查询', url: 'https://library.example.edu/search/book_001' }
        ]
      })
    }
  },
  // 18. 查询课题详情
  {
    url: '/api/v1/projects/:id',
    method: 'get',
    response: ({ query = {} } = {}) => {
      const p = projects.find(x => x.id === query.id)
      if (!p) return wrap(null)
      return wrap({
        ...p,
        projectNo: '2024ZY001',
        budget: 2400000,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2027-12-31T00:00:00Z',
        members: ['周明', '李青'],
        description: '项目建设可复用的数据采集、标注、审核和知识组织流程，支撑前台展示和后续研究。',
        progress: '进行中',
        attachments: [
          { name: '项目简介.pdf', url: 'https://example.edu/mock/files/project-001.pdf' }
        ]
      })
    }
  },
  // 19. 查询活动详情
  {
    url: '/api/v1/activities/:id',
    method: 'get',
    response: ({ query = {} } = {}) => {
      const a = activities.find(x => x.id === query.id)
      if (!a) return wrap(null)
      return wrap({
        ...a,
        gallery: [
          'https://example.edu/mock/activities/photo-001.jpg',
          'https://example.edu/mock/activities/photo-003.jpg'
        ],
        attachments: [
          { name: '会议手册.pdf', url: 'https://example.edu/mock/files/activity-001-handbook.pdf' }
        ]
      })
    }
  }
]
