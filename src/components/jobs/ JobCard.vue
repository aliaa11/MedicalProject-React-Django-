<template>
    <div class="job-card">
      <div class="card-header">
        <h3>{{ job.title }}</h3>
        <p class="location">{{ job.location }}</p>
        <span class="job-type">{{ job.type }}</span>
      </div>
      
      <div class="card-footer">
        <span class="deadline">Deadline: {{ job.deadline }}</span>
        <button class="apply-btn">Apply Now</button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    job: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .job-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.3s, box-shadow 0.3s;
    margin: 2%;
  }
  
  .job-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    margin-bottom: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #047fec;
    margin-bottom: 0.5rem;
  }
  
  .location {
    color: #718096;
    margin-bottom: 1rem;
  }
  
  .job-type {
    background: #00e56c;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    display: inline-block;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .deadline {
    color: #718096;
    font-size: 0.875rem;
  }
  
  .apply-btn {
    background: #00e56c;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .apply-btn:hover {
    background: #047fec;
  }
  </style>