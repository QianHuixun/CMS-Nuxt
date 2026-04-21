<template>
  <div class="book-import">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="书籍名称">
          <el-input
            v-model="searchForm.bookName"
            placeholder="请输入书籍名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input
            v-model="searchForm.author"
            placeholder="请输入作者"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input
            v-model="searchForm.publisher"
            placeholder="请输入出版社"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="importBook">导入书籍</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="bookName" label="书籍名称"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="publisher" label="出版社"></el-table-column>
        <el-table-column prop="publishDate" label="出版日期"></el-table-column>
        <el-table-column prop="isbn" label="ISBN"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '已导入' ? 'success' : 'warning'"
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editBook(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteBook(scope.row.id)"
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
  name: "BookImport",
  data() {
    return {
      searchForm: {
        bookName: "",
        author: "",
        publisher: "",
      },
      tableData: [
        {
          id: 1,
          bookName: "Vue.js实战",
          author: "尤雨溪",
          publisher: "人民邮电出版社",
          publishDate: "2020-01-01",
          isbn: "9787115526914",
          status: "已导入",
        },
        {
          id: 2,
          bookName: "React实战",
          author: "陶国荣",
          publisher: "机械工业出版社",
          publishDate: "2020-02-01",
          isbn: "9787111646989",
          status: "已导入",
        },
        {
          id: 3,
          bookName: "Angular实战",
          author: "王芃",
          publisher: "电子工业出版社",
          publishDate: "2020-03-01",
          isbn: "9787121378624",
          status: "待导入",
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
        bookName: "",
        author: "",
        publisher: "",
      };
    },
    importBook() {
      // 导入书籍逻辑
      this.$message.success("导入书籍功能开发中");
    },
    editBook(row) {
      // 编辑书籍逻辑
      console.log("编辑书籍", row);
    },
    deleteBook(id) {
      // 删除书籍逻辑
      this.$confirm("确定要删除这本书吗？", "提示", {
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
.book-import {
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
