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
      <el-button type="primary">添加分类</el-button>
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
      ]
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
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取商品分类数据失败！");
          }
          this.cateList = res.data.result;
          this.total = res.data.total;
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
}
</style>
