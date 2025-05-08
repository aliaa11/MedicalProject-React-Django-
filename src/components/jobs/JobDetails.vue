<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-4">{{ job.title }}</h1>
      <p class="text-lg text-gray-700 mb-2">{{ job.company }}</p>
      <p class="text-gray-600 mb-4">{{ job.location }}</p>
      <p class="text-gray-500">{{ job.description }}</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const job = ref({})
  
  onMounted(async () => {
    const res = await fetch('http://localhost:3000/jobs/' + route.params.id)
    job.value = await res.json()
  })
  </script>
  