<template>
  <div class="init">
    <div class="init-form">
      <h1>站点初始化</h1>
      <el-input placeholder="站点名称，如：XXX的博客" v-model="site.sitename"></el-input>
      <el-input placeholder="管理员" v-model="site.admin"></el-input>
      <el-input placeholder="密码" type="password" v-model="site.password"></el-input>
      <el-input placeholder="确认密码" type="password" v-model="site.repassword"></el-input>
      <el-button type="primary" :loading="loading" @click="saveSite">
        保存{{loading ? '中...' : ''}}
      </el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Input,
    Button,
  } from 'element-ui'
  Vue.component(Input.name, Input)
  Vue.component(Button.name, Button)

  export default {
    name: 'InitSite',
    data () {
      return {
        site: {},
        loading: false
      }
    },
    methods: {
      saveSite () {
        console.log(this.site)
        if (this.site.password !== this.site.repassword) {
          return
        }
        const params = Object.assign({}, this.site)
        delete params.repassword

        this.loading = true
        this.$http.post('/admin/init/save-site', params)
        .then(res => res.body)
        .then(res => {
          console.log(res)
          window.location.href = '/admin'
        })
        .finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="less">
  .init {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .init-form {
    width: 300px;
    height: 400px;

    h1 {
      text-align: center;
    }
    .el-input {
      margin-bottom: 10px;
    }
    .el-button {
      width: 100%;
    }
  }
</style>
