<template>
    <div class="container">
      <h2 class="text-center mb-4">Job Listings</h2>
  
      <div v-if="jobs.length" class="row g-4">
        <div class="col-md-6" v-for="(job, index) in jobs" :key="index">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">{{ job.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ job.location }} | {{ job.type }}</h6>
              <p class="card-text">{{ job.description }}</p>
              <ul class="list-unstyled">
                <li><strong>Salary:</strong> {{ job.salary }}</li>
                <li><strong>Technologies:</strong> {{ job.technologies }}</li>
                <li><strong>Category:</strong> {{ job.category }}</li>
              </ul>
              <button class="btn btn-outline-primary">View Details</button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="text-center">
        <p>No jobs available at the moment.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  // Simulated data — replace with API call if needed
  const jobs = ref([])
  
  onMounted(() => {
    // Mock data for now
    jobs.value = [
      {
        title: 'Frontend Developer',
        salary: '$70,000',
        description: 'Build and maintain user interfaces using Vue.js.',
        location: 'Remote',
        type: 'Full-time',
        technologies: 'Vue.js, JavaScript, HTML, CSS',
        category: 'Web Development'
      },
      {
        title: 'Backend Developer',
        salary: '$85,000',
        description: 'Develop RESTful APIs and handle database integration.',
        location: 'New York',
        type: 'Full-time',
        technologies: 'Node.js, Express, MongoDB',
        category: 'Web Development'
      }
    ]
  })
  </script>
  
  <style scoped>
  .card {
    border-radius: 10px;
  }
  </style>
  