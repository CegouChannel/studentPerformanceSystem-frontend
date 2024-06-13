import { axiosInstance } from '@/utils/axios/axios'

export default class StudentService {
  static async getData() {
    try {
      const response = await axiosInstance({
        url: '/students',
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

  static async addStudent(dataStudent) {
    try {
      const response = await axiosInstance({
        url: '/students',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          fio: dataStudent.fio,
          address: dataStudent.address,
          phone: dataStudent.phone,
          group: dataStudent.group,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async editStudent(dataStudent, id) {
    try {
      const response = await axiosInstance({
        url: `/students/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'PUT',
        data: JSON.stringify({
          fio: dataStudent.fio,
          address: dataStudent.address,
          phone: dataStudent.phone,
          group: dataStudent.group,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async deleteStudentById(id) {
    try {
      const response = await axiosInstance({
        url: `/students/${id}`,
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
