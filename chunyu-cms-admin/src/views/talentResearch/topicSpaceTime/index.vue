<template>
  <div class="topic-space-time">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="课题名称">
          <el-input
            v-model="searchForm.topicName"
            placeholder="请输入课题名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input
            v-model="searchForm.leader"
            placeholder="请输入负责人"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <el-option label="进行中" value="ongoing"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已终止" value="terminated"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="addTopic">新增课题</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="topicName" label="课题名称"></el-table-column>
        <el-table-column prop="leader" label="负责人"></el-table-column>
        <el-table-column prop="startDate" label="开始日期"></el-table-column>
        <el-table-column prop="endDate" label="结束日期"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="budget"
          label="预算"
          width="100"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editTopic(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteTopic(scope.row.id)"
              >删除</el-button
            >
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
  name: "TopicSpaceTime",
  data() {
    return {
      searchForm: {
        topicName: "",
        leader: "",
        status: "",
      },
      tableData: [
        {
          id: 1,
          topicName: "人工智能在医疗领域的应用",
          leader: "张三",
          startDate: "2023-01-01",
          endDate: "2024-12-31",
          status: "进行中",
          budget: "100万",
        },
        {
          id: 2,
          topicName: "区块链技术研究",
          leader: "李四",
          startDate: "2022-06-01",
          endDate: "2023-06-01",
          status: "已完成",
          budget: "50万",
        },
        {
          id: 3,
          topicName: "新能源汽车电池技术",
          leader: "王五",
          startDate: "2023-03-01",
          endDate: "2025-03-01",
          status: "进行中",
          budget: "150万",
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
        topicName: "",
        leader: "",
        status: "",
      };
    },
    addTopic() {
      // 新增课题逻辑
      this.$message.success("新增课题功能开发中");
    },
    editTopic(row) {
      // 编辑课题逻辑
      console.log("编辑课题", row);
    },
    deleteTopic(id) {
      // 删除课题逻辑
      this.$confirm("确定要删除这个课题吗？", "提示", {
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
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      // 重新获取数据
    },
    handleCurrentChange(current) {
      this.pagination.currentPage = current;
      // 重新获取数据
    },
    getTagType(status) {
      switch (status) {
        case "进行中":
          return "warning";
        case "已完成":
          return "success";
        case "已终止":
          return "danger";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.topic-space-time {
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
