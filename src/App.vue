<template>
  <div id="app">
    <!-- <site-navbar></site-navbar> -->
    <router-view></router-view>
  </div>
</template>

<script>

import Navbar from './components/Navbar'


export default {
  name: 'app',
  components: {
    'site-navbar': Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
