import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:3000/payments'

  const fetchPayments = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(apiUrl)
      payments.value = res.data
    } catch (err) {
        error.value = 'Failed to load payments'
    } finally {
      loading.value = false
    }
  }

  const createPayment = async (paymentData: any) => {
    try {
      const res = await axios.post(apiUrl, paymentData)
      payments.value.push(res.data)
    } catch (err) {
        error.value = 'Payment creation failed'
    }
  }

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment
  }
})
