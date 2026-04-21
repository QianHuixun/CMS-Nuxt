<template>
  <div class="nav-config">
    <div class="config-section">
      <h3>导航菜单配置</h3>
      <el-form :model="navForm" label-width="100px">
        <el-form-item label="导航名称">
          <el-input
            v-model="navForm.name"
            placeholder="请输入导航名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="导航链接">
          <el-input
            v-model="navForm.url"
            placeholder="请输入导航链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="navForm.sort"
            :min="1"
            :max="100"
            :step="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="navForm.visible"></el-switch>
        </el-form-item>
        <el-form-item label="导航图标">
          <el-input
            v-model="navForm.icon"
            placeholder="请输入图标类名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveConfig">保存配置</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="nav-list">
      <h3>导航菜单列表</h3>
      <el-table :data="navList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="导航名称"></el-table-column>
        <el-table-column prop="url" label="导航链接"></el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column prop="visible" label="是否显示" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.visible ? 'success' : 'danger'">
              {{ scope.row.visible ? "显示" : "隐藏" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="120"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editNav(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteNav(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavConfig",
  data() {
    return {
      navForm: {
        name: "",
        url: "",
        sort: 1,
        visible: true,
        icon: "",
      },
      navList: [
        {
          id: 1,
          name: "首页",
          url: "/",
          sort: 1,
          visible: true,
          icon: "Home",
        },
        {
          id: 2,
          name: "关于我们",
          url: "/about",
          sort: 2,
          visible: true,
          icon: "InfoFilled",
        },
        {
          id: 3,
          name: "联系我们",
          url: "/contact",
          sort: 3,
          visible: false,
          icon: "Phone",
        },
      ],
    };
  },
  methods: {
    saveConfig() {
      // 保存配置逻辑
      this.$message.success("保存成功");
    },
    resetForm() {
      this.navForm = {
        name: "",
        url: "",
        sort: 1,
        visible: true,
        icon: "",
      };
    },
    editNav(row) {
      // 编辑导航逻辑
      this.navForm = { ...row };
    },
    deleteNav(id) {
      // 删除导航逻辑
      this.$confirm("确定要删除这个导航吗？", "提示", {
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
  },
};
</script>

<style scoped>
.nav-config {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.config-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.nav-list {
  margin-top: 30px;
}

h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}
</style>
