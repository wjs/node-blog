<template>
  <div class="admin-layout">
    <div class="left">
      <el-menu theme="dark" :default-active="activeRouter" class="left-nav">
        <router-link :to="{ name: 'dashboard'}">
          <el-menu-item index="dashboard">
            <i class="el-icon-menu"></i>博客管理
          </el-menu-item>
        </router-link>
        <router-link :to="{ name: 'setting' }">
          <el-menu-item index="setting">
            <i class="el-icon-setting"></i>站点设置
          </el-menu-item>
        </router-link>
        <a href="/admin/logout" class="logout-btn">
          <el-menu-item index="logout">
            <i class="el-icon-d-caret"></i>退出登录
          </el-menu-item>
        </a>
      </el-menu>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Row,
    Col,
    Menu,
    MenuItem,
  } from 'element-ui'
  Vue.component(Row.name, Row)
  Vue.component(Col.name, Col)
  Vue.component(Menu.name, Menu)
  Vue.component(MenuItem.name, MenuItem)

  export default {
    name: 'Admin',
    data () {
      return {
        activeRouter: this.$router.currentRoute.name
      }
    }
  }
</script>

<style lang="less">
  html, body, #root, .admin-layout {
    height: 100%;
  }
  .admin-layout {
    display: flex;
    .left, .right {
      height: 100%;
    }
    .left {
      width: 125px;
    }
    .right {
      flex: 1;
      padding: 0 30px;
    }
  }
  .left-nav {
    height: 100%;
    a {
      text-decoration: none;
    }
  }
  .logout-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
  }

  .clearfix::after {
    display: block;
    content: '';
    clear: both;
  }
  .f-r {
    float: right;
  }
  .text-center {
    text-align: center;
  }
</style>
