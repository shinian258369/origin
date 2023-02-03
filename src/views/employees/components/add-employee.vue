<template>
  <!-- sync修饰符 -->
  <!--
      props变量在当前的组件的作用域中是只读的
      sync修饰符作用的属性 后面的变量不能是props变量
   -->
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 放置内容 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" class="wp50" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" class="wp50" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" class="wp50" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" class="wp50" placeholder="请选择聘用形式">
          <!-- label是显示值 value是存储值 -->
          <el-option
            v-for="item in EmployeeEnum.hireType "
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" class="wp50" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" class="wp50" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个树形组件 el-tree默认显示的字段 label 默认找节点的字段是children-->
        <!-- props -->
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="defaultProps" :default-expand-all="true" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" class="wp50" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- 放置确定取消按钮 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="btnOK">确定</el-button>
          <el-button @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { transListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      EmployeeEnum,
      // 是和接口对应的
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }, {
          min: 1, max: 4, message: '姓名为1-4位'
        }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, {
        //   pattern 正则表达式
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        workNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请选择部门', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }]
      },
      treeData: [], // 用来存储树形数据
      defaultProps: {
        //   指定展示的字段为name
        label: 'name'
      }, // 用来表示 树形字段的一些配置信息
      showTree: false, // 控制树形组件的显示
      loading: false // 树形加载进度条
    }
  },
  //   created() {
  //     this.getDepartments()
  //   },
  methods: {
    async getDepartments() {
      this.loading = true // 打开进度条
      this.showTree = true // 显示树形
      const { depts } = await getDepartments()
      // 展示树形
      this.treeData = transListToTreeData(depts, '') // 转化树形数据
      this.loading = false
    },
    selectNode(data) {
      this.formData.departmentName = data.name
      this.showTree = false
    },
    async btnOK() {
      // 调用新增接口

      try {
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData)
        this.$message.success('新增员工成功')
        // $parent 当前的父组件实例 用this.$parent的前提条件是 该组件不能位于 非原生组件内部 也就是 插槽内容
        // $children 当前的子组件集合
        // $parent用的非常少 对于组件放置的位置有很高的要求，不能讲组件放置于类似element组件的内部
        this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        this.$parent.showDialog = false // 直接关闭弹层
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 将数据重置为空
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 设置数据 写也行 ，不写也行
      // resetFields() 可以移除所有的校验效果 并且将数据重置为空字段 => resetField只能清空 目前在表单中定义的字段
      // 回写数据 会导致 formData中存在一些原来没有的字段 id  resetField不能清空多出来的字段
      // 目前没有编辑业务，没有多出来的字段 resetFields方法可以满足现在的需求
      this.$refs.addEmployee.resetFields() // 重置表单校验和数据
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
