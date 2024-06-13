import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetching } from '@/utils/useFetching.js'
import LessonService from '@/API/lessonService.js'

export const useLessonsStore = defineStore('lessonsStore', () => {
  const lessons = ref([])
  const { fetching: getLessons } = useFetching(async () => {
    lessons.value = await LessonService.getData()
  })
  const isLoading = ref(false)

  return {
    lessons,
    getLessons,
    isLoading,
  }
})
