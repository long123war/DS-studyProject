<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主区域 -->
    <el-card class="box-card">
      <div class="input-users">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button class="addUsers" type="primary">加只肥猪仔</el-button>
      </div>
      <template>
        <el-table :data="userList" stripe style="width: 100%" border>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态"> </el-table-column>
          <el-table-column prop="mg_state" label="操作"> </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getList();
  },
  data() {
    return {
      getUsers: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: "",
      pegenum: ""
    };
  },
  methods: {
    getList() {
      this.$http
        .get("users", { params: this.getUsers })
        .then(res => {
          return res.data;
        })
        .then(res => {
          this.userList = res.data.users;
          this.total = res.data.total;
          this.pegenum = res.data.pegenum;
        })
        .catch(err => {
          this.$message.error("获取用户信息失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  .input-users {
    width: 50%;
    display: flex;
    justify-content: space-between;

    .addUsers {
      margin-left: 15px;
    }
  }
  .el-table {
    margin-top: 15px;
  }
}
</style>
