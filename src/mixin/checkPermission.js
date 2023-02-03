// 检查权限点
// 导出一个混入对象
import store from '@/store'
export default {
  methods: {
    //   有权限就返回true 没权限返回false
    // 所有的组件都可以使用该方法 但是每个组件的标识是不一样的
    // 如果有这个key 就认为有权限 如没这个key那么认为没权限
    checkPermission(key) {
      const userInfo = store.state.user.userInfo
      if (userInfo && userInfo.roles && userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}

