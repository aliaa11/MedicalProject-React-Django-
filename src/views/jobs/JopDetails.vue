<template>
    <div class="job-details-container">
      <h1>Job Details Page</h1>
      <div class="job-content">
        <p>Hello! This is the job details page content.</p>
        
        <div class="job-info">
          <h2>Senior Frontend Developer</h2>
          <div class="meta-info">
            <span class="company">Tech Solutions Inc.</span>
            <span class="location">Cairo, Egypt</span>
            <span class="salary">$3,000 - $5,000</span>
            <span class="job-type">Full-time</span>
          </div>
          
          <div class="description">
            <h3>Job Description:</h3>
            <p>We are looking for an experienced Frontend Developer to join our team...</p>
          </div>
          
          <div class="requirements">
            <h3>Requirements:</h3>
            <ul>
              <li>3+ years of experience with Vue.js</li>
              <li>Strong JavaScript skills</li>
              <li>Experience with REST APIs</li>
            </ul>
          </div>
        </div>
        
        <button class="apply-btn">Apply Now</button>
      </div>
    </div>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  .job-details-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  h1 {
    color: #047fec;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .job-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .job-info h2 {
    color: #047fec;
    margin-bottom: 1rem;
  }
  
  .meta-info {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    color: #666;
  }
  
  .meta-info span {
    padding-right: 1rem;
    border-right: 1px solid #ddd;
  }
  
  .meta-info span:last-child {
    border-right: none;
  }
  
  .description, .requirements {
    margin-bottom: 2rem;
  }
  
  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .apply-btn {
    background: #00e56c;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    display: block;
    margin: 0 auto;
  }
  
  .apply-btn:hover {
    background: #00c45a;
  }
  </style>