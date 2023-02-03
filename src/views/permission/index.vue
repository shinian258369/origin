<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #after>
          <!-- addPermission第一个参数 是当前添加的节点的pid  第二个参数是添加的节点的类型 1 -->
          <!-- 1 代表访问权 2 代表操作权 -->
          <el-button type="primary" size="small" @click="addPermission('0', 1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 如果要用树形的话 必须给一个属性 row-key -->
      <el-table border :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 当type==1的时候才显示 添加按钮 -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 放置一个弹层 -->
    <el-dialog title="新增权限" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="权限名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item prop="code" label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item prop="description" label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为1时表示打开 当值为0时表示关闭 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 递归算法转化树形
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确认删除此权限点吗').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除权限点成功')
        this.getPermissionList()
      })
    },
    // pid  类型
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    // 编辑权限点
    async  editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    btnOK() {
      this.$refs.perForm.validate().then(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 有id就是编辑
            await updatePermission(this.formData)
          } else {
            await addPermission(this.formData)
          }
          this.showDialog = false
          this.$message.success('新增权限点成功')
          this.getPermissionList()
        }
      })
    },
    btnCancel() {
      // 还原数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields() // 重置校验
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
