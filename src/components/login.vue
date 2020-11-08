<template>
  <div class="login-background">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="head-box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginForm"
        :rules="rules"
        :model="login"
        label-width="0px"
        class="login-from"
      >
        <el-form-item label="" prop="rulesName">
          <el-input
            v-model="login.name"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="rulesPassWord">
          <el-input
            v-model="login.passWord"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="userLogin">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        name: "肥猪猪",
        passWord: "123456"
      },
      rules: {
        rulesName: [
          //{ required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        rulesPassWord: [
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    reset() {
      this.$refs.loginForm.resetFields();
    },
    userLogin() {
      this.$refs.loginForm.validate(valid => {
        //console.log(valid);
        if (valid == true) {
          this.$http
            .post("login", {
              username: this.login.name,
              password: this.login.passWord
            })
            .then(res => {
              if (res.data.meta.status != 200) {
                this.$message.error("登录失败");
              } else {
                this.$message.success("登录成功");
              }

              console.log(res.data);
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          return;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-background {
  background-color: #2b4b6b;
  height: 100%;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .head-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0px 0px 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 10px;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-from {
      padding: 0 20px;
      position: absolute;
      bottom: 10px;
      box-sizing: border-box;
      width: 100%;
    }
    .login-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
