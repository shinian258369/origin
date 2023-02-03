import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), // 设置token为共享
  userInfo: {} // 这里为什么不写null ?
}
const mutations = {
  // 设置token的mutations
  setToken(state, token) {
    state.token = token // 只是设置了vuex中的数据
    // 需要将vuex中的数据同步到缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 设置vuex中的token为null
    removeToken() // 同步删除缓存中的token
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    // state.userInfo = { ...userInfo } // 浅拷贝 如果要去改属性里面的某一个值 可以用浅拷贝的方式
  },
  removeUserInfo(state) {
    state.userInfo = {} // 重置为空对象
  }
}
const actions = {
  // 封装一个登录的action
  // data认为是 { mobile,password }
  // 只要用async标记了函数 那么这个函数本身就是promise对象
  async login(context, data) {
    // 调用登录接口
    // login(data).then(result => {

    // })
    // await下方永远都是 reslove成功执行的逻辑
    const result = await login(data)
    // result就是token
    context.commit('setToken', result)

    setTimeStamp() // 设置时间戳
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 此时result里面已经有userId
    const baseInfo = await getUserDetailById(result.userId) // 用户的基本信息
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 修改state中的用户资料
    return result // 这里这句话 是伏笔 当下是用不上的 但是后期会用上 敬请期待
  },
  // 登出action
  lgout({ commit }) {
    // 删除token
    commit('removeToken')
    // 删除用户资料
    commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 清空路由模块下的路由信息
    // Vuex子模块 调用子模块的mutation
    commit('permission/setRoutes', [], { root: true }) // commit默认是提交的当前子模块的mutations
    // 如果加上 root: true 就表示commit此时是根级的commit
    // this.$store.commit('permission/setRoutes')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
