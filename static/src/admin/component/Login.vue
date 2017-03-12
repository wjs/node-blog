<template>
  <div class="login">
    <div class="login-form">
      <h1>管理员登录</h1>
      <el-input placeholder="管理员" v-model="admin"></el-input>
      <el-input placeholder="密码" type="password" v-model="password" @keyup.native.enter="login"></el-input>
      <el-button type="primary" :loading="loading" @click="login">
        登录{{loading ? '中...' : ''}}
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
    name: 'Login',
    data () {
      return {
        admin: '',
        password: '',
        loading: false
      }
    },
    methods: {
      login () {
        const params = {
          username: this.admin,
          password: this.password
        }

        this.loading = true
        this.$http.post('/admin/login', params)
        .then(res => res.body)
        .then(res => {
          window.location.href = '/admin'
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="less">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .login-form {
    width: 300px;
    height: 300px;

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
