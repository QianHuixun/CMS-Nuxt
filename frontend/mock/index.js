const wrap = (data) => ({ code: 200, message: 'success', data })

const asset = (path) => `/mock-assets/${path}`
const isPdfUrl = (url = '') => /\.pdf($|[?#])/i.test(url)

const databases = [
  {
    id: 'db_tianhui',
    title: '《天回医简》数据库',
    status: 'active',
    info: '汇聚天回汉墓出土医简高清图像、释文、注释、单字切分图像与检索数据。',
    url: asset('databases/tianhui-slip-001.png'),
    videoUrl: asset('videos/lab-promo.mp4'),
    icon: 'database',
    sort: 1,
    backimg: asset('databases/tianhui-slip-001.png')
  },
  {
    id: 'db_bashu',
    title: '巴蜀古籍医籍数据库',
    status: 'active',
    info: '收录巴蜀地区历代中医古籍文献，支持全文检索与图像对照。',
    url: asset('databases/bronze-acupuncture-figure.jpg'),
    icon: 'book',
    sort: 2,
    backimg: asset('databases/bronze-acupuncture-figure.jpg')
  },
  {
    id: 'db_wanjuan',
    title: '万卷精华平台',
    status: 'active',
    info: '整合出土医学文献与传世医籍，构建多维度知识关联与检索服务。',
    url: asset('databases/wanjuan-platform.png'),
    videoUrl: asset('videos/wanjuan-demo.mp4'),
    icon: 'scroll',
    sort: 3,
    backimg: asset('databases/wanjuan-platform.png')
  },
  {
    id: 'db_annotation',
    title: '中医古籍数据标注系统',
    status: 'active',
    info: '面向中医古籍整理场景，提供实体关系标注、数据治理与协作审核能力。',
    url: asset('databases/annotation-system.png'),
    videoUrl: asset('videos/annotation-demo.mp4'),
    icon: 'default',
    sort: 4,
    backimg: asset('databases/annotation-system.png')
  }
]

const tools = [
  {
    id: 'tool_annotation',
    title: '中医文献分析与实体关系标注系统',
    description: '支持中医古籍实体、关系与语义信息的协同标注。',
    icon: 'pen-tool',
    url: asset('databases/annotation-system.png'),
    videoUrl: asset('videos/annotation-demo.mp4'),
    sort: 1
  },
  {
    id: 'tool_wanjuan',
    title: '万卷精华演示平台',
    description: '面向古籍知识服务，提供全文检索、知识关联与成果展示。',
    icon: 'image',
    url: asset('databases/wanjuan-platform.png'),
    videoUrl: asset('videos/wanjuan-demo.mp4'),
    sort: 2
  }
]

const talents = [
  {
    id: 1,
    name: '顾文澜',
    avatar: asset('talents/expert-photo.png'),
    title: '首席研究员',
    researchAreas: ['天回医简整理', '出土医书校勘', '医学文献数字化', '古籍知识图谱', '术语规范'],
    institution: '成都中医药大学'
  },
  {
    id: 2,
    name: '沈知远',
    avatar: asset('talents/expert-photo.png'),
    title: '研究员',
    researchAreas: ['经方知识抽取', '医案结构化', '中医古籍智能检索'],
    institution: '成都中医药大学'
  },
  {
    id: 3,
    name: '唐若岚',
    avatar: asset('talents/expert-photo.png'),
    title: '副教授',
    researchAreas: ['简帛整理', '文献比对', '医学伦理史', '数据标注'],
    institution: '成都中医药大学'
  },
  {
    id: 4,
    name: '陆清越',
    avatar: asset('talents/expert-photo.png'),
    title: '副研究员',
    researchAreas: ['古医籍保护', '文献版本学', '纸本文献修复', '信息抽取', '知识服务'],
    institution: '成都中医药大学'
  },
  {
    id: 5,
    name: '韩亦舟',
    avatar: asset('talents/expert-photo.png'),
    title: '教授',
    researchAreas: ['巴蜀医药资源', '古籍数字化', '语义建模', '临床知识组织'],
    institution: '成都中医药大学'
  },
  {
    id: 6,
    name: '程书雅',
    avatar: asset('talents/expert-photo.png'),
    title: '讲师',
    researchAreas: ['自然语言处理', '实体关系标注'],
    institution: '成都中医药大学'
  },
  {
    id: 7,
    name: '许安宁',
    avatar: asset('talents/expert-photo.png'),
    title: '青年研究员',
    researchAreas: ['医案推理', '病证方药建模', '临床语料整理', '知识问答'],
    institution: '成都中医药大学'
  },
  {
    id: 8,
    name: '邵闻溪',
    avatar: asset('talents/expert-photo.png'),
    title: '高级工程师',
    researchAreas: ['数据库治理', '元数据清洗', '文献检索优化'],
    institution: '成都中医药大学'
  },
  {
    id: 9,
    name: '叶思衡',
    avatar: asset('talents/expert-photo.png'),
    title: '助理研究员',
    researchAreas: ['术语规范化', '简帛文献整理', '医学名词映射', '资源编目', '校注整理'],
    institution: '成都中医药大学'
  },
  {
    id: 10,
    name: '乔一鸣',
    avatar: asset('talents/expert-photo.png'),
    title: '算法工程师',
    researchAreas: ['知识图谱构建', '大模型辅助标注', '证据检索'],
    institution: '成都中医药大学'
  },
  {
    id: 11,
    name: '白予安',
    avatar: asset('talents/expert-photo.png'),
    title: '馆员',
    researchAreas: ['古籍修复', '版本鉴定'],
    institution: '成都中医药大学'
  },
  {
    id: 12,
    name: '傅岚',
    avatar: asset('talents/expert-photo.png'),
    title: '研究助理',
    researchAreas: ['医学文献分析', '标注平台运营', '项目资料归档', '数据核验'],
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
      { text: '经脉数字化', weight: 96 },
      { text: '出土文献', weight: 92 },
      { text: '知识服务', weight: 88 },
      { text: '简牍整理', weight: 84 },
      { text: '中医药', weight: 80 },
      { text: '古籍修复', weight: 76 },
      { text: '针灸铜人', weight: 72 },
      { text: '黄帝内经', weight: 68 },
      { text: '数字人文', weight: 64 },
      { text: '知识图谱', weight: 60 },
      { text: '医案推理', weight: 56 },
      { text: '实体标注', weight: 52 },
      { text: '巴蜀医籍', weight: 48 },
      { text: '文物保护', weight: 44 },
      { text: '语料库', weight: 40 },
      { text: '数据治理', weight: 36 },
      { text: '智能检索', weight: 32 },
      { text: '多模态采集', weight: 28 },
      { text: '古籍影像', weight: 24 },
      { text: '术语规范', weight: 20 },
      { text: '协同标注', weight: 16 }
    ]
  }
]

const projects = [
  {
    id: 'project_001',
    title: '天回医简研究',
    type: '冷门绝学研究专项学术团队项目',
    year: 2025,
    startYear: 2025,
    endYear: 2030,
    leader: '柳长华',
    leaderId: 1,
    participant: '',
    institution: '成都中医药大学',
    projectNo: '25VJXT006',
    source: '全国哲学社会科学工作办公室',
    level: '国家级',
    budget: 800000,
    summary: '围绕天回医简开展系统整理、释读与学术研究。',
    keywords: '天回医简; 出土医学文献; 冷门绝学',
    fileUrl: asset('projects/project-001.pdf')
  },
  {
    id: 'project_002',
    title: '中医生命伦理思想史研究',
    type: '一般项目',
    year: 2021,
    startYear: 2021,
    endYear: 2025,
    leader: '杨静',
    leaderId: 3,
    participant: '',
    institution: '成都中医药大学',
    projectNo: '21BZX114',
    source: '全国哲学社会科学工作办公室',
    level: '国家级',
    budget: 200000,
    summary: '从思想史角度梳理中医生命伦理相关文献、概念与理论脉络。',
    keywords: '中医; 生命伦理; 思想史',
    fileUrl: asset('projects/project-002.pdf')
  },
  {
    id: 'project_003',
    title: '出土医学简帛数据库的构建及模式研究',
    type: '基地项目',
    year: 2022,
    startYear: 2022,
    endYear: 2023,
    leader: '杨静',
    leaderId: 3,
    participant: '柳长华;任玉兰;钟舒婷;李游;胡笺舒;杨恺',
    institution: '成都中医药大学',
    projectNo: 'SC22EZD066',
    source: '四川省哲学社会科学规划办公室',
    level: '省部级',
    budget: 25000,
    summary: '探索出土医学简帛数据库建设模式与资源组织方法。',
    keywords: '出土医学简帛; 数据库; 数字人文'
  },
  {
    id: 'project_004',
    title: '面向中医古籍医案的病证-方药类案双路径协同推理研究',
    type: '青年科学基金C类',
    year: 2025,
    startYear: 2025,
    endYear: 2028,
    leader: '周彤',
    participant: '',
    institution: '成都中医药大学',
    projectNo: '82505805',
    source: '国家自然科学基金',
    level: '国家级',
    budget: 300000,
    summary: '面向中医古籍医案，研究病证与方药双路径协同推理方法。',
    keywords: '中医古籍; 医案; 协同推理',
    fileUrl: asset('projects/project-004.pdf')
  }
]

const papers = [
  {
    id: 'paper_001',
    title: '在“两个结合”中努力建设中华民族现代文明',
    authors: '柳长华',
    firstAuthor: '柳长华',
    corresponding: '/',
    journal: '学习时报（理论版）',
    year: 2023,
    type: '理论文章',
    doi: '',
    abstract: '围绕“两个结合”与中华民族现代文明建设展开理论阐释。',
    keywords: ['两个结合', '中华文明', '文化传承'],
    coverImage: asset('papers/paper-001.pdf'),
    fileUrl: asset('papers/paper-001.pdf')
  },
  {
    id: 'paper_002',
    title: '中医古籍指代关系语料库的构建与指代消解方法研究',
    authors: '张婷婷, 温川飙',
    firstAuthor: '张婷婷',
    corresponding: '温川飙',
    journal: '图书情报工作',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '研究中医古籍指代关系语料库构建及指代消解方法。',
    keywords: ['中医古籍', '指代关系', '语料库'],
    coverImage: asset('papers/paper-002.pdf'),
    fileUrl: asset('papers/paper-002.pdf')
  },
  {
    id: 'paper_003',
    title: '保护历史文化遗产 更好守护文明根脉',
    authors: '柳长华',
    firstAuthor: '柳长华',
    corresponding: '/',
    journal: '四川日报',
    year: 2024,
    type: '报刊',
    doi: '',
    abstract: '围绕历史文化遗产保护与文明传承展开论述。',
    keywords: ['历史文化遗产', '文明传承', '保护利用'],
    coverImage: asset('papers/paper-003.jpg'),
    fileUrl: asset('papers/paper-003.jpg')
  },
  {
    id: 'paper_004',
    title: 'PulseNet: Multi-task learning-based non-contact pulse condition diagnosis using multi-scale fusion and transformer',
    authors: '温川飙 等',
    firstAuthor: '温川飙',
    corresponding: '温川飙',
    journal: 'SCI 论文',
    year: 2025,
    type: 'SCI',
    doi: '',
    abstract: 'A non-contact pulse condition diagnosis method based on multi-task learning, multi-scale fusion and transformer.',
    keywords: ['PulseNet', 'multi-task learning', 'pulse diagnosis'],
    coverImage: asset('papers/paper-004.jpeg'),
    fileUrl: asset('papers/paper-004.jpeg')
  },
  {
    id: 'paper_005',
    title: '出土医简病证术语的语义层级整理与知识组织研究',
    authors: '李清, 周明, 任玉兰',
    firstAuthor: '李清',
    corresponding: '周明',
    journal: '中医文献杂志',
    year: 2025,
    type: '期刊',
    doi: '',
    abstract: '围绕出土医简中的病证术语开展层级归纳、语义标注与知识组织方法研究。',
    keywords: ['出土医简', '病证术语', '知识组织'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_006',
    title: '面向古医籍整理的多模态图文校勘流程设计',
    authors: '陈薇, 温川飙',
    firstAuthor: '陈薇',
    corresponding: '温川飙',
    journal: '数字人文研究',
    year: 2025,
    type: '期刊',
    doi: '',
    abstract: '提出面向古医籍图像、释文与校注信息协同处理的多模态校勘流程。',
    keywords: ['古医籍', '多模态', '图文校勘'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_007',
    title: '天回医简针灸相关词汇的共现网络分析',
    authors: '唐若岚, 刘思远',
    firstAuthor: '唐若岚',
    corresponding: '刘思远',
    journal: '中华医史杂志',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '基于词汇共现关系分析天回医简针灸相关概念的聚类特征与知识结构。',
    keywords: ['天回医简', '针灸', '共现网络'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_008',
    title: '中医古籍实体关系标注规范及一致性评估',
    authors: '许安安, 张婷婷',
    firstAuthor: '许安安',
    corresponding: '张婷婷',
    journal: '数据分析与知识发现',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '构建中医古籍实体关系标注规范，并从标注一致性角度评估规范可用性。',
    keywords: ['中医古籍', '实体关系', '标注规范'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_009',
    title: '巴蜀医籍版本谱系的数字化建模研究',
    authors: '陆清越, 白予宁',
    firstAuthor: '陆清越',
    corresponding: '白予宁',
    journal: '图书馆论坛',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '从版本源流、刻印信息与馆藏线索出发，探索巴蜀医籍版本谱系的数字化表达方式。',
    keywords: ['巴蜀医籍', '版本谱系', '数字化建模'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_010',
    title: '医学简帛图像切分质量评价指标体系初探',
    authors: '邵闻源, 乔一航',
    firstAuthor: '邵闻源',
    corresponding: '乔一航',
    journal: '中文信息学报',
    year: 2023,
    type: '期刊',
    doi: '',
    abstract: '针对医学简帛图像切分任务，建立涵盖边界完整性、字符可读性与复核效率的评价指标。',
    keywords: ['医学简帛', '图像切分', '质量评价'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_011',
    title: '出土医学文献中的方药结构抽取与关系校验',
    authors: '周明, 傅岚',
    firstAuthor: '周明',
    corresponding: '傅岚',
    journal: '世界科学技术-中医药现代化',
    year: 2023,
    type: '期刊',
    doi: '',
    abstract: '面向出土医学文献方药内容，设计结构抽取规则与关系校验流程。',
    keywords: ['出土医学文献', '方药结构', '关系校验'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_012',
    title: '古医籍知识图谱辅助检索系统的用户体验评价',
    authors: '韩亦舟, 李清',
    firstAuthor: '韩亦舟',
    corresponding: '李清',
    journal: '情报理论与实践',
    year: 2023,
    type: '期刊',
    doi: '',
    abstract: '以古医籍知识图谱辅助检索场景为对象，评估检索效率、结果解释性与用户满意度。',
    keywords: ['古医籍', '知识图谱', '用户体验'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_013',
    title: '简帛医学文献释文差异的可视化比对方法',
    authors: '叶思衣, 唐若岚',
    firstAuthor: '叶思衣',
    corresponding: '唐若岚',
    journal: '古籍整理研究学刊',
    year: 2022,
    type: '期刊',
    doi: '',
    abstract: '结合释文版本差异与图像证据，提出适用于简帛医学文献整理的可视化比对方法。',
    keywords: ['简帛医学文献', '释文差异', '可视化比对'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_014',
    title: '中医文献术语规范化中的同义词归并策略研究',
    authors: '刘思远, 陈薇',
    firstAuthor: '刘思远',
    corresponding: '陈薇',
    journal: '中国中医基础医学杂志',
    year: 2022,
    type: '期刊',
    doi: '',
    abstract: '梳理中医文献术语同义表达类型，提出面向检索与知识服务的归并策略。',
    keywords: ['中医文献', '术语规范化', '同义词归并'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_015',
    title: '面向冷门绝学研究的古籍资源聚合与证据链组织',
    authors: '柳长华, 陆清越',
    firstAuthor: '柳长华',
    corresponding: '陆清越',
    journal: '大学图书馆学报',
    year: 2022,
    type: '期刊',
    doi: '',
    abstract: '围绕冷门绝学研究需求，探索古籍资源聚合、证据链组织与专题知识服务方式。',
    keywords: ['冷门绝学', '古籍资源', '证据链'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_016',
    title: '中医古籍数字化项目中的元数据治理实践',
    authors: '白予宁, 邵闻源',
    firstAuthor: '白予宁',
    corresponding: '邵闻源',
    journal: '图书馆建设',
    year: 2021,
    type: '期刊',
    doi: '',
    abstract: '总结中医古籍数字化项目中题名、责任者、版本与主题词等元数据治理经验。',
    keywords: ['中医古籍', '数字化项目', '元数据治理'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_017',
    title: '基于规则与语料的古医案时间表达识别方法',
    authors: '乔一航, 许安安',
    firstAuthor: '乔一航',
    corresponding: '许安安',
    journal: '中文信息处理前沿',
    year: 2021,
    type: '会议论文',
    doi: '',
    abstract: '针对古医案中时间表达形式多样的问题，设计规则与语料结合的识别方法。',
    keywords: ['古医案', '时间表达', '信息抽取'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_018',
    title: '医学古籍影像采集流程中的色彩一致性控制',
    authors: '傅岚, 韩亦舟',
    firstAuthor: '傅岚',
    corresponding: '韩亦舟',
    journal: '文献保护与修复',
    year: 2021,
    type: '期刊',
    doi: '',
    abstract: '结合医学古籍影像采集实践，讨论色彩校准、光照控制与后期质检流程。',
    keywords: ['医学古籍', '影像采集', '色彩一致性'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_019',
    title: '传世医籍方剂异名关系的自动发现与人工复核',
    authors: '程书雅, 周明',
    firstAuthor: '程书雅',
    corresponding: '周明',
    journal: '中医药信息学报',
    year: 2020,
    type: '期刊',
    doi: '',
    abstract: '面向传世医籍方剂名称异写、简称与别名问题，提出自动发现与人工复核结合的方法。',
    keywords: ['传世医籍', '方剂异名', '人工复核'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_020',
    title: '面向中医文献问答的证据片段组织方法',
    authors: '任玉兰, 陈薇',
    firstAuthor: '任玉兰',
    corresponding: '陈薇',
    journal: '情报科学',
    year: 2020,
    type: '期刊',
    doi: '',
    abstract: '针对中医文献问答中的答案溯源需求，研究证据片段抽取、排序与组织展示方法。',
    keywords: ['中医文献问答', '证据片段', '知识服务'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_021',
    title: '出土医学简牍病名释读中的跨文本证据整合研究',
    authors: '李游, 曹碧晏',
    firstAuthor: '李游',
    corresponding: '曹碧晏',
    journal: '中医文献研究',
    year: 2025,
    type: '期刊',
    doi: '',
    abstract: '围绕出土医学简牍病名释读，探索跨文本证据抽取、聚合与校验方法。',
    keywords: ['出土医学简牍', '病名释读', '证据整合'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_022',
    title: '中医古籍图像去噪与版面复原的协同处理流程',
    authors: '雷霆, 鲁金花',
    firstAuthor: '雷霆',
    corresponding: '鲁金花',
    journal: '数字出版研究',
    year: 2025,
    type: '期刊',
    doi: '',
    abstract: '针对古籍图像污损、透印和版面残缺问题，设计图像去噪与版面复原协同流程。',
    keywords: ['中医古籍', '图像去噪', '版面复原'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_023',
    title: '基于术语链的古医籍方证关联发现方法',
    authors: '蒲婉瑶, 闵新',
    firstAuthor: '蒲婉瑶',
    corresponding: '闵新',
    journal: '中医药导报',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '以术语链为线索，研究古医籍中方剂、证候与病机之间的关联发现方法。',
    keywords: ['术语链', '方证关联', '古医籍'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_024',
    title: '医学文物三维采集数据的轻量化展示策略',
    authors: '徐鑫垚, 周帅',
    firstAuthor: '徐鑫垚',
    corresponding: '周帅',
    journal: '文博数字化',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '面向医学文物三维采集成果，讨论模型压缩、纹理优化与 Web 展示策略。',
    keywords: ['医学文物', '三维采集', '轻量化展示'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_025',
    title: '出土医学文献数据库字段规范与质量控制实践',
    authors: '张婷婷, 万凌云',
    firstAuthor: '张婷婷',
    corresponding: '万凌云',
    journal: '数据与情报科学',
    year: 2024,
    type: '期刊',
    doi: '',
    abstract: '总结出土医学文献数据库建设中的字段设计、录入规范和质量控制流程。',
    keywords: ['出土医学文献', '数据库', '质量控制'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_026',
    title: '汉晋医籍针灸语汇的历时演变分析',
    authors: '杨静, 李洁',
    firstAuthor: '杨静',
    corresponding: '李洁',
    journal: '中华中医药杂志',
    year: 2023,
    type: '期刊',
    doi: '',
    abstract: '比较汉晋时期医籍中的针灸语汇，分析概念表达和术语系统的历时演变。',
    keywords: ['汉晋医籍', '针灸语汇', '历时演变'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_027',
    title: '面向医简整理的释文版本管理与审校记录模型',
    authors: '邓垚, 卢鹏',
    firstAuthor: '邓垚',
    corresponding: '卢鹏',
    journal: '古籍数字化研究',
    year: 2023,
    type: '期刊',
    doi: '',
    abstract: '构建面向医简释文整理的版本管理、审校记录和修改追踪模型。',
    keywords: ['医简整理', '释文版本', '审校记录'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_028',
    title: '中医古籍知识图谱中的证候节点消歧研究',
    authors: '樊二超, 孙务川',
    firstAuthor: '樊二超',
    corresponding: '孙务川',
    journal: '知识工程与智能系统',
    year: 2023,
    type: '会议论文',
    doi: '',
    abstract: '针对中医古籍知识图谱中证候名称多义和异名问题，提出节点消歧流程。',
    keywords: ['知识图谱', '证候节点', '消歧'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_029',
    title: '古代医方剂量表达的结构化抽取与单位换算',
    authors: '郭富强, 张婷婷',
    firstAuthor: '郭富强',
    corresponding: '张婷婷',
    journal: '中国数字医学',
    year: 2022,
    type: '期刊',
    doi: '',
    abstract: '面向古代医方中的剂量表达，研究结构化抽取、单位归一和换算规则。',
    keywords: ['医方剂量', '结构化抽取', '单位换算'],
    coverImage: asset('papers/tianhui-slip-column.png')
  },
  {
    id: 'paper_030',
    title: '面向古籍整理场景的人工智能辅助审读边界研究',
    authors: '温川飙, 柳长华',
    firstAuthor: '温川飙',
    corresponding: '柳长华',
    journal: '数字人文与中医药',
    year: 2022,
    type: '期刊',
    doi: '',
    abstract: '讨论人工智能辅助古籍审读中的可用边界、人工复核责任与成果可信度。',
    keywords: ['古籍整理', '人工智能', '辅助审读'],
    coverImage: asset('papers/tianhui-slip-column.png')
  }
]

const books = [
  {
    id: 'book_001',
    title: '《天回医简》线装本',
    author: '柳长华 主编',
    authorId: 1,
    publisher: '成都：巴蜀书社',
    year: 2025,
    coverImage: asset('books/book-tianhui-threadbound-cover.jpg'),
    isbn: '978-7-5531-2453-7'
  },
  {
    id: 'book_002',
    title: '《数字医疗概论》',
    author: '温川飙 主编',
    authorId: 2,
    publisher: '高等学校教材',
    year: 2023,
    coverImage: asset('books/book-digital-medical-cover.png'),
    isbn: ''
  },
  {
    id: 'book_003',
    title: '《医学图形图像处理》',
    author: '温川飙 副主编',
    authorId: 2,
    publisher: '中国中医药出版社',
    year: 2023,
    coverImage: asset('books/book-image-processing-cover.png'),
    isbn: '978-7-5132-8322-9'
  },
  {
    id: 'book_004',
    title: '《中医百部经典（影印本）》第二辑',
    author: '柳长华 主编',
    authorId: 1,
    publisher: '成都：巴蜀书社',
    year: 2023,
    coverImage: asset('books/book-classics-second.jpg'),
    isbn: '978-7-5531-2146-8'
  }
]

const softwarePatents = [
  {
    id: 'software_005',
    title: '基于中医症状、信息量表和智能交互问诊的数据归一化分层处理系统V1.0',
    type: 'software',
    typeName: '软件著作权',
    registrationNo: '2024.08',
    owner: '温川飙;郭富强;张婷婷;成都中医药大学',
    inventors: '温川飙;郭富强;张婷婷',
    year: 2024,
    fileUrl: asset('patents/software-005.pdf')
  },
  {
    id: 'software_006',
    title: '中医文献分析与实体关系标注系统V1.0',
    type: 'software',
    typeName: '软件著作权',
    registrationNo: '2024.12',
    owner: '张婷婷;万凌云;樊二超;孙务川;温川飙;成都中医药大学',
    inventors: '张婷婷;万凌云;樊二超;孙务川;温川飙',
    year: 2024,
    fileUrl: asset('patents/software-006.pdf')
  },
  {
    id: 'software_007',
    title: '《天回医简》数据库软件',
    type: 'software',
    typeName: '软件著作权',
    registrationNo: '2025.02',
    owner: '成都中医药大学;柳长华;杨静;李游;曹碧晏;雷霆;鲁金花',
    inventors: '柳长华;杨静;李游;曹碧晏;雷霆;鲁金花',
    year: 2025,
    videoUrl: asset('videos/lab-promo.mp4'),
    fileUrl: asset('patents/software-007.pdf')
  },
  {
    id: 'software_008',
    title: '大模型协助下的中医古籍数据标注软件V1.0',
    type: 'software',
    typeName: '软件著作权',
    registrationNo: '2025.06',
    owner: '成都中医药大学',
    inventors: '成都中医药大学',
    year: 2025,
    videoUrl: asset('videos/annotation-demo.mp4'),
    fileUrl: asset('patents/software-008.pdf')
  },
  {
    id: 'patent_010',
    title: '基于大语言模型的中医古籍症状标准化处理方法',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.1',
    owner: '杨静;邓垚;张婷婷;卢鹏;闵新;蒲婉瑶;温川飙',
    inventors: '杨静;邓垚;张婷婷;卢鹏;闵新;蒲婉瑶;温川飙',
    year: 2025,
    fileUrl: asset('patents/patent-010.pdf')
  },
  {
    id: 'patent_011',
    title: '中医古籍知识图谱构建方法、设备、介质',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.11',
    owner: '温川飙;付勇智;杨静;张婷婷;周帅;徐鑫垚',
    inventors: '温川飙;付勇智;杨静;张婷婷;周帅;徐鑫垚',
    year: 2025,
    fileUrl: asset('patents/patent-011.pdf')
  },
  {
    id: 'patent_012',
    title: '多层次中医古籍症状标准化处理方法',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.1',
    owner: '张婷婷;邓垚;闵新;杨静;卢鹏;蒲婉瑶;温川飙',
    inventors: '张婷婷;邓垚;闵新;杨静;卢鹏;蒲婉瑶;温川飙',
    year: 2025,
    fileUrl: asset('patents/patent-012.pdf')
  },
  {
    id: 'patent_013',
    title: '小样本中医古籍标注模型适配方法',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.1',
    owner: '张婷婷;周帅;温川飙;杨静;徐鑫垚;付勇智;李洁',
    inventors: '张婷婷;周帅;温川飙;杨静;徐鑫垚;付勇智;李洁',
    year: 2025,
    fileUrl: asset('patents/patent-013.pdf')
  },
  {
    id: 'patent_014',
    title: '中医古籍隐含语义与显式术语的关联方法、系统和介质',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.1',
    owner: '温川飙;徐鑫垚;杨静;张婷婷;周帅;付勇智',
    inventors: '温川飙;徐鑫垚;杨静;张婷婷;周帅;付勇智',
    year: 2025,
    fileUrl: asset('patents/patent-014.pdf')
  },
  {
    id: 'patent_018',
    title: '融合多维度上下文进行模型自适应优化的中医古籍标注方法',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.1',
    owner: '温川飙;周帅;杨静;张婷婷;徐鑫垚;付勇智;李洁',
    inventors: '温川飙;周帅;杨静;张婷婷;徐鑫垚;付勇智;李洁',
    year: 2025,
    fileUrl: asset('patents/patent-018.pdf')
  },
  {
    id: 'patent_020',
    title: '中医古籍异体字字典构建及文本对齐方法、系统和介质',
    type: 'patent',
    typeName: '发明专利',
    registrationNo: '2025.12',
    owner: '杨静;徐鑫垚;温川飙;张婷婷;周帅;付勇智',
    inventors: '杨静;徐鑫垚;温川飙;张婷婷;周帅;付勇智',
    year: 2025,
    fileUrl: asset('patents/patent-020.pdf')
  }
]

const activityPhotos = [
  {
    id: 'photo_001',
    activityId: 'activity_001',
    title: '出土医学文献数字化研讨会现场',
    activityName: '出土医学文献数字化研讨会',
    organizer: '出土医学文献文物保护研究数字实验室',
    location: '成都中医药大学博物馆会议厅',
    imageUrl: asset('activities/activity-group-photo.jpg'),
    thumbUrl: asset('activities/activity-group-photo.jpg'),
    activityTime: '2026-04-18T09:00:00Z',
    summary: '围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。'
  },
  {
    id: 'photo_002',
    activityId: 'activity_002',
    title: '中医药冷门绝学继承型人才学术能力提升培训班',
    activityName: '中医药冷门绝学继承型人才学术能力提升培训班（第六期）',
    organizer: '出土医学文献文物保护研究数字实验室',
    location: '成都中医药大学',
    imageUrl: asset('activities/activity-training.jpg'),
    thumbUrl: asset('activities/activity-training.jpg'),
    activityTime: '2025-11-10T14:00:00Z',
    summary: '围绕中医药冷门绝学传承、古籍整理与学术能力提升开展专题培训。'
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
    coverImage: asset('activities/activity-group-photo.jpg'),
    summary: '围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。',
    content: '<p>本次研讨会邀请医史文献、数字人文和数据工程方向专家，围绕平台建设、数据治理和成果展示进行交流。</p>',
    status: 'past'
  },
  {
    id: 'activity_002',
    name: '中医药冷门绝学继承型人才学术能力提升培训班（第六期）',
    time: '2025-11-10T14:00:00Z',
    endTime: '2025-11-10T17:00:00Z',
    location: '成都中医药大学',
    organizer: '出土医学文献文物保护研究数字实验室',
    coverImage: asset('activities/activity-training.jpg'),
    summary: '围绕中医药冷门绝学传承、古籍整理与学术能力提升开展专题培训。',
    content: '<p>培训班围绕出土医学文献、古籍整理和数字化研究能力提升开展专题交流。</p>',
    status: 'past'
  },
  {
    id: 'activity_003',
    name: '实验室数字化环境建设现场',
    time: '2025-05-20T09:00:00Z',
    endTime: '2025-05-20T11:30:00Z',
    location: '出土医学文献文物保护研究数字实验室',
    organizer: '成都中医药大学',
    coverImage: asset('activities/rare-books-digitization.jpeg'),
    summary: '展示实验室数字化采集、数据处理与古籍整理支撑环境。',
    content: '<p>活动展示实验室机房、数据处理环境及中医古籍数字化支撑平台。</p>',
    status: 'past'
  }
  ,
  {
    id: 'activity_004',
    name: '古籍数字化标注工作座谈会',
    time: '2025-03-12T10:00:00Z',
    endTime: '2025-03-12T12:00:00Z',
    location: '古籍数字化国家实验室',
    organizer: '出土医学文献文物保护研究数字实验室',
    coverImage: asset('activities/rare-books-digitization.jpeg'),
    summary: '围绕古籍文献图像标注、术语规范与数据审核流程进行工作交流。',
    content: '<p>参会人员就标注标准、实体关系录入和质量检查机制进行了讨论。</p>',
    status: 'past'
  },
  {
    id: 'activity_005',
    name: '天回医简整理阶段成果交流会',
    time: '2024-12-06T14:30:00Z',
    endTime: '2024-12-06T17:00:00Z',
    location: '成都中医药大学图书馆',
    organizer: '出土医学文献文物保护研究数字实验室',
    coverImage: asset('activities/tianhui-cctv-report.png'),
    summary: '梳理天回医简文献整理、图像处理与释文对照的阶段性成果。',
    content: '<p>交流会集中展示了简片图像复原、转写校订和数据入库的最新进展。</p>',
    status: 'past'
  },
  {
    id: 'activity_006',
    name: '中医古籍知识服务平台内部评审会',
    time: '2024-09-19T09:30:00Z',
    endTime: '2024-09-19T11:30:00Z',
    location: '出土医学文献文物保护研究数字实验室',
    organizer: '成都中医药大学',
    coverImage: asset('activities/rare-books-digitization.jpeg'),
    summary: '对中医古籍知识服务平台的检索、关联分析与可视化模块进行评审。',
    content: '<p>项目组根据内部评审意见调整了检索入口、知识关联展示与文献跳转流程。</p>',
    status: 'past'
  }]

function paginate(list, pageNum = 1, pageSize = 10) {
  const start = (pageNum - 1) * pageSize
  const rows = list.slice(start, start + pageSize)
  return { total: list.length, pageNum: Number(pageNum), pageSize: Number(pageSize), rows }
}

function getRouteId(request = {}) {
  const { params = {}, query = {}, url = '' } = request
  return params.id || query.id || url.split('?')[0].split('/').filter(Boolean).pop()
}

function matchesSoftwarePatentType(item, type) {
  if (!type) return true
  const normalized = String(type).toLowerCase()
  return String(item.type).toLowerCase() === normalized || item.typeName === type
}

function countByYear(list) {
  const counts = list.reduce((acc, item) => {
    if (!item.year) return acc
    acc[item.year] = (acc[item.year] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts).map(([year, count]) => ({ year: Number(year), count })).sort((a, b) => a.year - b.year)
}

function countBy(list, key) {
  return list.reduce((acc, item) => {
    const label = item[key]
    if (!label) return acc
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})
}

const achievementYearTrends = {
  papers: [
    { year: 2021, count: 12 },
    { year: 2022, count: 18 },
    { year: 2023, count: 21 },
    { year: 2024, count: 23 },
    { year: 2025, count: 25 }
  ],
  patents: [
    { year: 2021, count: 1 },
    { year: 2022, count: 2 },
    { year: 2023, count: 3 },
    { year: 2024, count: 4 },
    { year: 2025, count: 7 }
  ],
  books: [
    { year: 2021, count: 2 },
    { year: 2022, count: 3 },
    { year: 2023, count: 4 },
    { year: 2024, count: 5 },
    { year: 2025, count: 6 }
  ],
  projects: [
    { year: 2021, count: 4 },
    { year: 2022, count: 6 },
    { year: 2023, count: 7 },
    { year: 2024, count: 9 },
    { year: 2025, count: 12 }
  ]
}

const knowledgeGraph = {
  books: [
    { id: 'b1', name: '《临证指南医案》', count: 224, active: true },
    { id: 'b2', name: '《叶天士晚年方案真本》', count: 200, active: false },
    { id: 'b3', name: '《叶氏医案存真》', count: 200, active: false },
    { id: 'b4', name: '《未刻本叶氏医案》', count: 200, active: false },
    { id: 'b5', name: '《眉寿堂方案选存》', count: 200, active: false },
    { id: 'b6', name: '《三家医案合刻》', count: 50, active: false },
    { id: 'b7', name: '《种福堂公选医案》', count: 50, active: false }
  ],
  nodes: [
    { id: 'center', label: '叶天士医案\n知识图谱', type: 'center', level: 1, rings: 3 },
    { id: 'book_lzzn', label: '临证指南\n医案', type: 'book', level: 2, rings: 1 },
    { id: 'book_wnaf', label: '叶天士晚年\n方案真本', type: 'book', level: 2, rings: 1 },
    { id: 'book_yscz', label: '叶氏医案\n存真', type: 'book', level: 2, rings: 0 },
    { id: 'case_1_4', label: '案1-4', type: 'case', level: 3, rings: 1 },
    { id: 'visit_1', label: '诊次1', type: 'visit', level: 3, rings: 1 },
    { id: 'visit_2', label: '诊次2', type: 'visit', level: 3, rings: 0 },
    { id: 'path_lung_heat', label: '病因病机\n肺热', type: 'pathology', level: 2, rings: 1 },
    { id: 'path_qi_block', label: '肺气不能\n清肃', type: 'pathology', level: 3, rings: 0 },
    { id: 'sym_cough', label: '症状\n咳嗽', type: 'symptom', level: 3, rings: 1 },
    { id: 'sym_epilepsy', label: '症状\n痫症', type: 'symptom', level: 3, rings: 0 },
    { id: 'sym_chest', label: '右胸高', type: 'symptom', level: 4, rings: 0 },
    { id: 'formula_siling', label: '方剂\n四苓', type: 'formula', level: 3, rings: 1 },
    { id: 'formula_qingfei', label: '方剂\n清肺饮', type: 'formula', level: 3, rings: 0 },
    { id: 'herb_fuling', label: '茯苓', type: 'herb', level: 4, rings: 0 },
    { id: 'herb_zhuye', label: '淡竹叶', type: 'herb', level: 4, rings: 0 },
    { id: 'herb_zexie', label: '泽泻', type: 'herb', level: 5, rings: 0 },
    { id: 'herb_zhuling', label: '猪苓', type: 'herb', level: 5, rings: 0 },
    { id: 'patient_child', label: '稚年', type: 'patient', level: 4, rings: 0 },
    { id: 'p0', label: '', type: 'herb', level: 5, rings: 0 },
    { id: 'p1', label: '', type: 'symptom', level: 5, rings: 0 },
    { id: 'p2', label: '', type: 'case', level: 5, rings: 0 },
    { id: 'p3', label: '', type: 'formula', level: 5, rings: 0 },
    { id: 'p4', label: '', type: 'pathology', level: 5, rings: 0 },
    { id: 'p5', label: '', type: 'herb', level: 5, rings: 0 },
    { id: 'p6', label: '', type: 'symptom', level: 5, rings: 0 },
    { id: 'p7', label: '', type: 'case', level: 5, rings: 0 },
    { id: 'p8', label: '', type: 'formula', level: 5, rings: 0 },
    { id: 'p9', label: '', type: 'pathology', level: 5, rings: 0 },
    { id: 'p10', label: '', type: 'herb', level: 5, rings: 0 },
    { id: 'p11', label: '', type: 'symptom', level: 5, rings: 0 }
  ],
  links: [
    { source: 'center', target: 'book_lzzn' },
    { source: 'center', target: 'book_wnaf' },
    { source: 'center', target: 'book_yscz' },
    { source: 'book_lzzn', target: 'case_1_4' },
    { source: 'case_1_4', target: 'visit_1' },
    { source: 'case_1_4', target: 'visit_2' },
    { source: 'visit_1', target: 'path_lung_heat' },
    { source: 'visit_1', target: 'path_qi_block' },
    { source: 'visit_1', target: 'sym_cough' },
    { source: 'visit_1', target: 'sym_epilepsy' },
    { source: 'visit_1', target: 'sym_chest' },
    { source: 'visit_1', target: 'formula_siling' },
    { source: 'visit_2', target: 'formula_qingfei' },
    { source: 'formula_siling', target: 'herb_fuling' },
    { source: 'formula_siling', target: 'herb_zhuye' },
    { source: 'formula_siling', target: 'herb_zexie' },
    { source: 'formula_siling', target: 'herb_zhuling' },
    { source: 'case_1_4', target: 'patient_child' },
    { source: 'book_lzzn', target: 'p0' },
    { source: 'case_1_4', target: 'p1' },
    { source: 'case_1_4', target: 'p2' },
    { source: 'visit_1', target: 'p3' },
    { source: 'path_lung_heat', target: 'p4' },
    { source: 'formula_siling', target: 'p5' },
    { source: 'sym_cough', target: 'p6' },
    { source: 'book_wnaf', target: 'p7' },
    { source: 'visit_2', target: 'p8' },
    { source: 'path_qi_block', target: 'p9' },
    { source: 'formula_qingfei', target: 'p10' },
    { source: 'sym_epilepsy', target: 'p11' }
  ],
  detail: {
    title: '《临证指南医案》',
    subtitle: 'Case_1-4 · 叶天士医案知识图谱',
    text: '稚年纯阳体质，热症最多。病偏右胸高，呼气不利，肺气不能清肃。热郁内蒸，逆传膻中，致天君震动，状若痫症。夫肺主卫，心主营，二气循环于肺胃脉中。',
    tags: [
      { label: '肺气不能清肃', type: 'pathology' },
      { label: '痫症', type: 'symptom' },
      { label: '四苓', type: 'formula' },
      { label: '茯苓', type: 'herb' },
      { label: '淡竹叶', type: 'herb' }
    ],
    summary: [
      { label: '来源', value: '《临证指南医案》' },
      { label: '诊次', value: '5 次，默认显示诊次1' },
      { label: '实体', value: '症状 7 · 病机 6 · 方剂 5 · 中药 28' },
      { label: '关系', value: '组成、加味、减味、诊次用方' }
    ]
  }
}

const wordCloudRoutes = ['/api/v1/wordClouds', '/api/v1/word-clouds']
const softwarePatentPaginateRoutes = ['/api/v1/softwarePatents/paginate', '/api/v1/software-patents/paginate']
const softwarePatentStatsRoutes = ['/api/v1/softwarePatents/stats', '/api/v1/software-patents/stats']
const activityPhotoPaginateRoutes = ['/api/v1/activityPhotos/paginate', '/api/v1/activity-photos/paginate']

function createGetRoutes(urls, response) {
  return urls.map(url => ({ url, method: 'get', response }))
}

export default [
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
  ...createGetRoutes(wordCloudRoutes, () => wrap({ list: wordClouds })),
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
  ...createGetRoutes(softwarePatentPaginateRoutes, ({ query = {} }) => {
    let list = [...softwarePatents]
    if (query.year) list = list.filter(s => s.year === Number(query.year))
    if (query.type) list = list.filter(s => matchesSoftwarePatentType(s, query.type))
    return wrap(paginate(list, query.pageNum, query.pageSize))
  }),
  // 9. 查询活动剪影列表
  ...createGetRoutes(activityPhotoPaginateRoutes, ({ query = {} }) => {
    const pageSize = query.pageSize || 12
    return wrap(paginate(activityPhotos, query.pageNum, pageSize))
  }),
  // 11. 获取软著专利统计
  ...createGetRoutes(softwarePatentStatsRoutes, () => wrap({
    total: 17,
    byYear: achievementYearTrends.patents,
    byType: countBy(softwarePatents, 'typeName')
  })),
  // 13. 获取论文统计
  {
    url: '/api/v1/papers/stats',
    method: 'get',
    response: () => wrap({
      total: 99,
      byYear: achievementYearTrends.papers,
      byType: countBy(papers, 'type')
    })
  },
  // 15. 获取专著统计
  {
    url: '/api/v1/books/stats',
    method: 'get',
    response: () => wrap({
      total: 20,
      byYear: achievementYearTrends.books
    })
  },
  // 17. 获取课题统计
  {
    url: '/api/v1/projects/stats',
    method: 'get',
    response: () => wrap({
      total: 38,
      byYear: achievementYearTrends.projects,
      byType: countBy(projects, 'level')
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

  // ------ 以下为带 :id 参数的路由（放在后面，避免误匹配） ------

  // 10. 获取人才详情
  {
    url: '/api/v1/talents/:id',
    method: 'get',
    response: (request = {}) => {
      const id = Number(getRouteId(request))
      const t = talents.find(x => x.id === id)
      if (!t) return wrap(null)
      const achievementPool = [
        { id: 'paper_001', type: 'paper', title: '汉代医学文献数字整理方法研究' },
        { id: 'paper_002', type: 'paper', title: '中医古籍知识图谱构建与应用' },
        { id: 'book_001', type: 'book', title: '出土医书校勘与释读' },
        { id: 'book_002', type: 'book', title: '中医文献数据治理实践' },
        { id: 'project_001', type: 'project', title: '天回医简整理与知识服务' },
        { id: 'project_002', type: 'project', title: '古籍资源结构化与智能检索' },
        { id: 'award_001', type: 'award', title: '中医文献协同研究示范项目' }
      ]
      const count = 1 + ((id - 1) % 5)
      const startIndex = (id * 2) % achievementPool.length
      const achievements = Array.from({ length: count }, (_, index) => {
        const item = achievementPool[(startIndex + index) % achievementPool.length]
        return { ...item, id: `${item.type}_${id}_${index + 1}` }
      })
      return wrap({
        ...t,
        bio: '长期从事中医古籍整理、领域知识抽取与数字资源建设，关注研究成果的结构化表达与传播。',
        achievements
      })
    }
  },
  // 12. 查询软著专利详情
  ...createGetRoutes(['/api/v1/softwarePatents/:id', '/api/v1/software-patents/:id'], (request = {}) => {
    const id = getRouteId(request)
    const sp = softwarePatents.find(s => s.id === id)
    if (!sp) return wrap(null)
    return wrap({
      ...sp,
      applicationDate: `${sp.year}-01-01T00:00:00Z`,
      issueDate: `${sp.year}-12-31T00:00:00Z`,
      description: `${sp.title} 的支撑材料已归档，可在线预览登记证书或专利证书。`,
      pdfUrl: isPdfUrl(sp.fileUrl) ? sp.fileUrl : '',
      attachments: sp.fileUrl ? [
        { name: `${sp.title}.pdf`, url: sp.fileUrl }
      ] : []
    })
  }),
  // 14. 查询论文详情
  {
    url: '/api/v1/papers/:id',
    method: 'get',
    response: (request = {}) => {
      const id = getRouteId(request)
      const p = papers.find(x => x.id === id)
      if (!p) return wrap(null)
      return wrap({
        ...p,
        volume: '',
        issue: '',
        pages: '',
        url: p.fileUrl,
        pdfUrl: isPdfUrl(p.fileUrl) ? p.fileUrl : '',
        attachments: p.fileUrl ? [
          { name: `${p.title}.${isPdfUrl(p.fileUrl) ? 'pdf' : 'jpg'}`, url: p.fileUrl }
        ] : []
      })
    }
  },
  // 16. 查询专著详情
  {
    url: '/api/v1/books/:id',
    method: 'get',
    response: (request = {}) => {
      const id = getRouteId(request)
      const b = books.find(x => x.id === id)
      if (!b) return wrap(null)
      return wrap({
        ...b,
        publishDate: `${b.year}-01-01T00:00:00Z`,
        price: 0,
        pages: 0,
        words: 0,
        pdfUrl: '',
        description: `${b.title}，${b.author}，${b.publisher}，ISBN：${b.isbn || '暂缺'}。`,
        toc: '目录信息待补充',
        attachments: [
          { name: '封面图片', url: b.coverImage }
        ]
      })
    }
  },
  // 18. 查询课题详情
  {
    url: '/api/v1/projects/:id',
    method: 'get',
    response: (request = {}) => {
      const id = getRouteId(request)
      const p = projects.find(x => x.id === id)
      if (!p) return wrap(null)
      return wrap({
        ...p,
        projectNo: p.projectNo,
        startDate: `${p.startYear}-01-01T00:00:00Z`,
        endDate: `${p.endYear}-12-31T00:00:00Z`,
        members: p.participant ? p.participant.split(/[;；、]/).filter(Boolean) : [],
        description: p.summary,
        progress: '进行中',
        attachments: p.fileUrl ? [
          { name: `${p.title}.pdf`, url: p.fileUrl }
        ] : []
      })
    }
  },
  // 19. 查询活动详情
  {
    url: '/api/v1/activities/:id',
    method: 'get',
    response: (request = {}) => {
      const id = getRouteId(request)
      const a = activities.find(x => x.id === id)
      if (!a) return wrap(null)
      return wrap({
        ...a,
        title: a.name,
        type: '会议',
        gallery: [
          a.coverImage,
          asset('activities/activity-lab-room.jpeg'),
          asset('activities/activity-group-photo.jpg')
        ]
      })
    }
  }
]
