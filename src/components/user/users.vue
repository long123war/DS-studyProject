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
        <el-button class="addUsers" type="primary" @click="dialogVisible = true"
          >加只小肥猪仔</el-button
        >
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
            <template v-slot:default="scopeDate">
              <!-- 修改用户数据 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="clickedit(scopeDate.row)"
              ></el-button>
              <!-- 删除用户 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="clickDelete(scopeDate.row)"
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
      <!-- 加只肥猪仔对话框 -->
      <template>
        <el-dialog
          title="加只小肥猪仔"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="dialogClose"
          @close="resetDialog()"
        >
          <!-- 对话框内的表单 -->
          <el-form
            ref="dialogForm"
            :model="dialogForm"
            :rules="dialogRules"
            label-width="80px"
            status-icon
          >
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="dialogForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input
                type="password"
                v-model="dialogForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="dialogForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机：" prop="mobile">
              <el-input v-model="dialogForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 对话框底部按钮 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUsers">确 定</el-button>
          </span>
        </el-dialog>
      </template>
      <!-- 修改用户对话框 -->
      <template>
        <el-dialog
          title="修改用户信息"
          :visible.sync="changeUserdata"
          width="50%"
          :before-close="dialogClose"
          @close="resetUserdataDialog()"
        >
          <!-- 对话框内的表单 -->
          <el-form
            ref="UserStateForm"
            :model="UserStateForm"
            :rules="UserStateRules"
            label-width="80px"
            status-icon
          >
            <el-form-item label="用户名：">
              <el-input
                v-model="UserStateForm.username"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="UserStateForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机：" prop="mobile">
              <el-input v-model="UserStateForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 对话框底部按钮 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="changeUserdata = false">取 消</el-button>
            <el-button type="primary" @click="changeUsers">确 定</el-button>
          </span>
        </el-dialog>
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
    //验证邮箱规则
    var emailRules = (rule, value, callback) => {
      const checkEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (checkEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    //验证手机号规则
    var mobileRules = (rule, value, callback) => {
      const checkMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (checkMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法手机号"));
    };
    return {
      getUsers: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      dialogForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      UserStateForm: {
        username: "",
        email: "",
        mobile: ""
      },
      editUsers: {
        id: ""
      },
      dialogRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailRules, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: mobileRules, trigger: "blur" }
        ]
      },
      UserStateRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailRules, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: mobileRules, trigger: "blur" }
        ]
      },

      userList: [],
      total: 0,
      dialogVisible: false,
      changeUserdata: false
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
    //点击修改用户按钮触发
    clickedit(scopeDateRow) {
      this.editUsers.id = scopeDateRow.id;
      this.UserStateForm.username = scopeDateRow.username;
      this.changeUserdata = true;
    },
    clickDelete(scopeDateRow) {
      this.$confirm("此操作将永久删除该用户，是否继续？")
        .then(res => {
          this.$http
            .delete(`users/${scopeDateRow.id}`)
            .then(res => {
              console.log(res);
              if (res.data.meta.status !== 200) return;
              this.$message.success("删除成功");
              this.getList();
            })
            .catch(err => {
              this.$message.success("删除失败");
            });
        })
        .catch(err => {});
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
    // 输入框状态变化时触发，搜索输入框的值
    serch(query) {
      this.getUsers.query = query;
      this.getList();
    },
    //清除输入框时触发，刷新用户数据列表
    clearInput() {
      this.getList();
    },
    // 点几X关闭对话框是触发的回调函数
    dialogClose(done) {
      this.$confirm("确认关闭？")
        .then(res => {
          done();
        })
        .catch(res => {});
    },
    // 关闭“加只小肥猪仔“对话框就会触发的回调函数
    resetDialog(dialogForm) {
      this.$refs.dialogForm.resetFields();
    },
    // 关闭“修改用户信息“对话框就会触发的回调函数
    resetUserdataDialog(UserStateForm) {
      this.$refs.UserStateForm.resetFields();
    },
    // 添加用户请求
    addUsers() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.$http
            .post("users", this.dialogForm)
            .then(res => {
              // console.log(res);
              if (res.data.meta.status !== 201) return;
              this.$message.success("小肥猪仔增加了~！");
              this.getList();
            })
            .catch(err => {
              this.$message.success("小肥猪仔增加失败了~！");
            });
        }
      });
      this.dialogVisible = false;
    },
    // 修改用户请求
    changeUsers() {
      this.$refs.UserStateForm.validate(valid => {
        if (valid) {
          this.$http
            .put(`users/${this.editUsers.id}`, {
              id: this.editUsers.id,
              email: this.UserStateForm.email,
              mobile: this.UserStateForm.mobile
            })
            .then(res => {
              return res.data;
            })
            .then(res => {
              if (res.meta.status !== 200) return;
              this.$message.success("修改成功~！");
              this.getList();
            })
            .catch(err => {
              this.$message.success("修改失败~！");
            });
        }
      });
      this.changeUserdata = false;
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
