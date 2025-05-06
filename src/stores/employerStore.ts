import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEmployerStore = defineStore('employer', () => {
  const employers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:3000/employers'

  const fetchEmployers = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl)
      employers.value = res.data
    } catch (err) {
        error.value = 'Failed to load company data'
    } finally {
      loading.value = false
    }
  }

  const createEmployer = async (employerData: any) => {
    try {
      const res = await axios.post(apiUrl, employerData)
      employers.value.push(res.data)
    } catch (err) {
        error.value = 'Create company account failed'
    }
  }

  return {
    employers,
    loading,
    error,
    fetchEmployers,
    createEmployer
  }
})
