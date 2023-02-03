import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
const TimeOut = 5400 // 定义超时时间
const service = axios.create({
//    设置基础地址
// 环境变量 npm run dev  /api   /生产环境 npm run build  /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // 认为只要超过5秒钟不响应 就超时
})
// 请求拦截器
service.interceptors.request.use(async config => {
  // 请求接口  config是请求配置
  // 取token
  if (store.getters.token) {
    // 只要有token 就要检查token时效性
    if (CheckIsTimeOut()) {
      //  继续？
      await store.dispatch('user/lgout')
      router.push('/login') // 跳到登录
      return Promise.reject(new Error('您的token已经失效'))
    }
    // 如果存在token
    config.headers.Authorization = `Bearer ${store.getters.token}`
    // return config
  }
  // 这里一定要注意
  // 一定要return config
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 成功执行
  // axios默认加了一层data的包裹
  const { success, message, data } = response.data
  if (success) {
    // 此时认为业务执行成功了
    return data // 返回用户所需要的数据
  } else {
    // 当业务失败的时候
    Message.error(message) // 提示消息
    return Promise.reject(new Error(message))
  }
}, async error => {
  // error 有response对象 config
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 后端告诉前端token超时了
    await store.dispatch('user/lgout') // 调用登出action
    router.push('/login') // 跳到登录页
  }
  // 失败
  // Message等同于 this.$message
  Message.error(error.message) // 提示错误
  // reject
  return Promise.reject(error) // 传入一个错误的对象  就认为promise执行链 进入了catch
})
// 检查token是否过期
function CheckIsTimeOut() {
  // 当前时间  - 存储的时间戳 > 时效性  false   tr
  return (Date.now() - getTimeStamp()) / 1000 > TimeOut
}
export default service
