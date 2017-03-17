<template>
  <div class="post">
    <image-panel ref="imagePanel" :show="showImagePanel"></image-panel>
    <div>
      <el-input type="text" placeholder="Title" v-model="post.title"></el-input>
    </div>
    <div class="tools">
      <el-button type="primary" @click="openImagePanel">图片管理</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
    <div class="flex editor">
      <div class="flex1">
        <el-input
          type="textarea"
          placeholder="Markdown content..."
          v-model="post.content"
          @change="contentChange">
        </el-input>
      </div>
      <div class="flex1">
        <div class="preview-md" v-html="postPreview"></div>
      </div>
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
  import ImagePanel from './ImagePanel.vue'
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
    components: {
      ImagePanel
    },
    data () {
      return {
        post: {},
        postPreview: '',
        showImagePanel: false
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.getDetail(this.$route.params.id)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (confirm(`确认要离开？`)) {
        next()
      } else {
        return false
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
      openImagePanel () {
        this.$refs.imagePanel.$emit('toggleShow')
      }
    }
  }
</script>

<style lang="less">
  .post {
    height: 100%;
    overflow: auto;
    padding: 20px 30px 20px 0;
    margin-right: -30px;
    box-sizing: border-box;

    .flex {
      display: flex;
    }
    .flex1 {
      flex: 1;
      width: .001%;
    }
    .tools {
      margin: 20px 0;
    }
    .editor {
      height: ~"calc(100% - 120px)";
      border: 1px solid #bfcbd9;
      border-radius: 5px;
    }
    .el-textarea,
    textarea {
      height: 100%;
      border: none;
    }
    .preview-md {
      height: 100%;
      overflow: auto;
      padding: 0 10px;
      border-left: 1px solid #bfcbd9;
      box-sizing: border-box;
    }
    pre {
      max-width: 500px;
    }
  }
</style>
