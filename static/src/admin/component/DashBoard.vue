<template>
  <div class="dashboard">
    <h1>
      博客管理页面!
      <router-link :to="{ name: 'add-post' }" style="float: right;">
        <el-button type="success" size="small">新增博客<i class="el-icon-edit el-icon--right"></i></el-button>
      </router-link>
    </h1>
    <el-table
      :data="posts"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="发布时间"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="public"
        label="类型"
        width="100px">
        <template scope="scope">
          <p>{{scope.row.public ? '公开' : '私密' }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150px"
        class-name="operate">
        <template scope="scope">
          <a :href="`/posts/${scope.row._id}`" target="_blank">
            <el-button type="text" size="small">预览</el-button>
          </a>
          <router-link :to="{ name: 'edit-post', params: { id: scope.row._id } }">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="del(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 20px 0; text-align: center">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Button,
    Tooltip,
    Table,
    TableColumn,
    Pagination
  } from 'element-ui'
  Vue.component(Button.name, Button)
  Vue.component(Tooltip.name, Tooltip)
  Vue.component(Table.name, Table)
  Vue.component(TableColumn.name, TableColumn)
  Vue.component(Pagination.name, Pagination)

  export default {
    name: 'DashBoard',
    data () {
      return {
        posts: [],
        pagination: {
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.getList()
      this.getPagination()
    },
    methods: {
      getList (filter) {
        const params = {
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
        this.$http.get('/api/posts', {
          params: params
        })
        .then(res => res.body)
        .then(res => {
          this.posts = res.data
        })
      },
      getPagination () {
        this.$http.get('/api/posts/pagination')
        .then(res => res.body)
        .then(res => {
          this.pagination = Object.assign({}, this.pagination, res)
        })
      },
      pageChange (newPage) {
        this.pagination.currentPage = newPage
        this.getList()
      },
      del (item, index) {
        if (confirm(`确认要删除改博客？: ${item.title}?`)) {
          this.$http.delete(`/api/posts/${item._id}`)
          .then(res => res.body)
          .then(res => {
            this.posts.splice(index, 1)
          })
        }
      }
    }
  }
</script>

<style lang="less">
  .operate {
    a {
      margin-right: 10px;
    }
  }
</style>
