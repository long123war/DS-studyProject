<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主区域卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <template>
        <el-table :data="rightsList" stripe style="width: 100%" border>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称"> </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template v-slot:default="scoped">
              <el-tag v-if="scoped.row.level === '0'">一级</el-tag>
              <el-tag v-else-if="scoped.row.level === '1'" type="success"
                >二级</el-tag
              >
              <el-tag v-else-if="scoped.row.level === '2'" type="warning"
                >三级</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList();
  },
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    // 获取权限列表
    getRightsList() {
      this.$http
        .get(`rights/list`)
        .then(res => {
          return res.data;
        })
        .then(res => {
          this.rightsList = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 7px;
}
.el-table {
  margin: 15px 0;
}
</style>
