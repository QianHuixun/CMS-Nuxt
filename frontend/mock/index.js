﻿const wrap = (data) => ({ code: 200, message: 'success', data })

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
    id: 'db_wanjuan',
    title: '"万卷精华"中医文献文物资源聚合及协同创新平台',
    status: 'active',
    info: '整合出土医学文献与传世医籍，构建多维度知识关联与检索服务。',
    url: asset('databases/wanjuan-platform.png'),
    videoUrl: asset('videos/wanjuan-demo.mp4'),
    icon: 'scroll',
    sort: 2,
    backimg: asset('databases/wanjuan-platform.png')
  },
  {
    id: 'db_bashu',
    title: '巴蜀中医古籍知识库平台',
    status: 'active',
    info: '收录巴蜀地区历代中医古籍文献，支持全文检索与图像对照。',
    url: asset('books/book-classics-second.jpg'),
    icon: 'book',
    sort: 3,
    backimg: asset('books/book-classics-second.jpg')
  },
  {
    id: 'db_museum',
    title: '成都中医药大学博物馆数字VR展厅',
    status: 'active',
    info: '以沉浸式VR技术呈现中医药历史文物与馆藏精品，支持线上虚拟参观。',
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
    title: '基于大模型的中医古籍数据标注系统',
    description: '支持中医古籍实体、关系与语义信息的协同标注。',
    icon: 'pen-tool',
    url: asset('databases/annotation-system.png'),
    videoUrl: asset('videos/annotation-demo.mp4'),
    sort: 1
  },
  {
    id: 'tool_wanjuan',
    title: '敝昔智枢（Bixi Intellihub）\n——智能科研工作流平台',
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
    name: '杨静',
    avatar: asset('talents/yang-jing.jpg'),
    title: '实验室主任 / 教授',
    position: '实验室主任',
    professionalTitle: '教授',
    researchAreas: ['出土医学文献文物数字保护研究'],
    summary: '研究领域：中医哲学与生命伦理',
    description: '成都中医药大学党委副书记，教授，博士生导师，国务院政府特殊津贴专家，四川省“天府青城计划”（“万人计划”）创新领军人才。先后担任成都中医药大学附属医院（四川省中医院）党委书记、成都中医药大学副校长，现任成都中医药大学党委副书记。兼任四川省社科重点实验室主任，中国哲学史学会中医哲学专委会副会长、中华中医药学会健康管理分会副主任委员、世界中医药学会联合会中医药文化专委会副会长。\n主持国家社科基金、教育部项目、国家中医药管理局项目等国家级、部省级科研项目20余项。先后担任全国中医药行业规划教材主编、全国中医药研究生核心课程规划教材主编等。研究成果获中华中医药学会科学技术奖二等奖2项、全国中医药高等教育学会一等奖、四川省人民政府教学成果奖一等奖、四川省哲学社会科学优秀成果二等奖等10余项。',
    institution: '成都中医药大学',
    projects: ['中医生命伦理思想史研究', '出土医学简帛数据库的构建及模式研究', '医学文物文献数据知识发现软件平台研发', '新医科背景下医学人文教育模式构建与推广应用研究', '基于时序知识图谱的中医生命伦理思想演化研究'],
    papers: ['《资本论》内蕴的生命伦理批判', '龙门石刻药方灸法应用特点探析', '生生之道与中医学生命观', '技术、资本与身体：医学美容整形的伦理审思', '道家生生思想视野下中医生命伦理思想刍议', '胆黄连的炮制历史沿革及现代研究进展', '隋唐时期香文化对中医学的影响', '中医“仁和精诚”生命观融入医学生生命教育的价值意蕴与实践路径', '生生之道下孙思邈生命伦理思想发微', '《天回医简》“通天”观探析', '中医古籍指代关系语料库的构建与指代消解方法研究'],
    books: ['杏林选粹：巴蜀地区民间医药调查与保护利用', '中医哲学基础\n（全国中医药研究生核心课程规划教材）'],
    patents: ['中医古籍知识图谱构建方法、设备、介质', '中医古籍异体字字典构建及文本对齐方法、系统和介质', '基于大语言模型的中医古籍症状标准化处理方法', '多层次中医古籍症状标准化处理方法', '小样本中医古籍标注模型适配方法', '中医古籍隐含语义与显式术语的关联方法、系统和介质', '融合多维度上下文进行模型自适应优化的中医古籍标注方法'],
    softwareCopyrights: ['《天回医简》数据库软件V1.0']
  },
  {
    id: 2,
    name: '柳长华',
    avatar: asset('talents/liu-changhua.jpg'),
    title: '智能数据库构建分实验室主任 / 教授',
    position: '智能数据库构建分实验室主任',
    professionalTitle: '教授',
    researchAreas: ['出土医学文献与文物研究'],
    summary: '出土医学文献与文物研究、中医古籍整理与古籍数字化研究、传统医药非物质文化遗产与传统知识保护研究专家。近几年，在主持国家中医药管理局、国家文物局“天回医简”研究中，以辨彰学术，考镜源流的敏锐眼光，证明其学出扁仓医学。',
    description: '柳长华，山东淄博人，现任成都中医药大学中国出土医学文献与文物研究院特聘教授、院长，博士研究生导师，入选国家“百千万人才”国家级人选，四川省千人计划专家。曾任山东中医药大学教授，中国中医科学院中国医史文献研究所教授、所长。  \n2014年主持国家中医药管理局、国家文物局成都天回汉墓医简研究，以辨章学术、考镜源流的敏锐眼光，证明其学出扁仓医学。主编《天回医简》一书，获全国古籍出版社百佳图书（2022年）一等奖。国家社科基金冷门绝学研究专项学术团队首席专家，主持四川省社科基金特别重大委托项目、重大学术工程等多项国家级、省部级项目。',
    institution: '成都中医药大学',
    projects: ['天回医简研究', '《天回医简》研究', '天回汉墓髹漆经脉人像研究', '“荆州胡家草场12号西汉墓出土简牍整理与研究”子项目“医方、杂方的整理与研究”', '“道教医学经典的整理与研究 ”子项目“道教医学外丹术经典的整理与研究”', '出土医学文献与文物研究', '出土医学简帛数据库构建研究', '《天回医简》比类取象名物研究', '出土医学简帛数据库的构建及模式研究', '医药考古视域下的川派中医溯源研究——以四川地区汉代墓葬材料为中心'],
    papers: ['从《天回医简》看汉晋医经的编撰', '三世医学新论', '犮石考——有关先秦医学史的探索', '从出土医学文献看《黄帝内经》中的经脉系统', '五运六气理论对刘完素医学理论体系的影响', '汉代出土医简汤液医学考', '论中医药话语体系的构建及语言学的价值内涵', '始源与应用：天学与术数学知识视域下的针灸“身体图式”', '天回医简中的犮法', '《素问》中《水热穴论篇》《骨空论篇》腧穴分类考', '从简帛医方文献论汤液与本草渊源关系', '巴蜀医家张觉人稿本《外科问答》学术思想探析', '天回汉墓医简《脉书·上经》简三七的编联及对风气致病传变规律的研究', '天回医简《脉书·上经》“豆”字考及其脉象研究', '论汉代卦气说视角下时令节气的疾病思想', '秦汉出土医方学术性质、传播流散与演进脉络研究', '《脉书·上经》中四时疾病系统探析', '《天回医简〈脉书·上经〉》之“脉句”与带钩浅议', '《脉书·上经》重要语句三题', '《天回医简》诊损至脉相关词义新证', '天回医简《脉书·下经》汤液疾病特色探析', '唐代社会背景视域下孙思邈医学形成考论', '先秦时期巫与巫医刍论', '汉代“八风占”与《灵枢·九宫八风》中的“八风”思想', '简帛医书中金石类药物的应用特点及研究价值', '四川成都“天回医简”考古发现现实意义謭论', '新石器时期的巫与巫医初论', '《天回医简》文中之训诂研究'],
    books: ['天回医简', '中医百部经典（影印本）第二辑', '杏林选粹：巴蜀地区民间医药调查与保护利用', '《天回医简》线装本', '中医百部经典（影印本）第三辑'],
    patents: [],
    softwareCopyrights: ['《天回医简》数据库软件V1.0']
  },
  {
    id: 3,
    name: '温川飙',
    avatar: asset('talents/wen-chuanbiao.jpg'),
    title: '数字研究分实验室主任 / 研究员',
    position: '数字研究分实验室主任',
    professionalTitle: '研究员',
    researchAreas: ['古籍数字化'],
    summary: '长期从事医学智能、中西医结合大数据、健康穿戴设备研究',
    description: '研究员，现任中国中医药信息研究会云健康分会会长、中医药专业委员会主任委员。承担重大项目“穴位敏化关键技术智能装备”的研究，开展了穴位敏化诊疗设备的研究。带领团队开发“基于大数据的循证针灸临床决策支持平台”获得四川省科学技术一等奖，并开展“脑电波技术及其在针刺临床研究中的作用”、“针灸治疗中风病临床辨证的一种算法模型探索”、“基于STM32的可穿戴式中医电针治疗仪系统设计”、“基于艾灸作用机制探讨现代灸器的研制现状”等算法的创新研究。',
    institution: '成都中医药大学',
    projects: ['基于数据湖技术的疾病主客观征象及生物信息“分层关联网络”的发现及算法研究—糖尿病为例', '中医药AI模型高质量数据集', '医学出土文物数字化挖掘及分析', '基于时序知识图谱的中医生命伦理思想演化研究'],
    papers: ['中医古籍指代关系语料库的构建与指代消解方法研究', 'A Traditional Chinese Medicine Syndrome Classification Model Based on Cross-Feature Generation by Convolution Neural Network: Model Development and Validation', 'A novel tongue segmentation method based on improved U-Net', 'Global trends in intestinal flora and ulcerative colitis research during the past 10 years: A bibliometric analysis', 'Medical prediction from missing data with max-minus negative regularized dropout', 'Glucose trend prediction model based on improved wavelet transform and gated recurrent unit', 'Luteolin, a flavone ingredient: Anticancer mechanisms, combined medication strategy, pharmacokinetics, clinical trials, and pharmaceutical researches', 'MTS-PRO2SAT: Hybrid Mutation Tabu Search Algorithm in Optimizing Probabilistic 2 Satisfiability in Discrete Hopfield Neural Network', 'Development of Home Beauty Devices for Facial Rejuvenation: Establishment of Efficacy Evaluation System', 'Efficacy of acupuncture for depression: a systematic review and meta-analysis', 'Teaching exploration and practice of new engineering medical-engineering integration professional courses under the background of digital education', 'Exhaled gas biomarkers: a non-invasive approach for distinguishing diabetes and its complications', '基于中医五音理论的失眠临床研究进展及存在问题与策略分析', '基于中医四诊、西医检验和生物信息的多类型传感器数据归一化分层处理架构的研究', '数字疗法在中医药应用中的展望', '构建中医辨证解释体系的挑战与思路', 'PulseNet: Multi-task learning-based non-contact pulse condition diagnosis using multi-scale fusion and transformer'],
    books: ['医学信息安全\n（全国高等学校教材）', '医学图形图像处理', '数字医疗概论'],
    patents: ['一种基于面部视觉的多模态融合中医体质判别方法及系统', '一种基于计算机视觉的面部视频判别中医气血系统', '中医古籍知识图谱构建方法、设备、介质', '基于多波长光源的面部视频判别中医脉象的系统及方法', '中医古籍异体字字典构建及文本对齐方法、系统和介质', '基于大语言模型的中医古籍症状标准化处理方法', '多层次中医古籍症状标准化处理方法', '小样本中医古籍标注模型适配方法', '中医古籍隐含语义与显式术语的关联方法、系统和介质', '融合多维度上下文进行模型自适应优化的中医古籍标注方法'],
    softwareCopyrights: ['基于中医症状、信息量表和智能交互问诊的数据归一化分层处理系统V1.0', '中医文献分析与实体关系标注系统V1.0']
  },
  {
    id: 5,
    name: '任玉兰',
    avatar: asset('talents/ren-yulan.jpg'),
    title: '展示传播分实验室主任 / 教授',
    position: '展示传播分实验室主任',
    professionalTitle: '教授',
    researchAreas: ['中医医史文献与文化研究'],
    summary: '成都中医药大学二级教授，医史文献学硕士、针灸学博士，博士研究生导师、博士后合作导师。四川省第十三批学术与技术带头人。',
    description: '成都中医药大学二级教授，医史文献学硕士、针灸学博士，博士研究生导师、博士后合作导师。四川省第十三批学术与技术带头人。从事中医学科研、教学、医疗工作18年。主要研究方向为中医医史文献与文化研究、中医针灸的临床效应与机制研究。先后主持国家自然科学基金项目4项，省部级项目10项，发表学术论文128篇，其中第一作者/通讯作者SCI源刊论文20余篇，主编/副主编规划教材、学术专著8部，获国家科技进步奖二等奖1项、省科技进步一等奖2项，专利11项。',
    institution: '成都中医药大学',
    projects: ['出土医药文物3D数据库的建设模式与示范研究', '巴蜀古医籍书目汇考及数据库建设', '“巴蜀中医药·健康行天下”科普活动', '新文科视域下中医药院校美育教学体系建设研究', '成都历代名医的历史贡献与当代价值研究', '文字、文化与医道的融通研究', '《伤寒述微》整理研究', '闭经古籍文献挖掘与出版', '出土医学简帛数据库的构建及模式研究', '基于BERT预训练模型的医案类古籍知识关联与溯源研究'],
    papers: ['新文科视域下高等中医药院校美育教学体系构建的价值意蕴及路径——以成都中医药大学为例', '刘民叔《素问痿论释难》治痿学术思想探析', 'Research Report on Red Traditional Chinese Medicine Cultural Resources in  Bazhong Area', '从简帛医书看早期中医外感病因理论的发生', '从简帛医书到《伤寒论》：张仲景伤寒辨治体系源流论', '基于系统论的脾肾先后天理论新释', '从痉病理论的演进看张仲景对早期简帛医籍的继承与超越', '从瘴气到疠气:吴又可瘟疫学说考源', 'Medical prediction from missing data with max-minus negative regularized dropout'],
    books: ['中医文献学', '中医药文化学\n（全国高等医学院校中医药类系列教材）', '中国古医籍整理丛书续编 伤寒集验'],
    patents: [],
    softwareCopyrights: []
  },
  {
    id: 6,
    name: '赵琼',
    avatar: asset('talents/zhao-qiong.png'),
    title: '修复保护分实验室主任 / 研究员',
    position: '修复保护分实验室主任',
    professionalTitle: '研究员',
    researchAreas: ['中医古籍整理研究'],
    summary: '多年来主要从事中医儿科学的文献整理与临床诊治，擅长中医古籍文献的整理研究。',
    description: '二级教授、医学博士、博士生导师，现为四川省学术技术带头人、四川省中医药学术技术带头人、中华中医药学会儿科分会常务委员、世界中医药联合会儿科专委会常务理事、中国民族医药学会儿科分会常务委员、四川省中医药学会儿科专业委员会常务委员、四川省中医药学会儿童早期发展与健康研究会中医儿科慢病管理委员会副主任委员、四川省儿童优生托育协会中西医结合儿科分会常务委员等。先后发表学术论文140余篇，主编专著/教材8部，参编21部。主持承担国家级项目3项、部省级课题12项，主持获得省科技进步奖1项，其他科研奖励2项，取得发明专利及软件著作权9项。',
    institution: '成都中医药大学',
    projects: ['巴蜀中医古籍知识库平台构建', '巴蜀名医处方脉案手迹搜集整理研究', '《寒疫合编四卷》整理出版', '汉文古籍普查研究', '儿科古籍藏文文献整理、修复与挖掘利用研究', '中药材纸张与古籍修复保护研究', '基于名医处方手迹浅析巴蜀医家道方用药特点及思想', '明代医家徐用宣《袖珍小儿方》学术思想研究'],
    papers: ['非遗视域下高校传统文化美育教育路径研究——以成都中医药大学图书馆为例', '古籍文献修复可持续发展研究——以四川为例', '《白喉治法要言》治法用药探析', '数字人文视域下巴蜀中医特色资源知识库构建研究', '芝妈橙客《儿科醒》儿科疾病诊治思想探蠡', '巴蜀中医古籍知识建设思路的探讨', '基于名医处方手迹浅析巴蜀医家道方用药特点及思想'],
    books: ['儿科古籍文献选读', '民国时期温病学文献汇编', '中国古医籍整理丛书续编 儿科醒', '川派中医名家珍本汇刊'],
    patents: [],
    softwareCopyrights: []
  },
  {
    id: 7,
    name: '章红梅',
    avatar: asset('talents/zhang-hongmei.jpg'),
    title: '展示传播分实验室骨干 / 教授',
    position: '展示传播分实验室骨干',
    professionalTitle: '教授',
    researchAreas: ['中医古籍文献整理'],
    summary: '汉语言文字学博士，教授，硕士生导师。任教于成都中医药大学国学院，主要从事出土文献、中医古籍文献整理、研究以及汉语言文字学研究。',
    description: '汉语言文字学博士，教授，硕士生导师。任教于成都中医药大学国学院，主要从事出土文献、中医古籍文献整理、研究以及汉语言文字学研究。主讲《医古文》、《中医文献学专论》等课程。先后主持并完成国家社科基金项目、国家出版资助基金项目、教育部古委会项目、教育部一般项目、教育部青年项目、国家中医药管理局子项目、成都中医药大学校基金项目、成都中医药大学教改项目；主持并完成横向课题4项；主持成都中医药大学“杏林青年学者”项目、四川中医药文化协同发展研究中心重点项目、教育部古委会项目、四川省社科联项目各1项，目前在研；参与并完成国家社科基金项目2项、教育部项目1项。发表论文40余篇，其中CCSCI期刊论文14篇，核心期刊21篇，参编教材2部，主编及独著学术著作5部。学术成果先后荣获全国“优秀古籍图书奖”一等奖、四川省第十八次社会科学优秀成果二等奖，教学方面荣获成都中医药大学本科课堂教学质量二等奖。',
    institution: '成都中医药大学',
    projects: ['基于语料库汉魏至隋唐石刻传抄古文异体字整理与研究', '中国古代涉医石刻文献的搜集、整理与研究', '汉魏至隋唐石刻文献与《汉语大字典》修订研究', '唐代医家墓志文献整理与研究'],
    papers: ['中国古代对温泉疗疾的认知与利用', '新见唐代《李承宗墓志》考释'],
    books: [],
    patents: [],
    softwareCopyrights: []
  },
  {
    id: 8,
    name: '王丽',
    avatar: asset('talents/wang-li.jpg'),
    title: '展示传播分实验室骨干 / 教授',
    position: '展示传播分实验室骨干',
    professionalTitle: '教授',
    researchAreas: ['中医古籍整理与中医药文化研究'],
    summary: '多年来长期从事与中医古籍文献与文化的教学与科研工作',
    description: '王丽，成都中医药大学教授，中医医史文献专业博士研究生。长期致力于中医古籍文献整理和中医药文化的研究及相关课程的教学工作。先后主持、参与各级课题多项，发表论文多篇，校注中医古籍《枕藏外科》《外科秘授著要》等，副主编《中华脉学观止》，参编《百年中医史》《揭秘敝昔遗书与漆人》等书，参编《中医文化学》《医古文》等多部全国中医药行业高等教育“十三五”“十四五”规划教材',
    institution: '成都中医药大学',
    projects: ['巴蜀中西医结合教育先驱王仁叟医事与医著研究', '巴蜀粥养粥疗文献与文化的研究', '杨慎涉医研究', '川派中医和中浚学术经验总结与传承研究', '川派名医王仁叟传世抄本医著整理与研究', '干姜、筠姜的道地产地、名实考证及其文化资源挖掘'],
    papers: ['《天回医简》对辞书编纂的参考价值刍议——以病症名为例', '萧龙友“法当治本”学术思想研究', '齐秉慧《齐氏医案》的学术渊源与特色探析'],
    books: ['中医流派传承丛书 川派中医', '川派中医名家系列丛书：和中浚'],
    patents: [],
    softwareCopyrights: []
  },
  {
    id: 9,
    name: '陈菊',
    avatar: asset('talents/chen-ju.jpg'),
    title: '实验室主任助理 / 副教授',
    position: '实验室主任助理',
    professionalTitle: '副教授',
    researchAreas: ['中医人工智能', '可解释神经网络'],
    summary: '长期从事名中医AI传承及可解释神经网络与智能辨证算法应用研究。',
    description: '长期从事中医人工智能、名中医经验AI传承及可解释神经网络相关研究，具备高级标准化工程师、数据挖掘与分析应用工程师等专业背景。研究方向聚焦中医临床智能辨证论治算法构建、证候特征挖掘、诊疗规律发现与可解释模型应用，注重将中医理论体系、临床经验知识与人工智能方法深度融合。近年来，围绕名老中医经验传承、中医证候识别、病证结合建模等开展研究实践。在出土医学文物数字化研究中，可结合古代医学文献、文物图像、术语知识和临床理论，开展多源数据整理、知识关联建模与智能分析，为出土医学文物的数字保护、知识发现提供技术支撑。',
    institution: '成都中医药大学',
    projects: ['基于数据湖技术的疾病主客观征象及生物信息“分层特征关联网络”的发现及算法研究——糖尿病为例', '基于时序知识图谱的中医生命伦理思想演化研究', '医学文物文献数据知识发现软件平台研发', '医学出土文物数字化挖掘及分析'],
    papers: ['PRO2SAT: Systematic probabilistic satisfiability logic in discrete hopfield neural network', 'MTS-PRO2SAT: Hybrid mutation tabu search algorithm in optimizing probabilistic 2 satisfiability in discrete hopfield neural network', 'A Traditional Chinese Medicine Syndrome Classification Model Based on Cross-Feature Generation by Convolution Neural Network: Model Development and Validation', 'FGRA: Toward Flexible Logic Mining with Ensemble Multi-Attribute\nSelection and Discrete Hopfield Neural Network', '川派中医优势病种的多智能体“跨维度”群决策模型构建探讨'],
    books: [],
    patents: [],
    softwareCopyrights: []
  },
  {
    id: 11,
    name: '闵新',
    avatar: asset('talents/min-xin.jpg'),
    title: '数字研究分实验室骨干 / 助理研究员',
    position: '数字研究分实验室骨干',
    professionalTitle: '助理研究员',
    researchAreas: ['古籍数字化'],
    summary: '多年来以古籍研究从业者身份投身于古籍数字化领域，对古籍文本识别、古籍数据整编、文献信息标注、古籍数据库搭建等一系列生产流程和内容产出均有深入研究，长期深耕古籍数据处理方向，专注古籍资源数字化转化与结构化整理工作。',
    description: '多年来以古籍数字化研究从业者身份深耕古籍文献行业，长期专注于古籍数据处理核心领域。从业期间，系统钻研古籍文字录入、文本校勘、异体字整理、古籍信息标引、数据结构化加工、古籍资源数字化转化等一系列完整生产流程与内容产出工作，具备扎实的专业理论功底与丰富的实操经验。聚焦古籍数据清洗、文本规范化处理、古籍知识库搭建等关键方向，持续探索古籍文献数字化整理的方法与路径。熟练应对古籍文献繁杂、文字晦涩、版本多样等整理难点，严谨完成各类古籍数据梳理、校对整合与标准化输出工作。始终秉持严谨务实的治学态度，立足古籍保护与活化利用需求，不断优化古籍数据处理模式，为古籍文献数字化传承、古籍资源高效利用与学术研究赋能。',
    institution: '成都中医药大学',
    projects: ['多模态数据与知识驱动的糖尿病并发症“相似性关联网络”构建及风险预测方法研究'],
    papers: ['Hypergraph topic neural network with cross-modal fusion for latent treatment pattern recommendation', 'Multi-channel hypergraph topic neural network for clinical treatment pattern mining', '中医古籍指代关系语料库的构建与指代消解方法研究'],
    books: ['大学计算机基础 第8版\n（普通高等教育通识类课程教材）', '大学计算机基础上机实践教程 第8版\n（普通高等教育通识类课程教材）'],
    patents: ['基于大语言模型的中医古籍症状标准化处理方法', '多层次中医古籍症状标准化处理方法'],
    softwareCopyrights: []
  },
  {
    id: 12,
    name: '赵智慧',
    avatar: asset('talents/zhao-zhihui.jpg'),
    title: '数字研究分实验室骨干 / 助理研究员',
    position: '数字研究分实验室骨干',
    professionalTitle: '助理研究员',
    researchAreas: ['中医智能诊疗'],
    summary: '致力于中医四诊客观化，建立基于面部动态数据的中医疾病辨识方法',
    description: '致力于中医四诊客观化及智能辅助诊断，建立基于面部动态数据的体质辨识、气血辨识及证型辨识，并整合多源异构数据建立中医优势病种智能辨证模型，为中医面向移动诊疗的便捷化智能辅助诊疗提供新思路方法。',
    institution: '成都中医药大学',
    projects: ['基于机器视觉与信号处理技术的“视觉脉诊”研究', '基于面部rPPG 视频的中医脉诊关键技术研究'],
    papers: ['PulseNet: Multi-task learning-based non-contact pulse condition diagnosis using multi-scale fusion and transformer', '基于深度学习多模态融合的2型糖尿病中医证素辨证模型的构建'],
    books: [],
    patents: ['一种基于面部视觉的多模态融合中医体质判别方法及系统', '一种基于计算机视觉的面部视频判别中医气血系统', '基于多波长光源的面部视频判别中医脉象的系统及方法'],
    softwareCopyrights: []
  },
  {
    id: 13,
    name: '谭超群',
    avatar: asset('talents/tan-chaoqun.jpg'),
    title: '数字研究分实验室骨干 / 助理研究员',
    position: '数字研究分实验室骨干',
    professionalTitle: '助理研究员',
    researchAreas: ['中药数智化检测与品质追溯研究'],
    summary: '多年来以研究人员身份投身于中药数智化行业，对计算机视觉与智能化检测、品质追溯等全流程均有研究。',
    description: '谭超群，四川大学工学博士/博士后，多年来以一线科研人员身份长期投身于中药数智化研究行业中，对中药样品标准化采集、多模态数据构建、外观-化学-功效关联分析、智能化质量检测模型开发、品质追溯平台整合等一系列生产流程和内容产出均有深入研究。近年来，先后主持国家自然科学基金青年基金、中国博士后科学基金、四川省博士后特别资助、四川省科技厅青年基金等项目4项，并参与国家科技部重大专项、国自然面上项目、省科技厅等项目5项。以第一作者或通讯作者在国内外知名期刊发表论文近20篇，累计发表论文30余篇，致力于将计算机视觉与深度学习技术应用于中药“辨状论质”理论的数智化表达，推动中药质量评价从传统经验向可量化、可追溯的智能化方向迈进。',
    institution: '成都中医药大学',
    projects: ['基于多模态信息融合的中药“外观性状-化学成分-专家经验”质量属性关联表征新方法研究—以花椒为例', '多模态数据驱动的基于“辨状论质”理论花椒品质智能评价方法研究', '基于跨模态注意力融合花椒多源感知数据关联解析与协同表征的智能质量评价方法研究', '基于多源数据融合的中药“外观性状-化学成分-专家经验”质量属性关联表征新方法研究—以川贝母为例'],
    papers: ['Semi-supervised Latent Diffusion Model for Biliary Atresia Class-imbalanced Image Recognition', 'Rapid identification of medicinal plants via \nvisual feature-based deep learning', 'Fine-grained few-shot class-incremental identification of medicinal plants via frequency\u0002aware contrastive learning.', 'Flavor Grading of Zanthoxylum Based on Computer Vision-Multi-Chromatography Fusion', 'Visual feature-based multi-scale hybrid attention network for fine-grained Hawthorn varieties identification.', '基于多尺度特征深度神经网络的不同产地山楂细粒度图像识别'],
    books: [],
    patents: ['基于多尺度特征深度神经网络的半夏产地识别方法与系统'],
    softwareCopyrights: []
  },
  {
    id: 15,
    name: '赖雪瑜',
    avatar: asset('talents/lai-xueyu.jpg'),
    title: '智能数据库构建分实验室骨干 / 讲师',
    position: '智能数据库构建分实验室骨干',
    professionalTitle: '讲师',
    researchAreas: ['出土医学文献'],
    summary: '主要从事出土医学文献与文物研究，解读传世医籍',
    description: '主要从事出土医学文献与文物研究，重点通过出土医学文献与文物的研究对传世医籍解读',
    institution: '成都中医药大学',
    projects: ['古《针经》源流研究——以天回医简《脉书》上下经与传世医经为中心', '成都天回镇老官山M1号墓木牍研究', '天回医简研究', '出土医学简帛数据库构建研究'],
    papers: ['天回医简《脉书·上经》“豆”字考及其脉象研究', '《天回医简》文中之训诂研究', '《脉书·上经》重要语句三题'],
    books: ['《天回医简》线装本', '中医百部经典（影印本）第二辑', '中医百部经典（影印本）第三辑', '杏林选粹：巴蜀地区民间医药调查与保护利用'],
    patents: [],
    softwareCopyrights: []
  },
  {
    id: 16,
    name: '雷霆',
    avatar: asset('talents/lei-ting.jpg'),
    title: '智能数据库构建分实验室骨干 / 助理研究员',
    position: '智能数据库构建分实验室骨干',
    professionalTitle: '助理研究员',
    researchAreas: ['出土医学文献整理研究'],
    summary: '多年来以学者身份投身于中医科研行业中，对出土医学文献整理与数字化均有研究。',
    description: '雷霆，男，湖南邵阳人。成都中医药大学中国出土医学文献与文物研究院助理研究员。湖南中医药大学中医医史文献专业毕业，获医学硕士学位；成都中医药大学中医医史文献专业毕业，获医学博士学位，师从医史文献专家柳长华教授。多年来以学者身份投身于中医科研行业中，对出土医学文献整理与数字化均有研究。研究方向为出土医学文献研究、古籍数字化、中医古籍整理。目前主要从事《天回医简》医学理论解读，与基于知识元的医学知识计算机表示方法研究。目前围绕《天回医简》已发表《天回汉墓医简<脉书·上经>简三七的编联及对风气致病传变规律的研究》《“誘愓”“訹愓”考兼论汉人对精神疾病认识》《<脉书·上经>四时疾病系统探析》 等论文数篇。',
    institution: '成都中医药大学',
    projects: ['医经学视角下天回医简《逆顺五色脉臧验精神》的文献研究', '天回医简研究', '《天回医简》比类取象名物研究'],
    papers: ['天回汉墓医简《脉书·上经》简三七的编联及对风气致病传变规律的研究', '《素问》中《水热穴论篇》《骨空论篇》腧穴分类考', '“誘愓”“訹愓”考兼论汉人对精神疾病认识', '《脉书·上经》中四时疾病系统探析'],
    books: ['《天回医简》线装本', '中医百部经典（影印本）第二辑', '中医百部经典（影印本）第三辑', '杏林选粹：巴蜀地区民间医药调查与保护利用'],
    patents: [],
    softwareCopyrights: ['《天回医简》数据库软件V1.0']
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
    title: '“荆州胡家草场12号西汉墓出土简牍整理与研究”子项目“医方、杂方的整理与研究”',
    type: '国家级',
    year: 2020,
    startYear: 2020,
    endYear: '2024',
    leader: '柳长华',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_002',
    title: '中医生命伦理思想史研究',
    type: '国家级',
    year: 2021,
    startYear: 2021,
    endYear: '2026.09',
    leader: '杨静',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_003',
    title: '基于数据湖技术的疾病主客观征象及生物信息“分层特征关联网络”的发现及算法研究——糖尿病为例',
    type: '国家级',
    year: 2021,
    startYear: 2021,
    endYear: '2026',
    leader: '温川飙',
    participant: '胡绿慧、罗悦、陈菊',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '本项目以糖尿病为对象，面向疾病主客观征象和生物信息，依托数据湖技术汇聚中医四诊、西医检验、生物信息等多源异构数据，研究分层特征关联网络的发现算法，揭示糖尿病相关证候、指标与生物学信息之间的层次化关联规律，为糖尿病辨证分型、风险识别和精准干预提供数据融合与算法支撑。',
    keywords: '疾病主客观征象;生物信息;分层特征关联网络;糖尿病;数据湖技术'
  },
  {
    id: 'project_004',
    title: '中外交流视域下的本草研究--以汉魏至隋唐为中心',
    type: '国家级',
    year: 2021,
    startYear: 2021,
    endYear: '2026.09',
    leader: '陈宪良',
    participant: '王大伟;包得义;刘惹婷;薛云秀',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_005',
    title: '“道教医学经典的整理与研究 ”子项目“道教医学外丹术经典的整理与研究”',
    type: '国家级',
    year: 2023,
    startYear: 2023,
    endYear: '2026',
    leader: '柳长华',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_006',
    title: '汉唐道教金石文献集成研究',
    type: '国家级',
    year: 2024,
    startYear: 2024,
    endYear: '？',
    leader: '王家葵',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_007',
    title: '基于简帛文献的早期医哲关系及中医起源问题研究',
    type: '国家级',
    year: 2024,
    startYear: 2024,
    endYear: '？',
    leader: '殷鸣',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_008',
    title: '基于多模态信息融合的中药“外观性状-化学成分-专家经验”质量属性关联表征新方法研究—以花椒为例',
    type: '国家级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.12',
    leader: '谭超群',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_009',
    title: '面向中医古籍医案的病证-方药类案双路径协同推理研究',
    type: '国家级',
    year: 2025,
    startYear: 2025,
    endYear: '2028.12',
    leader: '周彤',
    participant: '',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_010',
    title: '《天回医简》比类取象名物研究',
    type: '国家级',
    year: 2025,
    startYear: 2025,
    endYear: '2030.09',
    leader: '毕洋',
    participant: '柳长华；邓宏亚；李康；桂珍明；雷霆',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '《天回医简》比类取象名物研究',
    keywords: '《天回医简》；比类取象；名物考证'
  },
  {
    id: 'project_011',
    title: '天回医简研究',
    type: '国家级',
    year: 2026,
    startYear: 2026,
    endYear: '2031.12',
    leader: '柳长华',
    participant: '赖雪瑜；毕洋；杨恺；雷霆；刘阳；李游；鲁金花；钟文霞；欧阳聪；陈柳霖；胡笺舒',
    institution: '成都中医药大学',
    level: '国家级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_012',
    title: '新医科背景下医学人文教育模式构建与推广应用研究',
    type: '省部级',
    year: 2021,
    startYear: 2021,
    endYear: '2023.03',
    leader: '杨静',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_013',
    title: '巴蜀中医古籍知识库平台构建',
    type: '省部级',
    year: 2022,
    startYear: 2022,
    endYear: '2023.06',
    leader: '赵琼',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_014',
    title: '出土医学简帛数据库的构建及模式研究',
    type: '省部级',
    year: 2022,
    startYear: 2022,
    endYear: '2023.08',
    leader: '杨静',
    participant: '柳长华;任玉兰;钟舒婷;李游;胡笺舒;杨恺',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_015',
    title: '基于语料库汉魏至隋唐石刻传抄古文异体字整理与研究',
    type: '省部级',
    year: 2022,
    startYear: 2022,
    endYear: '？',
    leader: '章红梅',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_016',
    title: '川渝地区古代制瓷业与外地制瓷业之间的关系研究',
    type: '省部级',
    year: 2022,
    startYear: 2022,
    endYear: '？',
    leader: '伍秋鹏',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_017',
    title: '闭经古籍文献挖掘与出版',
    type: '省部级',
    year: 2022,
    startYear: 2022,
    endYear: '2023.01',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_018',
    title: '基于机器视觉与信号处理技术的“视觉脉诊”研究',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2024',
    leader: '赵智慧',
    participant: '朱明双；汤朝晖；张婷婷；彭晋；孙毅；张翕然；王昕；张甜；王杰鑫',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '脉诊是中医独特且必不可少的临床诊断方法之一。然现有脉诊客观化仍高度依赖设备，成为阻碍中医远程诊疗的“卡脖子”难题。项目在“心主血脉、其华在面”藏象理论指导下，基于团队面部视频预测心率的技术突破，提出“通过构建‘视觉脉诊’模型以面部（视频）动态识别全息还原传统‘独取寸口’诊脉法”的科学假说。研究采用手机摄像头记录患者面部视频，同步进行专家脉象标注；整合人脸侦测、区域分割、盲源分离、注意力机制等先进机器视觉技术及信号处理技术，通过面部感兴趣区域分割、脉搏源信号提取及脉象预测构建基于面部视频的“视觉脉诊”辨识模型，数字化还原寸口法的脉诊信息。经真实病例验证，视觉脉诊模型准确率达 85%以上。本项目创新中医脉诊研究范式，为脉诊客观化提供新思路。',
    keywords: '脉诊客观化；非接触式；机器视觉；信号处理'
  },
  {
    id: 'project_019',
    title: '天回汉墓髹漆经脉人像研究',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2026.10',
    leader: '柳长华',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_020',
    title: '巴蜀名医处方脉案手迹搜集整理研究',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2026.10',
    leader: '赵琼',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_021',
    title: '巴蜀古医籍书目汇考及数据库建设',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.11',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_022',
    title: '汉魏至隋唐石刻文献与《汉语大字典》修订研究',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.11',
    leader: '章红梅',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_023',
    title: '天回医简集释',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.11',
    leader: '马永萍',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_024',
    title: '苏轼医学思想整理研究及知识图谱构建',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.11',
    leader: '林英',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_025',
    title: '以《天回医简》为中心的巴蜀中医药文化特性及其当代价值研究',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.10',
    leader: '王一童',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_026',
    title: '医药考古视域下的川派中医溯源研究——以四川地区汉代墓葬材料为中心',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.11',
    leader: '毕洋',
    participant: '柳长华；邓宏亚；杨凤武',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '医药考古视域下的川派中医溯源研究——以四川地区汉代墓葬材料为中心',
    keywords: '川派中医、医药考古、医学遗存'
  },
  {
    id: 'project_027',
    title: '古《针经》源流研究——以天回医简《脉书》上下经与传世医经为中心',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.11',
    leader: '赖雪瑜',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_028',
    title: '《寒疫合编四卷》整理出版',
    type: '省部级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.12',
    leader: '赵琼',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_029',
    title: '“巴蜀中医药·健康行天下”科普活动',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '？',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_030',
    title: '中医导引古籍抢救整理与动态复原研究',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '？',
    leader: '刘天宇',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_031',
    title: '民族时钟 健康密码:二十四节气中医非遗康养技术普及',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '？',
    leader: '刘天宇',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_032',
    title: '《天回医简》脉学知识范式及其赓续与嬗变研究',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '2025.12',
    leader: '殷鸣',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_033',
    title: '汉代至民国时期陶瓷中医药文物研究',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.11',
    leader: '伍秋鹏',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_034',
    title: '基于BERT预训练模型的医案类古籍知识关联与溯源研究',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.11',
    leader: '周彤',
    participant: '杨静;任玉兰;王一童;张婷婷;胡笺舒',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_035',
    title: '基于时序知识图谱的中医生命伦理思想演化研究',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.11',
    leader: '张婷婷',
    participant: '杨静;温川飙;陈菊;王一童;付勇智;刘梓涵',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_036',
    title: '《天回医简·脉书》比类取象名物考证研究',
    type: '省部级',
    year: 2024,
    startYear: 2024,
    endYear: '2026',
    leader: '毕洋',
    participant: '/',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '《天回医简·脉书》比类取象名物考证研究',
    keywords: '《天回医简·脉书》；比类取象；名物考证'
  },
  {
    id: 'project_037',
    title: '中医药AI模型高质量数据集',
    type: '省部级',
    year: 2025,
    startYear: 2025,
    endYear: '',
    leader: '温川飙',
    participant: '于正、高原',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '项目致力于构建覆盖全面、标准规范的多模态中医药AI数据集，解决中医药高质量数据资源匮乏问题，服务“健康中国”战略。项目将整合临床、古籍等多源数据，并实施质量控制与安全共享机制，为中医药智能化发展提供可靠的数据基础。',
    keywords: '中医药AI模型;高质量数据集;多模态数据;数据治理;知识图谱'
  },
  {
    id: 'project_038',
    title: '基于跨模态注意力融合花椒多源感知数据关联解析与协同表征的智能质量评价方法研究',
    type: '省部级',
    year: 2025,
    startYear: 2025,
    endYear: '2027',
    leader: '谭超群',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_039',
    title: '多模态数据驱动的基于“辨状论质”理论花椒品质智能评价方法研究',
    type: '省部级',
    year: 2025,
    startYear: 2025,
    endYear: '2027',
    leader: '谭超群',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_040',
    title: '《天回医简》研究',
    type: '省部级',
    year: 2025,
    startYear: 2025,
    endYear: '2030.08',
    leader: '柳长华',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_041',
    title: '《天回医简·犮理》文献与古治法源流研究',
    type: '省部级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.12',
    leader: '杨恺',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_042',
    title: '早期医哲会通的知识整合与义理阐释',
    type: '省部级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.12',
    leader: '魏子钦',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_043',
    title: '面向中医方书古籍的病证-方药类方双路径协同推理研究',
    type: '省部级',
    year: 2026,
    startYear: 2026,
    endYear: '2027.12',
    leader: '周彤',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_044',
    title: '多模态数据与知识驱动的糖尿病并发症“相似性关联网络”构建及风险预测方法研究',
    type: '省部级',
    year: 2026,
    startYear: 2026,
    endYear: '2027.12',
    leader: '闵新',
    participant: '/',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '本项目针对糖尿病并发症防控的临床需求,以构建多模态数据和知识驱动的糖尿病并发症相似性关联网络为核心目标。研究内容包括三个层次:一是基于领域知识的中西医多模态数据一致性表示方法,通过自然语言处理技术标准化抽取症状、体征、诊断、治疗等临床实体,设计双层关系模型实现跨域数据结构化对齐与知识融合,建立统一特征空间;二是多维度糖尿病并发症相似性关联网络构建方法,通过特征优选算法筛选核心特征集,设计多模态混合相似度模型量化并发症在病理生理、临床表现、分子机制等多维度的关联强度,引入冲突检测与动态权重真值发现算法构建高置信度关联网络并可视化风险传导路径;三是基于图主题神经网络的并发症风险预测方法,融合图神经网络与主题模型实现全局关联与语义主题的协同建模,利用网络拓扑结构与节点嵌入实现动态预测,并通过多中心临床数据验证模型效能。项目创新提出"多模态数据融合-多维动态关联推演-闭环决策系统"研究范式,突破中西医数据异构性壁垒,为糖尿病并发症精准防控提供理论突破与技术工具,推动中西医协同诊疗模式创新。',
    keywords: '糖尿病并发症；关联网络；预警模型'
  },
  {
    id: 'project_045',
    title: '基于多源信息融合的中药“外观性状-化学成分-专家经验”质量属性关联机制方法研究—以川贝母为例',
    type: '省部级',
    year: 2026,
    startYear: 2026,
    endYear: '2027.12',
    leader: '谭超群',
    participant: '',
    institution: '成都中医药大学',
    level: '省部级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_046',
    title: '陶瓷类中医药文物研究',
    type: '厅局级',
    year: 2022,
    startYear: 2022,
    endYear: '2024.07',
    leader: '伍秋鹏',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_047',
    title: '巴蜀地区中医古籍目录整理及研究',
    type: '厅局级',
    year: 2022,
    startYear: 2022,
    endYear: '2024.07',
    leader: '胡笺舒',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_048',
    title: '从汉字字源角度探究医古文中的中医思维',
    type: '厅局级',
    year: 2022,
    startYear: 2022,
    endYear: '2024.07',
    leader: '程子倩',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_049',
    title: '敦煌写卷中的外来药物及其文化研究',
    type: '厅局级',
    year: 2022,
    startYear: 2022,
    endYear: '2024.08',
    leader: '陈宪良',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_050',
    title: '古代毛女采药图像及造像研究',
    type: '厅局级',
    year: 2022,
    startYear: 2022,
    endYear: '2024.08',
    leader: '伍秋鹏',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_051',
    title: '《伤寒述微》整理研究',
    type: '厅局级',
    year: 2022,
    startYear: 2022,
    endYear: '2024.04',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_052',
    title: '多元视角下的成都老官山髹漆经穴人像文化内涵研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '？',
    leader: '周兴兰',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_053',
    title: '成都中医药大学博物馆藏中医药文物整理与研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '？',
    leader: '伍秋鹏',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_054',
    title: '成都老官山M3墓主人医学传承来源地的考古学研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2024',
    leader: '毕洋',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_055',
    title: '川渝地区汉代画像上的酒文化资料整理与研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '？',
    leader: '伍秋鹏',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_056',
    title: '《刘河间伤寒六种附二种》《保命歌括三十五卷》重点修复项目',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2023.12',
    leader: '林英',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_057',
    title: '汉文古籍普查研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '',
    leader: '赵琼',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_058',
    title: '新文科视域下中医药院校美育教学体系建设研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.01',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_059',
    title: '成都历代名医的历史贡献与当代价值研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.01',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_060',
    title: '川派名医王仁叟传世抄本医著整理与研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.01',
    leader: '王丽',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_061',
    title: '干姜、筠姜的道地产地、名实考证及其文化资源挖掘',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.01',
    leader: '王丽',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_062',
    title: '成都中医药大学图书馆古籍《脉因证治四卷》《古本难经阐注四卷》等十五种一般修复项目',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2023.12',
    leader: '张肖瑾',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_063',
    title: '川派中医和中浚学术经验总结与传承研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.03',
    leader: '王丽',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_064',
    title: '巴蜀儿科名家医案整理研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.03',
    leader: '林英',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_065',
    title: '杨慎涉医研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2024.09',
    leader: '王丽',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_066',
    title: '唐代医家墓志文献整理与研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.08',
    leader: '章红梅',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_067',
    title: '成都天回镇老官山M1号墓木牍研究',
    type: '厅局级',
    year: 2023,
    startYear: 2023,
    endYear: '2025.08',
    leader: '赖雪瑜',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_068',
    title: '四川地区出土医药卫生文物的调查研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026',
    leader: '彭慧',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_069',
    title: '基于《楚辞》的植物香料看先秦香药文化',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026',
    leader: '曹钰',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_070',
    title: '《黄帝内经》“如操带钩”之带钩形制研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026',
    leader: '毕洋',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_071',
    title: '《黄帝内经素问二十四卷》《万氏家传保命歌括三十五卷》重点古籍修复项目',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2024.12',
    leader: '林英',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_072',
    title: '《药要便蒙二卷》 《神农本草经四卷》《辨证录十四卷附胎产秘书三卷》古籍修复项目',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2024.12',
    leader: '张肖瑾',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_073',
    title: '巴蜀中医药古籍数字化建设',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2024.12',
    leader: '张肖瑾',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_074',
    title: '巴蜀粥养粥疗文献与文化的研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2025.01',
    leader: '王丽',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_075',
    title: '数字人文视野下川派名医处方笺的整理研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2025.07',
    leader: '张肖瑾',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_076',
    title: '巴蜀中西医结合教育先驱王仁叟医事与医著研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.09',
    leader: '王丽',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_077',
    title: '医学文物文献数据知识发现软件平台研发',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '杨静',
    participant: '张婷婷;程小恩;陈菊;刘梓涵;许涛;邓苏桁',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_078',
    title: '出土医学简帛数据库构建研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '柳长华',
    participant: '毕洋;赖雪瑜;李游;曹碧晏;胡笺舒;廖俊柱;鲁金花;程子倩',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_079',
    title: '医学出土文物数字化挖掘及分析',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '温川飙',
    participant: '陈菊;程小恩;张婷婷;刘梓涵;范鹏;邓苏桁',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_080',
    title: '中药材染纸与古籍修复保护研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '林英',
    participant: '赵琼;胡琴;王可可;张肖瑾;向丽;罗涵亓;吴涛',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_081',
    title: '出土医药文物3D数据库的建设模式与示范研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '任玉兰',
    participant: '谭红兵;彭慧;蒋林玲;胡笺舒;李游;曹碧晏;程子倩;鲁金花',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_082',
    title: '先秦时期的巫与巫医研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '毕洋',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_083',
    title: '《五十二病方》残片重新拼缀及释读研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '鲁金花',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_084',
    title: '秦简散见涉医文献整理研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.08',
    leader: '马永萍',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_085',
    title: '成都名中医处方笺整理及知识图谱构建研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '？',
    leader: '张肖瑾',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_086',
    title: '川派名医唐伯渊手迹搜集整理研究',
    type: '厅局级',
    year: 2024,
    startYear: 2024,
    endYear: '2026.12',
    leader: '张肖瑾',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_087',
    title: '基于面部rPPG 视频的中医脉诊关键技术研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2026.12',
    leader: '赵智慧',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_088',
    title: '考古学视域下秦汉时期贵州少数民族体育文化研究——以考古出土青铜剑为中心',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2026.03',
    leader: '毕洋',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_089',
    title: '东方美学视域下巴蜀中医药文化传承创新探索与实践—以天回医简为对象',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '李游',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_090',
    title: '医哲会通视域下朱丹溪生命伦理的哲学机制',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '魏子钦',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_091',
    title: '《天回医简》考古发现的现实意义与价值研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '毕洋',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_092',
    title: '秦汉简牍医方研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '刘立伟',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_093',
    title: '巴蜀古医籍整理丛书(第二批)-本草文献',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '王家葵',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_094',
    title: '唐五代蜀地波斯药商李珣及其家族研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '陈宪良',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_095',
    title: '简帛医书文化负载词英译策略及其多模态传播研究——以天回医简为例',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '罗军',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_096',
    title: '数字人文视域下的中医药智慧博物馆建设路径研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '胡笺舒',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_097',
    title: '出土医学文献元数据标准与叙词表构建研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.09',
    leader: '曹碧晏',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_098',
    title: '天回医简美学思想研究',
    type: '厅局级',
    year: 2025,
    startYear: 2025,
    endYear: '2027.10',
    leader: '李游',
    participant: '',
    institution: '成都中医药大学',
    level: '厅局级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_099',
    title: '出土医学文献与文物研究',
    type: '校级',
    year: 2022,
    startYear: 2022,
    endYear: '2025',
    leader: '柳长华',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_100',
    title: '外来花药在汉地的传播及其文化研究',
    type: '校级',
    year: 2022,
    startYear: 2022,
    endYear: '2023',
    leader: '陈宪良',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_101',
    title: '文字、文化与医道的融通研究',
    type: '校级',
    year: 2022,
    startYear: 2022,
    endYear: '2025.10',
    leader: '任玉兰',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_102',
    title: '中国古代涉医石刻文献的搜集、整理与研究',
    type: '校级',
    year: 2022,
    startYear: 2022,
    endYear: '2025.10',
    leader: '章红梅',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_103',
    title: '儿科古籍特藏文献整理、修复与挖掘利用研究',
    type: '校级',
    year: 2023,
    startYear: 2023,
    endYear: '2027.11',
    leader: '赵琼',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_104',
    title: '返本开新"背景下中医院校"国学"课程教学中巴蜀特色文化的适度融入',
    type: '校级',
    year: 2024,
    startYear: 2024,
    endYear: '2026',
    leader: '陈宪良',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
  },
  {
    id: 'project_105',
    title: '医经学视角下天回医简《逆顺五色脉臧验精神》的文献研究',
    type: '校级',
    year: 2025,
    startYear: 2025,
    endYear: '2027',
    leader: '雷霆',
    participant: '',
    institution: '成都中医药大学',
    level: '校级',
    summary: '',
    keywords: ''
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
    coverImage: asset('papers/paper-004.jpeg')
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
    coverImage: asset('databases/annotation-system.png')
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
    coverImage: asset('books/book-classics-second.jpg')
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
    coverImage: asset('databases/wanjuan-platform.png')
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
    coverImage: asset('activities/rare-books-digitization.jpeg')
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
    coverImage: asset('activities/activity-lab-room.jpeg')
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
    coverImage: asset('databases/wanjuan-platform.png')
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
    coverImage: asset('papers/paper-004.jpeg')
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
    coverImage: asset('databases/bronze-acupuncture-figure.jpg')
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
    coverImage: asset('databases/tianhui-database.png')
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
    coverImage: asset('databases/wanjuan-platform.png')
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
    coverImage: asset('papers/paper-004.jpeg')
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
    title: '出土医学文献文物保护研究数字重点实验室发布成果暨举办学术研讨会',
    activityName: '出土医学文献文物保护研究数字重点实验室发布成果暨举办学术研讨会',
    organizer: '出土医学文献文物保护研究数字实验室',
    location: '成都中医药大学',
    imageUrl: asset('activities/activity-lab-release.jpg'),
    thumbUrl: asset('activities/activity-lab-release.jpg'),
    activityTime: '2025-05-16T09:00:00Z',
    summary: '实验室发布"出土医学古籍Agent"成果，举办出土医学文献文物数字研究学术研讨会，展示AI赋能医学文献研究的最新进展。'
  },
  {
    id: 'photo_002',
    activityId: 'activity_002',
    title: '中国哲学史学会中医哲学专委会2025学术年会暨中医药社科哲学专家委员会成立大会',
    activityName: '中国哲学史学会中医哲学专委会2025学术年会',
    organizer: '中国哲学史学会中医哲学专委会、中国中医药出版社、成都中医药大学',
    location: '成都',
    imageUrl: asset('activities/activity-philosophy-conf.jpg'),
    thumbUrl: asset('activities/activity-philosophy-conf.jpg'),
    activityTime: '2025-10-19T09:00:00Z',
    summary: '大会以"中医哲学传统与现代性对话"为主题，举行全国中医药院校首个中医哲学研究中心成立仪式，发布"中医哲学研究专家共识（成都）"。'
  },
  {
    id: 'photo_003',
    activityId: 'activity_003',
    title: '2023年出土医学文献与文物学术会议（第二届）',
    activityName: '2023年出土医学文献与文物学术会议（第二届）',
    organizer: '成都中医药大学、世界中医药学会联合会',
    location: '成都',
    imageUrl: asset('activities/activity-conf-2023.jpg'),
    thumbUrl: asset('activities/activity-conf-2023.jpg'),
    activityTime: '2023-12-23T09:00:00Z',
    summary: '以"返本开新——开启与上古的对话"为主题，35名专家学者集中探讨《天回医简》相关学术问题，全国100余名专家学者、400余名硕博研究生参会。'
  },
  {
    id: 'photo_004',
    activityId: 'activity_004',
    title: '古籍数字化标注工作座谈会',
    activityName: '古籍数字化标注工作座谈会',
    organizer: '出土医学文献文物保护研究数字实验室',
    location: '古籍数字化国家实验室',
    imageUrl: asset('activities/rare-books-digitization.jpeg'),
    thumbUrl: asset('activities/rare-books-digitization.jpeg'),
    activityTime: '2025-03-12T10:00:00Z',
    summary: '围绕古籍文献图像标注、术语规范与数据审核流程进行工作交流。'
  },
  {
    id: 'photo_005',
    activityId: 'activity_005',
    title: '天回医简整理阶段成果交流会',
    activityName: '天回医简整理阶段成果交流会',
    organizer: '出土医学文献文物保护研究数字实验室',
    location: '成都中医药大学图书馆',
    imageUrl: asset('activities/tianhui-cctv-report.png'),
    thumbUrl: asset('activities/tianhui-cctv-report.png'),
    activityTime: '2024-12-06T14:30:00Z',
    summary: '梳理天回医简文献整理、图像处理与释文对照的阶段性成果。'
  },
  {
    id: 'photo_006',
    activityId: 'activity_006',
    title: '中医古籍知识服务平台内部评审会',
    activityName: '中医古籍知识服务平台内部评审会',
    organizer: '成都中医药大学',
    location: '出土医学文献文物保护研究数字实验室',
    imageUrl: asset('activities/rare-books-digitization.jpeg'),
    thumbUrl: asset('activities/rare-books-digitization.jpeg'),
    activityTime: '2024-09-19T09:30:00Z',
    summary: '对中医古籍知识服务平台的检索、关联分析与可视化模块进行评审。'
  }
]

const activities = [
  {
    id: 'activity_001',
    name: '出土医学文献文物保护研究数字重点实验室发布成果暨举办学术研讨会',
    time: '2025-05-16T09:00:00Z',
    endTime: '2025-05-16T17:00:00Z',
    location: '成都中医药大学',
    organizer: '出土医学文献文物保护研究数字实验室',
    coverImage: asset('activities/activity-lab-release.jpg'),
    gallery: [
      asset('activities/activity-lab-release.jpg'),
      asset('activities/activity-lab-room.jpeg'),
      asset('activities/rare-books-digitization.jpeg')
    ],
    summary: '实验室发布"出土医学古籍Agent"成果，举办出土医学文献文物数字研究学术研讨会，展示AI赋能医学文献研究的最新进展。',
    content: '<p>5月16日，出土医学文献文物保护研究数字重点实验室发布"出土医学古籍Agent"成果并举办出土医学文献文物数字研究学术研讨会。</p><p>大会发布了省级重点实验室出土医学文献文物保护研究数字实验室自研的"出土医学古籍Agent"，展示了人工智能技术对"天回"汉代医简等文物进行数字化保护与研究成果。成果以出土医学文献文物为核心资源，依托尖端扫描、存储、算力设备，通过智能数据库构建、数字研究、展示传播、修复保护四个分实验室协同联动，构建从古籍解码到文化传承的创新生态。</p><p>围绕"AI时代下医学文献文物的数字活化"，与会专家从数字孪生、古籍数字化保存活化、知识分类与人工智能结合等角度展开学术研讨。实验室学术委员会还召开建设与发展学术研讨会，共同讨论实验室"十五五"学术规划。</p><p>下一步，实验室将在学术委员会指导下优化规划，扎实推进出土医学文献文物与数字技术的融合创新，持续引领出土医学文献文物前沿研究。</p>',
    status: 'past'
  },
  {
    id: 'activity_002',
    name: '中国哲学史学会中医哲学专委会2025学术年会暨中医药社科哲学专家委员会成立大会',
    time: '2025-10-19T09:00:00Z',
    endTime: '2025-10-20T17:00:00Z',
    location: '成都',
    organizer: '中国哲学史学会中医哲学专委会、中国中医药出版社、成都中医药大学',
    coverImage: asset('activities/activity-philosophy-conf.jpg'),
    gallery: [
      asset('activities/activity-philosophy-conf.jpg'),
      asset('activities/activity-group-photo.jpg'),
      asset('activities/rare-books-digitization.jpeg')
    ],
    summary: '大会以"中医哲学传统与现代性对话"为主题，举行全国中医药院校首个中医哲学研究中心成立仪式，发布"中医哲学研究专家共识（成都）"，为成都中医药大学70周年校庆学术活动拉开序幕。',
    content: '<p>10月19—20日，由中国哲学史学会中医哲学专委会、中国中医药出版社、成都中医药大学共同主办的中国哲学史学会中医哲学专委会2025学术年会、中国中医药出版社中医药社科哲学专家委员会成立大会在成都召开。</p><p>本次大会主题为"中医哲学传统与现代性对话"，吸引来自中国社会科学院、中国中医科学院、中国科学技术信息研究所、北京大学、南开大学、北京中医药大学、上海中医药大学等20余所高校、科研院所的120余位专家学者参会，共同探讨中医哲学的原创智慧与现代转化。</p><p>开幕式举行了"成都中医药大学中医哲学研究中心"成立仪式，该中心为全国中医药院校首家中医哲学研究中心。中国哲学史学会中医哲学专委会、中国中医药出版社与成都中医药大学共同发布"中医哲学研究专家共识（成都）"。</p><p>大会设置主旨报告、主题报告和分论坛报告，40余名专家围绕中医哲学及其当代建构、中国哲学与中医哲学、生命哲学与中医生命伦理等议题展开交流，为成都中医药大学70周年校庆学术活动拉开序幕。</p>',
    status: 'past'
  },
  {
    id: 'activity_003',
    name: '2023年出土医学文献与文物学术会议（第二届）',
    time: '2023-12-23T09:00:00Z',
    endTime: '2023-12-24T17:00:00Z',
    location: '成都',
    organizer: '成都中医药大学、世界中医药学会联合会',
    coverImage: asset('activities/activity-conf-2023.jpg'),
    gallery: [
      asset('activities/activity-conf-2023.jpg'),
      asset('activities/activity-group-photo.jpg'),
      asset('activities/rare-books-digitization.jpeg')
    ],
    summary: '以"返本开新——开启与上古的对话"为主题，35名专家学者集中探讨《天回医简》相关学术问题，全国100余名专家学者、400余名硕博研究生参会。',
    content: '<p>12月23日至24日，海内外医史界、考古界、古文字界等领域的专家学者聚首四川成都，参加由成都中医药大学与世界中医药学会联合会主办的2023年出土医学文献与文物（第二届）学术会议。</p><p>大会开幕式上举行了国家中医药管理局重点研究室"出土医学文献与文物重点研究室"揭牌仪式。与会嘉宾围绕出土医学文献与文物研究的学术价值、学科建设、人才培养和文化传播展开交流。</p><p>为期两天的会议以"返本开新——开启与上古的对话"为主题，来自成都中医药大学、中国中医科学院、复旦大学、南京大学、武汉大学、北京中医药大学等高校，以及英国、日本等国的35名专家学者集中探讨《天回医简》相关学术问题。</p><p>会议重点围绕文物与医学实践、简帛与传世文献、简帛文字考释、文物与传统文化以及文物与医学思想发表主题演讲，全国50余所科研院所的100余名专家学者、400余名硕博研究生现场参会。</p>',
    status: 'past'
  },
  {
    id: 'activity_004',
    name: '古籍数字化标注工作座谈会',
    time: '2025-03-12T10:00:00Z',
    endTime: '2025-03-12T12:00:00Z',
    location: '古籍数字化国家实验室',
    organizer: '出土医学文献文物保护研究数字实验室',
    coverImage: asset('activities/rare-books-digitization.jpeg'),
    gallery: [
      asset('activities/rare-books-digitization.jpeg'),
      asset('databases/annotation-system.png'),
      asset('activities/activity-lab-room.jpeg')
    ],
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
    gallery: [
      asset('activities/tianhui-cctv-report.png'),
      asset('databases/tianhui-slip-001.png'),
      asset('papers/tianhui-slip-column.png')
    ],
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
    gallery: [
      asset('activities/rare-books-digitization.jpeg'),
      asset('databases/wanjuan-platform.png'),
      asset('databases/annotation-system.png')
    ],
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
    { year: 2022, count: 15 },
    { year: 2023, count: 29 },
    { year: 2024, count: 30 },
    { year: 2025, count: 22 },
    { year: 2026, count: 4 }
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
      total: 105,
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
        gallery: a.gallery || [a.coverImage]
      })
    }
  }
]
