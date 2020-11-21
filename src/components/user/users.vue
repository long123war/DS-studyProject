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
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          clearable
          v-model="getUsers.query"
          @clear="clearInput()"
          @change="serch(getUsers.query)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="serch(getUsers.query)"
          ></el-button>
        </el-input>
        <el-button class="addUsers" type="primary">加只小肥猪仔</el-button>
      </div>
      <!-- 表格 -->
      <template>
        <el-table :data="userList" stripe style="width: 100%" border>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column label="状态">
            <template v-slot:default="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeUserState(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="mg_state" label="操作" width="175">
            <template>
              <!-- 修改用户数据 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <!-- 删除用户 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
              <el-tooltip
                effect="dark"
                content="详细设置"
                placement="top-start"
                :enterable="false"
              >
                <!-- 用户详细设置 -->
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="getUsers.pagenum"
            :page-sizes="[2, 4, 6, 10]"
            :page-size="getUsers.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
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
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      userList: [],
      total: 0
    };
  },
  methods: {
    // 获取用户数据列表
    getList() {
      this.$http
        .get("users", { params: this.getUsers })
        .then(res => {
          return res.data;
        })
        .then(res => {
          this.userList = res.data.users;
          this.total = res.data.total;
          // this.getUsers.pegenum = res.data.pegenum;
        })
        .catch(err => {
          this.$message.error("获取用户信息失败");
        });
    },
    // 修改用户状态
    changeUserState(userInfo) {
      this.$http
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then(res => {
          this.$message.success("状态修改成功！");
        })

        .catch(err => {
          this.$message.success("状态修改失败！");
          userInfo.mg_state = !userInfo.mg_state;
        });
    },
    // 监听分页，每页显示数量
    handleSizeChange(newPageSize) {
      this.getUsers.pagesize = newPageSize;
      this.getList();
    },
    // 监听分页，当前页码
    handleCurrentChange(newPageNum) {
      this.getUsers.pagenum = newPageNum;
      this.getList();
    },
    serch(query) {
      this.getUsers.query = query;
      this.getList();
    },
    clearInput() {
      this.getList();
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
  .block {
    margin-top: 15px;
  }
}
</style>
