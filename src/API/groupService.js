import { axiosInstance } from '@/utils/axios/axios'

export default class GroupService {
  static async getData() {
    try {
      const response = await axiosInstance({
        url: '/groups',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'GET',
      })
      let group
      const groups = []
      for (group of response.data) {
        groups.push({
          title: group.name,
          value: group.id,
          planTraining: group.id_plan_training,
        })
      }
      return groups
    } catch (e) {
      throw e
    }
  }

  static async addGroup(dataGroup) {
    try {
      const response = await axiosInstance({
        url: '/groups',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          name: dataGroup.name,
          planTraining: dataGroup.planTraining,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async editGroup(data, id) {
    try {
      const response = await axiosInstance({
        url: `/groups/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'PUT',
        data: JSON.stringify({
          name: data.name,
          planTraining: data.planTraining,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async deleteGroupById(id) {
    try {
      const response = await axiosInstance({
        url: `/groups/${id}`,
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
