import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCandidateStore = defineStore('candidate', () => {
  const candidates = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:3000/candidates'

  const fetchCandidates = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl)
      candidates.value = res.data
    } catch (err) {
        error.value = 'Failed to load candidate data'
    } finally {
      loading.value = false
    }
  }

  const createCandidate = async (candidateData: any) => {
    try {
      const res = await axios.post(apiUrl, candidateData)
      candidates.value.push(res.data)
    } catch (err) {
        error.value = 'Failed to create candidate account'
    }
  }

  return {
    candidates,
    loading,
    error,
    fetchCandidates,
    createCandidate
  }
})
