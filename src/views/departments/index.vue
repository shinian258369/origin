<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 放置组织架构内容 -->
      <el-card class="tree-card">
        <!-- 主要内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个树形 -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 写一个显示的结构 插槽 作用域插槽 slot-scope-->
          <!-- 插槽  slot="a" 具名插槽-->
          <!-- 插槽   匿名插槽-->
          <!--  v-slot  先执行作用域插槽的取值 再传给tree-node-->
          <template v-slot="{ data }">
            <tree-tools :tree-node="data" @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartments" />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 放置一个新增弹层组件 sync修饰符 必须写 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'

import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      loading: false,
      showDialog: false, // 控制弹层变量
      company: { },
      departs: [],
      defaultProps: {
        label: 'name'
      },
      node: null // 专门来存储当前操作的节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const { depts, companyName } = await getDepartments()
      this.company = { manager: '负责人', name: companyName, id: '' }
      this.departs = transListToTreeData(depts, '')
      setTimeout(() => (this.loading = false)
        , 500)
    },
    // 自定义事件的接收方法 node就是操作的节点
    addDepts(node) {
      this.showDialog = true
      this.node = node // 记录node是为了记住往哪个部门下 添加子部门
    },
    async editDepts(node) {
      await this.$refs.addDept.getDepartDetail(node.id)
      this.showDialog = true
      this.node = node // 记录当前点击的编辑节点
      // 调用子组件方法？父组件  => 子组件方法
    }

  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
