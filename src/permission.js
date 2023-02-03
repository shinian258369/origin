// 路由的拦截权限问题
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 引入进度条样式

// 前置守卫
const whileList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // next是一个必须执行的钩子 不执行就卡主了
  if (store.getters.token) {
    if (to.path === '/login') {
      // next() 放行
      // next(false) 终止
      // next(地址) 跳到某个 地址
      next('/') // 跳到主页
    } else {
      // 要判断是不是已经获取过资料了
      if (!store.getters.userId) {
        // 如果id不存在 意味着当前没有用户资料 就要去获取用户资料
        // vuex的action是一个promise
        const { roles } = await store.dispatch('user/getUserInfo')
        // 此时已经获取完资料
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 此时得到的routes是当前用户的所拥有的的动态路由的权限
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 将当前动态路由加到当前路由规则上
        // 加await的意思是 强制等待获取完用户资料之后 才去放行  就能保证 用户进到页面时候 有资料
        // 添加完路由之后 不能用next()  要用next(to.path) 否则地址不能生效 这算是一个已知 的小缺陷
        // 执行完addRoutes 必须执行next(to.path) 不能执行 next() 这是一个已知的问题缺陷
        next(to.path) // 解决直接执行next()时的异常
      } else {
        next() // 放行
      }
    }
  } else {
    if (whileList.indexOf(to.path) > -1) {
      // 表示在白名单里面
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 是为了解决手动输入地址时 进度条不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  NProgress.done()
})
