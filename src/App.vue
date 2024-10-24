<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style>
html {
  font-family: Helvetica, sans-serif;
}

body {
  margin: 0;
}
</style>