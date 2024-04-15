import axios from 'axios'

export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_API
})

HTTP.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accesstoken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)
HTTP.interceptors.response.use(
  (res) => {
    return res
  },
  async(err) => {
    const originalConfig = err.config

    if (originalConfig.url !== '/auth/login-google' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        const tryTime = localStorage.getItem('try')
        localStorage.setItem('try', tryTime + 1)
        try {
          if (tryTime < 2) {
            const rs = await HTTP.post('auth/refresh-token', {
              refresh_token: localStorage.getItem('refresh')
            })

            localStorage.setItem('accesstoken', rs.data.data.access_token)
            localStorage.setItem('refresh', rs.data.data.refresh_token)
            if (rs.data.data) localStorage.setItem('try', 0)

            return HTTP(originalConfig)
          } else {
            localStorage.removeItem('accesstoken')
            localStorage.removeItem('refresh')
            window.close()
          }
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(err)
  }
)
