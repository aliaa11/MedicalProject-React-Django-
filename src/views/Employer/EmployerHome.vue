<template>
    <div>
        <h1 class="">Welcome to Employer Dashboard</h1>
        <div class="row">
            <main class="col-md-9">
                <div class="row g-3">
                    <div class="card col-md-4 m-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Jobs</h5>
                            <p class="card-text">100</p>
                            <router-link to="#" class="btn btn-primary">View</router-link>
                        </div>
                    </div>
                    <div class="card col-md-4 m-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Applicants</h5>
                            <p class="card-text">50</p>
                            <router-link to="#" class="btn btn-primary">View</router-link>
                        </div>
                    </div>
                    <div class="card col-md-4 m-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Interviews</h5>
                            <p class="card-text">20</p>
                            <router-link to="#" class="btn btn-primary">View</router-link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
    import SideBar from './SideBar.vue';
    import { RouterLink } from 'vue-router';
</script>

<style>

</style>