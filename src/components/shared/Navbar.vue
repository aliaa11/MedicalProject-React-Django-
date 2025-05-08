<template>
    <nav class="navbar">
      <div class="logo">Job Board</div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/jobs">Browse Job</RouterLink>
        <RouterLink to="/pages">Pages</RouterLink>
        <RouterLink to="/blog">Blog</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <div class="auth-buttons">
          <RouterLink to="/login" class="login-btn">Log in</RouterLink>
          <RouterLink to="/post-job" class="post-job-btn">Post A Job</RouterLink>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  </script>
  
  <style scoped>
  .navbar {
    background: #047fec; /* تغيير لون الخلفية إلى أزرق */
    color: white; /* لون النص أبيض */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white; /* تغيير لون النص إلى أبيض */
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .nav-links a {
    color: white; /* تغيير لون النص إلى أبيض */
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s;
  }
  
  .nav-links a:hover {
    opacity: 0.8;
  }
  
  .auth-buttons {
    display: flex;
    gap: 1rem;
    margin-left: 1rem;
  }
  
  .login-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    color: white;
  }
  
  .post-job-btn {
    background: #00e56c; /* لون أخضر */
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 0.25rem;
    transition: background 0.3s;
  }
  
  .post-job-btn:hover {
    background: #00c45a; /* لون أخضر داكن عند hover */
  }
  </style>