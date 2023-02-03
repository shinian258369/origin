<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 弹层内容 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择负责人" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" type="textarea" :rows="4" style="width:80%" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <!-- 放置居中的按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <!--放置列 -->
      <el-col :span="8">
        <el-button @click="btnCancel">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="btnOK">{{ $t('table.confirm') }}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // 校验逻辑 同级部门不能出现重复的名称
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        // 找到自己当前部门的所有的同级部门
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 新增场景
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // depts是所有的数据
      // 市场部所有的子部门的 pid 等于市场部的id  市场部的数据的treeNode.id
      isRepeat ? callback(new Error(`同级部门下已经有${value}这个部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value) // 只要发现编码重复 就不行
      }
      isRepeat ? callback(new Error(`已经有${value}这个编码了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1, max: 50, message: '部门名称为1-50个字符', trigger: 'blur'
          }, {
            // 同级部门不能出现重复的部门名称
            trigger: 'blur',
            validator: checkNameRepeat
          }], // 部门名称
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, {
          min: 1, max: 50, message: '部门编码为1-50个字符', trigger: 'blur'
        }, {
          trigger: 'blur',
          validator: checkCodeRepeat
        }], // 部门编码
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }], // 部门管理者
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, {
          min: 1, max: 300, message: '部门介绍为1-300个字符', trigger: 'blur'
        }] // 部门介绍
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOK() {
      this.$refs.deptForm.validate().then(() => {
        // 如果进入then表示校验成功
        // 子部门的pid 等于父部门的id
        return this.formData.id ? updateDepartments(this.formData) : addDepartments({ ...this.formData, pid: this.treeNode.id })
      }).then(() => {
        // 已经新增成功
        this.$emit('addDepts') // 触发自定义事件
        // update:props名称
        this.$emit('update:showDialog', false) // 触发事件
      })
    },
    btnCancel() {
      // 关闭弹层之前 应该 重置校验 并且还原数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields() // 重置方法
      this.$emit('update:showDialog', false)
    },
    async  getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
