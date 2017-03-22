<template>
  <div class="links">
    <div class="row" v-for="item in links">
      <input type="text" v-model="item.name">
      <input type="text" v-model="item.link">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FriendLinks',
    props: {
      links: []
    }
  }
</script>
