import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useJobStore = defineStore('job', () => {
  const jobs = ref([])
  const loading = ref(false)
  const error = ref(null)

  // API base URL
  const apiUrl = 'http://localhost:3000/jobs'

  // Get all jobs
  const fetchJobs = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl)
      jobs.value = res.data
    } catch (err) {
      error.value = 'Failed to load jobs'
    } finally {
      loading.value = false
    }
  }

  // Add new job
  const createJob = async (jobData: any) => {
    try {
      const res = await axios.post(apiUrl, jobData)
      jobs.value.push(res.data)
    } catch (err) {
      error.value = 'Failed to create job'
    }
  }

  // Delete job
  const deleteJob = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`)
      jobs.value = jobs.value.filter(job => job.id !== id)
    } catch (err) {
      error.value = 'Failed to delete job'
    }
  }

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    deleteJob
  }
})
