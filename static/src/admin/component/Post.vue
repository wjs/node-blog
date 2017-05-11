<template>
  <div class="post">
    <image-panel ref="imagePanel"></image-panel>
    <div>
      <el-input type="text" placeholder="Title" v-model="post.title"></el-input>
    </div>
    <div class="tools">
      <el-switch
        v-model="post.public"
        on-text="公开"
        off-text="私密">
      </el-switch>
      <el-tag
        :key="tag"
        v-for="tag in post.tags"
        :closable="true"
        :close-transition="false"
        @close="handleTagClose(tag)"
      >
      {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="tagInputVisible"
        v-model="tagInputValue"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleTagInputConfirm"
        @blur="handleTagInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ New Tag</el-button>
      <el-button type="primary" @click="openImagePanel">图片管理</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
    <div class="flex editor">
      <div class="flex1">
        <el-input
          type="textarea"
          placeholder="Markdown content..."
          v-model="post.content"
          @change="contentChange"
          @keydown.native="keydownSave">
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
    Switch,
    Tag,
    Message
  } from 'element-ui'
  import ImagePanel from './ImagePanel.vue'
  Vue.component(Input.name, Input)
  Vue.component(Button.name, Button)
  Vue.component(Switch.name, Switch)
  Vue.component(Tag.name, Tag)

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
        post: {
          public: false,
          tags: []
        },
        postPreview: '',
        tagInputVisible: false,
        tagInputValue: ''
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.getDetail(this.$route.params.id)
      }
    },
    beforeRouteLeave (to, from, next) {
      // if (confirm(`确认要离开？`)) {
      //   next()
      // } else {
      //   return false
      // }
      next()
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
      // cmd + s or ctrl + s to save
      keydownSave (e) {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {
          e.preventDefault()
          this.save()
        }
      },
      save () {
        if (this.post._id) {
          this.$http.put(`/api/posts/${this.post._id}`, this.post)
          .then(res => res.body)
          .then(res => {
            // this.$router.push({ name: 'dashboard' })
            Message({ message: '保存成功！', type: 'success'})
          })
        } else {
          this.$http.post('/api/posts', this.post)
          .then(res => res.body)
          .then(res => {
            this.post = Object.assign({}, this.post, { _id: res })
            // this.$router.push({ name: 'dashboard' })
            Message({ message: '保存成功！', type: 'success'})
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
      },
      handleTagClose (tag) {
        this.post.tags.splice(this.post.tags.indexOf(tag), 1);
      },
      showTagInput () {
        this.tagInputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleTagInputConfirm () {
        if (this.tagInputValue) {
          this.post.tags.push(this.tagInputValue)
        }
        this.tagInputVisible = false
        this.tagInputValue = ''
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
    pre, img {
      max-width: 500px;
    }
    .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      display: inline-block;
      width: 77px;
      height: 24px;
      line-height: 22px;
      margin: 0 10px;
    }
  }
</style>
