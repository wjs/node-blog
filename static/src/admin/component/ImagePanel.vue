<template>
  <transition name="slide">
    <div class="image-panel" v-show="show">
      图片管理

      <!--
      <el-upload
        class="upload-demo"
        action="/api/posts/upload-img"
        :multiple="false"
        :on-success="uploadImgSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      -->
      <vue-core-image-upload
        crop-ratio="4:3"
        :class="['pure-button','pure-button-primary','js-btn-crop']"
        :crop="true"
        url="/api/posts/upload-img"
        extensions="png,gif,jpeg,jpg"
        v-on:imageuploaded="uploadImgSuccess">
      </vue-core-image-upload>

      <el-collapse v-model="openYear">
        <el-collapse-item :title="year.dir" :name="year.dir" :key="year.dir" v-for="year in images">
          <div class="month-section" :key="month.dir" v-for="month in year.children">
            <div>{{month.dir}}</div>
            <div class="clearfix">
              <div class="img-box" :key="img" v-for="img in month.children">
                <img :src="`/static/${year.dir}/${month.dir}/${img}`" alt="">
                <div class="tool-box">
                  <i class="el-icon-delete2" @click="deleteImg(`${year.dir}/${month.dir}/${img}`)"></i>
                  <i class="el-icon-document f-r copy-btn" :data-clipboard-text="`![](/static/${year.dir}/${month.dir}/${img})`"></i>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="close-bar" @click="show = false">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import Clipboard from 'clipboard'
  import VueCoreImageUpload  from 'vue-core-image-upload'
  import {
    Button,
    Upload,
    Collapse,
    CollapseItem,
    Message
  } from 'element-ui'
  Vue.component(Button.name, Button)
  Vue.component(Upload.name, Upload)
  Vue.component(Collapse.name, Collapse)
  Vue.component(CollapseItem.name, CollapseItem)

  export default {
    name: 'ImagePanel',
    components: {
      VueCoreImageUpload
    },
    data () {
      return {
        show: false,
        images: [],
        openYear: '1'
      }
    },
    created () {
      this.$on('toggleShow', function () {
        this.show = !this.show
      })

      this.getUploadedImage()
    },
    methods: {
      getUploadedImage () {
        this.$http.get('/api/posts/upload-img/list')
        .then(res => res.body)
        .then(res => {
          this.images = res
          if (this.images[0]) {
            this.openYear = this.images[0].dir
          }
          this.$nextTick(() => {
            const clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
              Message({ message: '图片 Markdown 格式已复制到剪贴板！', type: 'info'})
              this.show = false
            })
          })
        })
      },
      uploadImgSuccess (res) {
        // 把返回的图片 url 直接插到 markdown 中
        // 默认加到后面，想放在其他地方需要手动移，后面查一下 textarea 光标位置
        // this.post.content += `![test img](${res})`
        this.getUploadedImage()
      },
      deleteImg (file) {
        this.$http.delete(`/api/posts/upload-img/${file}`)
        .then(res => res.body)
        .then(res => {
          this.getUploadedImage()
        })
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

  @imagePanelHeight: 300px;
  .image-panel {
    position: fixed;
    width: 100%;
    height: @imagePanelHeight;
    overflow: auto;
    top: 0;
    left: 0;
    padding-bottom: 30px;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 999;
  }
  .img-box {
    float: left;
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 10px 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
    &:hover {
      .tool-box {
        display: block;
      }
    }
    .tool-box {
      display: none;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 30px;
      padding: 5px 10px;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, .4);
      i {
        cursor: pointer;
        font-size: 1.5em;
        color: #fff;
        &:hover {
          color: #20a0ff;
        }
      }
    }
  }
  .close-bar {
    position: fixed;
    left: 0;
    top: @imagePanelHeight;
    width: 100%;
    text-align: center;
    background-color: #eee;
    box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.25);
    z-index: 999;
  }
</style>
