<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主内容 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 级联选择器 -->
      <el-cascader
        v-model="cascaderValue"
        :options="paramsList"
        :props="cascaderProps"
        @change="handleChange"
      ></el-cascader>
      <!-- 标签页 -->
      <template>
        <el-tabs v-model="paramsActiveName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              :disabled="isDisabled"
              @click="dialogVisible"
              >添加参数</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="only">
            <el-button
              type="primary"
              :disabled="isDisabled"
              @click="dialogVisible"
              >添加属性</el-button
            >
          </el-tab-pane>
        </el-tabs>
        <!-- 表格 -->
        <el-table :data="paramsData" style="width: 100%" border>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template v-slot:default="scope">
              <div>{{ scope.row }}</div>
              <!-- <el-tag
                v-for="tag in scope.row"
                :key="tag.attr_id"
                closable
                type=""
              >
                {{ tag.attr_vals }}
              </el-tag> -->
            </template>
          </el-table-column>
          <!-- 表格内容 -->
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot:default="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editDialogVisible(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteParams(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 添加分类和属性对话框 -->
      <el-dialog
        :title="addParamsName"
        :visible.sync="paramsVisible"
        width="50%"
        @close="removeParams()"
      >
        <!-- 对话框内的表单 -->
        <el-form
          :model="paramsForm"
          :rules="paramsRules"
          ref="paramsRef"
          label-width="100px"
        >
          <el-form-item
            v-if="paramsActiveName === 'many'"
            label="动态参数"
            prop="attr_name"
          >
            <el-input v-model="paramsForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item v-else label="静态属性" prop="attr_name">
            <el-input v-model="paramsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="paramsVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类和属性对话框 -->
      <el-dialog
        :title="editParamsName"
        :visible.sync="editParamsVisible"
        width="50%"
        @close="editremoveParams()"
      >
        <!-- 对话框内的表单 -->
        <el-form
          :model="editParamsForm"
          :rules="editParamsRules"
          ref="editParamsRef"
          label-width="100px"
        >
          <el-form-item
            v-if="paramsActiveName === 'many'"
            label="动态参数"
            prop="attr_name"
          >
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item v-else label="静态属性" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getParamsList();
  },
  data() {
    return {
      // 请求获得商品分类数据列表参数
      paramsListKey: {
        type: 3
      },
      // 商品分类数据列表
      paramsList: [],
      // 级联选择器内容
      cascaderValue: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      // 标签页绑定name
      paramsActiveName: "many",
      // 商品参数列表
      paramsData: [],
      // 控制添加参数/属性对话框的开关
      paramsVisible: false,
      // 添加动态参数货静态属性表单的绑定对象
      paramsForm: {
        attr_name: ""
      },
      // 添加表单里的验证规则\
      paramsRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      // 编辑对话框开关
      editParamsVisible: false,
      editParamsForm: {
        attr_name: ""
      },
      // 添加表单里的验证规则\
      editParamsRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取级联选择器商品分类数据列表
    getParamsList() {
      this.$http
        .get("categories", { params: this.paramsListKey })
        .then(res => {
          return res.data;
        })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取商品分类数据列表失败！");
          }
          this.paramsList = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 级联选择器发生变化时
    handleChange() {
      console.log(this.cascaderValue);
      this.getParamsData();
    },
    // 标签页变化时触发
    handleClick() {
      this.getParamsData();
    },
    // 请求获取商品参数列表
    getParamsData() {
      this.$http
        .get(`categories/${this.cateID}/attributes`, {
          params: { sel: this.paramsActiveName }
        })
        .then(res => {
          return res.data;
        })
        .then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取商品参数列表失败！");
          }
          this.paramsData = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 添加参数或属性按钮触发
    dialogVisible() {
      this.paramsVisible = true;
    },
    // 编辑按钮触发编辑对话框
    editDialogVisible(row) {
      this.editParamsVisible = true;
      this.$http
        .get(`categories/${this.cateID}/attributes/${row.attr_id}`, {
          params: { attr_sel: this.paramsActiveName }
        })
        .then(res => {
          return res.data;
        })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("查询参数失败！");
          }
          this.editParamsForm = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 添加参数或属性请求
    addParams() {
      this.$refs.paramsRef.validate(valid => {
        if (!valid) {
          return;
        }

        this.$http
          .post(`categories/${this.cateID}/attributes`, {
            attr_name: this.paramsForm.attr_name,
            attr_sel: this.paramsActiveName
          })
          .then(res => {
            return res.data;
          })
          .then(res => {
            console.log(res);
            if (res.meta.status !== 201) {
              this.$message.error("添加参数或属性失败！");
              return;
            }
            this.getParamsData();
            this.paramsVisible = false;
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    // 编辑确定请求
    editParams() {
      this.$refs.editParamsRef.validate(valid => {
        if (!valid) {
          return;
        }
        this.$http
          .put(
            `categories/${this.cateID}/attributes/${this.editParamsForm.attr_id}`,
            {
              attr_name: this.editParamsForm.attr_name,
              attr_sel: this.editParamsForm.attr_sel,
              attr_vals: this.editParamsForm.attr_vals
            }
          )
          .then(res => {
            return res.data;
          })
          .then(res => {
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("编辑提交参数失败！");
            }
            this.getParamsData();
            this.editParamsVisible = false;
          })
          .catch(err => {
            console.error(err);
          });
      });
    },
    // 添加对话框关闭后清空内容
    removeParams() {
      this.paramsForm.attr_name = "";
    },
    // 编辑对话框关闭后清空内容
    editremoveParams() {
      this.editParamsForm.attr_name = "";
    },
    // 删除按钮触发
    deleteParams(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`categories/${this.cateID}/attributes/${row.attr_id}`)
            .then(res => {
              return res.data;
            })
            .then(res => {
              if (res.meta.status !== 200) {
                return this.$message.error("删除失败！");
              }
              this.$message.success("删除成功！");
              this.getParamsData();
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message("取消删除！");
        });
    }
  },
  computed: {
    isDisabled() {
      // 如果级联选择器内容长度不为3，证明选择的不是三级分类
      if (this.cascaderValue.length !== 3) {
        // 禁用
        return true;
      }
      // 可用
      return false;
    },
    // 级联选择器选择三级商品的ID
    cateID() {
      return this.cascaderValue[this.cascaderValue.length - 1];
    },
    // 计算对话框是动态参数还是静态属性
    addParamsName() {
      if (this.paramsActiveName === "many") {
        return "添加动态参数";
      } else {
        return "添加静态属性";
      }
    },
    editParamsName() {
      if (this.paramsActiveName === "many") {
        return "修改动态参数";
      } else {
        return "修改静态属性";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 15px 0;
  .el-cascader {
    margin: 15px 0;
  }
  .el-table {
    margin-top: 15px;
  }
}
</style>
