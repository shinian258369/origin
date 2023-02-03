import request from '@/utils/request'

export function login(data) {
  // 返回了promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data // body参数体位于data
  })
}
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
