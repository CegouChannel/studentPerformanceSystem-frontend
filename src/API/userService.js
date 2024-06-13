import { axiosInstance } from '@/utils/axios/axios'

export default class UserService {
  static async addUser(dataUser) {
    try {
      const response = await axiosInstance({
        url: '/login',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          fio: dataUser.fio,
          email: dataUser.email,
          password: dataUser.password,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async login(dataUser) {
    try {
      const response = await axiosInstance({
        url: '/login',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          email: dataUser.email,
          password: dataUser.password,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }
}
