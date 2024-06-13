import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetching } from '@/utils/useFetching.js'
import planTraining from '@/API/planTrainingService.js'

export const usePlanTrainingStore = defineStore('planTrainingStore', () => {
  const plansTraining = ref([])
  const { fetching: getPlansTraining } = useFetching(async () => {
    plansTraining.value = await planTraining.getData()
  })
  const isLoading = ref(false)

  return {
    plansTraining,
    getPlansTraining,
    isLoading,
  }
})
