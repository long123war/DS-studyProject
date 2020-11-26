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
                :class="['tag-center', 'bottom-tag', i1 === 0 ? 'top-gat' : '']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag @close="removeTag(scoped.row, item1.id)" closable>
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
                      <el-tag
                        @close="removeTag(scoped.row, item2.id)"
                        type="success"
                        closable
                      >
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
                        @close="removeTag(scoped.row, item3.id)"
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
            <template v-slot:default="scoped">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRolePermissions(scoped.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分配权限对话框 -->
      <template>
        <el-dialog
          title="分配角色权限"
          :visible.sync="rolePermissions"
          width="50%"
          @close="resetRolePermissions()"
        >
          <el-tree
            :data="rolePermissionsList"
            :props="roleProps"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="defaultCheckRole"
            ref="roleTree"
          ></el-tree>
          <!-- 对话框底部按钮 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="rolePermissions = false">取 消</el-button>
            <el-button type="primary" @click="roleAuthorization"
              >确 定</el-button
            >
          </span>
        </el-dialog>
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
      rolesList: [],
      rolePermissionsList: [],
      roleProps: {
        children: "children",
        label: "authName"
      },
      // 点击分配权限时，用来保存角色对应权限的数组
      defaultCheckRole: [],
      rolePermissions: false,
      // 点击分配权限时先把角色id保存下来，方便之后发送请求使用
      roleId: ""
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
    },
    // 删除角色权限
    removeTag(roleId, rightId) {
      // 删除二次确认弹框
      this.$confirm("此操作将永久删除该角色权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 确认删除请求发送
        .then(res => {
          this.$http
            .delete(`roles/${roleId.id}/rights/${rightId}`)
            .then(res => {
              return res.data;
            })
            .then(res => {
              if (res.meta.status !== 200) {
                return this.$message.error("删除失败!!");
              }
              roleId.children = res.data;
              this.$message.success("删除成功!!");
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => err);
    },
    //点击角色分配权限触发
    setRolePermissions(roleInfo) {
      //发送请求获取所有权限列表
      this.$http
        .get(`rights/tree`)
        .then(res => {
          return res.data;
        })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取权限列表失败！");
          }
          // 赋值，再页面渲染出所有权限列表
          this.rolePermissionsList = res.data;
        })
        .catch(err => {
          console.error(err);
        });
      this.getRoleThreePermissions(roleInfo, this.defaultCheckRole);
      this.roleId = roleInfo.id;
      this.rolePermissions = true;
    },
    // 递归获取角色所有的三级权限
    getRoleThreePermissions(roleInfo, roleArr) {
      // 如果节点没有children证明是最后的三级权限，把id加入roleArr数组中
      if (!roleInfo.children) {
        return roleArr.push(roleInfo.id);
      }
      for (let item of roleInfo.children) {
        // 否则继续向下循环
        this.getRoleThreePermissions(item, roleArr);
      }
    },
    // 关闭角色分配对话框时
    resetRolePermissions() {
      this.defaultCheckRole = [];
    },
    // 分配权限对话框确定时发起请求给角色授权
    roleAuthorization() {
      const roleKeys = [
        ...this.$refs.roleTree.getCheckedKeys(),
        ...this.$refs.roleTree.getHalfCheckedNodes()
      ];
      const roleKeysString = roleKeys.join(",");
      this.$http
        .post(`roles/${this.roleId}/rights`, { rids: roleKeysString })
        .then(res => {
          return res.data;
        })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("更新角色权限失败！");
          }
          this.$message.success("更新角色权限成功！");
          this.getRolesList();
        })
        .catch(err => {
          console.error(err);
        });
      this.rolePermissions = false;
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
.tag-center {
  display: flex;
  align-items: center;
}
</style>
