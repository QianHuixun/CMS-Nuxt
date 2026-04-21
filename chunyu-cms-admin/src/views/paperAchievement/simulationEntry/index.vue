<template>
  <div class="simulation-entry">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="仿真名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入仿真名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            style="width: 150px"
          >
            <el-option label="物理仿真" value="physics"></el-option>
            <el-option label="化学仿真" value="chemistry"></el-option>
            <el-option label="生物仿真" value="biology"></el-option>
            <el-option label="工程仿真" value="engineering"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
          >
            <el-option label="已录入" value="completed"></el-option>
            <el-option label="未录入" value="pending"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="addSimulation">新增仿真</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="仿真名称"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createDate" label="创建日期"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '已录入' ? 'success' : 'warning'"
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editSimulation(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteSimulation(scope.row.id)"
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
  name: "SimulationEntry",
  data() {
    return {
      searchForm: {
        name: "",
        type: "",
        status: "",
      },
      tableData: [
        {
          id: 1,
          name: "分子动力学仿真",
          type: "物理仿真",
          description: "模拟分子运动规律",
          creator: "张三",
          createDate: "2023-01-01",
          status: "已录入",
        },
        {
          id: 2,
          name: "化学反应仿真",
          type: "化学仿真",
          description: "模拟化学反应过程",
          creator: "李四",
          createDate: "2023-02-01",
          status: "已录入",
        },
        {
          id: 3,
          name: "细胞分裂仿真",
          type: "生物仿真",
          description: "模拟细胞分裂过程",
          creator: "王五",
          createDate: "2023-03-01",
          status: "未录入",
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
        name: "",
        type: "",
        status: "",
      };
    },
    addSimulation() {
      // 新增仿真逻辑
      this.$message.success("新增仿真功能开发中");
    },
    editSimulation(row) {
      // 编辑仿真逻辑
      console.log("编辑仿真", row);
    },
    deleteSimulation(id) {
      // 删除仿真逻辑
      this.$confirm("确定要删除这个仿真吗？", "提示", {
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
  },
};
</script>

<style scoped>
.simulation-entry {
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
