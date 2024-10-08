<script setup>
import ViewTasks from '../components/ViewTasks.vue'
</script>

<template>
    <router-link to="/AddTasks">
        <button>Add tasks!</button>
    </router-link>
  <Suspense>
    <ViewTasks></ViewTasks>
  </Suspense>
</template>

<style scoped>
</style>