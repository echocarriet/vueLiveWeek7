<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view />
</template>
<script>
import emitter from './methods/eventBus';

export default {
  provide() {
    return {
      emitter,
    };
  },
};
</script>
<style lang="scss">
@import './assets/all';
// 推薦使用 CDN，因為 svg 不一定可以從 node_modules 導出
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');

// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
</style>
