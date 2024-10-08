<script setup>
import AddTask from '../components/AddTask.vue'
</script>

<template>
    <h1>Add Tasks here!</h1>
    <router-link to="/ViewTasks">
        <Button>Go back!</Button></router-link>
    <AddTask></AddTask>
</template>

<style scoped>
</style>