<script setup>
import { ref, watchEffect } from 'vue';

const filterDuration = ref('');
const sortBy = ref('');

const emit = defineEmits(['filterTasks']);

function filterTasks() {
    emit('filterTasks', { filterDuration: filterDuration.value, sortBy: sortBy.value });
}

watchEffect(() => {
    filterTasks();
});
</script>

<template>
    <div>
        <label for="filterDuration">Filter by: </label>
        <select v-model="filterDuration" id="filterDuration">
            <option value="">All</option>
            <option value="short">Short (Less than 1 day)</option>
            <option value="medium">Medium (1-7 days)</option>
            <option value="long">Long (More than 7 days)</option>
        </select>

        <label for="sortBy">Sort by: </label>
        <select v-model="sortBy" id="sortBy">
            <option value="">None</option>
            <option value="name">Project Name</option>
            <option value="startDate">Start Date</option>
        </select>
    </div>
</template>

<style>
</style>