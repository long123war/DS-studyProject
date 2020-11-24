<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主区域卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <template>
        <el-table :data="rolesList" stripe style="width: 100%" border>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template v-slot:default="scoped">
              <el-row
                v-for="(item1, i1) in scoped.row.children"
                :key="item1.id"
                closable
                :class="['bottom-tag', i1 === 0 ? 'top-gat' : '']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag>
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级与三级权限布局分配 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                    closable
                    :class="i2 === 0 ? '' : 'top-tag'"
                  >
                    <!-- 二级权限 -->
                    <el-col :span="6">
                      <el-tag type="success">
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        type="warning"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作">
            <!-- 操作按钮 -->
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
              <el-button type="warning" icon="el-icon-setting" size="mini"
                >分配权限</el-button
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
    this.getRolesList();
  },
  data() {
    return {
      rolesList: []
    };
  },
  methods: {
    //获取角色列表
    getRolesList() {
      this.$http
        .get("roles")
        .then(res => {
          return res.data;
        })
        .then(res => {
          this.rolesList = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 7px;
  .el-tag {
    margin: 5px;
  }
}
.top-tag {
  border-top: 1px solid #eee;
}
.bottom-tag {
  border-top: 1px solid #eee;
}
</style>
