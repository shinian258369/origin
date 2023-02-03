<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dataChage">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dataChage">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <!-- 放置日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- 插槽内容 -->
      <!-- <template slot="dateCell">123 </template> -->
      <!-- <template v-slot:dateCell>123 </template> -->
      <template #dateCell="{ date, data }">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>

  </div>
</template>

<script>
export default {
  filters: {
    getDay(str) {
      // "2020-12-01"
      const day = str.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    //  从哪年开始
    startDate: {
      type: Date,
      default: () => new Date() // 从当前时间开始
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null, // 当前时间
      yearList: [] // 可选择的年份  前5年  +当前年+ 后5年

    }
  },
  created() {
    // 当前年和月都没值 要去赋值
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    this.yearList = Array.from(Array(11), (v, i) => (i + this.currentYear - 5))
  },
  methods: {
    dataChage() {
      // 最新的年 最新的月
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
