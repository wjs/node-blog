<template>
  <transition name="slide">
    <div class="image-panel" v-show="show">
      图片管理
      <span class="f-r" @click="show = false">关闭</span>

      <el-upload
        class="upload-demo"
        action="/api/posts/upload-img"
        :multiple="false"
        :on-success="uploadImgSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import {
    Button,
    Upload
  } from 'element-ui'
  Vue.component(Button.name, Button)
  Vue.component(Upload.name, Upload)

  export default {
    name: 'ImagePanel',
    data () {
      return {
        show: false,
        images: []
      }
    },
    created () {
      this.$on('toggleShow', function () {
        this.show = !this.show
      })
    },
    methods: {
      uploadImgSuccess (res) {
        // 把返回的图片 url 直接插到 markdown 中
        // 默认加到后面，想放在其他地方需要手动移，后面查一下 textarea 光标位置
        // this.post.content += `![test img](${res})`
      }
    }
  }
</script>

<style lang="less">
  @keyframes slideDown {
    from {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      opacity: 0;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes slideUp {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    to {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      opacity: 0;
    }
  }
  .slide-enter-active, .slide-leave-active {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
  .slide-enter-to {
    animation: slideDown .2s forwards;
  }
  .slide-leave-to {
    animation: slideUp .25s forwards;
  }
  .image-panel {
    position: fixed;
    width: 100%;
    height: 300px;
    top: 0;
    left: 0;
    box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.25);
    background-color: #f2f2f2;
    z-index: 999;
  }
</style>
