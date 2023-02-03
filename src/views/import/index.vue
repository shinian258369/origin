<template>
  <!-- 放置一个导入excel的组件 -->
  <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async onSuccess({ header, results }) {
      if (this.type === 'user') {
        //  header是 头部表头的集合
      // results是实际的数据
      // [{ username: '高小山', workNumber: 1002 }]
      // [{ 姓名: '高小山’，工号： 1002 }]
      // 只有确定了用户字段关系 才能够将数据转化
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName',
          '聘用形式': 'formOfEmployment'
        }
        // results是中文形式的
        const newArr = results.map(item => {
        // 遍历item中的每一项
          var userInfo = {}
          Object.keys(item).map(key => {
          // key是中文的key  userRelations[key]是英文的
          // 判断是否是日期
            if (userRelations[key] === 'timeOfEntry1' || userRelations[key] === 'correctionTime1') {
            //  说明此时到了要转化日期 只要日期类型才需要转化
            // java后端接口 要求 如果日期类型 必须传date类型
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            } else {
              userInfo[userRelations[key]] = item[key]
            }
          })
          return userInfo
        })
        // 拿到新数组 就可以将数组插入到数据库
        await importEmployee(newArr)
        this.$message.success('批量导入员工成功')
        this.$router.back()
      }
      // } else if (this.type === 'departs') {

      // }
    },
    // excel中的时间不是一个标准时间 需要一个转化方法
    // format是一个分隔符 - /
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
