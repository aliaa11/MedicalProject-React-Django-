<template>
  <nav class="navbar">
    <div class="logo">Job Board</div>
    <div class="nav-links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/jobs">Browse Job</RouterLink>
      
      <div class="dropdown">
        <button class="dropbtn">Pages</button>
        <div class="dropdown-content">
          <RouterLink to="/candidates">Candidates</RouterLink>
        </div>
      </div>
      
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
  background: #047fec;
  color: white;
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
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  color: white;
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
  background: #00e56c;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
  transition: background 0.3s;
}

.post-job-btn:hover {
  background: #00c45a;
}


.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  color: white;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 0.25rem;
  top: 100%;
  left: 0;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  opacity: 0.8;
}
</style>