<template>
  <div id="app">
    <div class="container">
      <div>
        <transition name="fade">
          <router-view/>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
