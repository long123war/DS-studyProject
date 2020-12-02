<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主内容卡片 -->
    <el-card>
      <el-button type="primary" @click="sortingDialogVisible"
        >添加分类</el-button
      >
      <!-- 表格主体 -->
      <zk-table
        ref="table"
        show-index
        border
        index-text="#"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:#20B2AA;"
          ></i>
          <i class="el-icon-error" v-else style="color:#F92672;"></i>
        </template>
        <!-- 排序 -->
        <template slot="sorting" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning"
            >三级</el-tag
          >
        </template>
        <template slot="button">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </zk-table>
    </el-card>
    <!-- 添加分类对话框 -->
    <template>
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        @close="resetDialog()"
      >
        <!-- 对话框内的表单 -->
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          :rules="dialogRules"
          label-width="100px"
          status-icon
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="dialogForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              v-model="fatherSortingKey"
              :options="fatherSortingList"
              :props="cascaderProps"
              @change="fatherSortingChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- 对话框底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSorting">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      // 商品分类数据请求需要的参数
      cateListKey: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 数据库一共有多少条数据
      total: "",
      // 获取到的商品分类数据列表
      cateList: [],
      // 添加分类对话框弹出控制
      dialogVisible: false,
      // 选中父级分类的ID数组
      fatherSortingKey: [],
      // 获取父级分类数据列表（2级）
      fatherSortingList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: "cat_pid",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      // 表格的列数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "sorting"
        },
        {
          label: "操作",
          type: "template",
          template: "button"
        }
      ],
      // 添加分类表单对象
      dialogForm: {
        cat_name: "",
        cat_pid: "",
        cat_level: ""
      },
      // 表单预校验对象
      dialogRules: {
        cat_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取商品分类数据列表
    getCateList() {
      this.$http
        .get("categories", { params: this.cateListKey })
        .then(res => {
          return res.data;
        })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取商品分类数据失败！");
          }
          this.cateList = res.data.result;
          this.total = res.data.total;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 添加分类按钮触发
    sortingDialogVisible() {
      this.$http
        .get("categories", { params: { type: 2 } })
        .then(res => {
          return res.data;
        })
        .then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取商品分类数据列表失败！！！");
          }
          this.fatherSortingList = res.data;
        })
        .catch(err => {
          console.error(err);
        });
      this.dialogVisible = true;
    },
    // 关闭添加分类对话空时
    resetDialog() {
      this.$refs.dialogForm.resetFields();
    },
    // 添加分类对话框确定时
    addSorting() {},
    // 当添加分类对话框内，级联选择器发生变化时
    fatherSortingChange() {
      console.log(this.fatherSortingKey);
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 7px;
  .zk-table {
    margin-top: 15px;
  }
}
.el-cascader {
  width: 100%;
}
</style>
