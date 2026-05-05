中医大前台展示平台 Ajax 接口规范

本规范依据 中医大前台接口梳理.docx 二次整理，全部为前台只读 GET 接口。

修订处理

- 删除原文档中的 POST /api/v1/items 示例，避免误解为需要写接口。
- 删除 Authorization 等鉴权要求；前台展示接口默认无需鉴权。
- 保留原 Word 文档中的 camelCase 路径，同时在 mock routes 中提供部分 kebab-case 兼容别名。
- 论文详情和统计不返回引用次数、阅读热度。
- 人才详情不返回手机号等敏感联系方式。
- 不包含知识图谱接口。
统一响应

{
  "code": 200,
  "message": "success",
  "data": {}
}

接口总览

模块
接口
方法
路径
核心资源库页面 - 数据库入口
获取数据库列表
GET
/api/v1/databases
核心资源库页面 - 自研工具入口
获取自研工具列表
GET
/api/v1/tools
学术动态页面 1 - 人才展示
获取人才信息概要列表
GET
/api/v1/talents
学术动态页面 1 - 词云组件
获取词云列表
GET
/api/v1/wordClouds
学术动态页面 1 和课题概览页
查询课题概要列表
GET
/api/v1/projects/paginate
学术动态页面 2 和论文概览页
查询论文概要列表
GET
/api/v1/papers/paginate
学术动态页面 2 和专著概览页
查询专著概要列表
GET
/api/v1/books/paginate
学术动态页面 2 和软著专利概览页
查询软著专利概要列表
GET
/api/v1/softwarePatents/paginate
学术动态页面 2 - 活动剪影组件
查询活动剪影列表
GET
/api/v1/activityPhotos/paginate
人才详情页面
获取人才详情
GET
/api/v1/talents/{id}
软著专利概览页统计区

获取软著专利统计
GET
/api/v1/softwarePatents/stats
软著专利详情页
查询软著专利详情
GET
/api/v1/softwarePatents/{id}
论文概览页统计区
获取论文统计
GET
/api/v1/papers/stats
论文详情页
查询论文详情
GET
/api/v1/papers/{id}
专著概览页统计区
获取专著统计
GET
/api/v1/books/stats
专著详情页
查询专著详情
GET
/api/v1/books/{id}
课题概览页统计区
获取课题统计

GET
/api/v1/projects/stats
课题详情页
查询课题详情
GET
/api/v1/projects/{id}
活动概览页
查询活动概要列表
GET
/api/v1/activities/paginate
活动详情页
查询活动详情
GET
/api/v1/activities/{id}

接口详情

1. 获取数据库列表

- 页面用途：核心资源库页面 - 数据库入口
- 方法路径：GET /api/v1/databases
- 鉴权：无需鉴权
- 说明：获取现有全量数据库列表，不分页。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
id
string
数据库 ID
title
string
数据库名称
status
string
状态: active / inactive
info
string
简介
url
string
访问地址
icon
string
前端图标标识
sort
integer
排序号

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "list": [
      {
        "id": "db_tianhui",
        "title": "天回医简数据库",
        "status": "active",
        "info": "汇聚天回汉墓出土医简高清图像、释文、注释、单字切分图像与检索数据。",
        "url": "https://example.edu/databases/tianhui",
        "icon": "database",
        "sort": 1
      }
    ]
  }
}

2. 获取自研工具列表

- 页面用途：核心资源库页面 - 自研工具入口
- 方法路径：GET /api/v1/tools
- 鉴权：无需鉴权
- 说明：获取自研工具全量列表，不分页。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
id
string
工具 ID
title
string
工具名称
description
string
工具说明
icon
string
前端图标标识
url
string
访问地址
sort
integer
排序号

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "list": [
      {
        "id": "tool_annotation",
        "title": "出土医学文献标注工具",
        "description": "支持原简图像、释文、注释、实体和关系的协同标注。",
        "icon": "pen-tool",
        "url": "https://example.edu/tools/annotation",
        "sort": 1
      }
    ]
  }
}

3. 获取人才信息概要列表

- 页面用途：学术动态页面 1 - 人才展示
- 方法路径：GET /api/v1/talents
- 鉴权：无需鉴权
- 说明：获取全量人才概要列表，不分页。前台不公开手机号等敏感联系方式。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
id
integer
人才 ID
name
string
姓名
avatar
string
头像地址
title
string
职称或角色
researchArea
string
研究方向
institution
string
所属机构

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "list": [
      {
        "id": 1,
        "name": "陈维",
        "avatar": "https://example.edu/mock/talents/chen-wei.jpg",
        "title": "教授",
        "researchArea": "出土医学文献整理与经脉数字化",
        "institution": "成都中医药大学"
      }
    ]
  }
}

4. 获取词云列表

- 页面用途：学术动态页面 1 - 词云组件
- 方法路径：GET /api/v1/wordClouds
- 鉴权：无需鉴权
- 说明：获取词云配置列表。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
id
integer
词云 ID
title
string
词云标题
type
string
词云类型
words[].text
string
词条
words[].weight
integer
权重

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "年度热词",
        "type": "annual",
        "words": [
          {
            "text": "天回医简",
            "weight": 100
          },
          {
            "text": "经脉",
            "weight": 88
          },
          {
            "text": "出土文献",
            "weight": 82
          },
          {
            "text": "数字化",
            "weight": 76
          },
          {
            "text": "知识服务",
            "weight": 64
          }
        ]
      }
    ]
  }
}

5. 查询课题概要列表

- 页面用途：学术动态页面 1 和课题概览页
- 方法路径：GET /api/v1/projects/paginate
- 鉴权：无需鉴权
- 说明：分页查询课题概要列表，支持年度和类型筛选。
请求参数：

字段名
类型
必填
说明
pageNum
integer
否
页码，默认 1
pageSize
integer
否
每页条数，默认 10
year
integer
否
年度筛选
type
string
否
课题类型: 国家级 / 省部级 / 厅局级

响应 data 字段：

字段名
类型
说明
id
string
课题 ID
title
string
课题名称
type
string
课题类型
year
integer
立项年份
leader
string
负责人
institution
string
承担单位
coverImage
string
封面图
summary
string
摘要

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "id": "project_001",
        "title": "出土医学文献多模态整理与知识组织研究",
        "type": "国家级",
        "projectNo": "2024ZY001",
        "year": 2024,
        "leader": "陈维",
        "leaderId": 1,
        "institution": "成都中医药大学",
        "budget": 2400000,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2027-12-31T00:00:00Z",
        "members": [
          "周明",
          "李青"
        ],
        "summary": "围绕出土医学文献图像、释文、注释和成果数据开展多模态整理。",
        "description": "项目建设可复用的数据采集、标注、审核和知识组织流程，支撑前台展示和后续研究。",
        "progress": "进行中",
        "coverImage": "https://example.edu/mock/projects/project-001.jpg",
        "attachments": [
          {
            "name": "项目简介.pdf",
            "url": "https://example.edu/mock/files/project-001.pdf"
          }
        ]
      }
    ]
  }
}

6. 查询论文概要列表

- 页面用途：学术动态页面 2 和论文概览页
- 方法路径：GET /api/v1/papers/paginate
- 鉴权：无需鉴权
- 说明：分页查询论文概要列表，支持年度和类型筛选。
请求参数：

字段名
类型
必填
说明
pageNum
integer
否
页码，默认 1
pageSize
integer
否
每页条数，默认 10
year
integer
否
年度筛选
type
string
否
论文类型: SCI / CSSCI / 核心 / 普通

响应 data 字段：

字段名
类型
说明
id
string
论文 ID
title
string
论文题名
authors
string
作者，逗号分隔
journal
string
期刊或会议
year
integer
发表年份
type
string
论文类型
coverImage
string
封面图

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "id": "paper_001",
        "title": "天回医简经脉文献源流研究",
        "authors": "陈维, 周明",
        "authorIds": [
          1,
          2
        ],
        "journal": "中华医史杂志",
        "year": 2026,
        "volume": "56",
        "issue": "2",
        "pages": "101-112",
        "type": "核心",
        "doi": "10.12345/j.cmhistory.2026.002",
        "abstract": "论文讨论天回医简经脉文献与早期经脉理论之间的关系。",
        "keywords": [
          "天回医简",
          "经脉",
          "出土医学文献"
        ],
        "coverImage": "https://example.edu/mock/papers/paper-001.jpg",
        "attachments": [
          {
            "name": "论文全文.pdf",
            "url": "https://example.edu/mock/files/paper-001.pdf"
          }
        ]
      }
    ]
  }
}

7. 查询专著概要列表

- 页面用途：学术动态页面 2 和专著概览页
- 方法路径：GET /api/v1/books/paginate
- 鉴权：无需鉴权
- 说明：分页查询专著概要列表，支持年度筛选。
请求参数：

字段名
类型
必填
说明
pageNum
integer
否
页码，默认 1
pageSize
integer
否
每页条数，默认 10
year
integer
否
年度筛选

响应 data 字段：

字段名
类型
说明
id
string
专著 ID
title
string
书名
author
string
作者或主编
publisher
string
出版社
year
integer
出版年份
coverImage
string
封面图
isbn
string
ISBN

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "id": "book_001",
        "title": "天回医简与早期经脉医学",
        "author": "陈维 主编",
        "authorId": 1,
        "publisher": "人民卫生出版社",
        "publishDate": "2026-03-15T00:00:00Z",
        "year": 2026,
        "isbn": "978-7-117-00000-0",
        "price": 98.0,
        "pages": 456,
        "words": 580000,
        "description": "围绕天回医简材料、经脉理论源流和医学史价值展开系统研究。",
        "coverImage": "https://example.edu/mock/books/book-001.jpg",
        "toc": "第一章 出土背景; 第二章 文献整理; 第三章 经脉理论; 第四章 数字化应用",
        "attachments": [
          {
            "name": "试读 PDF",
            "url": "https://example.edu/mock/files/book-001-sample.pdf"
          },
          {
            "name": "馆藏查询",
            "url": "https://library.example.edu/search/book_001"
          }
        ]
      }
    ]
  }
}

8. 查询软著专利概要列表

- 页面用途：学术动态页面 2 和软著专利概览页
- 方法路径：GET /api/v1/softwarePatents/paginate
- 鉴权：无需鉴权
- 说明：分页查询软件著作权和专利概要列表。
请求参数：

字段名
类型
必填
说明
pageNum
integer
否
页码，默认 1
pageSize
integer
否
每页条数，默认 10
year
integer
否
年度筛选
type
string
否
类型: software / patent

响应 data 字段：

字段名
类型
说明
id
string
软著或专利 ID
title
string
名称
type
string
software / patent
registrationNo
string
登记号或专利号
owner
string
权利人
year
integer
授权或登记年份
coverImage
string
封面图

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "id": "software_001",
        "title": "出土医学文献标注系统",
        "type": "software",
        "registrationNo": "2024SR001234",
        "owner": "成都中医药大学",
        "inventors": "周明, 陈维",
        "applicationDate": "2024-01-15T00:00:00Z",
        "issueDate": "2024-06-20T00:00:00Z",
        "year": 2024,
        "description": "用于医学文献图像、释文、注释和实体的在线标注。",
        "coverImage": "https://example.edu/mock/ip/software-001.jpg",
        "attachments": [
          {
            "name": "登记证书.pdf",
            "url": "https://example.edu/mock/files/software-001.pdf"
          }
        ]
      }
    ]
  }
}

9. 查询活动剪影列表

- 页面用途：学术动态页面 2 - 活动剪影组件
- 方法路径：GET /api/v1/activityPhotos/paginate
- 鉴权：无需鉴权
- 说明：分页获取活动剪影图片列表。
请求参数：

字段名
类型
必填
说明
pageNum
integer
否
页码，默认 1
pageSize
integer
否
每页条数，默认 12

响应 data 字段：

字段名
类型
说明
id
string
图片 ID
title
string
图片标题
activityName
string
所属活动
imageUrl
string
原图地址
thumbUrl
string
缩略图地址
activityTime
string
活动时间

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "pageNum": 1,
    "pageSize": 12,
    "rows": [
      {
        "id": "photo_001",
        "title": "出土医学文献数字化研讨会现场",
        "activityName": "出土医学文献数字化研讨会",
        "imageUrl": "https://example.edu/mock/activities/photo-001.jpg",
        "thumbUrl": "https://example.edu/mock/activities/photo-001-thumb.jpg",
        "activityTime": "2026-04-18T09:00:00Z"
      }
    ]
  }
}

10. 获取人才详情

- 页面用途：人才详情页面
- 方法路径：GET /api/v1/talents/{id}
- 鉴权：无需鉴权
- 说明：获取人才详情，包含关联科研成果 ID、类型和名称。
请求参数：

字段名
类型
必填
说明
id
integer
是
人才 ID

响应 data 字段：

字段名
类型
说明
id
integer
人才 ID
name
string
姓名
avatar
string
头像地址
title
string
职称或角色
researchArea
string
研究方向
institution
string
所属机构
bio
string
简介
achievements[].id
string
关联成果 ID
achievements[].type
string
关联成果类型
achievements[].title
string
关联成果名称

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "陈维",
    "avatar": "https://example.edu/mock/talents/chen-wei.jpg",
    "title": "教授",
    "researchArea": "出土医学文献整理与经脉数字化",
    "institution": "成都中医药大学",
    "bio": "长期从事出土医学文献整理、简牍图像数字化和中医药知识服务研究。",
    "achievements": [
      {
        "id": "paper_001",
        "type": "paper",
        "title": "天回医简经脉文献源流研究"
      },
      {
        "id": "book_001",
        "type": "book",
        "title": "天回医简与早期经脉医学"
      },
      {
        "id": "project_001",
        "type": "project",
        "title": "出土医学文献多模态整理与知识组织研究"
      }
    ]
  }
}

11. 获取软著专利统计

- 页面用途：软著专利概览页统计区
- 方法路径：GET /api/v1/softwarePatents/stats
- 鉴权：无需鉴权
- 说明：获取软著专利总量、年度分布和类型分布。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
total
integer
总数
byYear[]
array
年度分布
byType
object
类型分布

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2,
    "byYear": [
      {
        "year": 2026,
        "count": 1
      },
      {
        "year": 2024,
        "count": 1
      }
    ],
    "byType": {
      "software": 1,
      "patent": 1
    }
  }
}

12. 查询软著专利详情

- 页面用途：软著专利详情页
- 方法路径：GET /api/v1/softwarePatents/{id}
- 鉴权：无需鉴权
- 说明：获取软著或专利详情。
请求参数：

字段名
类型
必填
说明
id
string
是
软著或专利 ID

响应 data 字段：

字段名
类型
说明
id
string
软著或专利 ID
title
string
名称
type
string
software / patent
registrationNo
string
登记号或专利号
owner
string
权利人
inventors
string
发明人或著作权人成员
applicationDate
string
申请日期
issueDate
string
授权或登记日期
description
string
简介
attachments[]
array
附件列表

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "id": "software_001",
    "title": "出土医学文献标注系统",
    "type": "software",
    "registrationNo": "2024SR001234",
    "owner": "成都中医药大学",
    "inventors": "周明, 陈维",
    "applicationDate": "2024-01-15T00:00:00Z",
    "issueDate": "2024-06-20T00:00:00Z",
    "year": 2024,
    "description": "用于医学文献图像、释文、注释和实体的在线标注。",
    "coverImage": "https://example.edu/mock/ip/software-001.jpg",
    "attachments": [
      {
        "name": "登记证书.pdf",
        "url": "https://example.edu/mock/files/software-001.pdf"
      }
    ]
  }
}

13. 获取论文统计

- 页面用途：论文概览页统计区
- 方法路径：GET /api/v1/papers/stats
- 鉴权：无需鉴权
- 说明：获取论文总量、年度分布和类型分布。不返回引用次数和阅读热度。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
total
integer
总数
byYear[]
array
年度分布
byType
object
类型分布

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2,
    "byYear": [
      {
        "year": 2026,
        "count": 1
      },
      {
        "year": 2025,
        "count": 1
      }
    ],
    "byType": {
      "核心": 1,
      "普通": 1
    }
  }
}

14. 查询论文详情

- 页面用途：论文详情页
- 方法路径：GET /api/v1/papers/{id}
- 鉴权：无需鉴权
- 说明：获取论文详情。按原文档要求去掉引用次数和阅读热度字段。
请求参数：

字段名
类型
必填
说明
id
string
是
论文 ID

响应 data 字段：

字段名
类型
说明
id
string
论文 ID
title
string
题名
authors
string
作者
authorIds
array<integer>
作者 ID
journal
string
期刊或会议
year
integer
发表年份
volume
string
卷
issue
string
期
pages
string
页码
type
string
论文类型
doi
string
DOI，可为空
abstract
string
摘要
keywords
array<string>
关键词
attachments[]
array
附件列表

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "id": "paper_001",
    "title": "天回医简经脉文献源流研究",
    "authors": "陈维, 周明",
    "authorIds": [
      1,
      2
    ],
    "journal": "中华医史杂志",
    "year": 2026,
    "volume": "56",
    "issue": "2",
    "pages": "101-112",
    "type": "核心",
    "doi": "10.12345/j.cmhistory.2026.002",
    "abstract": "论文讨论天回医简经脉文献与早期经脉理论之间的关系。",
    "keywords": [
      "天回医简",
      "经脉",
      "出土医学文献"
    ],
    "coverImage": "https://example.edu/mock/papers/paper-001.jpg",
    "attachments": [
      {
        "name": "论文全文.pdf",
        "url": "https://example.edu/mock/files/paper-001.pdf"
      }
    ]
  }
}

15. 获取专著统计

- 页面用途：专著概览页统计区
- 方法路径：GET /api/v1/books/stats
- 鉴权：无需鉴权
- 说明：获取专著总量和年度分布。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
total
integer
总数
byYear[]
array
年度分布

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2,
    "byYear": [
      {
        "year": 2026,
        "count": 1
      },
      {
        "year": 2024,
        "count": 1
      }
    ]
  }
}

16. 查询专著详情

- 页面用途：专著详情页
- 方法路径：GET /api/v1/books/{id}
- 鉴权：无需鉴权
- 说明：获取专著详情，包含封面、简介、目录、PDF 或馆藏查询附件。
请求参数：

字段名
类型
必填
说明
id
string
是
专著 ID

响应 data 字段：

字段名
类型
说明
id
string
专著 ID
title
string
书名
author
string
作者或主编
publisher
string
出版社
publishDate
string
出版日期
isbn
string
ISBN
price
number
定价
pages
integer
页数
words
integer
字数
description
string
内容简介
toc
string
目录
attachments[]
array
试读 PDF、馆藏查询等

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "id": "book_001",
    "title": "天回医简与早期经脉医学",
    "author": "陈维 主编",
    "authorId": 1,
    "publisher": "人民卫生出版社",
    "publishDate": "2026-03-15T00:00:00Z",
    "year": 2026,
    "isbn": "978-7-117-00000-0",
    "price": 98.0,
    "pages": 456,
    "words": 580000,
    "description": "围绕天回医简材料、经脉理论源流和医学史价值展开系统研究。",
    "coverImage": "https://example.edu/mock/books/book-001.jpg",
    "toc": "第一章 出土背景; 第二章 文献整理; 第三章 经脉理论; 第四章 数字化应用",
    "attachments": [
      {
        "name": "试读 PDF",
        "url": "https://example.edu/mock/files/book-001-sample.pdf"
      },
      {
        "name": "馆藏查询",
        "url": "https://library.example.edu/search/book_001"
      }
    ]
  }
}

17. 获取课题统计

- 页面用途：课题概览页统计区
- 方法路径：GET /api/v1/projects/stats
- 鉴权：无需鉴权
- 说明：获取课题总量、年度分布和类型分布。
请求参数：

字段名
类型
必填
说明
无
-
-
无请求参数

响应 data 字段：

字段名
类型
说明
total
integer
总数
byYear[]
array
年度分布
byType
object
类型分布

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2,
    "byYear": [
      {
        "year": 2024,
        "count": 1
      },
      {
        "year": 2023,
        "count": 1
      }
    ],
    "byType": {
      "国家级": 1,
      "省部级": 1
    }
  }
}

18. 查询课题详情

- 页面用途：课题详情页
- 方法路径：GET /api/v1/projects/{id}
- 鉴权：无需鉴权
- 说明：获取课题详情。
请求参数：

字段名
类型
必填
说明
id
string
是
课题 ID

响应 data 字段：

字段名
类型
说明
id
string
课题 ID
title
string
课题名称
type
string
课题类型
projectNo
string
课题编号
year
integer
立项年份
leader
string
负责人
leaderId
integer
负责人 ID
institution
string
承担单位
budget
number
经费
startDate
string
开始日期
endDate
string
结束日期
members
array<string>
成员
description
string
研究内容
progress
string
进度或状态
attachments[]
array
附件列表

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "id": "project_001",
    "title": "出土医学文献多模态整理与知识组织研究",
    "type": "国家级",
    "projectNo": "2024ZY001",
    "year": 2024,
    "leader": "陈维",
    "leaderId": 1,
    "institution": "成都中医药大学",
    "budget": 2400000,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2027-12-31T00:00:00Z",
    "members": [
      "周明",
      "李青"
    ],
    "summary": "围绕出土医学文献图像、释文、注释和成果数据开展多模态整理。",
    "description": "项目建设可复用的数据采集、标注、审核和知识组织流程，支撑前台展示和后续研究。",
    "progress": "进行中",
    "coverImage": "https://example.edu/mock/projects/project-001.jpg",
    "attachments": [
      {
        "name": "项目简介.pdf",
        "url": "https://example.edu/mock/files/project-001.pdf"
      }
    ]
  }
}

19. 查询活动概要列表

- 页面用途：活动概览页
- 方法路径：GET /api/v1/activities/paginate
- 鉴权：无需鉴权
- 说明：分页查询活动概要列表。该接口和活动剪影可共用活动基础数据，前端按页面选择展示字段。
请求参数：

字段名
类型
必填
说明
pageNum
integer
否
页码，默认 1
pageSize
integer
否
每页条数，默认 10
status
string
否
active / past

响应 data 字段：

字段名
类型
说明
id
string
活动 ID
name
string
活动名称
time
string
开始时间
location
string
地点
coverImage
string
封面图
summary
string
活动简介
status
string
active / past

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "id": "activity_001",
        "name": "出土医学文献数字化研讨会",
        "time": "2026-04-18T09:00:00Z",
        "endTime": "2026-04-18T17:30:00Z",
        "location": "成都中医药大学博物馆会议厅",
        "organizer": "出土医学文献文物保护研究数字实验室",
        "coverImage": "https://example.edu/mock/activities/activity-001.jpg",
        "summary": "围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。",
        "status": "past"
      }
    ]
  }
}

20. 查询活动详情

- 页面用途：活动详情页
- 方法路径：GET /api/v1/activities/{id}
- 鉴权：无需鉴权
- 说明：获取活动详情，包含富文本正文、图片和附件。
请求参数：

字段名
类型
必填
说明
id
string
是
活动 ID

响应 data 字段：

字段名
类型
说明
id
string
活动 ID
name
string
活动名称
time
string
开始时间
endTime
string
结束时间
location
string
地点
organizer
string
主办方
coverImage
string
封面图
gallery
array<string>
图片列表
summary
string
摘要
content
string
HTML 富文本
attachments[]
array
附件列表
status
string
active / past

成功响应示例：

{
  "code": 200,
  "message": "success",
  "data": {
    "id": "activity_001",
    "name": "出土医学文献数字化研讨会",
    "time": "2026-04-18T09:00:00Z",
    "endTime": "2026-04-18T17:30:00Z",
    "location": "成都中医药大学博物馆会议厅",
    "organizer": "出土医学文献文物保护研究数字实验室",
    "coverImage": "https://example.edu/mock/activities/activity-001.jpg",
    "gallery": [
      "https://example.edu/mock/activities/photo-001.jpg",
      "https://example.edu/mock/activities/photo-003.jpg"
    ],
    "summary": "围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。",
    "content": "<p>本次研讨会邀请医史文献、数字人文和数据工程方向专家，围绕平台建设、数据治理和成果展示进行交流。</p>",
    "attachments": [
      {
        "name": "会议手册.pdf",
        "url": "https://example.edu/mock/files/activity-001-handbook.pdf"
      }
    ],
    "status": "past"
  }
}

Mock 启动

node api-spec/mock/server.mjs --port 4010
