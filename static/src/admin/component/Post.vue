<template>
  <div class="post">
    <div class="row">
      <el-input type="text" placeholder="Title" v-model="post.title"></el-input>
      <el-upload
        class="upload-demo"
        action="/api/posts/upload-img"
        :multiple="false"
        :on-success="uploadImgSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <div class="row flex">
      <div class="flex1">
        <el-input
          type="textarea" :rows="20"
          placeholder="Markdown content..."
          v-model="post.content"
          @change="contentChange">
        </el-input>
      </div>
      <div class="flex1">
        <div class="preview-md" v-html="postPreview"></div>
      </div>
    </div>
    <div class="row">
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script>
  require('highlight.js/styles/atom-one-dark.css')
  import _ from 'lodash'
  import marked from 'marked'
  import Vue from 'vue'
  import {
    Input,
    Button,
    Upload
  } from 'element-ui'
  Vue.component(Input.name, Input)
  Vue.component(Button.name, Button)
  Vue.component(Upload.name, Upload)

  marked.setOptions({
    langPrefix: 'hljs ',
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value
    }
  })

  export default {
    name: 'Post',
    data () {
      return {
        post: {},
        postPreview: ''
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.getDetail(this.$route.params.id)
      }
    },
    methods: {
      getDetail (id) {
        this.$http.get(`/api/posts/${id}`)
        .then(res => res.body)
        .then(res => {
          this.post = res
          this.preview()
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
      },
      contentChange: _.debounce(function () {
        this.preview()
      }, 1000),
      preview () {
        this.postPreview = marked(this.post.content)
      },
      uploadImgSuccess (res) {
        // 把返回的图片 url 直接插到 markdown 中
        // 默认加到后面，想放在其他地方需要手动移，后面查一下 textarea 光标位置
        this.post.content += `![test img](${res})`
      }
    }
  }
</script>

<style lang="less">
  .post {
    .row {
      margin: 30px;
    }
    .flex {
      display: flex;
    }
    .flex1 {
      flex: 1;
    }
  }
</style>
