<template>
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 引入echarts模块 按需加载
// var echarts = require('echarts') // 这行代码引用的是所有的图表
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 单独引入雷达图
require('echarts/lib/chart/radar')
// // 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
//  组件中获取组件的dom元素
// beforeCreate created  beforeMount  mounted  beforeUpdate updated  beforeDestory  destoryed
  mounted() {
    var myEchart = echarts.init(this.$refs.myDiv)
    // 图表的元素一定要有高和宽
    myEchart.setOption({
      title: {
        text: '基础雷达图'
      },
      tooltip: {},
      legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '考勤', max: 100 },
          { name: '技术', max: 100 },
          { name: '管理', max: 100 },
          { name: '分享', max: 100 },
          { name: 'bug', max: 100 },
          { name: '助人', max: 100 }
        ]
      },
      series: [{
        name: '张三VS李四',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [20, 30, 99, 90, 1, 80],
            name: '张三指标'
          },
          {
            value: [99, 99, 0, 0, 100, 2],
            name: '李四指标'
          }
        ]
      }]
    })
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
