<template>
  <transition name="slide">
    <div class="image-panel" v-show="show">
      <div class="upload-box">
        截图比例
        <el-input-number v-model="cropW" :min="1"></el-input-number>
        :
        <el-input-number v-model="cropH" :min="1"></el-input-number>
        <vue-core-image-upload
          :crop-ratio="`${this.cropW}:${this.cropH}`"
          class="el-button el-button--primary crop-btn"
          :crop="true"
          url="/api/posts/upload-img"
          extensions="png,jpeg,jpg"
          v-on:imageuploaded="uploadImgSuccess">
        </vue-core-image-upload>
      </div>

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
    InputNumber,
    Collapse,
    CollapseItem,
    Message
  } from 'element-ui'
  Vue.component(Button.name, Button)
  Vue.component(InputNumber.name, InputNumber)
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
        cropW: 1,
        cropH: 1,
        images: [],
        openYear: '1'
      }
    },
    computed: {
      cropRatio () {
        return this.cropW + ':' + this.cropH
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

    .upload-box {
      padding: 20px 0;
    }
    .el-input-number {
      width: 120px;
      vertical-align: middle;
    }
    .crop-btn {
      margin-left: 20px;
      vertical-align: middle;
    }
    .el-collapse-item__header {
      background-color: #eff2f7;
    }
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
