import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:3000/users'

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl)
      users.value = res.data
    } catch (err) {
        error.value = 'Failed to load users'
        } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: any) => {
    try {
      const res = await axios.post(apiUrl, userData)
      users.value.push(res.data)
    } catch (err) {
      error.value = 'فشل إنشاء المستخدم'
    }
  }

  const fetchByRole = async (role: 'admin' | 'employer' | 'candidate') => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(`${apiUrl}?role=${role}`)
      users.value = res.data
    } catch (err) {
        error.value = 'Failed to load users by type'
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchByRole,
    createUser
  }
})
