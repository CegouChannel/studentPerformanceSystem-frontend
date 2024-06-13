import { axiosInstance } from '@/utils/axios/axios'

export default class PlanTrainingService {
  static async getData() {
    try {
      const response = await axiosInstance({
        url: '/plansTraining',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'GET',
      })
      let plan
      const plans = []
      for (plan of response.data) {
        const planTraining = {
          value: plan.id,
          title: plan.name,
        }
        plans.push(planTraining)
      }
      return plans
    } catch (e) {
      throw e
    }
  }

  static async addPlanTraining(dataGroup) {
    try {
      const response = await axiosInstance({
        url: '/plansTraining',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          name: dataGroup.name,
        }),
      })
      return response.data
    } catch (e) {
      throw e
    }
  }

  static async deletePlanTrainingById(id) {
    try {
      const response = await axiosInstance({
        url: `/plansTraining/${id}`,
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
