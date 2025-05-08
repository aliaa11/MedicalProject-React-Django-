<template>
    <div class="container">
      <h2 class="text-center mb-4">Post a new job</h2>
      <div class="card shadow p-4">
        <form @submit.prevent="submitJob">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="title" class="form-label">Job Title</label>
              <input type="text" id="title" v-model="job.title" class="form-control"  />
            </div>
            <div class="col-md-6">
              <label for="salary" class="form-label">Job Salary</label>
              <input type="text" id="salary" v-model="job.salary" class="form-control" />
            </div>
  
            <div class="col-md-6">
              <label for="description" class="form-label">Job Description</label>
              <textarea id="description" v-model="job.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="col-md-6">
              <label for="requirements" class="form-label">Job Requirements</label>
              <textarea id="requirements" v-model="job.requirements" class="form-control" rows="3"></textarea>
            </div>
  
            <div class="col-12">
              <label for="benefits" class="form-label">Job Benefits</label>
              <textarea id="benefits" v-model="job.benefits" class="form-control" rows="3"></textarea>
            </div>
  
            <div class="col-md-6">
              <label for="location" class="form-label">Job Location</label>
              <input type="text" id="location" v-model="job.location" class="form-control" />
            </div>
  
            <div class="col-md-6">
              <label for="type" class="form-label">Job Type</label>
              <select id="type" v-model="job.type" class="form-select">
                <option disabled value="">Select a job type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Internship</option>
              </select>
            </div>
  
            <div class="col-md-6">
              <label for="technologies" class="form-label">Technologies</label>
              <input type="text" id="technologies" v-model="job.technologies" class="form-control" />
            </div>
  
            <div class="col-md-6">
              <label for="category" class="form-label">Job Category</label>
              <select id="category" v-model="job.category" class="form-select">
                <option disabled value="">Select a category</option>
                <option>Web Development</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Customer Support</option>
              </select>
            </div>
  
            <div class="col-12  mt-3">
              <button type="submit" class="btn btn-primary px-5">Post Job</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  
  const job = reactive({
    title: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    type: '',
    technologies: '',
    category: ''
  });
  
  const submitJob = () => {
    // You can replace this with an API call
    console.log("Job submitted:", job);
    alert("Job posted successfully!");
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 12px;
  }
  </style>
  