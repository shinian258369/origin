// 引入了静态路由
// 权限模块的目的 是提供当前用户所拥有的路由权限的数据  静态路由 + 当前用户的自身的动态路由
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // routes表示当前人的路由权限
  routes: constantRoutes // 当前所有人都默认拥有静态路由
}
const mutations = {
  // newRoutes认为是用户登录之后获取的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 静态路由  + 动态路由
    // 需要得到newRoutes 才能调用mutations
  }
}
const actions = {
  // 筛选路由模块 menus认为是当前用户资料的menus标识  代表用户所拥有的的权限
  filterRoutes(context, menus) {
    // menus  ['setting','approvals]
    // asyncRoutes  [{ name: ''  }]
    var routes = []
    menus.forEach(item => {
      // item是字符串 去asyncRoutes里面找有没有路由的name叫这个字符串
      routes.push(...asyncRoutes.filter(route => route.name === item))
    })
    // routes就是当前用户的筛选之后的动态路由
    context.commit('setRoutes', routes)
    // 最后加一行代码
    return routes // 这句话又是一句点睛之笔  为什么要返回呢 ？ 因为后面调用action的时候 要使用
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
