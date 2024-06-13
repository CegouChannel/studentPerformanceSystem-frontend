import { axiosInstance } from '@/utils/axios/axios'

export default class JournalService {
  static async getData() {
    try {
      const response = await axiosInstance({
        url: '/journal',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'GET',
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async addJournal(dataJournal) {
    try {
      const response = await axiosInstance({
        url: '/journal',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          studentId: dataJournal.studentId,
          lessonId: dataJournal.lessonId,
          status: dataJournal.status,
          estimate: dataJournal.estimate,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async editJournal(dataJournal, id) {
    try {
      const response = await axiosInstance({
        url: `/journal/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'PUT',
        data: JSON.stringify({
          idStudent: dataJournal.idStudent,
          idLesson: dataJournal.idLesson,
          status: dataJournal.status,
          estimate: dataJournal.estimate,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async deleteJournalById(id) {
    try {
      const response = await axiosInstance({
        url: `/journal/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'DELETE',
        data: JSON.stringify({
          id: id,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }
}
