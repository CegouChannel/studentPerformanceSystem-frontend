import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetching } from '@/utils/useFetching.js'
import JournalService from '@/API/journalService.js'

export const useJournalStore = defineStore('journalStore', () => {
  const journal = ref([])
  const { fetching: getJournal } = useFetching(async () => {
    journal.value = await JournalService.getData()
  })
  const isLoading = ref(false)

  return {
    journal,
    getJournal,
    isLoading,
  }
})
