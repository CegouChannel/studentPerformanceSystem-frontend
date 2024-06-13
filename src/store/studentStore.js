import { defineStore } from 'pinia'
import { ref } from 'vue'
import StudentService from '@/API/studentService.js'
import { useFetching } from '@/utils/useFetching.js'

export const useStudentStore = defineStore('studentStore', () => {
  const students = ref([])
  const { fetching: getStudents } = useFetching(async () => {
    students.value = await StudentService.getData()
  })
  const isLoading = ref(false)

  return {
    students,
    getStudents,
    isLoading,
  }
})
