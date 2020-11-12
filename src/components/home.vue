<template>
  <el-container class="home-container">
    <!-- 主页头 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <img src="../assets/肥猪.jpg" />
        <span>肥猪猪管理肥猪系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 侧栏与主内容 -->
    <el-container>
      <!-- 侧栏 -->
      <el-aside :width="changeMenu === true ? '64px' : '200px'">
        <div class="toggle-button" @click="folding">|||</div>
        <el-menu
          class="el-menu-vertical"
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
          :collapse="changeMenu"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 侧面一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menus"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + i.path"
              v-for="i in item.children"
              :key="i.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ i.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主内容 -->
      <el-main> <router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      changeMenu: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getList() {
      this.$http
        .get("menus")
        .then(res => {
          if (res.data.meta.status === 200) {
            this.menus = res.data.data;
          }
          // console.log(res);
          console.log(this.menus);
        })
        .catch(err => {
          console.error(err);
        });
    },
    folding() {
      this.changeMenu = !this.changeMenu;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 20px;
    padding-left: 0px;
    > div {
      display: flex;
      align-items: center;
      img {
        width: 61px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
    .el-submenu {
      i {
        margin-right: 10px;
      }
    }
    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
