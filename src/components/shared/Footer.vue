<template>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Job Board</h3>
          <p class="tagline">Find your dream job</p>
          <p><i class="fas fa-envelope icon"></i> jobBoard@gmail.com</p>
          <p><i class="fas fa-phone icon"></i> +10 0000 000 00</p>
          <p><i class="fas fa-map-marker-alt icon"></i> Egypt</p>
        </div>
  
        <div class="footer-section">
          <h3>Company</h3>
          <ul>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> About</a></li>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> Pricing</a></li>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> Current Tips</a></li>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> FAQ</a></li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h3>Category</h3>
          <ul>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> Design & Art</a></li>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> Engineering</a></li>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> Sales & Marketing</a></li>
            <li><a href="#"><i class="fas fa-chevron-right link-icon"></i> Finance</a></li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h3>Subscribe</h3>
         
          <div class="subscribe-form">
            <input type="email" placeholder="Enter your mail">
            <button><i class="fas fa-paper-plane"></i> Subscribe</button>
          </div>
        </div>
      </div>
  
      <div class="copyright">
        <p>Copyright ©2025 All rights reserved</p>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background: #047fec; 
    padding: 4rem 0 2rem;
    color: white; 
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .footer-section h3 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: white;
  }
  
  .tagline {
    margin-bottom: 1.5rem;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8); 
  }
  
  .footer-section p {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
  }
  
  .icon {
    margin-right: 0.5rem;
    width: 1rem;
    color: #00e56c;
  }
  
  .link-icon {
    margin-right: 0.5rem;
    color: #00e56c; 
    font-size: 0.7rem;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 0.75rem;
  }
  
  .footer-section ul a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
    display: flex;
    align-items: center;
  }
  
  .footer-section ul a:hover {
    color: #00e56c; 
  }
  
  .subscribe-text {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8); 
  }
  
  .subscribe-form {
    display: flex;
  }
  
  .subscribe-form input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem 0 0 0.25rem;
    outline: none;
    color: #333;
  }
  
  .subscribe-form button {
    background: #00e56c;
    color: white;
    padding: 0 1.5rem;
    border: none;
    border-radius: 0 0.25rem 0.25rem 0;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .subscribe-form button:hover {
    background: #00c45a; 
  }
  
  .copyright {
    max-width: 1200px;
    margin: 3rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1); 
    text-align: center;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }
  </style>