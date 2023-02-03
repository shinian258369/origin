import request from '@/utils/request'
// 获取组织架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
// restful 接口开发规范
// CRUD  增删改查
// C  creare
// R  read
// U  update
// D  delete

// R  get  /user(查询列表)   get  /user/123(查询用户详情)
// C  post /user(新增用户)  data(新增用户的信息)
// U  put  /user/123(修改用户信息) data(修改用户的信息)
// D  delete  /user/123(删除某个用户)
