import Layout from '@/layout'
// 审批模块路由规则
export default {
  path: '/permission', // 地址
  name: 'permissions', // 给每一个路由规则加一个name 加它的目的是用于后面的权限设置
  component: Layout, // 一级路由组件
  children: [{
    path: '', //  二级路由的地址如果都不写 意味着当前的组件作为二级路由的默认组件
    component: () => import('@/views/permission'), // 引入 approval作为主页面
    name: 'permissions',
    meta: {
      // 路由元信息 里面可以存储一些路由信息
      title: '权限', // title有用处  表示当前模块的中文名称
      icon: 'lock'
    }
  }] // 二级路由组件
}
// /approvals => layout  =>
// /approvals/index
