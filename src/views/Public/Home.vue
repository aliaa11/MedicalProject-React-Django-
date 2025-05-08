<template>
    <div>
      <Navbar />
      <div class="hero-section">
       <div class="hero-content">
      <div class="hero-text">
        <h1><strong>Find Your Dream Job Today!</strong></h1>
        <p class="subtitle"><strong>Join thousands of companies hiring right now</strong></p>
        <div class="stats">4536+ Jobs listed</div>
        <p class="description">
          <strong>We connect top talent with leading companies worldwide. 
          Start your career journey with us today!</strong>
        </p>
        <button class="upload-btn">Upload Your Resume</button>
      </div>
      <div class="hero-image">
        <img src="@/assets/illustration.png" alt="People working">
      </div>
    </div>
      </div>
      <div class="search-container">
          <JobFilters @filterChanged="applyFilter" />
        </div>
  
      <div class="job-listings">
        <h2>Job Listing</h2>
        <div class="job-list">
          <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
        </div>
        <button class="browse-more">Browse More Job</button>
      </div>
      
      <Footer />
    </div>
  </template>
  <script setup>
  import Navbar from '@/components/shared/Navbar.vue'
import Footer from '@/components/shared/Footer.vue'
  import JobCard from '@/components/jobs/ JobCard.vue'
  import JobFilters from '@/components/jobs/JobFilters.vue'
  
  import { onMounted, ref, computed } from 'vue'
  import dayjs from 'dayjs'
  
  const jobs = ref([])       
  const filterCriteria = ref({})
  
  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3000/jobs') // URL بتاع json-server
      const data = await res.json()
      jobs.value = data
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      loading.value = false
    }
  })
  
  const applyFilter = (filters) => {
    filterCriteria.value = filters
  }
  
  const filteredJobs = computed(() => {
    return jobs.value.filter(job => {
      const f = filterCriteria.value
  
      const matchKeyword = !f.keyword || job.title.toLowerCase().includes(f.keyword.toLowerCase()) || job.description.toLowerCase().includes(f.keyword.toLowerCase())
      const matchLocation = !f.location || job.location === f.location
      const matchCategory = !f.category || job.category === f.category
      const matchExperience = !f.experience || job.experience_level === f.experience
      const matchSalary = !f.salary || (() => {
        const [min, max] = f.salary.split('-').map(Number)
        const [jobMin, jobMax] = job.salary_range.split('-').map(Number)
        return jobMin >= min && jobMax <= max
      })()
      const matchDate = !f.datePosted || (() => {
        const days = Number(f.datePosted)
        const postedDate = dayjs(job.created_at)
        return postedDate.isAfter(dayjs().subtract(days, 'day'))
      })()
  
      return matchKeyword && matchLocation && matchCategory && matchExperience && matchSalary && matchDate
    })
  })
  </script>

<style scoped>
.hero-section {
  background: #047fec; /* تغيير لون الخلفية إلى أزرق */
  color: white; /* لون النص أبيض */
  text-align: center;
  padding: 5rem 1rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.stats {
  background: #00e56c;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  margin-bottom: 1rem;
}

.description {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.upload-btn {
  background: #047fec;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
}

.search-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2%;
}

.job-listings {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.job-listings h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #047fec;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.browse-more {
  display: block;
  margin: 0 auto;
  background: #00e56c;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
}

.hero-section {
  background: #047fec;
  color: white;
  padding: 4rem 1rem;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-text {
  flex: 1;
  text-align: left;
  padding-right: 2rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.stats {
  background: #00e56c;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.description {
  max-width: 500px;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.upload-btn {
  background: white;
  color: #047fec;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* للجوالات والأجهزة الصغيرة */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
  }
  
  .hero-text {
    text-align: center;
    padding-right: 0;
    margin-bottom: 2rem;
  }
  
  .hero-image {
    justify-content: center;
  }
  
  .description {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
  
  