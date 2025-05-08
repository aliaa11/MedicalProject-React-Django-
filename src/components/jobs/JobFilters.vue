<template>
    <div class="filters">
      <div class="filter-group">
        <input type="text" v-model="filters.keyword" placeholder="Search keyword" @input="emitFilters" />
      </div>
  
      <div class="filter-group">
        <select v-model="filters.location" @change="emitFilters">
          <option value="">All Locations</option>
          <option value="California, USA">California, USA</option>
          <option value="New York, USA">New York, USA</option>
        </select>
      </div>
  
      <div class="filter-group">
        <select v-model="filters.category" @change="emitFilters">
          <option value="">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Design & Art">Design & Art</option>
          <option value="Sales & Marketing">Sales & Marketing</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
  
      <div class="filter-group">
        <select v-model="filters.experience" @change="emitFilters">
          <option value="">All Experience Levels</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>
  
      <div class="filter-group">
        <select v-model="filters.salary" @change="emitFilters">
          <option value="">All Salaries</option>
          <option value="0-3000">0 - 3000</option>
          <option value="3000-7000">3000 - 7000</option>
          <option value="7000-12000">7000 - 12000</option>
        </select>
      </div>
  
      <div class="filter-group">
        <select v-model="filters.datePosted" @change="emitFilters">
          <option value="">Any time</option>
          <option value="1">Last 24 hours</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
  
      <button class="find-job-btn" @click="emitFilters">Find Job</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const filters = ref({
    keyword: '',
    location: '',
    category: '',
    experience: '',
    salary: '',
    datePosted: ''
  })
  
  const emit = defineEmits(['filterChanged'])
  
  const emitFilters = () => {
    emit('filterChanged', filters.value)
  }
  </script>
  
  <style scoped>
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .filter-group {
    flex: 1 1 200px;
  }
  
  .filter-group input,
  .filter-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    outline: none;
  }
  
  .find-job-btn {
    background: #00e56c;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .find-job-btn:hover {
    background: #047fec;
  }
  </style>
  