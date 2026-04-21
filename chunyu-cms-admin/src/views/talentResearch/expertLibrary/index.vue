<template>
  <div class="expert-library">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="专家姓名">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入专家姓名"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属领域">
          <el-select
            v-model="searchForm.field"
            placeholder="请选择所属领域"
            style="width: 150px"
          >
            <el-option label="计算机科学" value="computer"></el-option>
            <el-option label="医学" value="medical"></el-option>
            <el-option label="工程学" value="engineering"></el-option>
            <el-option label="经济学" value="economics"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select
            v-model="searchForm.title"
            placeholder="请选择职称"
            style="width: 120px"
          >
            <el-option label="教授" value="professor"></el-option>
            <el-option label="副教授" value="associate"></el-option>
            <el-option label="研究员" value="researcher"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="addExpert">新增专家</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="专家姓名"></el-table-column>
        <el-table-column prop="field" label="所属领域"></el-table-column>
        <el-table-column prop="title" label="职称"></el-table-column>
        <el-table-column prop="institution" label="所属机构"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="120"
        ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editExpert(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteExpert(scope.row.id)"
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
  name: "ExpertLibrary",
  data() {
    return {
      searchForm: {
        name: "",
        field: "",
        title: "",
      },
      tableData: [
        {
          id: 1,
          name: "张三",
          field: "计算机科学",
          title: "教授",
          institution: "清华大学",
          email: "zhangsan@tsinghua.edu.cn",
          phone: "13800138001",
        },
        {
          id: 2,
          name: "李四",
          field: "医学",
          title: "副教授",
          institution: "北京大学",
          email: "lisi@pku.edu.cn",
          phone: "13900139002",
        },
        {
          id: 3,
          name: "王五",
          field: "工程学",
          title: "研究员",
          institution: "上海交通大学",
          email: "wangwu@sjtu.edu.cn",
          phone: "13700137003",
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
        field: "",
        title: "",
      };
    },
    addExpert() {
      // 新增专家逻辑
      this.$message.success("新增专家功能开发中");
    },
    editExpert(row) {
      // 编辑专家逻辑
      console.log("编辑专家", row);
    },
    deleteExpert(id) {
      // 删除专家逻辑
      this.$confirm("确定要删除这位专家吗？", "提示", {
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
.expert-library {
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
