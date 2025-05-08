<template>
  <div>
    <aside >
        <div class="list-group">
            <router-link class="list-group-item list-group-item-action" :to="{ name: 'EmployerDashboardHome' }">Home</router-link>
            <router-link class="list-group-item list-group-item-action" :to="{ name: 'JobForm' }">Post a Job</router-link>
            <router-link class="list-group-item list-group-item-action" :to="{ name: 'JobList' }">Job Listings</router-link>
            <router-link class="list-group-item list-group-item-action" :to="{ name: 'Applications' }">Applications</router-link>
        </div>
    </aside>
  </div>
</template>

<script setup>
    import { RouterLink } from 'vue-router';
</script>

<style>

</style>