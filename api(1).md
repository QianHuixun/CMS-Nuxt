# 中医大前台接口梳理

本文档按老师统计的前台页面与接口数量整理，参考示例补充接口 URL、查询参数和返回示例。所有接口默认无需鉴权，均为前台只读 `GET` 接口。

## 一、整体要求

### 1. 统一响应结构

所有接口均返回如下结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 2. 时间格式约定

| 项目 | 约定 |
| --- | --- |
| 时区 | UTC，前端自行转换为本地时间显示 |
| 格式 | ISO 8601 字符串，如 `2026-04-30T08:00:00Z` |
| 传输格式 | 同上，前后端均使用 UTC ISO 字符串 |

### 3. 错误处理约定

| HTTP 状态码 | 业务 code | 说明 |
| --- | --- | --- |
| 200 | 200 | 成功 |
| 200 | 400xx | 业务错误，例如参数错误 |
| 401 | 401 | 未登录 / token 失效 |
| 403 | 403 | 无权限 |
| 404 | 404 | 资源不存在 |
| 500 | 500 | 服务端异常 |

失败响应示例：

```json
{
  "code": 500,
  "message": "数据库错误",
  "data": null
}
```

## 二、接口详情

## （一）核心资源库页面

### 1. 获取现有数据库信息

路径：`GET /api/v1/databases`

说明：获取现有全量数据库列表，不支持分页。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 数据库总数 |
| list | array | 数据库列表 |
| list[].id | string | 数据库 ID |
| list[].title | string | 数据库名称 |
| list[].status | string | 状态，`active` 启用，`inactive` 停用 |
| list[].info | string | 数据库简介 |
| list[].url | string | 数据库访问地址 |
| list[].icon | string | 前端图标 class 或图标标识 |
| list[].sort | integer | 排序号，数值越小越靠前 |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 4,
    "list": [
      {
        "id": "item_001",
        "title": "天回医简数据库",
        "status": "active",
        "info": "汇聚天回汉墓出土医简高清图像、释文、注释和检索数据。",
        "url": "https://tianhui.org",
        "icon": "icon class",
        "sort": 1
      }
    ]
  }
}
```

### 2. 获取自研工具信息

路径：`GET /api/v1/tools`

说明：获取自研工具全量列表，不支持分页。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 工具总数 |
| list | array | 工具列表 |
| list[].id | string | 工具 ID |
| list[].title | string | 工具名称 |
| list[].description | string | 工具说明 |
| list[].icon | string | 前端图标 class 或图标标识 |
| list[].url | string | 工具访问地址 |
| list[].sort | integer | 排序号，数值越小越靠前 |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2,
    "list": [
      {
        "id": "tool_001",
        "title": "出土医学文献标注工具",
        "description": "支持原简图像、释文、注释、实体和关系的协同标注。",
        "icon": "pen-tool",
        "url": "https://example.edu/tools/annotation",
        "sort": 1
      }
    ]
  }
}
```

## （二）学术动态页面 1

### 3. 获取人才信息概要列表

路径：`GET /api/v1/talents`

说明：获取全部人才概要列表。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 人才总数 |
| list | array | 人才概要列表 |
| list[].id | integer | 人才 ID |
| list[].name | string | 姓名 |
| list[].avatar | string | 头像地址 |
| list[].title | string | 职称或角色 |
| list[].researchArea | string | 研究方向 |
| list[].institution | string | 所属机构 |

成功响应示例：

```json
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
```

### 4. 获取词云列表

路径：`GET /api/v1/wordClouds`

说明：获取词云组件数据。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| list | array | 词云配置列表 |
| list[].id | integer | 词云 ID |
| list[].title | string | 词云标题 |
| list[].type | string | 词云类型，如年度热词、研究方向等 |
| list[].words | array | 词条列表 |
| list[].words[].text | string | 词条文本 |
| list[].words[].weight | integer | 词条权重，前端可按权重控制字号或颜色 |

成功响应示例：

```json
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
          }
        ]
      }
    ]
  }
}
```

### 5. 获取课题概要列表

路径：`GET /api/v1/projects/paginate`

说明：分页获取课题概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 课题类型，如国家级、省部级、厅局级 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 课题概要列表 |
| rows[].id | string | 课题 ID |
| rows[].title | string | 课题名称 |
| rows[].type | string | 课题类型 |
| rows[].year | integer | 立项年度 |
| rows[].leader | string | 负责人姓名 |
| rows[].leaderId | integer | 负责人 ID，用于跳转人才详情 |
| rows[].institution | string | 承担单位 |
| rows[].coverImage | string | 封面图 |
| rows[].summary | string | 课题摘要 |

成功响应示例：

```json
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
        "year": 2024,
        "leader": "陈维",
        "leaderId": 1,
        "institution": "成都中医药大学",
        "coverImage": "https://example.edu/mock/projects/project-001.jpg",
        "summary": "围绕出土医学文献图像、释文、注释和成果数据开展多模态整理。"
      }
    ]
  }
}
```

## （三）学术动态页面 2

### 6. 获取论文列表

路径：`GET /api/v1/papers/paginate`

说明：分页获取论文概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 论文类型，如 SCI、CSSCI、核心、普通 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 论文概要列表 |
| rows[].id | string | 论文 ID |
| rows[].title | string | 论文题名 |
| rows[].authors | string | 作者，多个作者用逗号分隔 |
| rows[].authorIds | array<integer> | 作者对应的人才 ID 列表 |
| rows[].journal | string | 期刊或会议名称 |
| rows[].year | integer | 发表年度 |
| rows[].type | string | 论文类型 |
| rows[].coverImage | string | 封面图或展示图 |

成功响应示例：

```json
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
        "type": "核心",
        "coverImage": "https://example.edu/mock/papers/paper-001.jpg"
      }
    ]
  }
}
```

### 7. 获取著作列表

路径：`GET /api/v1/books/paginate`

说明：分页获取专著概要列表，可按年度筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 专著概要列表 |
| rows[].id | string | 专著 ID |
| rows[].title | string | 书名 |
| rows[].author | string | 作者或主编 |
| rows[].authorId | integer | 作者对应的人才 ID |
| rows[].publisher | string | 出版社 |
| rows[].year | integer | 出版年度 |
| rows[].isbn | string | ISBN |
| rows[].coverImage | string | 封面图 |

成功响应示例：

```json
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
        "year": 2026,
        "isbn": "978-7-117-00000-0",
        "coverImage": "https://example.edu/mock/books/book-001.jpg"
      }
    ]
  }
}
```

### 8. 获取软著专利列表

路径：`GET /api/v1/softwarePatents/paginate`

说明：分页获取软件著作权和专利概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 类型：`software` 软件著作权，`patent` 专利 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 软著专利概要列表 |
| rows[].id | string | 软著或专利 ID |
| rows[].title | string | 名称 |
| rows[].type | string | 类型，`software` 软件著作权，`patent` 专利 |
| rows[].registrationNo | string | 登记号或专利号 |
| rows[].owner | string | 权利人 |
| rows[].inventors | string | 发明人或著作权人成员 |
| rows[].year | integer | 授权或登记年度 |
| rows[].coverImage | string | 封面图 |

成功响应示例：

```json
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
        "year": 2024,
        "coverImage": "https://example.edu/mock/ip/software-001.jpg"
      }
    ]
  }
}
```

### 9. 获取活动剪影列表

路径：`GET /api/v1/activityPhotos/paginate`

说明：分页获取活动剪影图片列表。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 12 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 活动剪影列表 |
| rows[].id | string | 图片 ID |
| rows[].title | string | 图片标题 |
| rows[].activityName | string | 所属活动名称 |
| rows[].imageUrl | string | 原图地址 |
| rows[].thumbUrl | string | 缩略图地址 |
| rows[].activityTime | string | 活动时间 |

成功响应示例：

```json
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
```

## （四）人才详情页面

### 10. 获取人才详情

路径：`GET /api/v1/talents/{id}`

说明：获取人才详情，返回人才基本信息，以及该人才关联的科研成果 ID、类型、名称。

路径参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | integer | 是 | 人才 ID，放在 URL 路径中 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | integer | 人才 ID |
| name | string | 姓名 |
| avatar | string | 头像地址 |
| title | string | 职称或角色 |
| researchArea | string | 研究方向 |
| institution | string | 所属机构 |
| bio | string | 人才简介，不返回手机号等敏感联系方式 |
| achievements | array | 关联科研成果列表 |
| achievements[].id | string | 科研成果 ID |
| achievements[].type | string | 科研成果类型，如 `paper`、`book`、`project`、`software`、`patent` |
| achievements[].title | string | 科研成果名称 |

成功响应示例：

```json
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
```

## （五）软著专利概览页面

### 11. 查询软著专利列表

路径：`GET /api/v1/softwarePatents/paginate`

说明：分页查询软著专利概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 类型：`software` 软件著作权，`patent` 专利 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 软著专利概要列表 |
| rows[].id | string | 软著或专利 ID |
| rows[].title | string | 名称 |
| rows[].type | string | 类型，`software` 软件著作权，`patent` 专利 |
| rows[].registrationNo | string | 登记号或专利号 |
| rows[].owner | string | 权利人 |
| rows[].inventors | string | 发明人或著作权人成员 |
| rows[].year | integer | 授权或登记年度 |
| rows[].coverImage | string | 封面图 |

成功响应示例：

```json
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
        "year": 2024,
        "coverImage": "https://example.edu/mock/ip/software-001.jpg"
      }
    ]
  }
}
```

### 12. 获取软著专利统计

路径：`GET /api/v1/softwarePatents/stats`

说明：获取软著专利总量、年度分布和类型分布。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 软著专利总数 |
| byYear | array | 年度分布 |
| byYear[].year | integer | 年度 |
| byYear[].count | integer | 该年度数量 |
| byType | object | 类型分布 |
| byType.software | integer | 软件著作权数量 |
| byType.patent | integer | 专利数量 |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 142,
    "byYear": [
      {
        "year": 2026,
        "count": 28
      },
      {
        "year": 2025,
        "count": 34
      }
    ],
    "byType": {
      "software": 86,
      "patent": 56
    }
  }
}
```

## （六）论文概览页面

### 13. 查询论文列表

路径：`GET /api/v1/papers/paginate`

说明：分页查询论文概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 论文类型，如 SCI、CSSCI、核心、普通 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 论文概要列表 |
| rows[].id | string | 论文 ID |
| rows[].title | string | 论文题名 |
| rows[].authors | string | 作者 |
| rows[].authorIds | array<integer> | 作者对应的人才 ID 列表 |
| rows[].journal | string | 期刊或会议名称 |
| rows[].year | integer | 发表年度 |
| rows[].type | string | 论文类型 |
| rows[].coverImage | string | 封面图或展示图 |

成功响应示例：

```json
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
        "type": "核心",
        "coverImage": "https://example.edu/mock/papers/paper-001.jpg"
      }
    ]
  }
}
```

### 14. 获取论文统计

路径：`GET /api/v1/papers/stats`

说明：获取论文总量、年度分布和类型分布。引用次数和阅读热度最后实现时可去掉。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 论文总数 |
| byYear | array | 年度分布 |
| byYear[].year | integer | 年度 |
| byYear[].count | integer | 该年度数量 |
| byType | object | 类型分布，key 为论文类型，value 为数量 |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 128,
    "byYear": [
      {
        "year": 2026,
        "count": 21
      },
      {
        "year": 2025,
        "count": 36
      }
    ],
    "byType": {
      "SCI": 18,
      "CSSCI": 32,
      "核心": 45,
      "普通": 33
    }
  }
}
```

## （七）专著概览页面

### 15. 查询专著列表

路径：`GET /api/v1/books/paginate`

说明：分页查询专著概要列表，可按年度筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 专著概要列表 |
| rows[].id | string | 专著 ID |
| rows[].title | string | 书名 |
| rows[].author | string | 作者或主编 |
| rows[].authorId | integer | 作者对应的人才 ID |
| rows[].publisher | string | 出版社 |
| rows[].year | integer | 出版年度 |
| rows[].isbn | string | ISBN |
| rows[].coverImage | string | 封面图 |

成功响应示例：

```json
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
        "year": 2026,
        "isbn": "978-7-117-00000-0",
        "coverImage": "https://example.edu/mock/books/book-001.jpg"
      }
    ]
  }
}
```

### 16. 获取专著统计

路径：`GET /api/v1/books/stats`

说明：获取专著总量和年度分布。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 专著总数 |
| byYear | array | 年度分布 |
| byYear[].year | integer | 年度 |
| byYear[].count | integer | 该年度数量 |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 24,
    "byYear": [
      {
        "year": 2026,
        "count": 3
      },
      {
        "year": 2025,
        "count": 5
      }
    ]
  }
}
```

## （八）课题概览页面

### 17. 查询课题列表

路径：`GET /api/v1/projects/paginate`

说明：分页查询课题概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 课题类型，如国家级、省部级、厅局级 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 课题概要列表 |
| rows[].id | string | 课题 ID |
| rows[].title | string | 课题名称 |
| rows[].type | string | 课题类型 |
| rows[].year | integer | 立项年度 |
| rows[].leader | string | 负责人姓名 |
| rows[].leaderId | integer | 负责人 ID，用于跳转人才详情 |
| rows[].institution | string | 承担单位 |
| rows[].coverImage | string | 封面图 |
| rows[].summary | string | 课题摘要 |

成功响应示例：

```json
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
        "year": 2024,
        "leader": "陈维",
        "leaderId": 1,
        "institution": "成都中医药大学",
        "coverImage": "https://example.edu/mock/projects/project-001.jpg",
        "summary": "围绕出土医学文献图像、释文、注释和成果数据开展多模态整理。"
      }
    ]
  }
}
```

### 18. 获取课题统计

路径：`GET /api/v1/projects/stats`

说明：获取课题总量、年度分布和类型分布。

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 课题总数 |
| byYear | array | 年度分布 |
| byYear[].year | integer | 年度 |
| byYear[].count | integer | 该年度数量 |
| byType | object | 类型分布，key 为课题类型，value 为数量 |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 36,
    "byYear": [
      {
        "year": 2024,
        "count": 8
      },
      {
        "year": 2023,
        "count": 10
      }
    ],
    "byType": {
      "国家级": 6,
      "省部级": 14,
      "厅局级": 16
    }
  }
}
```

## （九）活动概览页面

### 19. 查询活动列表

路径：`GET /api/v1/activities/paginate`

说明：分页查询活动概要列表，可按年度、类型筛选。

查询参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| pageNum | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 10 |
| year | integer | 否 | 年度 |
| type | string | 否 | 活动类型，如会议、讲座、展览 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| total | integer | 总条数 |
| pageNum | integer | 当前页码 |
| pageSize | integer | 每页条数 |
| rows | array | 活动概要列表 |
| rows[].id | string | 活动 ID |
| rows[].title | string | 活动名称 |
| rows[].type | string | 活动类型 |
| rows[].year | integer | 活动年度 |
| rows[].time | string | 活动开始时间 |
| rows[].location | string | 活动地点 |
| rows[].coverImage | string | 封面图 |
| rows[].summary | string | 活动摘要 |

成功响应示例：

```json
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
        "title": "出土医学文献数字化研讨会",
        "type": "会议",
        "year": 2026,
        "time": "2026-04-18T09:00:00Z",
        "location": "成都中医药大学博物馆会议厅",
        "coverImage": "https://example.edu/mock/activities/activity-001.jpg",
        "summary": "围绕出土医学文献数字化采集、标注和知识服务开展专题研讨。"
      }
    ]
  }
}
```

## （十）软著专利详情

### 20. 查询软著专利详情

路径：`GET /api/v1/softwarePatents/{id}`

说明：获取软著或专利详情。

路径参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 软著或专利 ID，放在 URL 路径中 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 软著或专利 ID |
| title | string | 名称 |
| type | string | 类型，`software` 软件著作权，`patent` 专利 |
| registrationNo | string | 登记号或专利号 |
| owner | string | 权利人 |
| inventors | string | 发明人或著作权人成员 |
| applicationDate | string | 申请日期 |
| issueDate | string | 授权或登记日期 |
| year | integer | 授权或登记年度 |
| description | string | 简介 |
| coverImage | string | 封面图 |
| attachments | array | 附件列表 |
| attachments[].name | string | 附件名称 |
| attachments[].url | string | 附件地址 |

成功响应示例：

```json
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
```

## （十一）论文详情

### 21. 查询论文详情

路径：`GET /api/v1/papers/{id}`

说明：获取论文详情。最后实现时，引用次数和阅读热度可以去掉。

路径参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 论文 ID，放在 URL 路径中 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 论文 ID |
| title | string | 论文题名 |
| authors | string | 作者，多个作者用逗号分隔 |
| authorIds | array<integer> | 作者对应的人才 ID 列表 |
| journal | string | 期刊或会议名称 |
| year | integer | 发表年度 |
| volume | string | 卷 |
| issue | string | 期 |
| pages | string | 页码 |
| type | string | 论文类型 |
| doi | string | DOI，可为空 |
| abstract | string | 摘要 |
| keywords | array<string> | 关键词 |
| coverImage | string | 封面图或展示图 |
| attachments | array | 附件列表 |
| attachments[].name | string | 附件名称 |
| attachments[].url | string | 附件地址 |

成功响应示例：

```json
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
```

## （十二）专著详情

### 22. 查询专著详情

路径：`GET /api/v1/books/{id}`

说明：获取专著详情。

路径参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 专著 ID，放在 URL 路径中 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 专著 ID |
| title | string | 书名 |
| author | string | 作者或主编 |
| authorId | integer | 作者对应的人才 ID |
| publisher | string | 出版社 |
| publishDate | string | 出版日期 |
| year | integer | 出版年度 |
| isbn | string | ISBN |
| price | number | 定价 |
| pages | integer | 页数 |
| words | integer | 字数 |
| description | string | 内容简介 |
| coverImage | string | 封面图 |
| toc | string | 目录 |
| attachments | array | 附件列表 |
| attachments[].name | string | 附件名称 |
| attachments[].url | string | 附件地址 |

成功响应示例：

```json
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
```

## （十三）课题详情

### 23. 查询课题详情

路径：`GET /api/v1/projects/{id}`

说明：获取课题详情。

路径参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 课题 ID，放在 URL 路径中 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 课题 ID |
| title | string | 课题名称 |
| type | string | 课题类型 |
| projectNo | string | 课题编号 |
| year | integer | 立项年度 |
| leader | string | 负责人姓名 |
| leaderId | integer | 负责人 ID，用于跳转人才详情 |
| institution | string | 承担单位 |
| budget | number | 项目经费 |
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |
| members | array<string> | 项目成员 |
| summary | string | 摘要 |
| description | string | 研究内容 |
| progress | string | 项目进度或状态 |
| coverImage | string | 封面图 |
| attachments | array | 附件列表 |
| attachments[].name | string | 附件名称 |
| attachments[].url | string | 附件地址 |

成功响应示例：

```json
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
```

## （十四）活动详情

### 24. 查询活动详情

路径：`GET /api/v1/activities/{id}`

说明：获取活动详情，返回详情信息，并包含富文本正文。

路径参数：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | string | 是 | 活动 ID，放在 URL 路径中 |

返回 data 字段：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 活动 ID |
| title | string | 活动名称 |
| type | string | 活动类型 |
| time | string | 活动开始时间 |
| endTime | string | 活动结束时间 |
| location | string | 活动地点 |
| organizer | string | 主办方 |
| coverImage | string | 封面图 |
| gallery | array<string> | 活动图片列表 |
| summary | string | 活动摘要 |
| content | string | 活动详情富文本，HTML 字符串 |
| attachments | array | 附件列表 |
| attachments[].name | string | 附件名称 |
| attachments[].url | string | 附件地址 |
| status | string | 活动状态，如 `active`、`past` |

成功响应示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "activity_001",
    "title": "出土医学文献数字化研讨会",
    "type": "会议",
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
```
