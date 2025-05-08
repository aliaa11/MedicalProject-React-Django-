<template>
  <div>
    <Navbar v-if="showNavbarAndFooter" />
    <router-view />
    <Footer v-if="showNavbarAndFooter" />
  </div>
</template>

<script setup>
import Navbar from './components/shared/Navbar.vue'
import Footer from './components/shared/Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const showNavbarAndFooter = computed(() => {
 
  return !['login', 'register'].includes(route.name)
})
</script>