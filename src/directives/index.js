// 负责管理所有的自定义指令
// 只负责导出指令对象
// 变量名称就是指令名称
export const imageerror = {
  // 指令内容
  // 指令作用在 图片上的 dom是图片对象
  // inserted 在Vue3中也改名 => mounted
  inserted(dom, options) {
    // inserted执行的之后 此时 并没有对 src赋值
    // 图片有地址 但是地址加载图片失败的时候 会执行一个函数  onerror
    dom.src = dom.src || options.value
    dom.onerror = function() {
      // 监听onerror事件
      // options.value就是指令传过来的值
      dom.src = options.value // 当图片异常的时候 接收指令传过来的值 让这个值作为头像的备选
    }
    // 只有src有值 并且加载失败才会触发onerror
  },
  // 此钩子会在给image赋值之后执行
  // 这个钩子函数在Vue3中改名了 => updated
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
