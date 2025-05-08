<template>
    <div class="container">
      <h2 class="text-center mb-4">Job Applications</h2>
  
      <div v-if="applications.length" class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(app, index) in applications" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ app.name }}</td>
              <td>{{ app.email }}</td>
              <td>{{ app.jobTitle }}</td>
              <td>
                <span class="badge"
                      :class="{
                        'bg-warning text-dark': app.status === 'Pending',
                        'bg-success': app.status === 'Accepted',
                        'bg-danger': app.status === 'Rejected'
                      }">
                  {{ app.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-success me-2" @click="updateStatus(index, 'Accepted')">Accept</button>
                <button class="btn btn-sm btn-outline-danger" @click="updateStatus(index, 'Rejected')">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="text-center">
        <p>No applications received yet.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const applications = ref([])
  
  onMounted(() => {
    // Mock applications — replace with API later
    applications.value = [
      { name: 'Mohamed Maged', email: 'maged@yahoo.com', jobTitle: 'Frontend Developer', status: 'Pending' },
      { name: 'Younes Saeed', email: 'younes@yahoo.com', jobTitle: 'Backend Developer', status: 'Pending' }
    ]
  })
  
  function updateStatus(index, newStatus) {
    applications.value[index].status = newStatus
  }
  </script>
  
  <style scoped>
  table {
    border-radius: 8px;
    overflow: hidden;
  }
  </style>
  