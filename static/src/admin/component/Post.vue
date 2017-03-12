<template>
  <div class="post">
    <div class="row">
      <el-input type="text" placeholder="Title" v-model="post.title"></el-input>
    </div>
    <div class="row">
      <el-input type="textarea" :rows="20" placeholder="Markdown content..." v-model="post.content"></el-input>
    </div>
    <div class="row">
      <el-button type="primary" @click="save">Save</el-button>
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
    name: 'Post',
    data () {
      return {
        post: {}
      }
    },
    mounted () {
      if (this.$route.params.id) {
        console.log(this.$route.params.id)
        this.getDetail(this.$route.params.id)
      }
    },
    methods: {
      getDetail (id) {
        this.$http.get(`/api/posts/${id}`)
        .then(res => res.body)
        .then(res => {
          this.post = res
        })
      },
      save () {
        if (this.$route.params.id) {
          this.$http.put(`/api/posts/${this.post._id}`, this.post)
          .then(res => res.body)
          .then(res => {
            this.$router.push({ name: 'dashboard' })
          })
        } else {
          this.$http.post('/api/posts', this.post)
          .then(res => res.body)
          .then(res => {
            this.$router.push({ name: 'dashboard' })
          })
        }
      }
    }
  }
</script>

<style lang="less">
  .post {
    .row {
      margin: 30px;
    }
  }
</style>
