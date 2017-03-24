<template>
  <div class="setting">
    <h1>站点设置页面!</h1>
    <div class="row">
      <label>站点名称</label>
      <el-input type="text" placeholder="站点名称" v-model="site.sitename"></el-input>
    </div>
    <div class="row">
      <label>每页显示条数</label>
      <el-input-number v-model="site.pagesize" :min="1" :max="20"></el-input-number>
    </div>
    <div class="row">
      <label>管理员</label>
      <el-input type="text" placeholder="管理员" v-model="site.admin"></el-input>
    </div>
     <div class="row">
      <label>github 用户名</label>
      <el-input type="text" placeholder="github 用户名" v-model="site.github"></el-input>
    </div>
    <friend-links :links="site.links" :add-link="addLink"></friend-links>
    <div class="row">
      <el-button type="primary" @click="updateSite" :loading="loading">
        保存{{loading ? '中...' : '更改'}}
      </el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Input,
    InputNumber,
    Button,
    Message
  } from 'element-ui'
  import FriendLinks from './FriendLinks.vue'
  Vue.component(Input.name, Input)
  Vue.component(InputNumber.name, InputNumber)
  Vue.component(Button.name, Button)

  export default {
    name: 'Setting',
    components: {
      FriendLinks
    },
    data () {
      return {
        site: {},
        loading: false
      }
    },
    mounted () {
      this.getSite()
    },
    methods: {
      getSite () {
        this.$http.get(`/api/site`)
        .then(res => res.body)
        .then(res => {
          this.site = res
        })
      },
      updateSite () {
        const { sitename, pagesize, admin, github, links } = this.site
        const params = {
          sitename,
          pagesize,
          admin,
          github,
          links
        }

        this.loading = true
        this.$http.put(`/api/site/${this.site._id}`, params)
        .then(res => res.body)
        .then(res => {
          Message({ message: '保存成功！', type: 'success'})
        })
        .finally(() => {
          this.loading = false
        })
      },
      addLink (link) {
        this.site.links.push(link)
      }
    }
  }
</script>

<style lang="less">
  .setting {
    .row {
      display: flex;
      width: 50%;
      margin: 20px 0;
      > label {
        width: 120px;
        line-height: 36px;
        color: #666;
      }
      > .el-input {
        flex: 1;
      }
    }
  }
</style>
