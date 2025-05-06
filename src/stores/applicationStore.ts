import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useApplicationStore = defineStore('application', () => {
  const applications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:3000/applications'

  const fetchApplications = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl)
      applications.value = res.data
    } catch (err) {
        error.value = 'Failed to load requests'
    } finally {
      loading.value = false
    }
  }

  const fetchByJob = async (jobId: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(`${apiUrl}?job_id=${jobId}`)
      applications.value = res.data
    } catch (err) {
        error.value = 'Failed to load job applications'
    } finally {
      loading.value = false
    }
  }

  const fetchByCandidate = async (candidateId: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(`${apiUrl}?candidate_id=${candidateId}`)
      applications.value = res.data
    } catch (err) {
        error.value = 'Failed to load candidate applications'
    } finally {
      loading.value = false
    }
  }

  const createApplication = async (applicationData: any) => {
    try {
      const res = await axios.post(apiUrl, applicationData)
      applications.value.push(res.data)
    } catch (err) {
        error.value = 'Failed to send request'
    }
  }

  const deleteApplication = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`)
      applications.value = applications.value.filter(app => app.id !== id)
    } catch (err) {
        error.value = 'Failed to delete request'
    }
  }

  return {
    applications,
    loading,
    error,
    fetchApplications,
    fetchByJob,
    fetchByCandidate,
    createApplication,
    deleteApplication
  }
})
