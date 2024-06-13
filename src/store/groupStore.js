import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetching } from '@/utils/useFetching.js'
import GroupService from '@/API/groupService.js'

export const useGroupStore = defineStore('groupStore', () => {
  const groups = ref([])
  const { fetching: getGroups } = useFetching(async () => {
    groups.value = await GroupService.getData()
  })
  const isLoading = ref(false)

  return {
    groups,
    getGroups,
    isLoading,
  }
})
