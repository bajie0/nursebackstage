import axios from 'axios'
import qs from 'qs'
import cookies from "vue-cookies"
import router from '@/router'
import {Message} from 'element-ui'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
const api_url = "http://127.0.0.1:8000"


// 请求拦截器（ Token ）
axios.interceptors.request.use(
  config => {
    const token = cookies.get('token')
    if (token) {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        "token": token
      }
    }
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器（ Token ）
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else if (response.status === 201) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          Message.error(error.response.data)
          break

        case 401:
          router.push("/login")
          // Message.error(error.response.data)
          break

        case 402:
          Message.error(error.response.data)
          break

        case 403:
          Message.error(error.response.data)
          break

        case 404:
          Message.error(error.response.data)
          break

        case 406:
          Message.error(error.response.data)
          break
      }
    }
  }
)


// 数据 Data
export function ApiData(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api_url + url, {
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 新增 Create
export function ApiCreate(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(api_url + url, qs.stringify(data)).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 修改 Patch
export function ApiPatch(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(api_url + url, qs.stringify(data)).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}

// 删除 Delete
export function ApiDelete(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api_url + url, {
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 上传 Upload
export function ApiUpload(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(api_url + url, qs.stringify(data)).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 下载 Download
export function ApiDownload(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api_url + url, {
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 审核 State
export function ApiState(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api_url + url, {
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 登录 Login
export function ApiLogin(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(api_url + url, qs.stringify(data)).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}
