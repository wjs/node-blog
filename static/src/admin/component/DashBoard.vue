<template>
  <div class="dashboard">
    <h1>
      博客管理页面!
      <router-link :to="{ name: 'add-post' }" style="float: right;">
        <el-button type="success" size="small">新增博客<i class="el-icon-edit el-icon--right"></i></el-button>
      </router-link>
    </h1>

    <div class="post-item" v-for="(item, index) in posts">
      <div class="title"><a :href="`/posts/${item._id}`" target="_blank">{{item.title}}</a></div>
      <div class="operate">
        <router-link :to="{ name: 'edit-post', params: { id: item._id } }">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <el-button type="primary" icon="edit"></el-button>
          </el-tooltip>
        </router-link>
        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
          <el-button type="primary" icon="delete" @click="del(item, index)"></el-button>
        </el-tooltip>
      </div>
    </div>

    <el-pagination
      layout="prev, pager, next"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Button,
    Tooltip,
    Pagination
  } from 'element-ui'
  Vue.component(Button.name, Button)
  Vue.component(Tooltip.name, Tooltip)
  Vue.component(Pagination.name, Pagination)

  export default {
    name: 'DashBoard',
    data () {
      return {
        posts: [],
        pagination: {
          currentPage: 1,
          pageSize: 2
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
  .post-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;

    &:hover {
      background-color: #f2f2f2;
    }

    .title {
      flex: 1;
      font-size: 1.2em;
      line-height: 1.8;

      a {
        text-decoration: none;
        color: #333;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .operate {
      text-align: center;

      button {
        margin-left: 20px;
      }
    }
  }
</style>
