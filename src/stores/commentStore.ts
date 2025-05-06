import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = 'http://localhost:3000/comments'

  const fetchComments = async (jobId?: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get(jobId ? `${apiUrl}?job_id=${jobId}` : apiUrl)
      comments.value = res.data
    } catch (err) {
        error.value = 'Failed to load comments'
    } finally {
      loading.value = false
    }
  }

  const addComment = async (commentData: any) => {
    try {
      const res = await axios.post(apiUrl, commentData)
      comments.value.push(res.data)
    } catch (err) {
        error.value = 'Failed to add comment'
    }
  }

  const deleteComment = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`)
      comments.value = comments.value.filter(comment => comment.id !== id)
    } catch (err) {
        error.value = 'Failed to delete comment'
    }
  }

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment
  }
})
