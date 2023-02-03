import Layout from '@/layout'
// 审批模块路由规则
export default {
  path: '/employees', // 地址
  name: 'employees', // 给每一个路由规则加一个name 加它的目的是用于后面的权限设置
  component: Layout, // 一级路由组件
  children: [{
    path: '', //  二级路由的地址如果都不写 意味着当前的组件作为二级路由的默认组件
    name: 'employees',
    component: () => import('@/views/employees'), // 引入 approval作为主页面
    meta: {
      // 路由元信息 里面可以存储一些路由信息
      title: '员工', // title有用处  表示当前模块的中文名称
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // 动态路由参数 /:id id必须填  不填跳不过去 /:id? ?表示id可填可不填
    component: () => import('@/views/employees/detail'),
    hidden: true, // 在左侧菜单隐藏
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id', // 二级路由 写 /表示从根路径开始算  不写表示从 一级的路径开始算
    component: () => import('@/views/employees/print'),
    hidden: true // 在左侧菜隐藏
  }] // 二级路由组件
}
// /approvals => layout  =>
// /approvals/index
