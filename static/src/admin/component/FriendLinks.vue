<template>
  <div class="links">
    <el-button type="primary" @click="addNewRow">
      添加友链
    </el-button>
    <div class="row" v-for="item in links">
      <input type="text" v-model="item.name">
      <input type="text" v-model="item.link">
    </div>
    <div class="row" v-show="showNewRow">
      <input type="text" v-model="newLink.name">
      <input type="text" v-model="newLink.link">
      <el-button type="primary" @click="saveLinks()">
        添加
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FriendLinks',
    data () {
      return {
        showNewRow: false,
        newLink: {
          name: '',
          link: ''
        }
      }
    },
    props: {
      links: [],
      addLink: Function
    },
    methods: {
      addNewRow () {
        this.showNewRow = true
      },
      saveLinks () {
        this.addLink(this.newLink)
        this.showNewRow = false
      }
    }
  }
</script>
