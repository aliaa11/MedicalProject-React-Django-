<template>
    <div class="container">
        <nav class="navbar navbar-expand-lg p-4 mb-4">
            <div class="container-fluid">
                <router-link class="navbar-brand fw-bold fs-3" :to="{ name: 'EmployerDashboardHome' }">Job Board</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <router-link class="nav-link active" aria-current="page" :to="{ name: 'EmployerDashboardHome' }">Home</router-link>
                        <router-link class="nav-link" :to="{ name: 'EmployerDashboardHome' }">Browse Jobs</router-link>
                        <router-link class="nav-link" :to="{ name: 'EmployerDashboardHome' }">Applications</router-link>
                    </div>
                </div>
            </div>
        </nav>
        <div class="row">
            <SideBar class="col-md-3"></SideBar>
            <router-view class="col-md-9"></router-view>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';  
import SideBar from './SideBar.vue';

</script>

<style>
    .navbar, .navbar-nav .nav-link, .navbar-brand {
        background-color: #007bff !important;
        color: #fff !important;
    }

    .navbar-nav .nav-link.active {
        color: #fff !important;
    }

</style>