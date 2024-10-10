<script setup>
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';

const filterDuration = ref('');
const sortBy = ref('');
const filterStartDate = ref('');
const filterEndDate = ref('');

const dropdownVisible = ref(false);

const emit = defineEmits(['filterTasks']);

function filterTasks() {
    emit('filterTasks', {
        filterDuration: filterDuration.value,
        sortBy: sortBy.value,
        filterStartDate: filterStartDate.value,
        filterEndDate: filterEndDate.value,
    });
}

function toggleDropdown(event) {
    event.stopPropagation();
    dropdownVisible.value = !dropdownVisible.value;
}

function handleClickOutside(event) {
    if (!event.target.closest('#taskFilter') && !event.target.closest('#dropdownToggle')) {
        dropdownVisible.value = false;
    }
}

watchEffect(() => {
    filterTasks();
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div style="position: relative;">
        <button id="dropdownToggle" @click.stop="toggleDropdown">Filter & Sort</button>
        
        <div v-if="dropdownVisible" id="taskFilter" class="dropdown" @click.stop>
            <div class="dropdownItem">
                <label for="sortBy">Sort by: </label>
                <select v-model="sortBy" id="sortBy">
                    <option value="">None</option>
                    <option value="name">Task Name</option>
                    <option value="startDate">Start Date</option>
                </select>
            </div>
            <div class="dropdownItem">
                <label for="filterDuration">Duration: </label>
                <select v-model="filterDuration" id="filterDuration">
                    <option value="">All</option>
                    <option value="short">< 1 day </option>
                    <option value="medium">1-7 days</option>
                    <option value="long">> 7 days</option>
                </select>
            </div>
            <div class="dropdownItem">
                <label for="filterStartDate">Start Date: </label>
                <input type="date" v-model="filterStartDate" id="filterStartDate" />
            </div>
            <div class="dropdownItem">
                <label for="filterEndDate">End Date: </label>
                <input type="date" v-model="filterEndDate" id="filterEndDate" />
            </div>
        
        </div>
    </div>
</template>

<style scoped>
.dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px black solid;
    padding: 0.5rem;
    z-index: 1000;
}

.dropdownItem {
    margin: 0.5rem;
}

#taskFilter {
    display: flex;
    flex-direction: column;
}
</style>