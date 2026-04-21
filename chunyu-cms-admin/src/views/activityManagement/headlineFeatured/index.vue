<template>
  <div class="headline-featured">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入标题"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <el-option label="已发布" value="published"></el-option>
            <el-option label="未发布" value="unpublished"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select
            v-model="searchForm.sort"
            placeholder="请选择排序"
            style="width: 120px"
          >
            <el-option label="最新" value="latest"></el-option>
            <el-option label="最热" value="hottest"></el-option>
            <el-option label="推荐" value="recommended"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="addHeadline">新增头条</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="120"
        ></el-table-column>
        <el-table-column prop="publishDate" label="发布日期"></el-table-column>
        <el-table-column
          prop="views"
          label="浏览量"
          width="100"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '已发布' ? 'success' : 'warning'"
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.sort"
              :min="1"
              :max="100"
              :step="1"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editHeadline(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteHeadline(scope.row.id)"
              >删除</el-button
            >
            <el-button size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === "已发布" ? "下线" : "上线" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadlineFeatured",
  data() {
    return {
      searchForm: {
        title: "",
        status: "",
        sort: "",
      },
      tableData: [
        {
          id: 1,
          title: "人工智能技术发展趋势",
          author: "张三",
          publishDate: "2023-01-01",
          views: 1000,
          status: "已发布",
          sort: 1,
        },
        {
          id: 2,
          title: "区块链技术应用场景",
          author: "李四",
          publishDate: "2023-01-02",
          views: 800,
          status: "已发布",
          sort: 2,
        },
        {
          id: 3,
          title: "新能源汽车发展现状",
          author: "王五",
          publishDate: "2023-01-03",
          views: 1200,
          status: "未发布",
          sort: 3,
        },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    };
  },
  methods: {
    search() {
      // 搜索逻辑
      console.log("搜索", this.searchForm);
    },
    reset() {
      this.searchForm = {
        title: "",
        status: "",
        sort: "",
      };
    },
    addHeadline() {
      // 新增头条逻辑
      this.$message.success("新增头条功能开发中");
    },
    editHeadline(row) {
      // 编辑头条逻辑
      console.log("编辑头条", row);
    },
    deleteHeadline(id) {
      // 删除头条逻辑
      this.$confirm("确定要删除这个头条吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    toggleStatus(row) {
      // 切换状态逻辑
      row.status = row.status === "已发布" ? "未发布" : "已发布";
      this.$message.success(`状态已切换为${row.status}`);
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      // 重新获取数据
    },
    handleCurrentChange(current) {
      this.pagination.currentPage = current;
      // 重新获取数据
    },
  },
};
</script>

<style scoped>
.headline-featured {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.table-container {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
