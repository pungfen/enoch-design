import Axios from 'axios'
import { ElNotification } from 'element-plus'

export const axios = Axios.create({ headers: { enoch_terminal: 'WEB[ERP]' } })

axios.interceptors.response.use(
  (res) => {
    return Promise.resolve(res)
  },
  (err) => {
    if (err.response?.data.errors && err.response.data.errors[0]) {
      if (!err.response.data.errors[0].shouldNotNotification) {
        ElNotification({ title: '请求失败', message: err.response.data.errors[0].message })
      }
    }
    return Promise.reject(err)
  }
)
